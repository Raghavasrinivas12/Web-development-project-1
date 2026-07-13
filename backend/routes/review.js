const express = require('express');
const router = express.Router();
const { Review, Product, Store } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// POST /api/reviews — customer adds a review
router.post('/', authMiddleware, restrictTo('customer'), async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ msg: "productId, rating, and comment are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    const existing = await Review.findOne({ productId, userId: req.user.userid });
    if (existing) {
      return res.status(400).json({ msg: "You have already reviewed this product" });
    }
    const review = await Review.create({
      productId,
      userId: req.user.userid,
      rating,
      comment,
    });
    const populated = await Review.findById(review._id).populate('userId', 'username profilePic');
    return res.status(201).json({ msg: "Review submitted", review: populated });
  } catch (err) {
    console.error("Create Review Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// GET /api/reviews/product/:productId — public reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 });
    const total = reviews.length;
    const averageRating = total
      ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) distribution[r.rating]++;
    return res.json({ reviews, total, averageRating: Number(averageRating), distribution });
  } catch (err) {
    console.error("Fetch Product Reviews Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// GET /api/reviews/vendor — all reviews for vendor's products
router.get('/vendor', authMiddleware, restrictTo('vendor', 'superadmin'), async (req, res) => {
  try {
    const store = await Store.findOne({ ownerId: req.user.userid });
    if (!store) return res.json({ reviews: [], total: 0, averageRating: 0 });

    const vendorProducts = await Product.find({ storeId: store._id }).select('_id title');
    const productIds = vendorProducts.map((p) => p._id);
    const productMap = {};
    for (const p of vendorProducts) productMap[p._id.toString()] = p.title;

    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate('userId', 'username profilePic')
      .sort({ createdAt: -1 });

    const enriched = reviews.map((r) => {
      const obj = r.toObject();
      obj.productName = productMap[r.productId.toString()] || 'Unknown';
      return obj;
    });

    const total = enriched.length;
    const averageRating = total
      ? (enriched.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
      : 0;
    const positive = enriched.filter((r) => r.rating >= 4).length;
    const negative = enriched.filter((r) => r.rating <= 2).length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of enriched) distribution[r.rating]++;

    return res.json({ reviews: enriched, total, averageRating: Number(averageRating), positive, negative, distribution });
  } catch (err) {
    console.error("Fetch Vendor Reviews Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// POST /api/reviews/:id/reply — vendor replies to a review
router.post('/:id/reply', authMiddleware, restrictTo('vendor', 'superadmin'), async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ msg: "Reply is required" });
    }
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    const product = await Product.findById(review.productId);
    const store = await Store.findById(product.storeId);
    if (store.ownerId.toString() !== req.user.userid && req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    review.vendorReply = reply;
    await review.save();
    return res.json({ msg: "Reply sent", review });
  } catch (err) {
    console.error("Reply to Review Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
