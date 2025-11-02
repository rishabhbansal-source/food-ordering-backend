const MealPlan = require('../models/MealPlan');

// Get all meal plans
exports.getAllMealPlans = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const mealPlans = await MealPlan.find(filter)
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single meal plan
exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate('items.menuItem');
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ mealPlan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create meal plan (Admin only)
exports.createMealPlan = async (req, res) => {
  try {
    const mealPlan = new MealPlan(req.body);
    await mealPlan.save();
    await mealPlan.populate('items.menuItem');

    res.status(201).json({
      message: 'Meal plan created successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update meal plan (Admin only)
exports.updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('items.menuItem');

    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    res.json({
      message: 'Meal plan updated successfully',
      mealPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete meal plan (Admin only)
exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get active meal plans by date range
exports.getActiveMealPlansByDate = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.$or = [
        { type: 'daily', date: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { type: { $in: ['weekly', 'monthly'] }, validFrom: { $lte: new Date(endDate) }, validUntil: { $gte: new Date(startDate) } }
      ];
    }

    const mealPlans = await MealPlan.find(filter).populate('items.menuItem');
    res.json({ mealPlans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
