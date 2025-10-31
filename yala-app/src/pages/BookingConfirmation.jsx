import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../config/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingDetails = location.state;

    const [formData, setFormData] = useState({
        customerName: bookingDetails?.customerName || '',     // ✅ Pre-filled from Packages
        customerEmail: bookingDetails?.customerEmail || '',   // ✅ Pre-filled from Packages
        customerPhone: bookingDetails?.customerPhone || '',   // ✅ Pre-filled from Packages
        specialRequests: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingId, setBookingId] = useState('');

    // WhatsApp and Bank Details (these should come from backend/env in production)
    const ADMIN_WHATSAPP = process.env.REACT_APP_ADMIN_WHATSAPP || '+94771234567';
    const BANK_DETAILS = {
        bankName: process.env.REACT_APP_BANK_NAME || 'Will Add soon',
        accountName: process.env.REACT_APP_ACCOUNT_NAME || 'Will Add soon',
        accountNumber: process.env.REACT_APP_ACCOUNT_NUMBER || 'Will Add soon',
        branch: process.env.REACT_APP_BRANCH || 'Will Add soon',
        swiftCode: process.env.REACT_APP_SWIFT_CODE || 'Will Add soon',
    };

    useEffect(() => {
        // Redirect if no booking details
        if (!bookingDetails) {
            navigate('/');
        }
    }, [bookingDetails, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate form
            if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
                throw new Error('Please fill in all required fields');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.customerEmail)) {
                throw new Error('Please enter a valid email address');
            }

            // Combine booking details with customer info
            const completeBookingData = {
                ...bookingDetails,
                ...formData,
            };

            // Submit booking
            const response = await bookingAPI.create(completeBookingData);

            if (response.success) {
                setBookingId(response.booking.bookingId);
                setShowSuccess(true);

                // Scroll to success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error(response.message || 'Failed to create booking');
            }
        } catch (err) {
            setError(err.message);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const openWhatsApp = () => {
        const message = `Hi, I have a question about my booking (ID: ${bookingId || 'Pending'})`;
        const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!bookingDetails) {
        return null;
    }

    if (showSuccess) {
        return (
            <div className="booking-confirmation-container">
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h1>Booking Confirmed!</h1>
                    <p className="booking-id">Booking ID: <strong>{bookingId}</strong></p>
                    <p>Thank you for your booking! We have sent a confirmation email to <strong>{formData.customerEmail}</strong></p>

                    <div className="payment-info-box">
                        <h2>Payment Information</h2>
                        <div className="bank-details">
                            <h3>Bank Transfer Details</h3>
                            <div className="detail-row">
                                <span className="label">Bank Name:</span>
                                <span className="value">{BANK_DETAILS.bankName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Name:</span>
                                <span className="value">{BANK_DETAILS.accountName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Number:</span>
                                <span className="value">{BANK_DETAILS.accountNumber}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Branch:</span>
                                <span className="value">{BANK_DETAILS.branch}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">SWIFT Code:</span>
                                <span className="value">{BANK_DETAILS.swiftCode}</span>
                            </div>
                            <div className="total-amount">
                                <span className="label">Total Amount:</span>
                                <span className="value">${bookingDetails.totalPrice?.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="payment-instructions">
                            <h4>📌 Payment Instructions:</h4>
                            <ul>
                                <li>Please complete the bank transfer within 24 hours to confirm your booking</li>
                                <li>Use your Booking ID (<strong>{bookingId}</strong>) as the payment reference</li>
                                <li>Send the payment receipt via WhatsApp or Email</li>
                                <li>Our team will confirm your payment and finalize your booking</li>
                            </ul>
                        </div>

                        <button className="whatsapp-button" onClick={openWhatsApp}>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                alt="WhatsApp"
                                className="whatsapp-icon"
                            />
                            Contact Us on WhatsApp
                        </button>
                    </div>

                    <div className="action-buttons">
                        <button onClick={() => navigate('/')} className="btn-primary">
                            Back to Home
                        </button>
                        <button onClick={() => window.print()} className="btn-secondary">
                            Print Booking Details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-confirmation-container">
            <div className="booking-card">
                <h1>Confirm Your Booking</h1>

                {error && (
                    <div className="error-message">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <div className="booking-summary">
                    <h2>Booking Summary</h2>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span className="label">Reservation Type:</span>
                            <span className="value">{bookingDetails.reservationType === 'private' ? 'Private' : 'Shared'}</span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Date:</span>
                            <span className="value">
                                {bookingDetails.date ? new Date(bookingDetails.date).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Invalid Date'}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="label">Time Slot:</span>
                            <span className="value">{bookingDetails.timeSlot === 'morning' ? 'Morning Safari' : 'Evening Safari'}</span>
                        </div>
                        {bookingDetails.reservationType === 'private' ? (
                            <>
                                <div className="summary-item">
                                    <span className="label">Jeep Type:</span>
                                    <span className="value">{bookingDetails.jeepType}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="label">Number of People:</span>
                                    <span className="value">{bookingDetails.people}</span>
                                </div>
                            </>
                        ) : (
                            <div className="summary-item">
                                <span className="label">Seats Booked:</span>
                                <span className="value">{bookingDetails.selectedSeats || bookingDetails.people}</span>
                            </div>
                        )}
                        <div className="summary-item">
                            <span className="label">Guide:</span>
                            <span className="value">
                                {bookingDetails.guideOption === 'driver' ? 'Driver Only' :
                                    bookingDetails.guideOption === 'driverGuide' ? 'Driver Guide' :
                                        bookingDetails.guideOption === 'Driver+Guide' ? 'Driver + Guide' :
                                            'No Guide'}
                            </span>
                        </div>
                        {bookingDetails.mealOption === 'with' && (
                            <div className="summary-item">
                                <span className="label">Meals:</span>
                                <span className="value">
                                    {bookingDetails.includeBreakfast && 'Breakfast'}
                                    {bookingDetails.includeBreakfast && bookingDetails.includeLunch && ' + '}
                                    {bookingDetails.includeLunch && 'Lunch'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="price-breakdown">
                        <h3>Price Breakdown</h3>
                        <div className="price-item">
                            <span>Ticket Price:</span>
                            <span>${bookingDetails.ticketPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="price-item">
                            <span>Jeep Price:</span>
                            <span>${bookingDetails.jeepPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="price-item">
                            <span>Guide Price:</span>
                            <span>${bookingDetails.guidePrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="price-item">
                            <span>Meal Price:</span>
                            <span>${bookingDetails.mealPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="price-total">
                            <span>Total Amount:</span>
                            <span>${bookingDetails.totalPrice?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <h2>Your Information</h2>

                    <div className="form-group">
                        <label htmlFor="customerName">Full Name *</label>
                        <input
                            type="text"
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="customerEmail">Email Address *</label>
                        <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="customerPhone">Phone Number *</label>
                        <input
                            type="tel"
                            id="customerPhone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            placeholder="+94 77 123 4567"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialRequests">Special Requests (Optional)</label>
                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            placeholder="Any special requirements or requests..."
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>

                <div className="help-section">
                    <p>Need help? Contact us on WhatsApp</p>
                    <button className="whatsapp-button-small" onClick={openWhatsApp}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="WhatsApp"
                            className="whatsapp-icon-small"
                        />
                        WhatsApp Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;