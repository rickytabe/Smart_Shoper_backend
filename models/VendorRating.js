const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;


const VendorRating = sequelize.define('VendorRating', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = VendorRating;