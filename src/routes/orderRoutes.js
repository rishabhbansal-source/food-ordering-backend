const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrder);
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// Admin routes
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
