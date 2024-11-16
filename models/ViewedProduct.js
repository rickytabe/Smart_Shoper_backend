const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const Vendor = require('./Vendor');



const ViewedProduct = sequelize.define('ViewedProduct', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vendorId: { // Add vendorId
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vendor,
      key: 'id'
    }
  }
}, {
  timestamps: true
});
module.exports = ViewedProduct;
