require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line
const app = express();
require('./config/mongodb'); // Connect to MongoDB
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Add this line to enable CORS for all routes
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
