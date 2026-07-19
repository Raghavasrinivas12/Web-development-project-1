require('dotenv').config();
const express=require("express")
const router=express.Router()
const jwt=require("jsonwebtoken");
const crypto = require('crypto');
const { userCheck, profileUpdateCheck } = require("../zod");
const bcrypt = require('bcrypt');
const { User, Notification } = require("../db/db");
const authMiddleware = require('../middleware/authMiddleware');
const { sendVerificationEmail, sendResetEmail } = require('../email');


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

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "User already exists with this email address" }); 
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      username,
      email,
      passwordHash: hashedPassword, 
      phone,
      role,
      isVerified: false,
      verificationToken
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailErr) {
      console.error('Verification email failed:', emailErr.message);
    }

    const isResendConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxxxxxxxxx';

    const tokenPayload = {
      userid: user._id,
      role: user.role   
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic || '',
      isVerified: false,
      address: { street: '', city: '', state: '', zipCode: '', country: '' }
    };

    const response = {
      msg: "Successfully signed up. Please check your email to verify your account.",
      token,
      user: userData
    };
    if (!isResendConfigured) {
      response.devUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;
    }

    await Notification.create({
      userId: user._id,
      title: 'Welcome to ShopHub!',
      message: 'Your account has been created. Verify your email to start shopping.',
      type: 'system',
      link: '/'
    });

    return res.status(201).json(response);

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

    const tokenPayload = {userid: user._id,role: user.role};

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic || '',
      isVerified: user.isVerified,
      address: user.address || { street: '', city: '', state: '', zipCode: '', country: '' }
    };

    return res.json({
      msg: "User signed in successfully",
      token,
      user: userData
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

// GET CURRENT USER PROFILE
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userid).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic || '',
      isVerified: user.isVerified,
      address: user.address || { street: '', city: '', state: '', zipCode: '', country: '' }
    };

    return res.json({ user: userData });
  } catch (err) {
    console.error("Profile Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// UPDATE USER PROFILE
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { success, error } = profileUpdateCheck.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        msg: "Incorrect inputs",
        errors: error.errors
      });
    }

    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.profilePic !== undefined) updates.profilePic = req.body.profilePic;
    if (req.body.address) updates.address = req.body.address;

    const user = await User.findByIdAndUpdate(
      req.user.userid,
      updates,
      { returnDocument: 'after' }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePic: user.profilePic || '',
      isVerified: user.isVerified,
      address: user.address || { street: '', city: '', state: '', zipCode: '', country: '' }
    };

    return res.json({
      msg: "Profile updated successfully",
      user: userData
    });
  } catch (err) {
    console.error("Profile Update Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// VERIFY EMAIL
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error("Verify Email Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// RESEND VERIFICATION
router.post('/resend-verification', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userid);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isVerified) return res.json({ msg: "Email already verified" });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);
    return res.json({ msg: "Verification email sent" });
  } catch (err) {
    console.error("Resend Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "If that email is registered, a reset link has been sent." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const isResendConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_xxxxxxxxxxxx';

    try {
      await sendResetEmail(email, resetToken);
    } catch (emailErr) {
      console.error('Reset email failed:', emailErr.message);
    }

    const response = { msg: "If that email is registered, a reset link has been sent." };
    if (!isResendConfigured) {
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
      response.devUrl = resetUrl;
    }

    return res.json(response);
  } catch (err) {
    console.error("Forgot Password Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// RESET PASSWORD
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(password, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;