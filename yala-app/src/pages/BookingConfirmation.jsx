import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiX, FiPrinter } from "react-icons/fi";
import { apiEndpoints, publicFetch } from "../config/api";
import { toast } from "react-toastify";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);

  // Print only the booking confirmation modal content
  const handlePrint = () => {
    // Create a new window with only the booking details
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('booking-print-content');
    
    if (printWindow && printContent) {
      const printHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Booking Confirmation - ${confirmedBookingId}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                padding: 20px;
                background: white;
                color: #1f2937;
              }
              .print-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #034123;
              }
              .header h1 {
                color: #034123;
                font-size: 28px;
                margin-bottom: 10px;
              }
              .booking-id {
                font-size: 18px;
                color: #6b7280;
                margin-top: 10px;
              }
              .booking-id span {
                color: #f26b21;
                font-weight: bold;
              }
              .section {
                margin-bottom: 25px;
                padding: 20px;
                background: #f9fafb;
                border-radius: 12px;
                border: 1px solid #e5e7eb;
              }
              .section h2 {
                color: #034123;
                font-size: 20px;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #034123;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .info-row:last-child {
                border-bottom: none;
              }
              .info-label {
                color: #6b7280;
                font-weight: 500;
              }
              .info-value {
                color: #034123;
                font-weight: 600;
              }
              .price-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .price-total {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                margin-top: 15px;
                border-top: 2px solid #034123;
                font-size: 18px;
              }
              .price-total .label {
                color: #034123;
                font-weight: bold;
              }
              .price-total .value {
                color: #f26b21;
                font-weight: bold;
                font-size: 24px;
              }
              .status-badge {
                display: inline-block;
                padding: 8px 16px;
                background: #fee000;
                color: #856404;
                border-radius: 8px;
                font-weight: bold;
                margin-top: 10px;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 2px solid #e5e7eb;
                text-align: center;
                color: #6b7280;
                font-size: 14px;
              }
              @media print {
                body {
                  padding: 0;
                }
                .print-container {
                  max-width: 100%;
                }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `;
      
      printWindow.document.write(printHTML);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (bookingConfirmed) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [bookingConfirmed]);

  // If no booking data, redirect back
  if (!bookingData) {
    navigate("/packages");
    return null;
  }

  // ✅ CRITICAL: Calculate prices on confirmation page (matching Packages.jsx)
  const calculatePrices = () => {
    const {
      people,
      visitorType,
      guideOption,
      mealOption,
      includeBreakfast,
      includeLunch,
      selectedBreakfastItems,
      selectedLunchItems,
      vegOption,
      includeEggs,
      timeSlot,
      jeepPrice: frontendJeepPrice,
      ticketPrice: frontendTicketPrice,
      guidePrice: frontendGuidePrice,
      mealPrice: frontendMealPrice,
      totalPrice: frontendTotalPrice,
    } = bookingData;

    // Use prices already calculated from frontend
    // These should match exactly what user saw
    return {
      ticketPrice: Number(frontendTicketPrice) || 0,
      jeepPrice: Number(frontendJeepPrice) || 0,
      guidePrice: Number(frontendGuidePrice) || 0,
      mealPrice: Number(frontendMealPrice) || 0,
      totalPrice: Number(frontendTotalPrice) || 0,
    };
  };

  const prices = calculatePrices();

  const handleConfirmBooking = async () => {
    setLoading(true);
    
    try {
      console.log('📤 Submitting booking with prices:', prices);
      console.log('📤 Full booking data:', bookingData);

      // ✅ CRITICAL: Send the EXACT prices user saw on confirmation page
      const bookingPayload = {
        // Customer Information
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone,
        
        // Booking Details
        park: bookingData.park,
        block: bookingData.block,
        timeSlot: bookingData.timeSlot,
        guideOption: bookingData.guideOption,
        visitorType: bookingData.visitorType,
        mealOption: bookingData.mealOption,
        vegOption: bookingData.vegOption,
        people: bookingData.people,
        
        // Date
        date: bookingData.date,
        
        // Meal selections
        includeBreakfast: bookingData.includeBreakfast || false,
        includeLunch: bookingData.includeLunch || false,
        includeEggs: bookingData.includeEggs || false,
        selectedBreakfastItems: bookingData.selectedBreakfastItems || [],
        selectedLunchItems: bookingData.selectedLunchItems || [],
        
        // Additional info
        pickupLocation: bookingData.pickupLocation || "",
        hotelWhatsapp: bookingData.hotelWhatsapp || "",
        accommodation: bookingData.accommodation || "",
        passportNumber: bookingData.passportNumber || "",
        nicNumber: bookingData.nicNumber || "",
        localContact: bookingData.localContact || "",
        localAccommodation: bookingData.localAccommodation || "",
        
        // Package info
        packageId: bookingData.packageId,
        packageName: bookingData.packageName,
        
        // ✅ CRITICAL: Include ALL calculated prices
        ticketPrice: prices.ticketPrice,
        jeepPrice: prices.jeepPrice,
        guidePrice: prices.guidePrice,
        mealPrice: prices.mealPrice,
        totalPrice: prices.totalPrice,
      };

      console.log('📤 Final payload being sent:', bookingPayload);

      const response = await publicFetch(apiEndpoints.bookings.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (data.success) {
        setBookingConfirmed(true);
        setConfirmedBookingId(data.booking.bookingId);
        toast.success("Booking confirmed successfully!");
        console.log('✅ Booking created:', data.booking);
      } else {
        toast.error(data.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("❌ Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (bookingConfirmed) {
  // Hidden print-only content (not displayed on screen)
  const printContent = (
    <div id="booking-print-content" className="hidden">
      <div className="print-container">
        <div className="header">
          <h1>Booking Confirmation</h1>
          <div className="booking-id">
            Booking ID: <span>{confirmedBookingId}</span>
          </div>
        </div>
        
        <div className="section">
          <h2>Customer Information</h2>
          <div className="info-row">
            <span className="info-label">Name:</span>
            <span className="info-value">{bookingData.customerName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email:</span>
            <span className="info-value">{bookingData.customerEmail}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Phone:</span>
            <span className="info-value">{bookingData.customerPhone}</span>
          </div>
        </div>

        <div className="section">
          <h2>Booking Details</h2>
          <div className="info-row">
            <span className="info-label">Package:</span>
            <span className="info-value">{bookingData.packageName || 'Safari Package'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(bookingData.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Time Slot:</span>
            <span className="info-value capitalize">{bookingData.timeSlot} Safari</span>
          </div>
          <div className="info-row">
            <span className="info-label">Number of People:</span>
            <span className="info-value">{bookingData.people}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Park:</span>
            <span className="info-value capitalize">{bookingData.park} National Park</span>
          </div>
          <div className="info-row">
            <span className="info-label">Guide Option:</span>
            <span className="info-value capitalize">
              {bookingData.guideOption.replace(/([A-Z])/g, " $1").trim()}
            </span>
          </div>
        </div>

        <div className="section">
          <h2>Price Breakdown</h2>
          <div className="price-row">
            <span className="info-label">Ticket Price:</span>
            <span className="info-value">${prices.ticketPrice.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span className="info-label">Jeep Price:</span>
            <span className="info-value">${prices.jeepPrice.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span className="info-label">Guide Price:</span>
            <span className="info-value">${prices.guidePrice.toFixed(2)}</span>
          </div>
          <div className="price-row">
            <span className="info-label">Meal Price:</span>
            <span className="info-value">${prices.mealPrice.toFixed(2)}</span>
          </div>
          <div className="price-total">
            <span className="label">Total Amount:</span>
            <span className="value">${prices.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="section">
          <div className="status-badge">⏳ Status: PENDING APPROVAL</div>
          <p style={{ marginTop: '15px', color: '#6b7280', lineHeight: '1.6' }}>
            Your booking request has been received and is waiting for admin confirmation. 
            You will receive a confirmation email at {bookingData.customerEmail} once approved.
          </p>
        </div>

        <div className="footer">
          <p>Thank you for choosing Yala Safari!</p>
          <p style={{ marginTop: '5px' }}>For inquiries, contact us via WhatsApp: +94 77 374 2700</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hidden print content */}
      {printContent}
      
      {/* Modal Popup */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full my-auto relative">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#f9fafb] text-[#6b7280] hover:text-[#034123] transition-all duration-300 z-10"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>

          <div className="p-6 lg:p-10">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-[#fee000]/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg border-2 border-[#fee000]/40">
                <svg
                  className="w-12 h-12 text-[#856404]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-3">
                Booking Request Submitted!
              </h1>
              <p className="text-[#6b7280] text-base lg:text-lg mb-4">
                Booking ID: <span className="font-mono font-bold text-[#f26b21]">{confirmedBookingId}</span>
              </p>
            </div>

        {/* Pending Status Card */}
        <div className="bg-[#fee000]/20 backdrop-blur-sm border-2 border-[#fee000]/40 rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#fee000] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-[#856404]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg lg:text-xl font-bold text-[#856404] mb-2">
                ⏳ Status: PENDING APPROVAL
              </h3>
              <p className="text-[#856404] mb-4">
                Your booking request has been received and is waiting for admin confirmation.
              </p>
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#fee000]/30 shadow-sm">
                <p className="text-sm font-semibold text-[#034123] mb-3">
                  📧 What happens next?
                </p>
                <ul className="text-sm text-[#4b5563] space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#f26b21] mt-1">•</span>
                    <span>Our team will review your booking within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f26b21] mt-1">•</span>
                    <span>You will receive a <strong className="text-[#034123]">confirmation email</strong> at <span className="font-semibold text-[#034123]">{bookingData.customerEmail}</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f26b21] mt-1">•</span>
                    <span>Once approved, we'll send payment instructions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#f26b21] mt-1">•</span>
                    <span>Keep your Booking ID for reference: <span className="font-mono font-bold text-[#f26b21]">{confirmedBookingId}</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Check Status Card */}
        <div className="bg-[#034123]/5 backdrop-blur-sm border border-[#034123]/20 rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
          <h3 className="text-lg lg:text-xl font-bold text-[#034123] mb-3">📱 Track Your Booking Status</h3>
          <p className="text-sm text-[#6b7280] mb-5">
            You can check your booking status anytime using your email or booking ID.
          </p>
          <button
            onClick={() => navigate('/booking-status')}
            className="w-full bg-[#034123] hover:bg-[#026042] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Check Booking Status
          </button>
        </div>

        {/* Contact Card */}
        <div className="bg-white/95 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
          <h3 className="text-lg lg:text-xl font-bold text-[#034123] mb-3">💬 Need Help?</h3>
          <p className="text-sm text-[#6b7280] mb-5">
            Have questions about your booking? Contact us directly via WhatsApp.
          </p>
          <button
            onClick={() =>
              window.open(
                `https://wa.me/+94773742700?text=Hi! I have a question about my booking. Booking ID: ${confirmedBookingId}`,
                "_blank"
              )
            }
            className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contact Us on WhatsApp
          </button>
        </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] font-semibold py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#d1d5db]/60 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FiX className="w-5 h-5" />
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#034123] hover:bg-[#026042] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FiPrinter className="w-5 h-5" />
                Print Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-6 lg:py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#034123] to-[#026042] text-white p-6 lg:p-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-center">
              Confirm Your Booking
            </h1>
            <p className="text-white/80 text-center mt-2 text-sm lg:text-base">Review your booking details before confirmation</p>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Booking Summary */}
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-6 lg:p-8">
                <h2 className="text-xl lg:text-2xl font-bold text-[#034123] mb-6 pb-3 border-b-2 border-[#034123]/20">
                  Booking Summary
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e5e7eb]/40">
                    <span className="text-[#6b7280] font-medium">Reservation Type:</span>
                    <span className="font-semibold text-[#034123]">Private Safari</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e5e7eb]/40">
                    <span className="text-[#6b7280] font-medium">Date:</span>
                    <span className="font-semibold text-[#034123]">
                      {new Date(bookingData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e5e7eb]/40">
                    <span className="text-[#6b7280] font-medium">Time Slot:</span>
                    <span className="font-semibold text-[#034123] capitalize">
                      {bookingData.timeSlot} Safari
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e5e7eb]/40">
                    <span className="text-[#6b7280] font-medium">Number of People:</span>
                    <span className="font-semibold text-[#034123]">{bookingData.people}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#e5e7eb]/40">
                    <span className="text-[#6b7280] font-medium">Jeep Type:</span>
                    <span className="font-semibold text-[#034123]">Luxury Jeep</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <span className="text-[#6b7280] font-medium">Guide:</span>
                    <span className="font-semibold text-[#034123] capitalize">
                      {bookingData.guideOption.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-6 lg:p-8">
                <h2 className="text-xl lg:text-2xl font-bold text-[#034123] mb-6 pb-3 border-b-2 border-[#034123]/20">
                  Price Breakdown
                </h2>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 lg:p-6 space-y-4 border border-[#e5e7eb]/40">
                  <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]/30">
                    <span className="text-[#6b7280] font-medium">Ticket Price:</span>
                    <span className="font-semibold text-[#034123]">
                      ${prices.ticketPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]/30">
                    <span className="text-[#6b7280] font-medium">Jeep Price:</span>
                    <span className="font-semibold text-[#034123]">
                      ${prices.jeepPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]/30">
                    <span className="text-[#6b7280] font-medium">Guide Price:</span>
                    <span className="font-semibold text-[#034123]">
                      ${prices.guidePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-[#e5e7eb]/30">
                    <span className="text-[#6b7280] font-medium">Meal Price:</span>
                    <span className="font-semibold text-[#034123]">
                      ${prices.mealPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-[#034123]/20 pt-4 mt-4 bg-[#034123]/5 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg lg:text-xl font-bold text-[#034123]">
                        Total Amount:
                      </span>
                      <span className="text-xl lg:text-2xl font-bold text-[#f26b21]">
                        ${prices.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#e5e7eb]/60">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] font-semibold py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#d1d5db]/60 hover:scale-[1.02]"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#034123] to-[#026042] hover:from-[#026042] hover:to-[#034123] text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:bg-[#9ca3af] disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Confirm & Book Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;