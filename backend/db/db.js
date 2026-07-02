const mongoose=require('mongoose');
require('dotenv').config();
console.log("Mongo URL:", process.env.MONGODB_URL);
mongoose.connect(
  `${process.env.MONGODB_URL}`,
   {
    family: 4
  }
)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB Error:');
  console.error(error);
});

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, 
  phone: { type: String, trim: true },
  profilePic: { type: String, default: '' },
  role: {type: String,enum: ['customer', 'vendor', 'superadmin'], default: 'customer' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


// STORE SCHEMA
const StoreSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  storeName: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
  logoUrl: { type: String },
  isApproved: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });


// PRODUCT SCHEMA
const ProductSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, default: 0, min: 0 },
  category: { type: String, default: '' },
  images: [{ type: String }],
  variants: [{ type: String }] 
}, { timestamps: true });


// SUB ORDER SCHEMA
const OrderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  title: { type: String, required: true }, 
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true, min: 0 } 
});


// ORDER SCHEMA
const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [OrderItemSchema], 
  totalAmount: { type: Number, required: true, min: 0 },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  stripePaymentIntentId: { type: String } //payment webhooks
}, { timestamps: true });

// BANNER SCHEMA
const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// CATEGORY SCHEMA
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// SETTINGS SCHEMA
const SettingsSchema = new mongoose.Schema({
  storeName: { type: String, default: 'ShopHub' },
  supportEmail: { type: String, default: 'support@shophub.com' },
  supportPhone: { type: String, default: '+91 9876543210' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: 'Bengaluru, Karnataka' },
  logo: { type: String, default: '' },
  currency: { type: String, default: '₹ INR' },
  language: { type: String, default: 'English' },
  timeZone: { type: String, default: 'Asia/Kolkata' },
  taxPercentage: { type: Number, default: 18 },
  emailNotifications: { type: Boolean, default: true },
  orderNotifications: { type: Boolean, default: true },
  vendorAlerts: { type: Boolean, default: true },
  lowStockAlerts: { type: Boolean, default: false },
  pushNotifications: { type: Boolean, default: true },
  darkMode: { type: Boolean, default: true },
  compactSidebar: { type: Boolean, default: false },
  enableAnimations: { type: Boolean, default: true },
  aboutUs: { type: String, default: '' },
  contactUs: { type: String, default: '' },
  privacyPolicy: { type: String, default: '' },
  termsConditions: { type: String, default: '' },
  shippingPolicy: { type: String, default: '' },
  returnRefundPolicy: { type: String, default: '' },
  faq: { type: String, default: '' },
}, { timestamps: true });

// ACTIVITY LOG SCHEMA
const ActivityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Store = mongoose.model('Store', StoreSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Banner = mongoose.model('Banner', BannerSchema);
const Category = mongoose.model('Category', CategorySchema);
const Settings = mongoose.model('Settings', SettingsSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = { User, Store, Product, Order, Banner, Category, Settings, ActivityLog };