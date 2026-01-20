import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiClock, HiUsers, HiShare, HiHeart, HiUser, HiX } from 'react-icons/hi';
import { campaignsAPI, donationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CampaignProgress from '../components/campaign/CampaignProgress';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate, getDaysRemaining, getCategoryLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

// Razorpay Key ID from environment or fallback
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S5nRTleVBjqKri';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [showDonateModal, setShowDonateModal] = useState(false);

    // Donation form state
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorMessage, setDonorMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [campaignRes, donationsRes] = await Promise.all([
                    campaignsAPI.getById(id),
                    donationsAPI.getByCampaign(id, { limit: 5 })
                ]);
                setCampaign(campaignRes.data);
                setDonations(donationsRes.data.donations);
            } catch (error) {
                console.error('Error fetching campaign:', error);
                toast.error('Campaign not found');
                navigate('/campaigns');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // Pre-fill donor details if user is authenticated
    useEffect(() => {
        if (user) {
            setDonorName(user.name || '');
            setDonorEmail(user.email || '');
        }
    }, [user]);

    const handleDonate = () => {
        if (!isAuthenticated) {
            toast.error('Please login to donate');
            navigate('/login');
            return;
        }

        if (!donationAmount || parseFloat(donationAmount) < 1) {
            toast.error('Please enter a valid donation amount');
            return;
        }

        setShowDonateModal(true);
    };

    const handleCloseDonateModal = () => {
        setShowDonateModal(false);
        setDonorMessage('');
        setIsAnonymous(false);
    };

    const initializeRazorpayPayment = async () => {
        if (!donorName.trim() || !donorEmail.trim()) {
            toast.error('Please enter your name and email');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(donorEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setDonating(true);

        try {
            // Step 1: Create order on backend
            const orderResponse = await donationsAPI.createOrder({
                campaignId: id,
                amount: parseFloat(donationAmount),
                donorName: isAnonymous ? 'Anonymous' : donorName,
                donorEmail,
                message: donorMessage,
                isAnonymous
            });

            const { orderId, amount, currency, donationId } = orderResponse.data;

            // Step 2: Initialize Razorpay checkout
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: amount, // Amount in paise from backend
                currency: currency,
                name: 'CharityHub',
                description: `Donation for: ${campaign.title}`,
                order_id: orderId,
                handler: async function (response) {
                    // Step 3: Verify payment on backend
                    try {
                        const verifyResponse = await donationsAPI.verifyPayment({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            donationId
                        });

                        if (verifyResponse.data) {
                            toast.success('Thank you for your donation! 🎉');
                            handleCloseDonateModal();
                            setDonationAmount('');

                            // Refresh campaign data to update raised amount
                            const updatedCampaign = await campaignsAPI.getById(id);
                            setCampaign(updatedCampaign.data);

                            // Refresh donations list
                            const updatedDonations = await donationsAPI.getByCampaign(id, { limit: 5 });
                            setDonations(updatedDonations.data.donations);
                        }
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: donorName,
                    email: donorEmail
                },
                notes: {
                    campaignId: id,
                    donationId: donationId
                },
                theme: {
                    color: '#8B5CF6' // Primary purple color to match the theme
                },
                modal: {
                    ondismiss: function () {
                        setDonating(false);
                        toast.error('Payment was cancelled');
                    }
                }
            };

            // Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                toast.error('Payment service is not available. Please refresh the page.');
                setDonating(false);
                return;
            }

            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                toast.error(`Payment failed: ${response.error.description}`);
                setDonating(false);
            });

            razorpay.open();
            setDonating(false);

        } catch (error) {
            console.error('Error creating order:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
            setDonating(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: campaign.title,
                text: campaign.shortDescription,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const quickAmounts = [500, 1000, 2500, 5000, 10000];

    if (loading) return <Loader fullScreen />;
    if (!campaign) return null;

    const daysLeft = getDaysRemaining(campaign.endDate);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Campaign Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="badge badge-primary">
                                    {getCategoryLabel(campaign.category)}
                                </span>
                            </div>
                        </div>

                        {/* Campaign Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {campaign.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <HiUser className="text-primary-500" />
                                    <span>by {campaign.creator?.name || 'Anonymous'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiClock className="text-primary-500" />
                                    <span>{daysLeft} days left</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiUsers className="text-primary-500" />
                                    <span>{campaign.donorsCount} donors</span>
                                </div>
                            </div>

                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {campaign.description}
                            </p>
                        </div>

                        {/* Recent Donors */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Donors</h2>
                            {donations.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    Be the first to donate to this campaign!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {donations.map((donation, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold">
                                                    {donation.donorName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="font-medium text-gray-900">{donation.donorName}</div>
                                                {donation.message && (
                                                    <p className="text-sm text-gray-500 line-clamp-1">{donation.message}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-primary-600">
                                                    {formatCurrency(donation.amount)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            {/* Progress */}
                            <CampaignProgress
                                raised={campaign.raisedAmount}
                                target={campaign.targetAmount}
                            />

                            {/* Quick Amounts */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Select Amount
                                </label>
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                    {quickAmounts.map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setDonationAmount(amount.toString())}
                                            className={`py-2 rounded-lg font-medium transition-all ${donationAmount === amount.toString()
                                                ? 'bg-primary-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            ₹{amount.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    placeholder="Or enter custom amount"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                                    min="1"
                                />
                            </div>

                            {/* Donate Button */}
                            <div className="mt-6 space-y-3">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    size="lg"
                                    onClick={handleDonate}
                                    disabled={!donationAmount || parseFloat(donationAmount) < 1}
                                >
                                    <HiHeart />
                                    Donate {donationAmount && formatCurrency(parseFloat(donationAmount))}
                                </Button>
                                <Button variant="outline" fullWidth onClick={handleShare}>
                                    <HiShare />
                                    Share Campaign
                                </Button>
                            </div>

                            {/* Campaign Details */}
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Created</span>
                                    <span className="text-gray-900">{formatDate(campaign.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">End Date</span>
                                    <span className="text-gray-900">{formatDate(campaign.endDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Category</span>
                                    <span className="text-gray-900">{getCategoryLabel(campaign.category)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Modal */}
            {showDonateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Complete Your Donation</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Donating {formatCurrency(parseFloat(donationAmount))} to {campaign.title}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseDonateModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <HiX className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Donor Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                                    disabled={isAnonymous}
                                />
                            </div>

                            {/* Donor Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={donorEmail}
                                    onChange={(e) => setDonorEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Receipt will be sent to this email
                                </p>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Leave a Message (Optional)
                                </label>
                                <textarea
                                    value={donorMessage}
                                    onChange={(e) => setDonorMessage(e.target.value)}
                                    placeholder="Write a message of support..."
                                    rows={3}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 resize-none"
                                />
                            </div>

                            {/* Anonymous Toggle */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="anonymous" className="text-sm text-gray-700">
                                    Make my donation anonymous
                                </label>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Donation Amount</span>
                                    <span className="text-xl font-bold text-primary-600">
                                        {formatCurrency(parseFloat(donationAmount))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100">
                            <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                onClick={initializeRazorpayPayment}
                                disabled={donating}
                            >
                                {donating ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <HiHeart />
                                        Proceed to Payment
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-3">
                                Secured by Razorpay. Your payment details are encrypted.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignDetails;

