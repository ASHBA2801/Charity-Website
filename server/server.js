const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const { apiLimiter, authLimiter, donationLimiter } = require('./middleware/rateLimit');

// Load environment variables
dotenv.config();

// Validate required environment variables
validateEnv();

// Connect to database
connectDB();

const app = express();

// ============================================
// Security Middleware
// ============================================

// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "https://checkout.razorpay.com"],
            frameSrc: ["'self'", "https://api.razorpay.com"],
            connectSrc: ["'self'", "https://api.razorpay.com", process.env.CLIENT_URL || 'https://charity-website-gdnu.onrender.com']
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'https://charity-website-gdnu.onrender.com',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Enable gzip compression
app.use(compression());

// Body parsers with size limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply general rate limiter to all API routes
app.use('/api', apiLimiter);

// ============================================
// Routes
// ============================================

// Auth routes with strict rate limiting
app.use('/api/auth', authLimiter, require('./routes/auth'));

// Donation routes with donation-specific rate limiting
app.use('/api/donations', donationLimiter, require('./routes/donations'));

// Other routes
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/admin', require('./routes/admin'));

// Enhanced health check route with database status
app.get('/api/health', async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    const healthCheck = {
        status: dbStatus === 'connected' ? 'OK' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus
    };

    const statusCode = dbStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
});

// ============================================
// Error Handling
// ============================================

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ============================================
// Server Startup
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
