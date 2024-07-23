const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

exports.getProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await product.update(req.body);
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await product.destroy();
  res.status(204).end();
};
