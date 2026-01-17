const express = require('express');
const router = express.Router();
const {
    createDonationOrder,
    verifyDonationPayment,
    getDonationsByCampaign,
    getMyDonations
} = require('../controllers/donationController');
const { protect, optionalAuth } = require('../middleware/auth');

// Public routes
router.post('/create-order', optionalAuth, createDonationOrder);
router.post('/verify-payment', verifyDonationPayment);
router.get('/campaign/:campaignId', getDonationsByCampaign);

// Protected routes
router.get('/my-donations', protect, getMyDonations);

module.exports = router;
