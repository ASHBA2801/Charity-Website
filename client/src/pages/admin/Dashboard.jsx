import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HiCurrencyRupee, HiUserGroup, HiCollection, HiCheckCircle,
    HiClock, HiEye, HiCheck, HiX, HiStar
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate, getCategoryLabel } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!isAdmin) {
            toast.error('Access denied. Admin only.');
            navigate('/');
            return;
        }
        fetchData();
    }, [isAdmin, navigate]);

    useEffect(() => {
        if (activeTab === 'campaigns') {
            fetchCampaigns();
        }
    }, [activeTab, statusFilter]);

    const fetchData = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const response = await adminAPI.getCampaigns({ status: statusFilter, limit: 20 });
            setCampaigns(response.data.campaigns);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        }
    };

    const handleStatusChange = async (campaignId, newStatus) => {
        try {
            await adminAPI.updateCampaignStatus(campaignId, newStatus);
            toast.success(`Campaign ${newStatus}`);
            fetchCampaigns();
            fetchData();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleToggleFeatured = async (campaignId) => {
        try {
            await adminAPI.toggleFeatured(campaignId);
            toast.success('Featured status updated');
            fetchCampaigns();
        } catch (error) {
            toast.error('Failed to update');
        }
    };

    if (loading) return <Loader fullScreen />;

    const statCards = [
        { label: 'Total Raised', value: formatCurrency(stats?.totalAmount || 0), icon: HiCurrencyRupee, color: 'from-green-500 to-emerald-600' },
        { label: 'Total Donations', value: stats?.totalDonations || 0, icon: HiCheckCircle, color: 'from-primary-500 to-primary-600' },
        { label: 'Active Campaigns', value: stats?.activeCampaigns || 0, icon: HiCollection, color: 'from-blue-500 to-blue-600' },
        { label: 'Pending Approval', value: stats?.pendingCampaigns || 0, icon: HiClock, color: 'from-amber-500 to-orange-500' },
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: HiUserGroup, color: 'from-purple-500 to-purple-600' },
    ];

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'campaigns', label: 'Campaigns' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-700 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-white/80 mt-1">Manage campaigns, users, and donations</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 px-1 font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-primary-600 border-b-2 border-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {statCards.map((stat, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                        <stat.icon className="text-white text-xl" />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-gray-500 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Donations */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Donations</h2>
                            {stats?.recentDonations?.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No donations yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {stats?.recentDonations?.map((donation, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div>
                                                <div className="font-medium text-gray-900">{donation.donorName}</div>
                                                <div className="text-sm text-gray-500">{donation.campaign?.title}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-primary-600">{formatCurrency(donation.amount)}</div>
                                                <div className="text-xs text-gray-400">{formatDate(donation.createdAt)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <div className="space-y-6">
                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-3">
                            {['pending', 'active', 'disabled', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-full font-medium capitalize transition-all ${statusFilter === status
                                            ? 'bg-primary-500 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        {/* Campaigns Table */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Campaign</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Creator</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Target</th>
                                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Raised</th>
                                            <th className="text-center py-4 px-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {campaigns.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                                    No campaigns found
                                                </td>
                                            </tr>
                                        ) : (
                                            campaigns.map((campaign) => (
                                                <tr key={campaign._id} className="hover:bg-gray-50">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={campaign.image}
                                                                alt={campaign.title}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <div>
                                                                <div className="font-medium text-gray-900 line-clamp-1">{campaign.title}</div>
                                                                <div className="text-sm text-gray-500">{getCategoryLabel(campaign.category)}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="text-sm text-gray-900">{campaign.creator?.name}</div>
                                                        <div className="text-xs text-gray-500">{campaign.creator?.email}</div>
                                                    </td>
                                                    <td className="py-4 px-4 font-medium">{formatCurrency(campaign.targetAmount)}</td>
                                                    <td className="py-4 px-4 font-medium text-primary-600">
                                                        {formatCurrency(campaign.raisedAmount)}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Link to={`/campaigns/${campaign._id}`}>
                                                                <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title="View">
                                                                    <HiEye className="text-lg" />
                                                                </button>
                                                            </Link>
                                                            {statusFilter === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusChange(campaign._id, 'active')}
                                                                        className="p-2 rounded-lg hover:bg-green-100 text-green-600"
                                                                        title="Approve"
                                                                    >
                                                                        <HiCheck className="text-lg" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusChange(campaign._id, 'disabled')}
                                                                        className="p-2 rounded-lg hover:bg-red-100 text-red-600"
                                                                        title="Reject"
                                                                    >
                                                                        <HiX className="text-lg" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {statusFilter === 'active' && (
                                                                <button
                                                                    onClick={() => handleToggleFeatured(campaign._id)}
                                                                    className={`p-2 rounded-lg ${campaign.featured
                                                                            ? 'bg-amber-100 text-amber-600'
                                                                            : 'hover:bg-gray-100 text-gray-400'
                                                                        }`}
                                                                    title={campaign.featured ? 'Remove from featured' : 'Add to featured'}
                                                                >
                                                                    <HiStar className="text-lg" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
