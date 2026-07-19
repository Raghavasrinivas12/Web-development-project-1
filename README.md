# 🛍️ ShopHub — Multi-Tenant E-Commerce Marketplace

A full-stack multi-tenant e-commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js). Supports three user roles — **Customers**, **Vendors**, and **Super Admins** — each with their own dashboard and capabilities.

---

## ✨ Features

### 👤 Customer
- Browse products by category, search, and filter
- Product detail page with image gallery and reviews
- Add to cart with stock-aware quantity limits
- Wishlist (persisted in localStorage)
- Stripe card payments + Cash on Delivery
- Order history with status tracking
- Email verification & password reset flow
- Profile management with address fields
- Notification inbox with unread badge

### 🏪 Vendor
- Dedicated vendor dashboard with collapsible sidebar
- Store settings (name, description, logo, GST details)
- Product management (create/edit with multi-image upload via Cloudinary)
- Order management (view orders containing your products, update status)
- Sales analytics with Recharts visualizations
- Inventory tracking
- Review management (reply to customer reviews)

### 🛠️ Super Admin
- Full admin dashboard with site-wide statistics
- Manage users, vendors, products, orders, categories
- Banner management for the homepage
- CMS-style site settings (site name, logo, contact info, footer, social links, about page, policies, help center)
- In-app notification system with read/unread tracking
- Reports & analytics with CSV export
- Activity log for auditing

---

## 🧱 Tech Stack

| Layer        | Technology                                                   |
| ------------ | ------------------------------------------------------------ |
| **Frontend** | React 19, Vite 8, TailwindCSS 4, React Router 7, Framer Motion, Recharts, Stripe Elements |
| **Backend**  | Express 5, Mongoose 9, JWT, Cloudinary SDK, Nodemailer, Zod, Multer |
| **Database** | MongoDB Atlas                                                 |
| **Payments** | Stripe (test mode) + COD                                     |
| **Images**   | Cloudinary (multi-upload, single-upload, delete)             |
| **Email**    | Gmail SMTP via Nodemailer (App Password)                     |

---

## 📁 Project Structure

```
backend/
├── db/
│   └── db.js                  # Mongoose schemas & connection
├── middleware/
│   ├── authMiddleware.js      # JWT Bearer token verification
│   ├── roleMiddleware.js      # Role-based access control
│   └── validateMiddleware.js  # Zod schema validation
├── routes/
│   ├── user.js                # Auth & profile (signup, signin, verify, reset)
│   ├── admin.js               # Superadmin CRUD & settings
│   ├── store.js               # Vendor store management & dashboards
│   ├── product.js             # Product CRUD & public listing
│   ├── order.js               # Checkout, history, status updates
│   ├── payment.js             # Stripe payment intent
│   ├── upload.js              # Cloudinary multi/single upload
│   ├── review.js              # Create, read, reply, delete reviews
│   ├── notification.js        # User notification CRUD
│   ├── home.js                # Banners & categories for homepage
│   └── email.js               # Nodemailer email sending
├── index.js                   # Express app entry point
├── seed.js                    # Database seed script
├── email.js                   # Email transport helper
├── zod.js                     # Zod validation schemas
├── .env                       # Environment variables
└── package.json

frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.jsx    # Auth state, login, logout, refreshUser
│   │   ├── CartContext.jsx    # Cart state with localStorage persistence
│   │   └── WishlistContext.jsx# Wishlist state with localStorage persistence
│   ├── Components/
│   │   ├── Navbar.jsx         # Responsive navbar with role-based links
│   │   ├── Footer.jsx         # Site footer
│   │   ├── About.jsx          # About page content
│   │   ├── HelpCenter.jsx     # Help center content
│   │   └── Policies.jsx       # Policies content
│   ├── Layouts/
│   │   ├── UserLayout.jsx     # Public & customer layout
│   │   ├── VendorLayout.jsx   # Vendor dashboard sidebar layout
│   │   └── AdminLayout.jsx    # Admin dashboard sidebar layout
│   ├── pages/
│   │   ├── public/            # Home, Shop, ProductDetail, Login, Register,
│   │   │                      # Cart, Checkout, Wishlist, MyOrders, Search, etc.
│   │   ├── user/              # Profile, Notifications
│   │   ├── vendor/            # Dashboard, Products, Orders, Sales, Reviews, Settings
│   │   └── admin/             # Dashboard, Users, Vendors, Products, Orders,
│   │                          # Categories, Banners, Reports, Settings, Notifications
│   ├── App.jsx                # Route definitions
│   ├── config.js              # API URL config
│   └── index.css              # Tailwind imports & global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)
- Cloudinary account (for image uploads)
- Stripe account (test mode) — optional for COD-only
- Gmail App Password (for email) — optional, dev URLs printed otherwise

### 1. Clone & Install

```bash
git clone https://github.com/Raghavasrinivas12/Web-development-project-1.git
cd Web-development-project-1

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

Copy `.env` into `backend/.env` and fill in your values:

```env
MONGODB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/marketplace
PORT=5000
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=ShopHub <your_email@gmail.com>
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
| Role       | Email                 | Password     |
| ---------- | --------------------- | ------------ |
| Admin      | admin@example.com     | password123  |
| Vendor     | vendor@example.com    | password123  |
| Customer   | user@example.com      | password123  |

Plus sample banners, categories, stores, and products.

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 User Roles

| Role         | Access                                                      |
| ------------ | ----------------------------------------------------------- |
| **customer** | Browse, cart, wishlist, checkout, orders, profile           |
| **vendor**   | All customer features + vendor dashboard, store, products   |
| **superadmin** | Full admin panel for site-wide management               |

---

## 📦 API Overview

All endpoints are prefixed with `/api`.

| Prefix            | Auth Required | Description              |
| ----------------- | ------------- | ------------------------ |
| `POST /user/signup` | No          | Register new user        |
| `POST /user/signin` | No          | Login                    |
| `GET /user/profile` | Yes         | Get profile              |
| `PUT /user/profile` | Yes         | Update profile           |
| `GET /products`     | No          | List products (public)   |
| `GET /products/:id` | No          | Product detail           |
| `POST /orders/checkout` | Yes    | Place order              |
| `GET /orders/history` | Yes      | User order history       |
| `POST /upload`      | Yes          | Upload multiple images   |
| `POST /upload/single` | Yes       | Upload single image      |
| `GET /notifications` | Yes         | List notifications       |
| `PUT /notifications/:id/read` | Yes | Mark one read        |
| `PUT /notifications/read-all` | Yes | Mark all read         |

Admin endpoints (`/api/admin/*`) and vendor endpoints (`/api/stores/*`) are restricted by role.

---

## 🖼️ Image Upload Flow

1. Frontend sends `multipart/form-data` with field `images` (multi) or `image` (single) + `folder` name
2. Backend uses Multer (memory storage) → Cloudinary upload stream
3. Returns `{ urls: [...] }` (multi) or `{ url: "..." }` (single)

---

## 📧 Email Flow (Dev Mode)

When `SMTP_PASS` is not configured, the app prints verification/reset URLs to the console instead of sending real emails. The frontend shows these URLs in a yellow "Dev Mode" box on the success screen.

To send real emails, set up a [Gmail App Password](https://myaccount.google.com/apppasswords) and configure the `SMTP_*` env vars.

---

## 📊 Reports

The admin panel includes a Reports page with:
- Revenue, orders, and user growth charts (Recharts)
- Top-selling products and categories
- Filters by date range
- CSV export

---

## 🧪 Testing

No test suite is currently configured. The project uses manual testing via the frontend UI.

---

## 📄 License

This project is for educational purposes.
