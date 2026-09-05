const { Sequelize } = require('sequelize');
require('dotenv').config();

const sslOptions = process.env.DB_SSL === 'true' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
} : {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    },
    dialectOptions: sslOptions
  }
);

module.exports = sequelize;