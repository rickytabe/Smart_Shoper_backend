// server/routes/recommendationRoutes.js

const express = require('express');
const recommendationController = require('../controllers/recommendationController');
const { authMiddleware } = require('../middleware/authMiddleware'); // Import authMiddleware

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Collaborative Filtering Recommendation Route
router.get('/', recommendationController.getRecommendations);

module.exports = router;
