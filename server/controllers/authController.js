const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Password complexity regex: min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    });
};

// Validate password complexity
const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!PASSWORD_REGEX.test(password)) {
        return {
            valid: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        };
    }
    return { valid: true };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate password complexity
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ message: passwordValidation.message });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user with lockout fields
        const user = await User.findOne({ email }).select('+password +loginAttempts +lockUntil');

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if account is locked
        if (user.isLocked) {
            const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account is locked. Please try again in ${lockTimeRemaining} minutes.`
            });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            // Increment failed login attempts
            await user.incrementLoginAttempts();

            // Check if this attempt caused a lockout
            const updatedUser = await User.findById(user._id).select('loginAttempts lockUntil');
            if (updatedUser.isLocked) {
                return res.status(423).json({
                    message: 'Account has been locked due to too many failed login attempts. Please try again in 15 minutes.'
                });
            }

            const remainingAttempts = User.MAX_LOGIN_ATTEMPTS - updatedUser.loginAttempts;
            return res.status(401).json({
                message: `Invalid email or password. ${remainingAttempts} attempt(s) remaining.`
            });
        }

        // Successful login - reset login attempts
        await user.resetLoginAttempts();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                // Validate new password complexity
                const passwordValidation = validatePassword(req.body.password);
                if (!passwordValidation.valid) {
                    return res.status(400).json({ message: passwordValidation.message });
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { register, login, getProfile, updateProfile };

