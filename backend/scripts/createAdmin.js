/**
 * Admin user create/update script.
 * Usage:
 *   node scripts/createAdmin.js
 *   node scripts/createAdmin.js admin@example.com StrongPass123 "Admin Name"
 *
 * Email/password .env se: ADMIN_EMAIL, ADMIN_PASSWORD, optional ADMIN_NAME
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Admin';

  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI missing in backend/.env');
    process.exit(1);
  }
  if (!email || !password) {
    console.error('Provide ADMIN_EMAIL and ADMIN_PASSWORD in .env or as CLI arguments.');
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('Admin password must be at least 6 characters.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      user.name = name;
      user.password = hashedPassword;
      user.role = 'admin';
      await user.save();
      console.log(`Updated existing user to admin: ${email}`);
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Created admin user: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('createAdmin failed:', error.message);
    process.exit(1);
  }
};

run();
