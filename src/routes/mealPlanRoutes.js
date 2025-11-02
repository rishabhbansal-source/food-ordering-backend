const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlanController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public/User routes
router.get('/', mealPlanController.getAllMealPlans);
router.get('/by-date', mealPlanController.getActiveMealPlansByDate);
router.get('/:id', mealPlanController.getMealPlan);

// Admin routes
router.post('/', verifyToken, isAdmin, mealPlanController.createMealPlan);
router.put('/:id', verifyToken, isAdmin, mealPlanController.updateMealPlan);
router.delete('/:id', verifyToken, isAdmin, mealPlanController.deleteMealPlan);

module.exports = router;
