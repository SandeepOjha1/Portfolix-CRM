const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'crm_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Helper to format full admin profile object
const formatAdminResponse = (admin) => ({
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  avatar: admin.avatar || '',
  phone: admin.phone || '',
  company: admin.company || '',
  title: admin.title || '',
  department: admin.department || '',
  address: admin.address || '',
  city: admin.city || '',
  state: admin.state || '',
  country: admin.country || '',
  postalCode: admin.postalCode || '',
  timezone: admin.timezone || 'UTC+05:30',
  bio: admin.bio || '',
  website: admin.website || '',
  createdAt: admin.createdAt,
  lastLogin: admin.lastLogin,
});

// @desc    Register / Sign up new user
// @route   POST /api/auth/register (or /api/auth/signup)
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, email, and a password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Create user in database
    const admin = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'admin',
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      lastLogin: new Date(),
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Portfolix CRM.',
      token,
      admin: formatAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find admin by email and explicitly select password field
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: formatAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({
      success: true,
      admin: formatAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
      avatar,
      phone,
      company,
      title,
      department,
      address,
      city,
      state,
      country,
      postalCode,
      timezone,
      bio,
      website,
    } = req.body;
    const admin = await Admin.findById(req.admin._id).select('+password');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (name !== undefined) admin.name = name.trim();
    if (email !== undefined) admin.email = email.toLowerCase().trim();
    if (avatar !== undefined) admin.avatar = avatar;
    if (phone !== undefined) admin.phone = phone.trim();
    if (company !== undefined) admin.company = company.trim();
    if (title !== undefined) admin.title = title.trim();
    if (department !== undefined) admin.department = department.trim();
    if (address !== undefined) admin.address = address.trim();
    if (city !== undefined) admin.city = city.trim();
    if (state !== undefined) admin.state = state.trim();
    if (country !== undefined) admin.country = country.trim();
    if (postalCode !== undefined) admin.postalCode = postalCode.trim();
    if (timezone !== undefined) admin.timezone = timezone.trim();
    if (bio !== undefined) admin.bio = bio.trim();
    if (website !== undefined) admin.website = website.trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password',
        });
      }
      const isMatch = await admin.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match',
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }
      admin.password = newPassword;
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: formatAdminResponse(admin),
    });
  } catch (error) {
    next(error);
  }
};
