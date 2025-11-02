const mongoose = require('mongoose');

const mealPlanItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const mealPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  planType: {
    type: String,
    required: true,
    enum: ['preset-combo', 'custom-selection']
  },
  // For preset combo plans - fixed items included
  items: [mealPlanItemSchema],

  // For custom selection plans - user can choose from these categories/items
  allowedCategories: [{
    type: String,
    enum: [
      'roti-puri',
      'paranthas',
      'rice',
      'non-veg-curries',
      'veg-curries',
      'sabji',
      'special-items',
      'snacks'
    ]
  }],
  maxItems: {
    type: Number,
    default: 5 // Maximum items user can select for custom plans
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  // For daily plans - specific date
  date: {
    type: Date
  },
  // For weekly/monthly plans - validity period
  validFrom: {
    type: Date
  },
  validUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
