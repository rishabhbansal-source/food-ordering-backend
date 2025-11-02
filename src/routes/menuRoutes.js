const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/categories', menuController.getCategories);
router.get('/:id', menuController.getMenuItem);

// Admin routes
router.post('/', verifyToken, isAdmin, menuController.createMenuItem);
router.put('/:id', verifyToken, isAdmin, menuController.updateMenuItem);
router.delete('/:id', verifyToken, isAdmin, menuController.deleteMenuItem);

module.exports = router;
