import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX, HiHeart, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
import Button from '../common/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all">
                            <HiHeart className="text-white text-xl" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Give<span className="text-primary-500">Hope</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="btn-ghost flex items-center gap-2">
                                        <HiViewGrid className="text-lg" />
                                        Admin
                                    </Link>
                                )}
                                <Link to="/campaigns/create" className="btn-outline text-sm py-2 px-4">
                                    Start Campaign
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-semibold">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                                    </button>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-t-xl">
                                            <HiUser /> Profile
                                        </Link>
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-b-xl">
                                            <HiLogout /> Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="my-4" />
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/campaigns/create"
                                    className="block px-4 py-3 rounded-xl text-primary-600 hover:bg-primary-50 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Start Campaign
                                </Link>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-4 py-3 rounded-xl bg-primary-500 text-white text-center font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
