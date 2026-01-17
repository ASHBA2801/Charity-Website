/**
 * Environment variable validation
 * Fails fast if required environment variables are missing
 */

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
];

const validateEnv = () => {
    const missing = [];
    const warnings = [];

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    });

    // Check for weak JWT secret in production
    if (process.env.NODE_ENV === 'production') {
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
            warnings.push('JWT_SECRET should be at least 32 characters in production');
        }
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.includes('dev')) {
            warnings.push('JWT_SECRET appears to contain development value - use a secure random string');
        }
        if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.includes('test')) {
            warnings.push('RAZORPAY_KEY_ID appears to be a test key - use production credentials');
        }
    }

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach((envVar) => console.error(`   - ${envVar}`));
        console.error('\nPlease check your .env file and ensure all required variables are set.');
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  Environment warnings:');
        warnings.forEach((warning) => console.warn(`   - ${warning}`));
    }

    console.log('✅ Environment validation passed');
};

module.exports = validateEnv;
