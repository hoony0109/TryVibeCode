const fs = require('fs').promises;
const path = require('path');

const collectionsFilePath = path.join(__dirname, '../../ref/mongodb_collections.txt');

async function getCollectionNames() {
    try {
        const data = await fs.readFile(collectionsFilePath, 'utf8');
        const regex = /g_pGameLog->GameLog\(L"([^"]+)"/g;
        const matches = [...data.matchAll(regex)];
        const collectionNames = matches.map(match => match[1]);
        
        // Get unique names and sort them
        const uniqueNames = [...new Set(collectionNames)];
        uniqueNames.sort();
        
        return uniqueNames;
    } catch (error) {
        console.error('Error reading or parsing mongodb_collections.txt:', error);
        // Return a default/empty list or throw the error
        return [];
    }
}

module.exports = { getCollectionNames };
