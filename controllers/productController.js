const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

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

exports.createProduct = async (req, res) => {
  const { name, price, description, imageUrl } = req.body;

  // Validate input
  if (!name || !price) {
    return res.status(400).json({ message: "Name and price are required." });
  }

  if (typeof name !== "string" || typeof price !== "number") {
    return res
      .status(400)
      .json({ message: "Name must be a string and price must be a number." });
  }
  // Check if imageUrl is a valid URL
  /*if (!isValidUrl(imageUrl)) {
    return res.status(400).json({ message: "Invalid image URL." });
  }

  // ... rest of your createProduct logic ...

  // Helper function to check for valid URL
  function isValidUrl(urlString) {
    let url;
    try {
      url = new URL(urlString);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
*/
  try {
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
