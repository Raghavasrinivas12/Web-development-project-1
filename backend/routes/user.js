require('dotenv').config()
const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken");
const { userCheck } = require("../zod");
const bcrypt = require('bcrypt');
const { User } = require("../db/db");



//sign up route
router.post('/signup', async (req, res) => {
  try {
    const body = req.body;
    
  
    const { success, error } = userCheck.safeParse(body);
    if (!success) {
      return res.status(400).json({
        msg: "Incorrect inputs",
        errors: error.errors
      });
    }

    const { username, email, password, phone, role } = body;

    // Check if user already exists
    const existing = await User.find({ email });
    if (existing) {
      return res.status(409).json({ msg: "User already exists with this email address" }); 
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

    // Generate JWT Token Payload
    const tokenPayload = {
      userid: user._id,
      role: user.role   
    };

   
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(201).json({
      msg: "Successfully signed up",
      token
    });

  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


// SIGN IN
router.post('/signin', async (req, res) => { 
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

  
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate Token
const tokenPayload = {userid: user._id,role: user.role};

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });


    return res.json({
      msg: "User signed in successfully",
      token
    });

  } catch (err) {
    console.error("Signin Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



// DELETE ACCOUNT (SELF OR ADMIN ONLY)
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.userid; 

    // Find and erase account document
    const deletedUser = await User.findByIdAndDelete(currentUserId);
    if (!deletedUser) {
      return res.status(404).json({ msg: "User account not found." });
    }

    return res.json({
      msg: "Account permanently wiped from the system structure successfully."
    });

  } catch (err) {
    console.error("Delete Account Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;