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
  // Defensive check to prevent logging with undefined/null adminId or action
  if (!adminId || !action) {
    console.error('Log activity failed: adminId or action is missing.', { adminId, action });
    return;
  }

  try {
    const newLog = new Log({
      adminId: String(adminId), // Ensure adminId is a string
      action,
      details,
    });
    await newLog.save();
  } catch (err) {
    console.error('Error logging activity:', err.message);
  }
};

module.exports = { logActivity };
