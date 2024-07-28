const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const sequelize = require('./config/db').sequelize;
const models = require('./models'); // Import models to initialize associations

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Shopper API!');
});

const PORT = process.env.PORT || 5000;

// Sync database and then start server
sequelize.sync().then(() => {
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

module.exports = app;
