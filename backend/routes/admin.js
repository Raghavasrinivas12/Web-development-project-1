const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { User, Store, Product, Order } = require("../db/db");

const router = express.Router();

router.use(authMiddleware, restrictTo("superadmin"));

router.get("/users", async (req, res) => {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });
    res.json({ count: users.length, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalVendors,
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      vendorStats,
    ] = await Promise.all([
      User.countDocuments(),
      Store.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $in: ["Paid", "Delivered"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find()
        .populate("userId", "username email")
        .sort({ createdAt: -1 })
        .limit(5),
      Store.find()
        .populate("ownerId", "username email")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      stats: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      recentOrders,
      vendorStats,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/users/:id/toggle-status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ msg: "User status updated", isActive: user.isActive });
  } catch (err) {
    console.error("Error toggling user status:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/vendors/:id/approve", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ msg: "Store not found" });
    store.isApproved = "Approved";
    await store.save();
    res.json({ msg: "Vendor approved", store });
  } catch (err) {
    console.error("Error approving vendor:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.put("/vendors/:id/reject", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ msg: "Store not found" });
    store.isApproved = "Rejected";
    await store.save();
    res.json({ msg: "Vendor rejected", store });
  } catch (err) {
    console.error("Error rejecting vendor:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.delete("/vendors/:id", async (req, res) => {
  try {
    const deleted = await Store.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Store not found" });
    res.json({ msg: "Vendor deleted" });
  } catch (err) {
    console.error("Error deleting vendor:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
