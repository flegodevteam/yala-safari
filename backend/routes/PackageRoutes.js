const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

// Get current package/pricing (for frontend)
router.get('/', packageController.getPackage);

// Update package/pricing (admin panel)
router.put('/', packageController.updatePackage);

module.exports = router;