const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { createOrder, verifyPayment } = require('../utils/razorpay');

// @desc    Create Razorpay order for donation
// @route   POST /api/donations/create-order
// @access  Public
const createDonationOrder = async (req, res) => {
    try {
        const { campaignId, amount, donorName, donorEmail, message, isAnonymous } = req.body;

        // Validate campaign exists and is active
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        if (campaign.status !== 'active') {
            return res.status(400).json({ message: 'This campaign is not accepting donations' });
        }

        // Create Razorpay order
        const receipt = `donation_${Date.now()}`;
        const order = await createOrder(amount, 'INR', receipt);

        // Create pending donation record
        const donation = await Donation.create({
            campaign: campaignId,
            donor: req.user?._id || null,
            donorName,
            donorEmail,
            amount,
            message,
            isAnonymous,
            razorpayOrderId: order.id,
            status: 'pending'
        });

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            donationId: donation._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify payment and complete donation
// @route   POST /api/donations/verify-payment
// @access  Public
const verifyDonationPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, donationId } = req.body;

        // Verify signature
        const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            // Update donation status to failed
            await Donation.findByIdAndUpdate(donationId, { status: 'failed' });
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // Update donation to completed
        const donation = await Donation.findByIdAndUpdate(
            donationId,
            {
                razorpayPaymentId,
                razorpaySignature,
                status: 'completed'
            },
            { new: true }
        ).populate('campaign');

        // Update campaign raised amount
        await Campaign.findByIdAndUpdate(donation.campaign._id, {
            $inc: { raisedAmount: donation.amount, donorsCount: 1 }
        });

        res.json({
            message: 'Payment verified successfully',
            donation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get donations for a campaign
// @route   GET /api/donations/campaign/:campaignId
// @access  Public
const getDonationsByCampaign = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const donations = await Donation.find({
            campaign: req.params.campaignId,
            status: 'completed'
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('donorName amount message isAnonymous createdAt');

        const total = await Donation.countDocuments({
            campaign: req.params.campaignId,
            status: 'completed'
        });

        // Hide donor names for anonymous donations
        const processedDonations = donations.map(d => ({
            ...d.toObject(),
            donorName: d.isAnonymous ? 'Anonymous' : d.donorName
        }));

        res.json({
            donations: processedDonations,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalDonations: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user's donation history
// @route   GET /api/donations/my-donations
// @access  Private
const getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id, status: 'completed' })
            .populate('campaign', 'title image')
            .sort({ createdAt: -1 });

        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createDonationOrder,
    verifyDonationPayment,
    getDonationsByCampaign,
    getMyDonations
};
