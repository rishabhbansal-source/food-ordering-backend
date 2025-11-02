const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

// Address management
router.post('/address', verifyToken, authController.addAddress);
router.put('/address/:addressId', verifyToken, authController.updateAddress);
router.delete('/address/:addressId', verifyToken, authController.deleteAddress);

module.exports = router;
