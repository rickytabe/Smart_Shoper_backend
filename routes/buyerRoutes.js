const express = require('express');
const router = express.Router();
const { registerBuyer, loginBuyer, getAllBuyers } = require('../controllers/buyerController');

// Register route
router.post('/registerBuyer', async (req, res) => {
  try {
    await registerBuyer(req, res); // Call the registerUser function
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/loginBuyer', async (req, res) => {
  try {
    await loginBuyer(req, res); // Call the loginUser function
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
//update Buyer
router.post('/updateBuyer/:id', async (req, res) => {
  const { id } = req.params;
  await updateBuyer(req, res)
});
//delete Buyer
router.post('/deleteBuyer/:id', async (req, res) => {
  try{
  const { id } = req.params;
  await deleteBuyer(req, res)
  }catch(err){
  console.error(err.message);
  res.status(500).json({ message: 'Server error' })
  }
});
//get all Buyer
router.get('/getAllBuyers', async (req, res) => {
  try{
    await getAllBuyers(req, res)
  }catch(err){
    console.error(err.message);
    res.status(500).json({ message: 'Server error' })
  }
})
//getBuyer


module.exports = router;
