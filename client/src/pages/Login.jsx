import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed, HiHeart } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const { login, error } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            toast.success('Welcome back!');
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
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 rounded text-primary-500" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
