const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const {Users} = require('./User');



const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'canceled'),
    defaultValue: 'pending'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Or false, depending on your requirements
    references: {
      model: 'Users', // Refers to your Users model
      key: 'id' 
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  }

}, {
  timestamps: true
});

module.exports = Order;