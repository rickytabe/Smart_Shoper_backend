// server/controllers/recommendationController.js

const { generateRecommendations } = require('../utils/recommendationUtils');
const { Product } = require('../models'); // Import the Product model
const { Op } = require('sequelize'); 


const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request

    const recommendedProductIds = await generateRecommendations(userId);

    const recommendedProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: recommendedProductIds
        }
      }
    });

    res.json(recommendedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getRecommendations,
};
