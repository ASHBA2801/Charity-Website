# Charitable Donations & Fundraising Platform

A full-stack MERN (MongoDB, Express, React, Node.js) web application for charitable donations and fundraising campaigns.

## 🚀 Features

### User Features
- **User Authentication** - Register, login, JWT-based sessions
- **Browse Campaigns** - View all active fundraising campaigns
- **Campaign Details** - Full campaign information with donation history
- **Create Campaigns** - Start your own fundraising campaign
- **Make Donations** - Secure payment via Razorpay
- **Responsive Design** - Mobile-first UI with TailwindCSS

### Admin Features
- **Dashboard** - Overview of platform statistics
- **Campaign Moderation** - Approve/reject pending campaigns
- **Featured Campaigns** - Toggle featured status
- **User Management** - View all registered users

## 📁 Project Structure

```
Charity-Website-MERN STACK/
├── client/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   └── utils/          # Helper functions
│   └── ...
│
├── server/                 # Node.js + Express Backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & admin middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── seed/               # Sample data seeder
│   └── utils/              # Razorpay utilities
│
└── README.md
```

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas cloud)
- **Razorpay Account** (for payment integration)

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/charity_db
JWT_SECRET=your_secret_key_here
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
```

### 3. Seed Sample Data

```bash
cd server
npm run seed
```

This creates:
- **Admin user**: `admin@charity.com` / `admin123`
- **Regular user**: `john@example.com` / `password123`
- **Sample campaigns and donations**

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get current user profile |

### Campaigns
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns` | Get all active campaigns |
| GET | `/api/campaigns/featured` | Get featured campaigns |
| GET | `/api/campaigns/:id` | Get single campaign |
| POST | `/api/campaigns` | Create campaign (auth) |
| PUT | `/api/campaigns/:id` | Update campaign (owner/admin) |
| DELETE | `/api/campaigns/:id` | Delete campaign (owner/admin) |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donations/create-order` | Create Razorpay order |
| POST | `/api/donations/verify-payment` | Verify payment |
| GET | `/api/donations/campaign/:id` | Get campaign donations |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/campaigns` | All campaigns |
| PUT | `/api/admin/campaigns/:id/status` | Update campaign status |

## 🎨 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Razorpay** - Payment gateway

## 📝 Notes

- Campaigns require admin approval before going live
- Razorpay integration uses test mode by default
- JWT tokens expire after 30 days

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for session management
- CORS configured for frontend origin
- Input validation on all endpoints
- Admin routes protected by role middleware

## 📄 License

This project is for educational purposes.
