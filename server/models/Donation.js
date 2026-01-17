const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    donorName: {
        type: String,
        required: [true, 'Please provide donor name'],
        trim: true
    },
    donorEmail: {
        type: String,
        required: [true, 'Please provide donor email'],
        lowercase: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: [1, 'Donation amount must be at least 1']
    },
    message: {
        type: String,
        maxlength: [500, 'Message cannot be more than 500 characters']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Update campaign after successful donation
donationSchema.post('save', async function () {
    if (this.status === 'completed') {
        const Campaign = mongoose.model('Campaign');
        await Campaign.findByIdAndUpdate(this.campaign, {
            $inc: { raisedAmount: this.amount, donorsCount: 1 }
        });
    }
});

module.exports = mongoose.model('Donation', donationSchema);
