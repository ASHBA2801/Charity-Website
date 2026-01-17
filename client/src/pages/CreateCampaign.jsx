import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiUpload, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { campaignsAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        shortDescription: '',
        description: '',
        targetAmount: '',
        category: 'other',
        endDate: '',
        image: ''
    });
    const [errors, setErrors] = useState({});

    const categories = [
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' },
        { value: 'environment', label: 'Environment' },
        { value: 'disaster-relief', label: 'Disaster Relief' },
        { value: 'animals', label: 'Animals' },
        { value: 'community', label: 'Community' },
        { value: 'other', label: 'Other' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.targetAmount) newErrors.targetAmount = 'Target amount is required';
        else if (parseFloat(formData.targetAmount) < 100) {
            newErrors.targetAmount = 'Minimum target amount is ₹100';
        }
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        else if (new Date(formData.endDate) <= new Date()) {
            newErrors.endDate = 'End date must be in the future';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        if (!isAuthenticated) {
            toast.error('Please login to create a campaign');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const campaignData = {
                ...formData,
                targetAmount: parseFloat(formData.targetAmount),
                image: formData.image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'
            };

            await campaignsAPI.create(campaignData);
            toast.success('Campaign created! Waiting for admin approval.');
            navigate('/campaigns');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (tomorrow)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Start a Campaign</h1>
                    <p className="text-gray-500 mt-2">Share your cause and start making a difference</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <Input
                            label="Campaign Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Give your campaign a compelling title"
                            error={errors.title}
                            required
                        />

                        {/* Short Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Short Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                placeholder="Brief summary (max 200 characters)"
                                maxLength={200}
                                rows={2}
                                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                            />
                            <p className="text-sm text-gray-400 mt-1">
                                {formData.shortDescription.length}/200 characters
                            </p>
                        </div>

                        {/* Full Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell your story. Why is this cause important? How will the funds be used?"
                                rows={6}
                                className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-xl transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Category & Target Amount */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <Input
                                label="Target Amount (₹)"
                                type="number"
                                name="targetAmount"
                                value={formData.targetAmount}
                                onChange={handleChange}
                                placeholder="50000"
                                error={errors.targetAmount}
                                min="100"
                                required
                            />
                        </div>

                        {/* End Date & Image URL */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    min={minDateStr}
                                    className={`w-full px-4 py-3 text-gray-900 bg-white border-2 rounded-xl transition-all duration-200 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 ${errors.endDate ? 'border-red-500' : 'border-gray-200'}`}
                                />
                                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
                            </div>

                            <Input
                                label="Image URL (optional)"
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Image Preview */}
                        {formData.image && (
                            <div className="relative">
                                <img
                                    src={formData.image}
                                    alt="Campaign preview"
                                    className="w-full h-48 object-cover rounded-xl"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary" loading={loading} className="flex-1">
                                Create Campaign
                            </Button>
                        </div>

                        <p className="text-sm text-gray-500 text-center">
                            Your campaign will be reviewed by our team before going live.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
