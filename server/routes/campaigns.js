const express = require('express');
const router = express.Router();
const {
    getAllCampaigns,
    getFeaturedCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getMyCampaigns
} = require('../controllers/campaignController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', getAllCampaigns);
router.get('/featured', getFeaturedCampaigns);
router.get('/:id', getCampaign);

// Protected routes
router.post('/', protect, createCampaign);
router.put('/:id', protect, updateCampaign);
router.delete('/:id', protect, deleteCampaign);
router.get('/user/my-campaigns', protect, getMyCampaigns);

module.exports = router;
