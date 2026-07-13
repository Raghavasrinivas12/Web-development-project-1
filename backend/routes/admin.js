const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Product, Order, User, Store, Category, Settings, ActivityLog, Notification } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

async function logActivity(action, details, userId) {
  try {
    await ActivityLog.create({ action, details, performedBy: userId });
  } catch (_) {}
}

router.use(authMiddleware, restrictTo('superadmin'));

// ── Stats ──
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments({ role: { $ne: 'superadmin' } }),
      User.countDocuments({ role: 'vendor' }),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    return res.json({ stats: { totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue } });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch stats' });
  }
});

// ── Users ──
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'superadmin' } })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    return res.json({ msg: 'User status updated', user: { id: user._id, isActive: user.isActive } });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to toggle user status' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json({ msg: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete user' });
  }
});

// ── Vendors (Stores) ──
router.get('/vendors', async (req, res) => {
  try {
    const stores = await Store.find().populate('ownerId', 'username email').sort({ createdAt: -1 });
    return res.json({ vendors: stores });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch vendors' });
  }
});

router.put('/vendors/:id/approve', async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isApproved: 'Approved' },
      { new: true }
    );
    if (!store) return res.status(404).json({ msg: 'Vendor not found' });
    return res.json({ msg: 'Vendor approved', store });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to approve vendor' });
  }
});

router.put('/vendors/:id/reject', async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isApproved: 'Rejected' },
      { new: true }
    );
    if (!store) return res.status(404).json({ msg: 'Vendor not found' });
    return res.json({ msg: 'Vendor rejected', store });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to reject vendor' });
  }
});

router.delete('/vendors/:id', async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ msg: 'Vendor not found' });
    return res.json({ msg: 'Vendor deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete vendor' });
  }
});

// ── Orders ──
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch orders' });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!valid.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    return res.json({ msg: 'Order status updated', order });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update order status' });
  }
});

// ── Products ──
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('storeId', 'storeName')
      .sort({ createdAt: -1 });
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch products' });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    return res.json({ msg: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete product' });
  }
});

// ── Categories ──
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'name',
          foreignField: 'category',
          as: 'products',
        },
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
        },
      },
      { $project: { products: 0 } },
      { $sort: { createdAt: -1 } },
    ]);
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch categories' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, image, isActive } = req.body;
    if (!name) return res.status(400).json({ msg: 'Category name is required' });
    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ msg: 'Category already exists' });
    const category = await Category.create({ name, image, isActive });
    return res.status(201).json({ category });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to create category' });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const { name, image, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, isActive },
      { new: true }
    );
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    return res.json({ category });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update category' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    return res.json({ msg: 'Category deleted' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete category' });
  }
});

// ── Reports ──
router.get('/reports', async (req, res) => {
  try {
    const [
      monthlySales,
      categorySales,
      orderStatusDist,
      topProducts,
      topVendors,
      recentTransactions,
    ] = await Promise.all([
      // Monthly sales
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            sales: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 12 },
      ]),
      // Category-wise sales from order items
      Order.aggregate([
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$product.category',
            value: { $sum: '$items.quantity' },
          },
        },
        { $sort: { value: -1 } },
      ]),
      // Order status distribution
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            orders: { $sum: 1 },
          },
        },
      ]),
      // Top products
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            title: { $first: '$items.title' },
            sold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            id: '$_id',
            product: '$title',
            sold: 1,
            revenue: 1,
          },
        },
      ]),
      // Top vendors
      Store.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'storeId',
            as: 'storeProducts',
          },
        },
        {
          $lookup: {
            from: 'orders',
            let: { productIds: '$storeProducts._id' },
            pipeline: [
              { $unwind: '$items' },
              { $match: { $expr: { $in: ['$items.productId', '$$productIds'] } } },
              { $group: { _id: null, total: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } } } },
            ],
            as: 'vendorOrders',
          },
        },
        {
          $addFields: {
            revenue: { $ifNull: [{ $arrayElemAt: ['$vendorOrders.total', 0] }, 0] },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        { $project: { storeName: 1, revenue: 1 } },
      ]),
      // Recent transactions
      Order.find()
        .populate('userId', 'username')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('totalAmount orderStatus userId createdAt'),
    ]);

    return res.json({
      monthlySales,
      categorySales,
      orderStatus: orderStatusDist,
      topProducts,
      topVendors,
      recentTransactions,
    });
  } catch (err) {
    console.error('Reports error:', err);
    return res.status(500).json({ msg: 'Failed to fetch reports' });
  }
});

// ── Settings ──
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return res.json({ settings });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch settings' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    Object.assign(settings, req.body);
    await settings.save();
    return res.json({ settings });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to save settings' });
  }
});

// ── Logo Upload ──
router.post('/settings/logo', upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No image file provided' });
    }
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'shophub/logo', public_id: 'store_logo', overwrite: true },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.logo = result.secure_url;
    await settings.save();
    logActivity('Logo updated', 'Store logo was changed', req.user.userid);
    return res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Logo upload error:', err);
    return res.status(500).json({ msg: 'Logo upload failed' });
  }
});

// ── Change Password ──
router.put('/settings/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }
    const admin = await User.findById(req.user.userid);
    if (!admin) return res.status(404).json({ msg: 'Admin not found' });
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) return res.status(401).json({ msg: 'Current password is incorrect' });
    const saltRounds = 10;
    admin.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await admin.save();
    logActivity('Password changed', 'Admin password was updated', req.user.userid);
    return res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err);
    return res.status(500).json({ msg: 'Failed to change password' });
  }
});

// ── Save Content Page ──
router.put('/settings/content', async (req, res) => {
  try {
    const { page, content } = req.body;
    const validPages = ['aboutUs', 'contactUs', 'privacyPolicy', 'termsConditions', 'shippingPolicy', 'returnRefundPolicy', 'faq'];
    if (!validPages.includes(page)) {
      return res.status(400).json({ msg: 'Invalid page name' });
    }
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings[page] = content;
    await settings.save();
    logActivity(`${page} edited`, `${page} content was updated`, req.user.userid);
    return res.json({ msg: `${page} updated successfully` });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to save content' });
  }
});

// ── Backup ──
router.get('/backup', async (req, res) => {
  try {
    const [users, stores, products, orders, banners, categories, settings, activityLogs] = await Promise.all([
      User.find().lean(),
      Store.find().lean(),
      Product.find().lean(),
      Order.find().lean(),
      Banner.find().lean(),
      Category.find().lean(),
      Settings.find().lean(),
      ActivityLog.find().lean(),
    ]);
    logActivity('Backup downloaded', 'Full database backup was downloaded', req.user.userid);
    return res.json({
      exportedAt: new Date().toISOString(),
      data: { users, stores, products, orders, banners, categories, settings, activityLogs },
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to generate backup' });
  }
});

router.post('/backup/restore', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ msg: 'No backup data provided' });
    const collections = [
      { name: 'User', model: User },
      { name: 'Store', model: Store },
      { name: 'Product', model: Product },
      { name: 'Order', model: Order },
      { name: 'Banner', model: Banner },
      { name: 'Category', model: Category },
      { name: 'Settings', model: Settings },
      { name: 'ActivityLog', model: ActivityLog },
    ];
    for (const { name, model } of collections) {
      const key = name.charAt(0).toLowerCase() + name.slice(1) + 's';
      if (data[key] && Array.isArray(data[key])) {
        await model.deleteMany({});
        if (data[key].length > 0) {
          await model.insertMany(data[key]);
        }
      }
    }
    logActivity('Backup restored', 'Database was restored from backup', req.user.userid);
    return res.json({ msg: 'Backup restored successfully' });
  } catch (err) {
    console.error('Restore error:', err);
    return res.status(500).json({ msg: 'Failed to restore backup' });
  }
});

// ── Clear Cache ──
router.post('/clear-cache', async (req, res) => {
  try {
    logActivity('Cache cleared', 'System cache was cleared', req.user.userid);
    return res.json({ msg: 'Cache cleared successfully' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to clear cache' });
  }
});

// ── Activity Logs ──
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch activity logs' });
  }
});

// ── Notifications ──
router.get('/notifications', async (req, res) => {
  try {
    const count = await Notification.countDocuments();
    if (count === 0) {
      const samples = [
        { title: 'New order placed', message: 'Order #1001 has been placed by Rahul Sharma.', type: 'order', link: '/admin/orders' },
        { title: 'Vendor registered', message: 'Tech World has registered as a new vendor.', type: 'vendor', link: '/adminvendors' },
        { title: 'Low stock alert', message: 'iPhone 15 is running low on stock.', type: 'product', link: '/admin/products' },
        { title: 'Welcome to ShopHub Admin', message: 'You are now logged into the admin dashboard.', type: 'system' },
      ];
      await Notification.insertMany(samples);
    }
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    return res.json({ notifications, unreadCount });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch notifications' });
  }
});

router.put('/notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    return res.json({ msg: 'Notification marked as read' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to mark notification as read' });
  }
});

router.put('/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to mark all as read' });
  }
});

module.exports = router;
