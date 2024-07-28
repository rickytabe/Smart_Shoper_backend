//create a route to retrieve users from the database

const express = require('express');
const Users = require('../controllers/userController'); // Assuming you have a userController
const router = express.Router();

// Route to all users
router.get('/', Users.getAllUsers); 
router.get('/:id', Users.getUser);
router.put('/:id', Users.updateUser);
router.delete('/:id', Users.deleteUser);

module.exports = router;
