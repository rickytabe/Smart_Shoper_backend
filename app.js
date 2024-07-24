const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('./config/db').sequelize;

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Shopper API!');
});

const PORT = process.env.PORT || 5000;

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
