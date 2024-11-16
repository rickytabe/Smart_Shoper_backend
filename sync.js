const sequelize = require('./config/db'); // Correct path to your database config
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Categories = require('./models/categories');
const UserCategory = require('./models/UserCategory');
const VendorCategory = require('./models/VendorCategory');
const Ratings = require('./models/Ratings');
const VendorRating = require('./models/VendorRating');
const BoughtProduct = require('./models/BoughtProduct');
const ViewedProduct = require('./models/ViewedProduct');
const Recommendation = require('./models/Recommendation');

// Add any other models you might have

const syncDatabase = async () => {
  try {

    console.log('Connection has been established successfully.');

    // Sync models in order, considering foreign key dependencies
    await User.sync({ alter: true });
    await Vendor.sync({ alter: true });
    await Categories.sync({ alter: true });
    await Product.sync({ alter: true });
    await Order.sync({ alter: true });
    await OrderItem.sync({ alter: true });
    await UserCategory.sync({ alter: true });
    await VendorCategory.sync({ alter: true });
    await Ratings.sync({ alter: true });
    await VendorRating.sync({ alter: true });
    await BoughtProduct.sync({ alter: true });
    await ViewedProduct.sync({ alter: true });
    await Recommendation.sync({ alter: true });

    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database schema:', error);
  } finally {
    await sequelize.close(); // Close the connection after syncing
  }
};

// Execute the sync
syncDatabase();
