import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js';

class AuthController {
  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  /**
   * Send token response
   */
  sendTokenResponse(user, statusCode, res) {
    const token = this.generateToken(user._id);
    
    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      success: true,
      token,
      data: { user }
    });
  }

  /**
   * Register new user
   * POST /api/auth/register
   */
  register = catchAsync(async (req, res, next) => {
    const { email, password, firstName, lastName, phone, country } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Create user
    const user = await User.create({
      email,
      password,
      profile: {
        firstName,
        lastName,
        phone,
        country
      }
    });

    // Generate email verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');
    user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    await user.save({ validateBeforeSave: false });

    // Send welcome email
    await sendWelcomeEmail(user, verifyToken);

    this.sendTokenResponse(user, 201, res);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    // Find user and check password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      // Increment login attempts
      if (user) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // Lock for 2 hours
        }
        await user.save({ validateBeforeSave: false });
      }
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if account is locked
    if (user.isLocked()) {
      return next(new AppError('Account is locked due to too many failed login attempts', 423));
    }

    // Reset login attempts
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save({ validateBeforeSave: false });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return next(new AppError('Please verify your email before logging in', 401));
    }

    this.sendTokenResponse(user, 200, res);
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });

  /**
   * Forgot password
   * POST /api/auth/forgot-password
   */
  forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('No user found with that email', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    
    await user.save({ validateBeforeSave: false });

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({
      success: true,
      message: 'Password reset link sent to email'
    });
  });

  /**
   * Reset password
   * POST /api/auth/reset-password/:token
   */
  resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    
    await user.save();

    this.sendTokenResponse(user, 200, res);
  });

  /**
   * Verify email
   * GET /api/auth/verify-email/:token
   */
  verifyEmail = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired verification token', 400));
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  });

  /**
   * Get current user
   * GET /api/auth/me
   */
  getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: { user }
    });
  });

  /**
   * Update password
   * PATCH /api/auth/update-password
   */
  updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    this.sendTokenResponse(user, 200, res);
  });
}

export default new AuthController();