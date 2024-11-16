const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;


const Rating = sequelize.define('Rating', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
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

module.exports = Rating;