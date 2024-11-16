const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const UserCategory = sequelize.define('UserCategory', {
  // You can add additional fields here if needed (e.g., createdAt)
});

module.exports = UserCategory;
