const express = require('express');
const vendorController = require('../controllers/vendorController'); 
const router = express.Router();


// Get all vendors
router.get('/', vendorController.getVendors);

// Get a single vendor
router.get('/:id', vendorController.getVendor);

// Register a new vendor
router.post('/registerVendor', vendorController.registerVendor);

// Login an existing vendor
router.post('/loginVendor', vendorController.loginVendor);

// Update a vendor (only for the vendor themselves)
router.put('/updateVendor/:id', async (req, res) => {
  const { id } = req.params;
  if (req.vendor.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Unauthorized: You cannot update another vendor' });
  }
  await vendorController.updateVendor(req, res);
});

// Delete a vendor (only for the vendor themselves)
router.delete('/deleteVendor/:id', async (req, res) => {
  const { id } = req.params;
  if (req.vendor.id !== parseInt(id)) {
    return res.status(403).json({ message: 'Unauthorized: You cannot delete another vendor' });
  }
  await vendorController.deleteVendor(req, res);
});

// Get vendors by category
router.get('/category/:category', vendorController.getVendorsByCategory);

// Search vendors
router.get('/search', vendorController.searchVendors);

module.exports = router;
