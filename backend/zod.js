const { z } = require("zod");

// USER VALIDATION
const userCheck = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["customer", "vendor", "superadmin"]).default("customer")
});


// STORE VALIDATION
const storeCheck = z.object({
  ownerId: z.string().min(1, "Owner reference ID is required"),
  storename: z.string().min(2, "Store name must be at least 2 characters"),
  description: z.string().optional(),
  logoUrl: z.string().url("Invalid image url layout").optional()
});


// PRODUCT VALIDATION
const productCheck = z.object({
  storeId: z.string().min(1, "Store reference ID is required"),
  title: z.string().min(1, "Product title is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().optional(),
  images: z.array(z.string().url("Each image must be a valid URL")).default([]),
  variants: z.array(z.string()).default([])
});


// ORDER VALIDATION
const orderCheck = z.object({
  userId: z.string().min(1, "User reference ID is required"),
  totalAmount: z.number().nonnegative("Total amount cannot be negative"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      title: z.string().min(1),
      quantity: z.number().int().positive("Quantity must be at least 1"),
      priceAtPurchase: z.number().nonnegative()
    })
  ).min(1, "Order must contain at least 1 item"),
  orderStatus: z.enum(["Pending", "Paid", "Shipped", "Delivered", "Cancelled"]).default("Pending"),
  shippingAddress: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
    country: z.string().min(1, "Country is required")
  }),
  stripePaymentIntentId: z.string().optional()
});

const profileUpdateCheck = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50).optional(),
  phone: z.string().optional(),
  profilePic: z.string().optional()
});

module.exports = {
  userCheck,
  profileUpdateCheck,
  storeCheck,
  productCheck,
  orderCheck
};