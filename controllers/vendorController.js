const { Vendor, Product, Category } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // For Sequelize operators
require('dotenv').config(); // Load environment variables

// Function to get all vendors
const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({
      include: [Product], // Include products to show what they sell
    });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get a single vendor by ID
const getVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByPk(id, {
      include: [Product], // Include products to show what they sell
    });
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to register a new vendor
const registerVendor = async (req, res) => {
  try {
    const { name, description, phonenumber, email, password, categories } = req.body;

    // Validate input
    if (!name || !description || !email || !phonenumber|| !password || !categories) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingVendor = await Vendor.findOne({ where: { email } });
    if (existingVendor) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate categories (check if they exist in the Category table)
    const validCategories = await Category.findAll({
      where: {
        name: {
          [Op.in]: categories,
        },
      },
    });
    if (validCategories.length !== categories.length) {
      return res.status(400).json({ message: 'Invalid categories' });
    }

    // Create vendor
    const newVendor = await Vendor.create({
      name,
      description,
      phonenumber,
      email,
      password: hashedPassword,
      categories, // Store the selected categories
    });

    // Associate categories with the vendor (if you have a many-to-many relationship)
    await newVendor.setCategories(validCategories);

    // Generate JWT token
    const token = jwt.sign({ vendor: { id: newVendor.id } }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    res.status(201).json({ token, name: newVendor.name, email: newVendor.email });
  } catch (error) {
    console.error('Error registering vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to log in an existing vendor
const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find vendor
    const vendor = await Vendor.findOne({ where: { email } });
    if (!vendor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ vendor: { id: vendor.id } }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    res.json({ token, name: vendor.name, email: vendor.email });
  } catch (error) {
    console.error('Error logging in vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to update an existing vendor
const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { name, description, phonenumber, email, password, categories } = req.body;

  try {
    const vendor = await Vendor.findByPk(id);

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Update vendor data (handle password hashing if necessary)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      vendor.password = hashedPassword;
    }

    // Validate categories (check if they exist in the Category table)
    const validCategories = await Category.findAll({
      where: {
        name: {
          [Op.in]: categories,
        },
      },
    });
    if (validCategories.length !== categories.length) {
      return res.status(400).json({ message: 'Invalid categories' });
    }

    await vendor.update({ name, description,phonenumber, email, password: vendor.password, categories });

    // Update the vendor's associated categories
    await vendor.setCategories(validCategories);

    res.json(vendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to delete a vendor
const deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByPk(id);
    if (vendor) {
      await vendor.destroy();
      res.status(204).end({ message: 'Vendor deleted successfully' }); // 204 No Content - successful deletion
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to get vendors by category
const getVendorsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const vendors = await Vendor.findAll({
      where: {
        categories: {
          [Op.contains]: [category], // Check if the category is in the vendor's categories array
        },
      },
      include: [Product], // Include products to show what they sell
    });
    res.json(vendors);
  } catch (error) {
    console.error('Error fetching vendors by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to search vendors by name or description
const searchVendors = async (req, res) => {
  const { query } = req.query;

  try {
    const vendors = await Vendor.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [Product], // Include products to show what they sell
    });

    res.json(vendors);
  } catch (error) {
    console.error('Error searching vendors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getVendors,
  getVendor,
  registerVendor,
  loginVendor,
  updateVendor,
  deleteVendor,
  getVendorsByCategory,
  searchVendors,
};
