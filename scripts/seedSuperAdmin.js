const { User } = require('../models');
require('dotenv').config();

async function seedSuperAdmin() {
  try {
    const superAdminExists = await User.findOne({ 
      where: { role: 'super_admin' } 
    });

    if (!superAdminExists) {
      await User.create({
        name: process.env.SUPER_ADMIN_NAME || 'Super System Administrator',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@system.com',
        password: process.env.SUPER_ADMIN_PASSWORD || 'Super@123456',
        address: process.env.SUPER_ADMIN_ADDRESS || 'System Headquarters',
        role: 'super_admin'
      });
      
      console.log(' Super Admin created successfully!');
      console.log(` Email: ${process.env.SUPER_ADMIN_EMAIL || 'superadmin@system.com'}`);
      console.log('  Please change the password after first login');
    } else {
      console.log('ℹ Super Admin already exists');
    }
  } catch (error) {
    console.error(' Error seeding super admin:', error);
  }
}

module.exports = seedSuperAdmin;