const express = require('express');
const router = express.Router();
const { Banner, Category } = require('../db/db');

router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ banners });
  } catch (err) {
    console.error("Fetch Banners Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ categories });
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
