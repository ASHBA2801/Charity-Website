import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiClock, HiUsers, HiShare, HiHeart, HiUser } from 'react-icons/hi';
import { campaignsAPI, donationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CampaignProgress from '../components/campaign/CampaignProgress';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency, formatDate, getDaysRemaining, getCategoryLabel } from '../utils/helpers';
import toast from 'react-hot-toast';

const CampaignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [campaign, setCampaign] = useState(null);
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [donating, setDonating] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [showDonateModal, setShowDonateModal] = useState(false);

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

    const handleDonate = () => {
        if (!isAuthenticated) {
            toast.error('Please login to donate');
            navigate('/login');
            return;
        }
        setShowDonateModal(true);
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
        </div>
    );
};

export default CampaignDetails;
