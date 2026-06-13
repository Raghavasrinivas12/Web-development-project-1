const mongoose=require('mongoose');
require('dotenv').config;

mongoose.connect('mongodb+srv://E-commerce:ecommerceproject1@cluster1.s9yuyxb.mongodb.net/');//connection

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, 
  phone: { type: String, trim: true },
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
  logoUrl: { type: String }
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

const User = mongoose.model('User', UserSchema);
const Store = mongoose.model('Store', StoreSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);

module.exports = { User, Store, Product, Order };