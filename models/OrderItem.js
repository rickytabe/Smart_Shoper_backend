const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const {Orders, Products} = require('../models');




const OrderItem = sequelize.define('OrderItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Orders', // name of the Orders model
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  productId:{
    type: DataTypes.INTEGER,
    references:{
      model:'Products',
      key:'id'
    }
  }

},{
  timestamps: true
})

module.exports = OrderItem;