const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const User = require('./User');
const Product = require('./Product');



const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'canceled'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true
});

module.exports = Order;
