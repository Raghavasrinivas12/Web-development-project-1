const express = require('express');
const router = express.Router();
const { Product, Order, User, Store, Category, Settings } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

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

module.exports = router;
