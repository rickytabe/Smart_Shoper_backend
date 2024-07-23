const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);

module.exports = router;
