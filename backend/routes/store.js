require('dotenv').config
const express=require("express");
const authMiddleware = require('../middleware/authmiddle');
const { storeCheck } = require('../zod');
const { Store } = require('../db/db');
const router=express.Router()


router.post('/', authMiddleware, async (req, res) => {
  try {
    const ownerId = req.user.userid; // Extracted from verified JWT payload context
    const userRole = req.user.role;   // Extracted from verified JWT payload context

    // Rule: Guard endpoint against non-vendor roles
    if (userRole !== 'vendor' && userRole !== 'superadmin') {
      return res.status(403).json({ msg: "Access denied: Only vendors can register a storefront." });
    }

    // Parse data layout using your inherited Zod validator
    const validationResult = storeCheck.safeParse({
      ownerId,
      storename: req.body.storename,
      description: req.body.description,
      logoUrl: req.body.logoUrl
    });

    if (!validationResult.success) {
      return res.status(400).json({ 
        msg: "Validation error matching payload requirements", 
        errors: validationResult.error.errors 
      });
    }

    
    const existingStore = await Store.findOne({ storeName: req.body.storename });
    if (existingStore) {
      return res.status(409).json({ msg: "Store name is already occupied by another merchant." });
    }

    // Instantiate document in MongoDB Atlas
    const newStore = await Store.create({
      ownerId,
      storeName: req.body.storename,
      description: req.body.description,
      logoUrl: req.body.logoUrl
    });

    return res.status(201).json({
      msg: "Store ecosystem initialized successfully!",
      store: newStore
    });

  } catch (err) {
    console.error("Error creating store:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// GET ALL FETCH ALL STORES
router.get('/', async (req, res) => {
  try {
    // Finds all stores, populates owner username and email, excludes passwordHash
    const stores = await Store.find()
      .populate('ownerId', 'username email')
      .sort({ createdAt: -1 }); // Newest stores display first

    return res.json({
      count: stores.length,
      stores
    });
  } catch (err) {
    console.error("Error fetching stores:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// FETCH SINGLE STORE
router.get('/:id', async (req, res) => {
  try {
    const storeId = req.params.id;

    const store = await Store.findById(storeId).populate('ownerId', 'username email');

    if (!store) {
      return res.status(404).json({ msg: "Storefront not found." });
    }

    return res.json({ store });
  } catch (err) {
    console.error("Error fetching single store:", err);
    // If the MongoDB ObjectId structure is malformed, catch it cleanly here
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: "Invalid Store ID layout structure." });
    }
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// UPDATE STORE (FOR PROJECT OWNER ONLY)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const storeId = req.params.id;
    const currentUserId = req.user.userid; // From JWT
    const { storename, description, logoUrl } = req.body;

    
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ msg: "Storefront not found." });
    }

    
    if (store.ownerId.toString() !== currentUserId && req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Unauthorized: You do not own this storefront." });
    }

    
    const validationResult = storeCheck.safeParse({
      ownerId: currentUserId,
      storename: storename || store.storeName,
      description: description || store.description,
      logoUrl: logoUrl || store.logoUrl
    });

    if (!validationResult.success) {
      return res.status(400).json({ msg: "Invalid updates provided", errors: validationResult.error.errors });
    }

    // 4. Check if the updated storename conflicts with another existing store
    if (storename && storename !== store.storeName) {
      const nameConflict = await Store.findOne({ storeName: storename });
      if (nameConflict) {
        return res.status(409).json({ msg: "Target store name is already occupied by another tenant." });
      }
    }

    
    store.storeName = storename || store.storeName;
    store.description = description || store.description;
    store.logoUrl = logoUrl || store.logoUrl;

    const updatedStore = await store.save();

    return res.json({
      msg: "Store updated successfully across the tenancy node",
      store: updatedStore
    });

  } catch (err) {
    console.error("Error updating store details:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;