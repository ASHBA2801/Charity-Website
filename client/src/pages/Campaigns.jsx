import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiSearch, HiFilter } from 'react-icons/hi';
import { campaignsAPI } from '../services/api';
import CampaignCard from '../components/campaign/CampaignCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Campaigns = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'education', label: 'Education' },
        { value: 'health', label: 'Health' },
        { value: 'environment', label: 'Environment' },
        { value: 'disaster-relief', label: 'Disaster Relief' },
        { value: 'animals', label: 'Animals' },
        { value: 'community', label: 'Community' },
        { value: 'other', label: 'Other' },
    ];

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: 9,
                    ...(search && { search }),
                    ...(category !== 'all' && { category }),
                };
                const response = await campaignsAPI.getAll(params);
                setCampaigns(response.data.campaigns);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [currentPage, search, category]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setSearchParams({ search, category });
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setCurrentPage(1);
        setSearchParams({ search, category: newCategory });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-gradient-to-r from-primary-600 to-purple-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Explore Campaigns
                    </h1>
                    <p className="text-white/80 text-center max-w-2xl mx-auto mb-8">
                        Discover causes that need your support and make a meaningful impact
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search campaigns..."
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30"
                            />
                            <Button
                                type="submit"
                                variant="primary"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                Search
                            </Button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Filters & Campaigns */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {categories.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => handleCategoryChange(cat.value)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${category === cat.value
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 shadow'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Campaigns Grid */}
                    {loading ? (
                        <Loader />
                    ) : campaigns.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {campaigns.map((campaign) => (
                                    <CampaignCard key={campaign._id} campaign={campaign} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((p) => p - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === i + 1
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((p) => p + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Campaigns;
