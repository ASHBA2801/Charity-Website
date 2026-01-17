const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getAllCampaigns,
    updateCampaignStatus,
    toggleFeatured,
    getAllDonations,
    updateUserRole
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

// All routes require authentication and admin role
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/campaigns', getAllCampaigns);
router.put('/campaigns/:id/status', updateCampaignStatus);
router.put('/campaigns/:id/featured', toggleFeatured);
router.get('/donations', getAllDonations);

module.exports = router;
