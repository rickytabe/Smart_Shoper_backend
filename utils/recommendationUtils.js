// /server/utils/recommendationUtils.js
const models = require('../models/index.js'); // Import models
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');


/**
 * Function to generate product recommendations based on user history.
 * @param {number} userId - The ID of the user for whom recommendations are needed.
 * @returns {Array} - Array of recommended product IDs.
 */
const generateRecommendations = async (userId) => {
  // 1. Fetch User Data (including orders)
  const user = await models.User.findByPk(userId, {
    include: [
      {
        model: models.Order,
        include: [
          {
            model: models.OrderItem,
            include: [models.Product]
          }
        ]
      },
      {
        model: models.Ratings,
        include: [models.Product]
      },
      {
        model: models.ViewedProduct,
        include: [models.Product]
      },
      {
        model: models.BoughtProduct,
        include: [models.Product]
      },
      {
        model: models.VendorRating,
        include: [models.Vendor]
      }
    ]
  });

  // 2. Extract Relevant Data
  const userOrders = user.Orders;
  const userRatings = user.Ratings;
  const userViews = user.ViewedProducts;
  const userPurchases = user.BoughtProducts;
  const userVendorRatings = user.VendorRatings;

  // 3. Implement Recommendation Logic (Hybrid Approach)

  // 3.1 Collaborative Filtering (Based on Ratings)
  const userRatingsMap = {};
  userRatings.forEach(rating => {
    userRatingsMap[rating.productId] = rating.rating;
  });

  const similarities = {};
  // Iterate over users who have rated products the current user has rated
  for (const otherUserRating of userRatings) { 
    const otherUserId = otherUserRating.userId;
    if (otherUserId !== userId) {
      // Find ratings of the other user
      const otherUserRatings = await models.Ratings.findAll({ 
        where: { userId: otherUserId },
      });

      const otherUserRatingsMap = otherUserRatings.reduce((map, rating) => {
        map[rating.productId] = rating.rating;
        return map;
      }, {});

      const commonProducts = Object.keys(userRatingsMap).filter(productId => otherUserRatingsMap[productId]);

      if (commonProducts.length > 0) {
        const sum = commonProducts.reduce((acc, productId) => {
          return acc + (userRatingsMap[productId] * otherUserRatingsMap[productId]);
        }, 0);

        similarities[otherUserId] = sum / (commonProducts.length);
      }
    }
  }

  const topSimilarUsers = Object.keys(similarities).sort((a, b) => similarities[b] - similarities[a]).slice(0, 3);

  const collaborativeRecommendations = {};
  topSimilarUsers.forEach(otherUserId => {
    userRatings.filter(rating => rating.userId === parseInt(otherUserId)).forEach(rating => {
      if (!userRatingsMap[rating.productId]) {
        if (!collaborativeRecommendations[rating.productId]) {
          collaborativeRecommendations[rating.productId] = 0;
        }
        collaborativeRecommendations[rating.productId] += rating.rating * similarities[otherUserId];
      }
    });
  });

  // 3.2 Item-Based Recommendations (Based on Orders)
  const purchasedProductIds = userOrders.reduce((ids, order) => {
    return [...ids, ...order.OrderItems.map(item => item.productId)];
  }, []);

  const itemBasedRecommendations = {};
  for (const purchasedProductId of purchasedProductIds) {
    const similarProducts = await models.Product.findAll({
      where: {
        id: {
          [Op.ne]: purchasedProductId
        }
      },
      attributes: ['id'],
      include: [
        {
          model: models.OrderItem,
          attributes: [''],
          where: {
            productId: {
              [Op.in]: purchasedProductIds
            }
          }
        }
      ],
      group: ['Product.id'],
      having: Sequelize.literal(`COUNT(DISTINCT "OrderItem.productId") > 1`) // Ensure at least two common purchases
    });

    similarProducts.forEach(product => {
      if (!itemBasedRecommendations[product.id]) {
        itemBasedRecommendations[product.id] = 0;
      }
      itemBasedRecommendations[product.id]++;
    });
  }

  // 3.3 Content-Based Recommendations (Based on Viewed Products)
  const viewedProductIds = userViews.map(view => view.productId);
  const contentBasedRecommendations = {};
  viewedProductIds.forEach(productId => {
    contentBasedRecommendations[productId] = 1;
  });

  // 3.4 Vendor-Based Recommendations (Based on Vendor Ratings)
  const highRatedVendorIds = userVendorRatings.filter(rating => rating.rating >= 4).map(rating => rating.vendorId);
  const vendorBasedRecommendations = {};
  highRatedVendorIds.forEach(vendorId => {
    userVendorRatings.filter(rating => rating.vendorId === vendorId).forEach(rating => {
      if (!vendorBasedRecommendations[rating.productId]) {
        vendorBasedRecommendations[rating.productId] = 0;
      }
      vendorBasedRecommendations[rating.productId] += rating.rating;
    });
  });

  // 4. Combine Recommendations
  const combinedRecommendations = {};
  Object.keys(collaborativeRecommendations).forEach(productId => {
    combinedRecommendations[productId] = collaborativeRecommendations[productId];
  });
  Object.keys(itemBasedRecommendations).forEach(productId => {
    if (!combinedRecommendations[productId]) {
      combinedRecommendations[productId] = 0;
    }
    combinedRecommendations[productId] += itemBasedRecommendations[productId];
  });
  Object.keys(contentBasedRecommendations).forEach(productId => {
    if (!combinedRecommendations[productId]) {
      combinedRecommendations[productId] = 0;
    }
    combinedRecommendations[productId] += contentBasedRecommendations[productId];
  });
  Object.keys(vendorBasedRecommendations).forEach(productId => {
    if (!combinedRecommendations[productId]) {
      combinedRecommendations[productId] = 0;
    }
    combinedRecommendations[productId] += vendorBasedRecommendations[productId];
  });

  // 5. Sort Recommendations
  const sortedRecommendations = Object.keys(combinedRecommendations).sort((a, b) => combinedRecommendations[b] - combinedRecommendations[a]);

  // 6. Filter Out Already Purchased Products
  const recommendedProductIds = sortedRecommendations.filter(productId => !purchasedProductIds.includes(parseInt(productId)));

  return recommendedProductIds;
};

module.exports = {
  generateRecommendations,
};
