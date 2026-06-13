require('dotenv').config()
const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken");
const { userCheck } = require("../zod");
const bcrypt = require('bcrypt');
const { User } = require("../db/db");
const JWT_SECRET = process.env.JWT_SECRET || "untileasy1";

//sign up route
router.post('/signup', async (req, res) => {
  try {
    const body = req.body;
    // Validate inputs using Zod
    const { success, error } = userCheck.safeParse(body);
    if (!success) {
      return res.status(400).json({
        msg: "Incorrect inputs",
        errors: error.errors
      });
    }

    const { username, email, password, phone, role } = body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "User already exists" }); 
    }

    // Hash the password securely
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Database
    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword, 
      phone,
      role
    });
    // Generate JWT Token
    const userid = user._id;
    const token = jwt.sign({ userid },JWT_SECRET );
    

    return res.status(201).json({
      msg: "Successfully signed up",
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// sign in route
router.post('/signin', async (req, res) => { 
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Verify password match
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate Token
    const userid = user._id;
    const token = jwt.sign({ userid }, JWT_SECRET);

    return res.json({
      msg: "User signed in successfully",
      token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// Delete User Route
router.delete('/delete-account', async (req, res) => {
  try {
   // usually we would get through middleware userid
    const { userid } = req.body; 

    if (!userid) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const deletedUser = await User.findByIdAndDelete(userid);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({
      msg: "Account deleted successfully"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;