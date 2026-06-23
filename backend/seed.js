require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User, Store, Product, Banner, Category } = require('./db/db');

async function seed() {
  try {
    console.log('Seeding database...');

    // Clear existing data
    await Promise.all([
      Banner.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Store.deleteMany({}),
      User.deleteMany({}),
    ]);

    // ── Banners ──
    const banners = await Banner.insertMany([
      {
        title: "Mega Sale 2026",
        subtitle: "Up to 70% Off on Electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      },
      {
        title: "Fashion Collection",
        subtitle: "Latest Trends at Best Prices",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      },
      {
        title: "ShopHub Marketplace",
        subtitle: "Many Stores, One Hub",
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      },
    ]);
    console.log(`  ✓ ${banners.length} banners inserted`);

    // ── Categories ──
    const categories = await Category.insertMany([
      { name: "Electronics", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
      { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050" },
      { name: "Furniture", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
      { name: "Books", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da" },
      { name: "Grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e" },
      { name: "Accessories", image: "https://images.unsplash.com/photo-1601924994987-69e8d56d0db2" },
    ]);
    console.log(`  ✓ ${categories.length} categories inserted`);

    // ── Users (vendors + a test customer) ──
    const hash = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { username: "techvendor", email: "tech@store.com", passwordHash: hash, role: "vendor" },
      { username: "fashionvendor", email: "fashion@store.com", passwordHash: hash, role: "vendor" },
      { username: "bookvendor", email: "books@store.com", passwordHash: hash, role: "vendor" },
      { username: "homevendor", email: "home@store.com", passwordHash: hash, role: "vendor" },
      { username: "testuser", email: "test@user.com", passwordHash: hash, role: "customer" },
    ]);
    console.log(`  ✓ ${users.length} users inserted`);

    // ── Stores ──
    const stores = await Store.insertMany([
      { ownerId: users[0]._id, storeName: "Tech Store", description: "Latest electronics and gadgets" },
      { ownerId: users[1]._id, storeName: "Fashion Hub", description: "Trending fashion wear" },
      { ownerId: users[2]._id, storeName: "Book World", description: "Books for every reader" },
      { ownerId: users[3]._id, storeName: "Home Essentials", description: "Everything for your home" },
    ]);
    console.log(`  ✓ ${stores.length} stores inserted`);

    // ── Products ──
    const products = await Product.insertMany([
      {
        storeId: stores[0]._id, title: "Wireless Headphones", price: 1499, stockQuantity: 50,
        category: "Electronics", description: "Premium noise-cancelling wireless headphones with 30hr battery.",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
      },
      {
        storeId: stores[0]._id, title: "Smart Watch", price: 2999, stockQuantity: 30,
        category: "Electronics", description: "Fitness tracker with heart-rate monitor and GPS.",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30"],
      },
      {
        storeId: stores[0]._id, title: "Gaming Mouse", price: 799, stockQuantity: 100,
        category: "Electronics", description: "RGB gaming mouse with 6 programmable buttons.",
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46"],
      },
      {
        storeId: stores[0]._id, title: "Laptop", price: 49999, stockQuantity: 15,
        category: "Electronics", description: "High-performance laptop for work and play.",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
      },
      {
        storeId: stores[0]._id, title: "Bluetooth Speaker", price: 1999, stockQuantity: 40,
        category: "Electronics", description: "Portable waterproof speaker with deep bass.",
        images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1"],
      },
      {
        storeId: stores[1]._id, title: "Cotton T-Shirt", price: 499, stockQuantity: 200,
        category: "Fashion", description: "Soft 100% cotton regular-fit tee.",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
      },
      {
        storeId: stores[1]._id, title: "Denim Jacket", price: 1999, stockQuantity: 25,
        category: "Fashion", description: "Classic blue denim jacket for all seasons.",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5"],
      },
      {
        storeId: stores[1]._id, title: "Running Shoes", price: 2999, stockQuantity: 60,
        category: "Fashion", description: "Lightweight running shoes with cushioned sole.",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
      },
      {
        storeId: stores[1]._id, title: "Leather Belt", price: 799, stockQuantity: 80,
        category: "Accessories", description: "Genuine leather belt with metal buckle.",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62"],
      },
      {
        storeId: stores[2]._id, title: "The Great Gatsby", price: 399, stockQuantity: 100,
        category: "Books", description: "F. Scott Fitzgerald's timeless classic.",
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"],
      },
      {
        storeId: stores[2]._id, title: "Atomic Habits", price: 599, stockQuantity: 90,
        category: "Books", description: "An easy & proven way to build good habits.",
        images: ["https://images.unsplash.com/photo-1589829085813-3194e4e71ab2"],
      },
      {
        storeId: stores[2]._id, title: "Sapiens", price: 699, stockQuantity: 70,
        category: "Books", description: "A brief history of humankind.",
        images: ["https://images.unsplash.com/photo-1532012197267-da84d127e765"],
      },
      {
        storeId: stores[3]._id, title: "LED Desk Lamp", price: 1299, stockQuantity: 45,
        category: "Furniture", description: "Adjustable LED lamp with warm & cool modes.",
        images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"],
      },
      {
        storeId: stores[3]._id, title: "Throw Pillow Set", price: 899, stockQuantity: 60,
        category: "Furniture", description: "Set of 2 decorative velvet pillows.",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2"],
      },
      {
        storeId: stores[3]._id, title: "Organic Green Tea", price: 299, stockQuantity: 150,
        category: "Grocery", description: "Premium organic green tea leaves.",
        images: ["https://images.unsplash.com/photo-1556679343-c7306c1976bc"],
      },
    ]);
    console.log(`  ✓ ${products.length} products inserted`);

    console.log('\n✅ Seed complete!');
    console.log('   Test vendor login: tech@store.com / password123');
    console.log('   Test customer login: test@user.com / password123');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
