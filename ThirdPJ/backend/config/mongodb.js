const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB.'))
.catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
