require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
require('./config/mongodb'); // Connect to MongoDB
const { loadItemData } = require('./utils/itemDataParser'); // Import loadItemData
const mysql = require('./config/mysql'); // Import mysql module
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Add this line to enable CORS for all routes
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`[DEBUG] Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

// Load item data before starting the server
async function startServer() {
  try {
    await mysql.initialize(); // Initialize MySQL game DB pools
    console.log('MySQL game database pools initialized successfully.');

    const gameSocketClient = require('./utils/gameSocketClient');
    await gameSocketClient.initialize();
    console.log('Game socket client initialized.');

    await loadItemData();
    console.log('All item data loaded successfully.');

    // Define Routes
    console.log('[DEBUG] Registering server-settings router...');
    app.use('/api/server-settings', require('./routes/serverSettings'));
    console.log('[DEBUG] server-settings router registered.');

    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/players', require('./routes/players'));
    app.use('/api/items', require('./routes/items'));
    app.use('/api/stats', require('./routes/stats'));
    app.use('/api/notices', require('./routes/notices'));
    app.use('/api/coupons', require('./routes/coupons'));
    app.use('/api/create-admin', require('./routes/createAdmin'));
    app.use('/api/content-access', require('./routes/contentAccess'));
    app.use('/api/admin-logs', require('./routes/adminLogs'));
    app.use('/api/operations', require('./routes/operations'));
    app.use('/api/status', require('./routes/status'));
    app.use('/api/logs', require('./routes/logs'));
    app.use('/api/payments', require('./routes/payments'));
    app.use('/api/server-control', require('./routes/serverControl'));



    app.get('/', (req, res) => {
      res.send('Hello from Backend!');
    });

    // Add 404 handler for undefined API routes
    app.use('/api', (req, res) => {
      console.log(`[DEBUG] 404 - API route not found: ${req.method} ${req.originalUrl}`);
      res.status(404).json({ message: 'API route not found', path: req.originalUrl });
    });

    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database or item data loading error:', error);
    process.exit(1); // Exit if item data fails to load
  }
}

startServer();
