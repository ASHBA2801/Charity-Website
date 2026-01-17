import { Link } from 'react-router-dom';
import { HiHeart, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'How It Works', path: '/how-it-works' },
        { name: 'Contact', path: '/contact' },
    ];

    const supportLinks = [
        { name: 'FAQs', path: '/faqs' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Donate', path: '/campaigns' },
    ];

    const socialLinks = [
        { icon: FaFacebookF, path: '#', label: 'Facebook' },
        { icon: FaTwitter, path: '#', label: 'Twitter' },
        { icon: FaInstagram, path: '#', label: 'Instagram' },
        { icon: FaLinkedinIn, path: '#', label: 'LinkedIn' },
    ];

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                                <HiHeart className="text-white text-xl" />
                            </div>
                            <span className="text-xl font-bold text-white">
                                Give<span className="text-primary-400">Hope</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Empowering communities through transparent and impactful charitable giving.
                            Together, we can make a difference.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.path}
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-primary-400 transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <HiLocationMarker className="text-primary-400 text-xl mt-0.5" />
                                <span>123 Charity Lane, Hope City, HC 12345</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiPhone className="text-primary-400 text-xl" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiMail className="text-primary-400 text-xl" />
                                <span>support@givehope.org</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} GiveHope. All rights reserved.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Made with <HiHeart className="inline text-red-500" /> for a better world
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
