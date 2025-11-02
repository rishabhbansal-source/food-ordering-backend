const Subscription = require('../models/Subscription');
const MealPlan = require('../models/MealPlan');

// Create subscription
exports.createSubscription = async (req, res) => {
  try {
    const { mealPlan, customItems, deliveryAddress, startDate, endDate, deliveryDays, notes } = req.body;

    const plan = await MealPlan.findById(mealPlan);
    if (!plan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    if (!plan.isActive) {
      return res.status(400).json({ message: 'This meal plan is not currently active' });
    }

    // Validate custom items for custom-selection plans
    if (plan.planType === 'custom-selection' && (!customItems || customItems.length === 0)) {
      return res.status(400).json({ message: 'Please select items for your custom meal plan' });
    }

    if (plan.planType === 'custom-selection' && customItems.length > plan.maxItems) {
      return res.status(400).json({ message: `You can select maximum ${plan.maxItems} items` });
    }

    const subscription = new Subscription({
      user: req.user._id,
      mealPlan,
      customItems: plan.planType === 'custom-selection' ? customItems : undefined,
      deliveryAddress,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      deliveryDays,
      totalAmount: plan.price,
      notes
    });

    await subscription.save();
    await subscription.populate('mealPlan');
    await subscription.populate('customItems.menuItem');

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;

    const subscriptions = await Subscription.find(filter)
      .populate('mealPlan')
      .populate('customItems.menuItem')
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single subscription
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('mealPlan')
      .populate('customItems.menuItem')
      .populate('user', 'name email phone');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user owns the subscription or is admin
    if (subscription.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ subscription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all subscriptions (Admin only)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const subscriptions = await Subscription.find(filter)
      .populate('user', 'name email phone')
      .populate('mealPlan')
      .populate('customItems.menuItem')
      .sort({ createdAt: -1 });

    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { deliveryAddress, deliveryDays, notes, status } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user owns the subscription or is admin
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (deliveryAddress) subscription.deliveryAddress = deliveryAddress;
    if (deliveryDays) subscription.deliveryDays = deliveryDays;
    if (notes) subscription.notes = notes;
    if (status) subscription.status = status;

    await subscription.save();
    await subscription.populate('mealPlan');
    await subscription.populate('customItems.menuItem');

    res.json({
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check if user owns the subscription
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
