import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiHeart } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await register(formData.name, formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            toast.success('Account created successfully!');
            navigate('/');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 py-12 px-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <HiHeart className="text-primary-500 text-2xl" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Give<span className="text-secondary-300">Hope</span>
                        </span>
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                        <p className="text-gray-500 mt-2">Join our community of changemakers</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            error={errors.name}
                            icon={<HiUser />}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            error={errors.email}
                            icon={<HiMail />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.password}
                            icon={<HiLockClosed />}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.confirmPassword}
                            icon={<HiLockClosed />}
                            required
                        />

                        <div className="flex items-start gap-2">
                            <input type="checkbox" className="w-4 h-4 mt-1 rounded text-primary-500" required />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                            </span>
                        </div>

                        <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
