const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', orderController.getOrders);
router.get('/getOrder/:orderId', orderController.getOrder);
router.post('/createOrder', orderController.createOrder);
router.put('/updateStatus/:orderId', orderController.updateOrderStatus); // Add this route
router.delete('/deleteOrder/:orderId', orderController.deleteOrder);
router.put('/updateOrder', orderController.updateOrder);

module.exports = router;
