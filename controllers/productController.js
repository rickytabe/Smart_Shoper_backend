const Product = require("../models/Product");
const Vendor = require('../models/Vendor'); 

// Function to get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Function to get a single product by ID
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product: ", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Function to create a new product 
exports.createProduct = async (req, res) => {
  const { 
    name, 
    price, 
    description, 
    imageUrl, 
    CategoryId,
    stock, 
    vendorId, 
    likes, 
    rating, 
    type, 
    discount 
  } = req.body;

  // Input validation
  if (!name || !price || !CategoryId || !stock || !vendorId || !type) {
    return res.status(400).json({ 
      message: "Name, price, CategoryId, stock, vendorId, and type are required." 
    });
  }

  // Check data types
  if (typeof name !== "string" || 
      typeof price !== "number" || 
      typeof CategoryId !== "string" ||
      typeof stock !== "number" || 
      typeof vendorId !== "number" || 
      typeof likes !== "number" || 
      typeof rating !== "number" || 
      typeof type !== "string" || 
      typeof discount !== "number"
  ) {
    return res.status(400).json({ 
      message: "Invalid data types provided for one or more fields." 
    });
  }

  // Check if imageUrl is a valid URL (if provided)
  if (imageUrl && !isValidUrl(imageUrl)) {
    return res.status(400).json({ message: "Invalid image URL." });
  }

  // Check if the vendor exists
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found." });
  }

  // Check if the user is a vendor (assuming you have role-based authorization)
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: "Unauthorized: Only vendors can create products." });
  }

  try {
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl,
      CategoryId,
      stock,
      vendorId,
      likes,
      rating,
      type,
      discount
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

// Function to update an existing product
exports.updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { 
    name, 
    price, 
    description, 
    imageUrl, 
    CategoryId,
    stock, 
    vendorId, 
    likes, 
    rating, 
    type, 
    discount 
  } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the vendor of the product
    if (product.vendorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: Only the product vendor can update this product." });
    }

    // Input validation (similar to createProduct, but you might allow partial updates)
    // ...

    // Update the product
    await product.update({
      name,
      price,
      description,
      imageUrl,
      CategoryId,
      stock,
      vendorId,
      likes,
      rating,
      type,
      discount
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Function to delete a product
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user is the vendor of the product
    if (product.vendorId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: You are not the vendor of this product." });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
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
