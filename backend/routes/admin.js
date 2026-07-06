const express = require('express');
const router = express.Router();
const { Product, Order, User, Store } = require('../db/db');
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

module.exports = router;
