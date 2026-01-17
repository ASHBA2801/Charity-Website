const Campaign = require('../models/Campaign');

// @desc    Get all active campaigns
// @route   GET /api/campaigns
// @access  Public
const getAllCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = { status: 'active' };

        // Category filter
        if (req.query.category && req.query.category !== 'all') {
            query.category = req.query.category;
        }

        // Search filter
        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const campaigns = await Campaign.find(query)
            .populate('creator', 'name avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Campaign.countDocuments(query);

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

// @desc    Get featured campaigns
// @route   GET /api/campaigns/featured
// @access  Public
const getFeaturedCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ status: 'active', featured: true })
            .populate('creator', 'name avatar')
            .sort({ raisedAmount: -1 })
            .limit(6);

        // If not enough featured, fill with top campaigns
        if (campaigns.length < 6) {
            const additionalCampaigns = await Campaign.find({
                status: 'active',
                featured: false,
                _id: { $nin: campaigns.map(c => c._id) }
            })
                .populate('creator', 'name avatar')
                .sort({ raisedAmount: -1 })
                .limit(6 - campaigns.length);

            campaigns.push(...additionalCampaigns);
        }

        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate('creator', 'name avatar email');

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.json(campaign);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a campaign
// @route   POST /api/campaigns
// @access  Private
const createCampaign = async (req, res) => {
    try {
        const { title, description, shortDescription, targetAmount, image, category, endDate } = req.body;

        const campaign = await Campaign.create({
            title,
            description,
            shortDescription: shortDescription || description.substring(0, 150) + '...',
            targetAmount,
            image,
            category,
            endDate,
            creator: req.user._id,
            status: 'pending' // Requires admin approval
        });

        await campaign.populate('creator', 'name avatar');

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Owner or Admin)
const updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check ownership or admin
        if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this campaign' });
        }

        const { title, description, shortDescription, targetAmount, image, category, endDate } = req.body;

        campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            { title, description, shortDescription, targetAmount, image, category, endDate },
            { new: true, runValidators: true }
        ).populate('creator', 'name avatar');

        res.json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Owner or Admin)
const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Check ownership or admin
        if (campaign.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this campaign' });
        }

        await campaign.deleteOne();

        res.json({ message: 'Campaign removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's campaigns
// @route   GET /api/campaigns/user/my-campaigns
// @access  Private
const getMyCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ creator: req.user._id })
            .sort({ createdAt: -1 });

        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllCampaigns,
    getFeaturedCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    getMyCampaigns
};
