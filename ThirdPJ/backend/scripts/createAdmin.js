require('dotenv').config({ path: 'E:/hoony/VibeCode/ThirdPJ/backend/.env' }); // Load environment variables from .env file
const bcrypt = require('bcryptjs');
const mysql = require('../config/mysql');

async function createAdminAccount() {
  const username = 'admin'; // Default admin username
  const password = 'admin_password'; // Default admin password - CHANGE THIS IN PRODUCTION
  const role = 'superadmin'; // Default role

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if admin already exists
    const [rows] = await mysql.execute('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length > 0) {
      console.log('Admin account already exists. Skipping creation.');
      return;
    }

    await mysql.execute(
      'INSERT INTO admins (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );
    console.log('Admin account created successfully!');
  } catch (err) {
    console.error('Error creating admin account:', err.message);
  } finally {
    process.exit();
  }
}

createAdminAccount();
