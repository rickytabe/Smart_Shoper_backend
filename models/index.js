const Sequelize = require('sequelize');
const sequelize = require('../config/db').sequelize;

const User = require('./User');
const Order = require('./Order');
const Product = require('./Product');
const OrderItem = require('./OrderItem');
const Ratings = require('./Ratings');
const ViewedProduct = require('./ViewedProduct');
const BoughtProduct = require('./BoughtProduct');
const VendorRating = require('./VendorRating');
const Vendor = require('./Vendor');
const Recommendation = require('./Recommendation');
const Category = require('./categories');
const VendorCategory = require('./VendorCategory');
const UserCategory = require('./UserCategory');

const models = {
  User,
  Order,
  Product,
  OrderItem,
  Ratings,
  ViewedProduct,
  BoughtProduct,
  VendorRating,
  Vendor,
  Recommendation ,// Add Recommendation to the models object
  Category,
  VendorCategory,
  UserCategory,
};

// Define associations
models.User.hasMany(models.Order, { foreignKey: 'userId' });
models.Order.belongsTo(models.User, { foreignKey: 'userId' });

models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });

models.Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
models.OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });

models.User.hasMany(models.Ratings, { foreignKey: 'userId' });
models.Ratings.belongsTo(models.User, { foreignKey: 'userId' });
models.Product.hasMany(models.Ratings, { foreignKey: 'productId' });
models.Ratings.belongsTo(models.Product, { foreignKey: 'productId' });

models.User.hasMany(models.ViewedProduct, { foreignKey: 'userId' });
models.ViewedProduct.belongsTo(models.User, { foreignKey: 'userId' });
models.Product.hasMany(models.ViewedProduct, { foreignKey: 'productId' });
models.ViewedProduct.belongsTo(models.Product, { foreignKey: 'productId' });
models.ViewedProduct.belongsTo(models.Vendor, { foreignKey: 'vendorId' }); // Add association

models.User.hasMany(models.BoughtProduct, { foreignKey: 'userId' });
models.BoughtProduct.belongsTo(models.User, { foreignKey: 'userId' });
models.Product.hasMany(models.BoughtProduct, { foreignKey: 'productId' });
models.BoughtProduct.belongsTo(models.Product, { foreignKey: 'productId' });
models.BoughtProduct.belongsTo(models.Vendor, { foreignKey: 'vendorId' }); // Add association

models.User.hasMany(models.VendorRating, { foreignKey: 'userId' });
models.VendorRating.belongsTo(models.User, { foreignKey: 'userId' });
models.Vendor.hasMany(models.VendorRating, { foreignKey: 'vendorId' });
models.VendorRating.belongsTo(models.Vendor, { foreignKey: 'vendorId' });

models.Vendor.hasMany(models.Product, { foreignKey: 'vendorId' });
models.Product.belongsTo(models.Vendor, { foreignKey: 'vendorId' });

models.User.hasMany(models.Recommendation, { foreignKey: 'userId' }); // Associate User with Recommendation
models.Recommendation.belongsTo(models.User, { foreignKey: 'userId' });

models.Product.hasMany(models.Recommendation, { foreignKey: 'productId' }); // Associate Product with Recommendation
models.Recommendation.belongsTo(models.Product, { foreignKey: 'productId' });

models.Vendor.belongsToMany(models.Category, { through: 'VendorCategory', foreignKey: 'vendorId' });
models.Category.belongsToMany(models.Vendor, { through: 'VendorCategory', foreignKey: 'categoryId' });

models.User.belongsToMany(models.Category, { through: 'UserCategory', foreignKey: 'userId' });
models.Category.belongsToMany(models.User, { through: 'UserCategory', foreignKey: 'categoryId' });



module.exports = models;
