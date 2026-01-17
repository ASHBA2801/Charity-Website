import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiHeart, HiUserGroup, HiGlobe, HiShieldCheck } from 'react-icons/hi';
import { campaignsAPI } from '../services/api';
import CampaignCard from '../components/campaign/CampaignCard';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await campaignsAPI.getFeatured();
                setFeaturedCampaigns(response.data);
            } catch (error) {
                console.error('Error fetching featured campaigns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const stats = [
        { label: 'Total Raised', value: '₹25M+', icon: HiHeart },
        { label: 'Active Campaigns', value: '500+', icon: HiGlobe },
        { label: 'Happy Donors', value: '10K+', icon: HiUserGroup },
        { label: 'Success Rate', value: '95%', icon: HiShieldCheck },
    ];

    const howItWorks = [
        { step: '01', title: 'Create Campaign', description: 'Share your cause and set your fundraising goal' },
        { step: '02', title: 'Share Your Story', description: 'Spread the word through social media and networks' },
        { step: '03', title: 'Receive Donations', description: 'Accept secure payments from supporters worldwide' },
        { step: '04', title: 'Make Impact', description: 'Use funds to make a real difference in lives' },
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white animate-fade-in">
                            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                                🌟 Trusted by 10,000+ donors worldwide
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                Make a Difference,
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-400">
                                    One Donation at a Time
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                                Join thousands of changemakers supporting causes that matter.
                                Start a campaign or donate to transform lives today.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/campaigns">
                                    <Button variant="secondary" size="lg">
                                        Browse Campaigns
                                        <HiArrowRight className="text-lg" />
                                    </Button>
                                </Link>
                                <Link to="/campaigns/create">
                                    <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                                        Start Fundraising
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Hero Image/Card */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl blur-2xl opacity-30 animate-pulse-slow" />
                                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                            <HiHeart className="text-4xl text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">Join Our Community</h3>
                                        <p className="text-white/70 mb-6">Together we've raised over {formatCurrency(25000000)} for causes worldwide</p>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="bg-white/10 rounded-xl p-4">
                                                <div className="text-3xl font-bold text-white">500+</div>
                                                <div className="text-white/60 text-sm">Campaigns</div>
                                            </div>
                                            <div className="bg-white/10 rounded-xl p-4">
                                                <div className="text-3xl font-bold text-white">10K+</div>
                                                <div className="text-white/60 text-sm">Donors</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-20 fill-gray-50" viewBox="0 0 1440 100" preserveAspectRatio="none">
                        <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z" />
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                                    <stat.icon className="text-2xl text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Campaigns */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="section-header">
                        <h2>Featured Campaigns</h2>
                        <p>Support these high-impact campaigns making a real difference in communities worldwide</p>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCampaigns.slice(0, 6).map((campaign) => (
                                <CampaignCard key={campaign._id} campaign={campaign} />
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/campaigns">
                            <Button variant="outline" size="lg">
                                View All Campaigns
                                <HiArrowRight />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>Start making an impact in just a few simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                                    <span className="text-5xl font-bold text-primary-100">{item.step}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{item.title}</h3>
                                    <p className="text-gray-500">{item.description}</p>
                                </div>
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                        <HiArrowRight className="text-2xl text-gray-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl text-white/80 mb-8">
                        Whether you want to start a campaign or support an existing cause,
                        your contribution matters.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/campaigns/create">
                            <Button variant="secondary" size="lg">
                                Start a Campaign
                            </Button>
                        </Link>
                        <Link to="/campaigns">
                            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                                Donate Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
