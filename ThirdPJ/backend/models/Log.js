const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  details: {
    type: Object,
  },
});

const Log = mongoose.model('Log', LogSchema);

const logActivity = async (adminId, action, details = {}) => {
  try {
    const newLog = new Log({
      adminId,
      action,
      details,
    });
    await newLog.save();
  } catch (err) {
    console.error('Error logging activity:', err.message);
  }
};

module.exports = { logActivity };
