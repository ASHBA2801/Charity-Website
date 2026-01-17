const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Sample data
const users = [
    {
        name: 'Admin User',
        email: 'admin@charity.com',
        password: 'admin123',
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
    }
];

const campaigns = [
    {
        title: 'Education for Underprivileged Children',
        description: 'Help us provide quality education to underprivileged children in rural areas. Your donation will fund school supplies, uniforms, and tuition fees for children who cannot afford them. Together, we can break the cycle of poverty through education and give these children a chance at a brighter future. Every child deserves the opportunity to learn and grow.',
        shortDescription: 'Provide quality education to underprivileged children in rural areas.',
        targetAmount: 500000,
        raisedAmount: 125000,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800',
        category: 'education',
        status: 'active',
        featured: true,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        donorsCount: 45
    },
    {
        title: 'Clean Water for Villages',
        description: 'Access to clean water is a basic human right, yet millions of people in remote villages lack this essential resource. This campaign aims to install water purification systems and dig wells in 10 villages. Your contribution will provide safe drinking water to over 5,000 families, reducing waterborne diseases and improving overall health in these communities.',
        shortDescription: 'Install water purification systems in remote villages.',
        targetAmount: 750000,
        raisedAmount: 320000,
        image: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=800',
        category: 'community',
        status: 'active',
        featured: true,
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        donorsCount: 89
    },
    {
        title: 'Medical Aid for Cancer Patients',
        description: 'Cancer treatment is expensive, and many families cannot afford the cost of chemotherapy and medications. This fund helps cover treatment costs for patients from low-income families. We work directly with hospitals to ensure your donations reach those who need them most. Every contribution brings hope to a family fighting against cancer.',
        shortDescription: 'Providing financial support for cancer treatment to low-income families.',
        targetAmount: 1000000,
        raisedAmount: 450000,
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
        category: 'health',
        status: 'active',
        featured: true,
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        donorsCount: 156
    },
    {
        title: 'Plant Trees - Save Environment',
        description: 'Join our mission to combat climate change by planting trees across the country. For every ₹100 donated, we plant one tree. Our goal is to plant 10,000 trees this year, which will absorb tons of CO2 and provide habitat for wildlife. Together, we can create a greener, healthier planet for future generations.',
        shortDescription: 'Plant 10,000 trees to fight climate change.',
        targetAmount: 200000,
        raisedAmount: 85000,
        image: 'https://images.unsplash.com/photo-1542601098-3adb3baeb1ec?w=800',
        category: 'environment',
        status: 'active',
        featured: false,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        donorsCount: 67
    },
    {
        title: 'Animal Shelter Support',
        description: 'Our local animal shelter provides care for over 200 abandoned and injured animals. Running costs for food, medical care, and maintenance are significant. Your donation helps us continue our mission of rescuing, rehabilitating, and rehoming animals in need. Every animal deserves a second chance at a loving home.',
        shortDescription: 'Support the local animal shelter with food and medical supplies.',
        targetAmount: 150000,
        raisedAmount: 72000,
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        category: 'animals',
        status: 'active',
        featured: false,
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        donorsCount: 34
    },
    {
        title: 'Disaster Relief Fund',
        description: 'Natural disasters strike without warning, leaving families homeless and vulnerable. This emergency fund provides immediate relief including food, shelter, medical aid, and essential supplies to disaster-affected communities. Your contribution ensures we can respond quickly when disaster strikes, helping families rebuild their lives.',
        shortDescription: 'Emergency relief fund for natural disaster victims.',
        targetAmount: 2000000,
        raisedAmount: 890000,
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
        category: 'disaster-relief',
        status: 'active',
        featured: true,
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        donorsCount: 312
    }
];

// Seed function
const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Campaign.deleteMany({});
        await Donation.deleteMany({});

        console.log('Cleared existing data...');

        // Create users (password will be hashed by pre-save hook)
        const createdUsers = await User.create(users);
        console.log(`Created ${createdUsers.length} users`);

        // Create campaigns with user references
        const campaignsWithCreator = campaigns.map((campaign, index) => ({
            ...campaign,
            creator: createdUsers[index % createdUsers.length]._id
        }));

        const createdCampaigns = await Campaign.create(campaignsWithCreator);
        console.log(`Created ${createdCampaigns.length} campaigns`);

        // Create some sample donations
        const donations = [
            {
                campaign: createdCampaigns[0]._id,
                donor: createdUsers[1]._id,
                donorName: 'John Doe',
                donorEmail: 'john@example.com',
                amount: 5000,
                message: 'Happy to support education!',
                status: 'completed',
                razorpayOrderId: 'sample_order_1',
                razorpayPaymentId: 'sample_payment_1'
            },
            {
                campaign: createdCampaigns[1]._id,
                donor: createdUsers[2]._id,
                donorName: 'Jane Smith',
                donorEmail: 'jane@example.com',
                amount: 10000,
                message: 'Clean water saves lives!',
                status: 'completed',
                razorpayOrderId: 'sample_order_2',
                razorpayPaymentId: 'sample_payment_2'
            },
            {
                campaign: createdCampaigns[2]._id,
                donorName: 'Anonymous Donor',
                donorEmail: 'anonymous@example.com',
                amount: 25000,
                message: 'Stay strong!',
                isAnonymous: true,
                status: 'completed',
                razorpayOrderId: 'sample_order_3',
                razorpayPaymentId: 'sample_payment_3'
            }
        ];

        await Donation.insertMany(donations);
        console.log(`Created ${donations.length} sample donations`);

        console.log('\n✅ Seed data created successfully!');
        console.log('\n📋 Test Credentials:');
        console.log('   Admin: admin@charity.com / admin123');
        console.log('   User:  john@example.com / password123');
        console.log('   User:  jane@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
