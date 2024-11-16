const Category = require('../models/categories'); // Assuming your model is in '../models/categories.js'
const Vendor = require('../models/Vendor'); // For associations
const { Op } = require('sequelize');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
    const { name, describtion, imageUrls, metaDescription } = req.body; 
    try {
      // Input validation (including imageUrls if required)
      if (!name || !describtion) {
        return res.status(400).json({ message: 'Name and Description are required' });
      }
  
      // Validate imageUrls (if provided) to ensure it's an array of valid URLs
      if (imageUrls && (!Array.isArray(imageUrls) || !imageUrls.every(isValidUrl))) {
        return res.status(400).json({ message: 'Invalid image URLs provided.' });
      }
  
      const newCategory = await Category.create({ 
        name, 
        describtion, 
        imageUrls, // Save the array of image URLs
        metaDescription 
      });
  
      res.status(201).json(newCategory);
    }catch(error){
      //error handling

    }  
};

// Update an existing category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, describtion, imageUrls, metaDescription } = req.body;
    try {
      const category = await Category.findByPk(id);
      if (category) {
        // ... (Input validation similar to createCategory)
  
        await category.update({ 
          name, 
          describtion, 
          imageUrls, 
          metaDescription 
        });
        res.json(category);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      // ... error handling ...

    }
  };
  

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (category) {
      await category.destroy();
      res.status(204).end(); // 204 No Content - successful deletion
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get vendors associated with a category
exports.getVendorsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findByPk(categoryId, {
      include: [
        {
          model: Vendor,
          through: 'VendorCategory', // Assuming your through table is named 'VendorCategory'
        },
      ],
    });

    if (category) {
      res.json(category.Vendors); // Send the associated vendors
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Search categories by name
exports.searchCategories = async (req, res) => {
  const { query } = req.query;

  try {
    const categories = await Category.findAll({
      where: {
        name: {
          [Op.like]: `%${query}%`, // Case-insensitive search
        },
      },
    });

    res.json(categories);
  } catch (error) {
    console.error('Error searching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Helper function to check for valid URL
function isValidUrl(urlString) {
  try {
    new URL(urlString);
    return true; 
  } catch (error) {
    return false; 
  }
}
