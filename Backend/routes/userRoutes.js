const express = require('express');
const { protect, adminOnly } = require('../middlewares/authMiddleware'); // Importing authentication middleware
const { getUsers, getUserById, deleteUser } = require('../controllers/userController'); // Importing user controller functions
const router = express.Router();

router.get('/',protect,adminOnly,getUsers); // Get all users
router.get('/:id',protect,getUserById); // Get user by ID
//router.delete('/:id',protect,admin,deleteUser); // Delete user by ID


module.exports = router; // Export the router