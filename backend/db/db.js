const mongoose=require('mongoose');
require('dotenv').config;

mongoose.connect(process.env.MONGODB_URL);//connection

//User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true }, 
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }, 
  phone: { type: Number, trim: true },
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' }
}, { timestamps: true });


//Store Schema
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


//PRODUCT SCHEMA
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
  images: [{ type: String }]
}, { timestamps: true });


//ORDER SUB-SCHEMA (Added)
// This must be defined BEFORE OrderSchema so it can be nested inside it.
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


//ORDER SCHEMA
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
  }
}, { timestamps: true });


const User=mongoose.model('User',UserSchema);
const Store=mongoose.model('Store',StoreSchema);
const Product=mongoose.model('Product',ProductSchema);
const Order=mongoose.model('Order',OrderSchema);

module.exports={User,Store,Product,Order}