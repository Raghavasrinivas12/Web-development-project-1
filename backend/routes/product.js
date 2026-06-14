const express = require('express');
const router = express.Router();
const { Product, Store } = require('../db/db'); // Path to your Mongoose schemas
const { productCheck } = require('../zod'); 


const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validateBody } = require('../middleware/validateMiddleware');


// ADD NEW PRODUCT (VENDOR ONLY)
router.post('/', authMiddleware, restrictTo('vendor'), validateBody(productCheck), async (req, res) => {
  try {
    const { storeId, title, description, price, stockQuantity, images, variants } = req.body;
    const currentUserId = req.user.userid; 

   // verify vendors actually owns
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ msg: "Target storefront not found." });
    }

    if (store.ownerId.toString() !== currentUserId && req.user.role !== 'superadmin') {
      return res.status(403).json({ msg: "Unauthorized: You cannot add items to a store you do not own." });
    }

    
    const newProduct = await Product.create({
      storeId,
      title,
      description,
      price,
      stockQuantity,
      images,
      variants 
    });

    return res.status(201).json({
      msg: "Product listed across the tenant marketplace successfully!",
      product: newProduct
    });

  } catch (err) {
    console.error("Create Product Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// FETCH ALL PRODUCTS
router.get('/', async (req, res) => {
  try {

    const products = await Product.find()
      .populate('storeId', 'storeName logoUrl')
      .sort({ createdAt: -1 });

    return res.json({
      count: products.length,
      products
    });
  } catch (err) {
    console.error("Fetch All Products Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// GET PRODUCT SPECIALLY FOR PER STORE
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const products = await Product.find({ productId }).sort({ createdAt: -1 });
    
    return res.json({
      count: products.length,
      products
    });
  } catch (err) {
    console.error("Fetch Store Products Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// FETCH SINGLE PRODUCT DETAILS
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('storeId', 'storeName logoUrl');
    
    if (!product) {
      return res.status(404).json({ msg: "Product listing not found." });
    }

    return res.json({ product });
  } catch (err) {
    console.error("Fetch Single Product Error:", err);
    if (err.kind === 'ObjectId') return res.status(400).json({ msg: "Invalid Product ID structure." });
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// UPDATE PRODUCT DETAILS (FOR OWNER ONLY)
router.put('/:id', authMiddleware, restrictTo('vendor'), validateBody(productCheck), async (req, res) => {
  try {
    const productId = req.params.id;
    const currentUserId = req.user.userid;

    // find its associated store
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product listing not found." });
    }

    const store = await Store.findById(product.storeId);
    
    
    if (!store || (store.ownerId.toString() !== currentUserId && req.user.role !== 'superadmin')) {
      return res.status(403).json({ msg: "Unauthorized action: Tenant ownership validation failed." });
    }


    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: req.body },
      { new: true } 
    );

    return res.json({
      msg: "Product schema properties updated successfully!",
      product: updatedProduct
    });

  } catch (err) {
    console.error("Update Product Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// REMOVE PRODUCT (STORE OWNER ONLY)
router.delete('/:id', authMiddleware, restrictTo('vendor'), async (req, res) => {
  try {
    const productId = req.params.id;
    const currentUserId = req.user.userid;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product catalog reference entry not found." });
    }

    const store = await Store.findById(product.storeId);
    
    
    if (!store || (store.ownerId.toString() !== currentUserId && req.user.role !== 'superadmin')) {
      return res.status(403).json({ msg: "Unauthorized action: Management privileges restriction applied." });
    }

    await Product.findByIdAndDelete(productId);

    return res.json({ msg: "Product listing systematically erased from inventory records." });

  } catch (err) {
    console.error("Delete Product Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;