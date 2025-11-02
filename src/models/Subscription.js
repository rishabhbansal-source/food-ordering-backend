const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MealPlan',
    required: true
  },
  // For custom selection plans - user's chosen items
  customItems: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    quantity: Number
  }],
  deliveryAddress: {
    label: String,
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  // For daily subscriptions - days of week to deliver (0 = Sunday, 6 = Saturday)
  deliveryDays: [{
    type: Number,
    min: 0,
    max: 6
  }],
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'completed'],
    default: 'active'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
