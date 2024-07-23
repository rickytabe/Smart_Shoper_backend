// /server/utils/recommendationUtils.js

/**
 * Function to generate product recommendations based on user history.
 * @param {Array} userOrders - Array of user orders.
 * @param {Array} allProducts - Array of all available products.
 * @returns {Array} - Array of recommended products.
 */
function generateRecommendations(userOrders, allProducts) {
    // Your recommendation logic here
    const recommendedProducts = [];
  
    // Example logic: Recommend products that the user hasn't ordered yet
    const orderedProductIds = userOrders.map(order => order.productId);
    allProducts.forEach(product => {
      if (!orderedProductIds.includes(product.id)) {
        recommendedProducts.push(product);
      }
    });
  
    return recommendedProducts;
  }
  
  module.exports = {
    generateRecommendations,
  };
  