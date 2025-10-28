// utils/emailService.js
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Register Handlebars helpers
    handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    handlebars.registerHelper('formatCurrency', (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    });
  }

  /**
   * Send email
   */
  async sendEmail(to, subject, template, data) {
    try {
      // Load template
      const templatePath = path.join(
        process.cwd(),
        'templates',
        'emails',
        `${template}.hbs`
      );
      const templateContent = await fs.readFile(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateContent);
      const html = compiledTemplate(data);

      // Send email
      const mailOptions = {
        from: `Yala Safari <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html
      };

      await this.transporter.sendMail(mailOptions);
      
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(booking) {
    const email = booking.customer?.email || booking.guestDetails?.email;
    
    await this.sendEmail(
      email,
      `Booking Confirmation - ${booking.bookingNumber}`,
      'booking-confirmation',
      {
        bookingNumber: booking.bookingNumber,
        customerName: booking.customer?.fullName || 
                     `${booking.guestDetails?.firstName} ${booking.guestDetails?.lastName}`,
        safari: booking.safari,
        date: booking.date,
        timeSlot: booking.timeSlot,
        participants: booking.participants,
        total: booking.pricing.total,
        pickup: booking.pickup
      }
    );
  }

  /**
   * Send booking cancellation
   */
  async sendBookingCancellation(booking) {
    const email = booking.customer?.email || booking.guestDetails?.email;
    
    await this.sendEmail(
      email,
      `Booking Cancellation - ${booking.bookingNumber}`,
      'booking-cancellation',
      {
        bookingNumber: booking.bookingNumber,
        customerName: booking.customer?.fullName || 
                     `${booking.guestDetails?.firstName} ${booking.guestDetails?.lastName}`,
        safari: booking.safari,
        date: booking.date,
        refundAmount: booking.cancellation?.refundAmount,
        reason: booking.cancellation?.reason
      }
    );
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await this.sendEmail(
      user.email,
      'Welcome to Yala Safari',
      'welcome',
      {
        name: user.profile.firstName,
        verificationUrl
      }
    );
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await this.sendEmail(
      user.email,
      'Password Reset Request',
      'password-reset',
      {
        name: user.profile.firstName,
        resetUrl
      }
    );
  }
}

export default new EmailService();
export const { 
  sendBookingConfirmation,
  sendBookingCancellation,
  sendWelcomeEmail,
  sendPasswordResetEmail
} = new EmailService();