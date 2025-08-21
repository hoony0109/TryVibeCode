const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { getCollectionNames } = require('../utils/collectionParser');

// POST /api/logs/query
router.post('/query', async (req, res) => {
  console.log('[DEBUG] Received /api/logs/query request with body:', JSON.stringify(req.body, null, 2));
  const { collectionName, filters, pagination, sortBy } = req.body;

  if (!collectionName) {
    return res.status(400).json({ msg: 'Collection name is required' });
  }

  try {
    // 1. Determine the database name from the time range
    const startDate = filters?.timeRange?.start ? new Date(filters.timeRange.start) : new Date();
    const year = startDate.getFullYear();
    const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
    const dbName = `UserGameLog_TCP_${year}${month}`;
    
    console.log(`[DEBUG] Targeting database: ${dbName}`);

    // 2. Switch to the target database
    const db = mongoose.connection.useDb(dbName, { useCache: true });
    const collection = db.collection(collectionName);

    let query = {};

    // Build query from filters
    if (filters) {
      // Time range filter
      if (filters.timeRange && filters.timeRange.start && filters.timeRange.end) {
        const formatForDB = (dateString) => {
            if (!dateString) return null;
            const d = new Date(dateString);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const seconds = d.getSeconds().toString().padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };
        
        query._time = {
          $gte: formatForDB(filters.timeRange.start),
          $lte: formatForDB(filters.timeRange.end),
        };
      }

      // Common filters
      if (filters.commonFilters) {
        for (const key in filters.commonFilters) {
          const filterValue = filters.commonFilters[key];
          if (filterValue) {
            // char_idx is a number, other common filters are treated as strings
            if (key === 'char_idx') {
              query[key] = Number(filterValue);
            } else {
              query[key] = { $regex: filterValue, $options: 'i' };
            }
          }
        }
      }
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    if (sortBy && sortBy.field) {
      sortOptions[sortBy.field] = sortBy.order === 'asc' ? 1 : -1;
    } else {
      sortOptions._time = -1; // Default sort by time descending
    }

    console.log('[DEBUG] Executing query:', JSON.stringify(query, null, 2));
    const documents = await collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray();
    console.log(`[DEBUG] Found ${documents.length} documents.`);
    const totalDocuments = await collection.countDocuments(query);

    res.json({
      queriedDatabase: dbName,
      documents,
      pagination: {
        page,
        limit,
        totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
      },
    });
  } catch (error) {
    console.error('Error querying logs:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

// @route   GET /api/logs/collections
// @desc    Get all available log collection names
// @access  Private
router.get('/collections', auth, async (req, res) => {
    try {
        const names = await getCollectionNames();
        res.json(names);
    } catch (err) {
        console.error('Failed to get collection names:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

// @route   GET /api/logs/schema/:collectionName
// @desc    Get the schema of a log collection
// @access  Private
router.get('/schema/:collectionName', auth, async (req, res) => {
    const { collectionName } = req.params;

    try {
        let sample = [];
        let dbName = '';

        // Go back up to 12 months to find a collection with data
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            dbName = `UserGameLog_TCP_${year}${month}`;
            
            console.log(`[DEBUG] Trying to get schema from ${dbName}.${collectionName}`);

            const db = mongoose.connection.client.db(dbName);
            const collection = db.collection(collectionName);
            
            // Check if collection exists before sampling
            const collections = await db.listCollections({ name: collectionName }).toArray();
            if (collections.length > 0) {
                sample = await collection.aggregate([{ $sample: { size: 100 } }]).toArray();
                if (sample.length > 0) {
                    console.log(`[DEBUG] Found data in ${dbName}.${collectionName}. Inferring schema.`);
                    break; // Found data, exit loop
                }
            }
        }

        if (sample.length === 0) {
            console.log(`[DEBUG] No documents found for ${collectionName} in the last 12 months.`);
            return res.json({ fields: [] });
        }

        const fieldTypes = {};

        sample.forEach(doc => {
            for (const key in doc) {
                if (!fieldTypes[key]) {
                    const value = doc[key];
                    let type = typeof value;
                    if (value instanceof Date) {
                        type = 'Date';
                    } else if (value === null) {
                        type = 'String'; // Default to string for null values
                    }
                    fieldTypes[key] = type;
                }
            }
        });

        const fields = Object.keys(fieldTypes).map(key => ({
            name: key,
            type: fieldTypes[key],
        }));

        res.json({ fields });

    } catch (err) {
        console.error(`Error fetching schema for ${collectionName}:`, err.message);
        res.status(500).send('Server Error');
    }
});
