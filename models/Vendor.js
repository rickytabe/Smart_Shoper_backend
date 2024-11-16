const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const Category = require('./categories');



const Vendor = sequelize.define('Vendor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  websiteUrl: {
    type: DataTypes.STRING,
    allowNull: true // You can set this to false if required
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  timestamps: true
});

module.exports = Vendor;