// server/models/categories.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db').sequelize;

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // We'll store an array of image URLs as a JSON string
  imageUrls: { 
    type: DataTypes.JSON, // Use JSON data type to store arrays
    allowNull: true,
    defaultValue: [], // Default to an empty array
    get() {
      const rawValue = this.getDataValue('imageUrls');
      return rawValue ? JSON.parse(rawValue) : []; // Parse JSON on retrieval
    },
    set(value) {
      this.setDataValue('imageUrls', JSON.stringify(value)); // Stringify before saving
    }
  },
}, {
  timestamps: true 
});

module.exports = Category;
