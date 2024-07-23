const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Recommendation = sequelize.define('Recommendation', {}, {
  timestamps: true
});

Recommendation.belongsTo(User, { foreignKey: 'userId' });
Recommendation.belongsTo(Product, { foreignKey: 'productId' });

module.exports = Recommendation;
