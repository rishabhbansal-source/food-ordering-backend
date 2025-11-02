const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', verifyToken, subscriptionController.createSubscription);
router.get('/my-subscriptions', verifyToken, subscriptionController.getUserSubscriptions);
router.get('/:id', verifyToken, subscriptionController.getSubscription);
router.put('/:id', verifyToken, subscriptionController.updateSubscription);
router.put('/:id/cancel', verifyToken, subscriptionController.cancelSubscription);

// Admin routes
router.get('/', verifyToken, isAdmin, subscriptionController.getAllSubscriptions);

module.exports = router;
