const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
const createOrder = async (amount, currency = 'INR', receipt = null) => {
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
};

// Verify payment signature
const verifyPayment = (orderId, paymentId, signature) => {
    const crypto = require('crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
};

module.exports = { razorpay, createOrder, verifyPayment };
