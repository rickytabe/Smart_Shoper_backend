const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;
const Vendor = require('./Vendor');
const Category = require('./categories');


const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0 
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull:false,
    defaultValue: 1,
    references: {
      model: Vendor,
      key: 'id'
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Product;