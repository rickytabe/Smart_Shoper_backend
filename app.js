const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); 
const { sequelize, syncDatabase } = require('./config/db');
const models = require('./models'); // Import models to initialize associations

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:5173']
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 ) { // Allow requests with no origin (like mobile apps or Postman) or from allowed origins
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you are using cookies or authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

app.use(cors(corsOptions));

// Middleware

app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/buyerRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/auth', require('./routes/vendorRoutes')); 
app.use('/api/categories', require('./routes/categoryRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Shopper API!');
});

const PORT = process.env.PORT || 5000;

// Sync database and then start server
syncDatabase()
  .then(async () => {
    console.log('Database & tables synced successfully');

    // 1. Sync new models (if any) - use force: true ONLY ONCE for initial creation
    // Example:
    // await sequelize.models.NewModel.sync({ force: true }); // Create the table
    // ... (repeat for other new models) ...

    // 2. Sync modified models individually
    // Example:
    // await sequelize.models.User.sync({ alter: true }); 
    // await sequelize.models.Product.sync({ alter: true }); 
    // ... (repeat for other modified models) ...

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = app;
