require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('./src/models/User');
const MenuItem = require('./src/models/MenuItem');
const MealPlan = require('./src/models/MealPlan');

// Sample data based on brochures
const menuItems = [
  // Roti & Puri
  { name: 'Plain Roti', category: 'roti-puri', price: 1.2, isVegetarian: true, description: 'Traditional Indian flatbread' },
  { name: 'Ghee Roti', category: 'roti-puri', price: 1.3, isVegetarian: true, description: 'Roti with clarified butter' },
  { name: 'Puri', category: 'roti-puri', price: 1.3, isVegetarian: true, description: 'Deep fried puffed bread' },

  // Paranthas
  { name: 'Plain Parantha', category: 'paranthas', price: 4, isVegetarian: true, description: 'Simple layered flatbread' },
  { name: 'Methi Parantha', category: 'paranthas', price: 5, isVegetarian: true, description: 'Fenugreek flavored parantha' },
  { name: 'Aloo Parantha', category: 'paranthas', price: 6, isVegetarian: true, description: 'Potato stuffed parantha' },
  { name: 'Gobhi Parantha', category: 'paranthas', price: 6, isVegetarian: true, description: 'Cauliflower stuffed parantha' },
  { name: 'Paneer Parantha', category: 'paranthas', price: 6, isVegetarian: true, description: 'Cottage cheese stuffed parantha' },
  { name: 'Mix Parantha', category: 'paranthas', price: 7, isVegetarian: true, description: 'Mixed vegetables stuffed' },
  { name: 'Egg Parantha', category: 'paranthas', price: 7, isVegetarian: false, description: 'Egg stuffed parantha' },

  // Rice
  { name: 'Plain Rice', category: 'rice', price: 5, isVegetarian: true, description: 'Steamed basmati rice' },
  { name: 'Jeera Rice', category: 'rice', price: 6, isVegetarian: true, description: 'Cumin flavored rice' },
  { name: 'Matar Rice', category: 'rice', price: 7, isVegetarian: true, description: 'Peas pulao' },
  { name: 'Veg Fried Rice', category: 'rice', price: 15, isVegetarian: true, description: 'Chinese style fried rice' },
  { name: 'Egg Fried Rice', category: 'rice', price: 15, isVegetarian: false, description: 'Egg fried rice' },
  { name: 'Veg Pulao', category: 'rice', price: 15, isVegetarian: true, description: 'Vegetable pulao' },
  { name: 'Veg Biryani', category: 'rice', price: 16, isVegetarian: true, description: 'Vegetable biryani' },
  { name: 'Chicken Biryani', category: 'rice', price: 16, isVegetarian: false, description: 'Chicken biryani' },
  { name: 'Mutton Biryani', category: 'rice', price: 17, isVegetarian: false, description: 'Mutton biryani' },

  // Non-Veg Curries
  { name: 'Egg Bhurji (Dry)', category: 'non-veg-curries', price: 15, isVegetarian: false, description: 'Scrambled egg curry' },
  { name: 'Egg Curry', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Boiled egg curry' },
  { name: 'Egg Korma', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Egg in rich gravy' },
  { name: 'Kadhai Chicken', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Spicy chicken curry' },
  { name: 'Butter Chicken', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Creamy tomato chicken' },
  { name: 'Cream Chicken', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Chicken in cream sauce' },
  { name: 'Chicken Curry', category: 'non-veg-curries', price: 16, isVegetarian: false, description: 'Traditional chicken curry' },
  { name: 'Mutton Bhuna', category: 'non-veg-curries', price: 17, isVegetarian: false, description: 'Dry mutton curry' },

  // Special Items
  { name: 'Besan Ladoo', category: 'special-items', price: 2, isVegetarian: true, description: 'Chickpea flour sweet' },
  { name: 'Khasta Kachori', category: 'special-items', price: 7, isVegetarian: true, description: 'Crispy stuffed kachori' },
  { name: 'Pani Puri', category: 'special-items', price: 10, isVegetarian: true, description: 'Street food favorite' },
  { name: 'Chole Kachori', category: 'special-items', price: 13, isVegetarian: true, description: 'Kachori with chickpeas' },
  { name: 'Pav Bhaji', category: 'special-items', price: 13, isVegetarian: true, description: 'Spicy vegetable mash' },
  { name: 'Dahi Bhalla', category: 'special-items', price: 13, isVegetarian: true, description: 'Lentil dumplings in yogurt' },
  { name: 'Chole Bhature', category: 'special-items', price: 14, isVegetarian: true, description: 'Chickpeas with fried bread' },

  // Snacks
  { name: 'Plain Bread Pakoda', category: 'snacks', price: 2.5, isVegetarian: true, description: 'Fried bread fritters' },
  { name: 'Aloo Bread Pakoda', category: 'snacks', price: 3.5, isVegetarian: true, description: 'Potato bread fritters' },
  { name: 'Classic Samosa', category: 'snacks', price: 2, isVegetarian: true, description: 'Potato filled pastry' },
  { name: 'Paneer Samosa', category: 'snacks', price: 2.6, isVegetarian: true, description: 'Paneer filled samosa' },
  { name: 'Veg Noodles', category: 'snacks', price: 16, isVegetarian: true, description: 'Chinese style noodles' },
  { name: 'Egg Chowmein', category: 'snacks', price: 16, isVegetarian: false, description: 'Egg noodles' },
  { name: 'Veg Manchurian', category: 'snacks', price: 16, isVegetarian: true, description: 'Vegetable balls in sauce' },

  // Sabji
  { name: 'Jeera Aloo', category: 'sabji', price: 15, isVegetarian: true, description: 'Cumin potato curry' },
  { name: 'Carrot Matar', category: 'sabji', price: 15, isVegetarian: true, description: 'Carrot and peas curry' },
  { name: 'Capsicum Aloo', category: 'sabji', price: 15, isVegetarian: true, description: 'Bell pepper potato curry' },
  { name: 'Gobhi Aloo', category: 'sabji', price: 15, isVegetarian: true, description: 'Cauliflower potato curry' },
  { name: 'Beans Aloo', category: 'sabji', price: 15, isVegetarian: true, description: 'Green beans potato curry' },
  { name: 'Baingan Aloo', category: 'sabji', price: 15, isVegetarian: true, description: 'Eggplant potato curry' },

  // Veg Curries
  { name: 'Tadka Masoor Dal', category: 'veg-curries', price: 15, isVegetarian: true, description: 'Red lentil curry' },
  { name: 'Punjabi Mix Dal', category: 'veg-curries', price: 15, isVegetarian: true, description: 'Mixed lentils' },
  { name: 'Dal Maharani', category: 'veg-curries', price: 15, isVegetarian: true, description: 'Black lentils' },
  { name: 'Dal Makhani', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Creamy black lentils' },
  { name: 'Chole Masala Curry', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Chickpea curry' },
  { name: 'Kala Chana Curry', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Black chickpea curry' },
  { name: 'Rajma Curry', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Kidney beans curry' },
  { name: 'Matar Mushroom', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Peas and mushroom' },
  { name: 'Paneer Butter Masala', category: 'veg-curries', price: 16, isVegetarian: true, description: 'Cottage cheese in tomato gravy' },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await MealPlan.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@homeflavours.com',
      password: 'admin123',
      phone: '0432163918',
      role: 'admin',
      isActive: true,
    });
    console.log('Admin user created:', adminUser.email);

    // Create test user
    console.log('Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test@123',
      phone: '0432163919',
      role: 'user',
      isActive: true,
      addresses: [{
        label: 'Home',
        street: '123 Main St',
        city: 'Manor Lakes',
        state: 'VIC',
        zipCode: '3024',
        phone: '0432163919',
        isDefault: true,
      }],
    });
    console.log('Test user created:', testUser.email);

    // Create menu items
    console.log('Creating menu items...');
    const createdItems = await MenuItem.insertMany(
      menuItems.map(item => ({ ...item, isAvailable: true }))
    );
    console.log(`Created ${createdItems.length} menu items`);

    // Create sample meal plans
    console.log('Creating sample meal plans...');

    // Get some menu items for the preset combo
    const roti = createdItems.find(item => item.name === 'Plain Roti');
    const dal = createdItems.find(item => item.name === 'Dal Makhani');
    const rice = createdItems.find(item => item.name === 'Plain Rice');
    const sabji = createdItems.find(item => item.name === 'Jeera Aloo');

    const dailyPlan = await MealPlan.create({
      name: 'Daily Combo Meal',
      type: 'daily',
      planType: 'preset-combo',
      items: [
        { menuItem: roti._id, quantity: 4 },
        { menuItem: dal._id, quantity: 1 },
        { menuItem: rice._id, quantity: 1 },
        { menuItem: sabji._id, quantity: 1 },
      ],
      price: 25,
      description: '4 Rotis, Dal Makhani, Plain Rice, and Jeera Aloo',
      date: new Date(),
      isActive: true,
    });

    const weeklyPlan = await MealPlan.create({
      name: 'Weekly Custom Plan',
      type: 'weekly',
      planType: 'custom-selection',
      allowedCategories: ['roti-puri', 'paranthas', 'rice', 'veg-curries', 'sabji'],
      maxItems: 7,
      price: 150,
      description: 'Choose up to 7 items from selected categories for the week',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    const monthlyPlan = await MealPlan.create({
      name: 'Monthly Deluxe Plan',
      type: 'monthly',
      planType: 'custom-selection',
      allowedCategories: ['roti-puri', 'paranthas', 'rice', 'veg-curries', 'non-veg-curries', 'sabji'],
      maxItems: 10,
      price: 500,
      description: 'Choose up to 10 items daily for the entire month',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    console.log('Created 3 meal plans');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin:');
    console.log('  Email: admin@homeflavours.com');
    console.log('  Password: admin123');
    console.log('\nTest User:');
    console.log('  Email: test@example.com');
    console.log('  Password: test@123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
