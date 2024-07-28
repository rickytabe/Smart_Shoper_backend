const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/', productController.getProducts);
router.get('/getProduct/:id', productController.getProduct);
router.post('/createProduct', productController.createProduct);
router.put('/updateProduct/:id', productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
