const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, deliveryDate, notes, mealPlan } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item ${item.menuItem} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity
      });

      totalAmount += menuItem.price * item.quantity;
    }

    const order = new Order({
      user: req.user._id,
      orderType: 'one-time',
      items: orderItems,
      mealPlan,
      deliveryAddress,
      totalAmount,
      paymentMethod: 'cod',
      deliveryDate: new Date(deliveryDate),
      notes
    });

    await order.save();
    await order.populate('items.menuItem');

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const { status, orderType } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.orderStatus = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter)
      .populate('items.menuItem')
      .populate('mealPlan')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem')
      .populate('mealPlan')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, orderType, startDate, endDate } = req.query;
    const filter = {};

    if (status) filter.orderStatus = status;
    if (orderType) filter.orderType = orderType;
    if (startDate || endDate) {
      filter.deliveryDate = {};
      if (startDate) filter.deliveryDate.$gte = new Date(startDate);
      if (endDate) filter.deliveryDate.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.menuItem')
      .populate('mealPlan')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    await order.populate('user', 'name email phone');
    await order.populate('items.menuItem');

    res.json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
