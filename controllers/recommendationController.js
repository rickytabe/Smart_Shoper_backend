const { generateRecommendations } = require('../utils/recommendationUtils');
/*const { Order, Product } = require('../models');*/
const Order = require('../models/Order');
const Product = require('../models/Product');


const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request

    // Fetch user orders
    const userOrders = await Order.findAll({ where: { userId } });

    // Fetch all products
    const allProducts = await Product.findAll();

    // Generate recommendations
    const recommendations = generateRecommendations(userOrders, allProducts);

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
};

module.exports = {
  getRecommendations,
};
