const MenuItem = require('../models/MenuItem');

// Get all menu items (with optional category filter)
exports.getAllMenuItems = async (req, res) => {
  try {
    const { category, isAvailable } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const menuItems = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single menu item
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create menu item (Admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update menu item (Admin only)
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete menu item (Admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get menu categories
exports.getCategories = async (req, res) => {
  try {
    const categories = [
      'roti-puri',
      'paranthas',
      'rice',
      'non-veg-curries',
      'veg-curries',
      'sabji',
      'special-items',
      'snacks'
    ];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
