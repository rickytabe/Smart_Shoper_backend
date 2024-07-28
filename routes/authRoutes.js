const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Register route
router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res); // Call the registerUser function
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res); // Call the loginUser function
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
