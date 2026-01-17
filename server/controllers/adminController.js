const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCampaigns = await Campaign.countDocuments();
        const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
        const pendingCampaigns = await Campaign.countDocuments({ status: 'pending' });

        const donationStats = await Donation.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalDonations: { $sum: 1 }
                }
            }
        ]);

        const recentDonations = await Donation.find({ status: 'completed' })
            .populate('campaign', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalUsers,
            totalCampaigns,
            activeCampaigns,
            pendingCampaigns,
            totalAmount: donationStats[0]?.totalAmount || 0,
            totalDonations: donationStats[0]?.totalDonations || 0,
            recentDonations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments();

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all campaigns (admin)
// @route   GET /api/admin/campaigns
// @access  Private/Admin
const getAllCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const campaigns = await Campaign.find(filter)
            .populate('creator', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Campaign.countDocuments(filter);

        res.json({
            campaigns,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalCampaigns: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update campaign status (approve/disable)
// @route   PUT /api/admin/campaigns/:id/status
// @access  Private/Admin
const updateCampaignStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'active', 'completed', 'disabled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('creator', 'name email');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle campaign featured status
// @route   PUT /api/admin/campaigns/:id/featured
// @access  Private/Admin
const toggleFeatured = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        campaign.featured = !campaign.featured;
        await campaign.save();

        res.json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all donations (admin)
// @route   GET /api/admin/donations
// @access  Private/Admin
const getAllDonations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const donations = await Donation.find()
            .populate('campaign', 'title')
            .populate('donor', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Donation.countDocuments();

        res.json({
            donations,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDonations: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllUsers,
    getAllCampaigns,
    updateCampaignStatus,
    toggleFeatured,
    getAllDonations,
    updateUserRole
};
