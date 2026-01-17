const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a campaign title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a campaign description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [200, 'Short description cannot be more than 200 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please provide a target amount'],
        min: [100, 'Target amount must be at least 100']
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'
    },
    category: {
        type: String,
        enum: ['education', 'health', 'environment', 'disaster-relief', 'animals', 'community', 'other'],
        default: 'other'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'disabled'],
        default: 'pending'
    },
    featured: {
        type: Boolean,
        default: false
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide an end date']
    },
    donorsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate percentage raised
campaignSchema.virtual('percentageRaised').get(function () {
    return Math.min(Math.round((this.raisedAmount / this.targetAmount) * 100), 100);
});

// Calculate days left
campaignSchema.virtual('daysLeft').get(function () {
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
});

// Include virtuals in JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);
