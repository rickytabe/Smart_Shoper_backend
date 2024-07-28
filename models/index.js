const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

const User = require('./User');
const Order = require('./Order');
const Product = require('./Product');
const OrderItem = require('./OrderItem');

const models = {
  User,
  Order,
  Product,
  OrderItem
};

// Define associations
models.Order.belongsTo(models.User, { foreignKey: 'userId' });
models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
models.Product.hasMany(models.OrderItem, { foreignKey: 'productId' });

module.exports = models;
