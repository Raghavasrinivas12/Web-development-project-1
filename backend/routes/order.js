const express = require('express');
const router = express.Router();
const { Order, Product, Store, User, Notification } = require('../db/db'); 
const { orderCheck } = require('../zod')
const authMiddleware = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

// CREATE ORDER (FOR CUSTOMER ONLY)
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email before placing an order" });
    }

    const { items, shippingAddress, orderStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "Cannot process an empty cart." });
    }

    // Server-side price calculation & stock verification loop
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ msg: `Product with ID ${item.productId} not found.` });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ msg: `Insufficient stock for item: ${product.title}` });
      }

      calculatedTotal += product.price * item.quantity;

      verifiedItems.push({
        productId: product._id.toString(),
        title: product.title,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    
    const validationResult = orderCheck.safeParse({
      userId,
      totalAmount: calculatedTotal,
      items: verifiedItems,
      shippingAddress,
      orderStatus: orderStatus || 'Pending',
    });

    if (!validationResult.success) {
      console.error("Order validation errors:", JSON.stringify(validationResult.error.issues, null, 2));
      return res.status(400).json({ 
        msg: "Validation error on order configuration rules", 
        errors: validationResult.error.issues 
      });
    }

    // Create the pending order document data base
    // we will append the Stripe client_secret here later
    const newOrder = await Order.create({
      userId,
      items: verifiedItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      orderStatus: 'Pending',
      stripePaymentIntentId: "pi_mock_" + Math.random().toString(36).substring(2, 11) // Mock placeholder for now
    });

    //Atomically decrement stock counts for purchased items
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    await Notification.create({
      userId,
      title: 'Order placed',
      message: `Your order of ₹${calculatedTotal.toLocaleString()} has been placed successfully.`,
      type: 'order',
      link: '/myorders'
    });

    return res.status(201).json({
      msg: "Checkout order pipeline initialized successfully!",
      order: newOrder
    });

  } catch (err) {
    console.error("Checkout Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// CUSTOMER HISTORIC ORDERS (FOR CUSTOMER ONLY)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid;

    const orders = await Order.find({ userId })
      .populate('items.productId', 'images title')
      .sort({ createdAt: -1 }); 

    return res.json({
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("Fetch Order History Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// FETCH ITEMS FOR VENDOR ONLY
router.get('/vendor-dashboard', authMiddleware, restrictTo('vendor', 'superadmin'), async (req, res) => {
  try {
    const currentVendorUserId = req.user.userid;

    const store = await Store.findOne({ ownerId: currentVendorUserId });
    if (!store) {
      return res.json({ orders: [], count: 0 });
    }

    const vendorProducts = await Product.find({ storeId: store._id }).select('_id');
    const productIds = vendorProducts.map((p) => p._id);

    const orders = await Order.find({
      'items.productId': { $in: productIds }
    })
      .populate('userId', 'username email')
      .populate('items.productId', 'images title')
      .sort({ createdAt: -1 });

    const enrichedOrders = orders.map((order) => {
      const orderObj = order.toObject();
      orderObj.vendorItems = order.items.filter((item) =>
        productIds.some((pid) => pid.toString() === item.productId.toString())
      );
      return orderObj;
    });

    return res.json({ orders: enrichedOrders, count: enrichedOrders.length });
    
  } catch (err) {
    console.error("Vendor Dashboard Orders Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


 // UPDATE DELIVERY STATUS ( FOR VENDOR AND ADMIN ONLY)
router.put('/:id/status', authMiddleware, restrictTo('vendor', 'superadmin'), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status progression update string tag." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Target order reference not found." });
    }

    order.orderStatus = status;
    await order.save();

    return res.json({
      msg: `Order status successfully transitioned to: ${status}`,
      order
    });

  } catch (err) {
    console.error("Update Status Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;