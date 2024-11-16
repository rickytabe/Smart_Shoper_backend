const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const VendorCategory = sequelize.define('VendorCategory', {
  // You can add additional fields here if needed, for example:
  // createdAt: DataTypes.DATE,
  // updatedAt: DataTypes.DATE,
}, {
timestamps: true
}
);

module.exports = VendorCategory;
