import Booking from "../models/Booking.js";
import Package from "../models/Package.js";
import asyncHandler from "express-async-handler";

// Helper function to calculate pricing based on reservation type
const calculatePricing = async (bookingData) => {
  try {
    // Get current package pricing from database
    const pkg = await Package.findOne().sort({ updatedAt: -1 });
    
    if (!pkg) {
      throw new Error("Package pricing not found. Please contact administrator.");
    }

    let ticketPrice = 0;
    let jeepPrice = 0;
    let guidePrice = 0;
    let mealPrice = 0;
    let totalPrice = 0;

    const { 
      reservationType, 
      jeepType, 
      timeSlot, 
      people, 
      selectedSeats,
      guideOption,
      mealOption,
      includeBreakfast,
      includeLunch,
      visitorType 
    } = bookingData;

    // Define ticket price per person (can be configured)
    const TICKET_PRICE_FOREIGN = 2; // $2 per foreign visitor
    const TICKET_PRICE_LOCAL = 1;   // $1 per local visitor
    
    const ticketPricePerPerson = visitorType === 'foreign' 
      ? TICKET_PRICE_FOREIGN 
      : TICKET_PRICE_LOCAL;

    // ==========================================
    // PRIVATE RESERVATION CALCULATION
    // ==========================================
    if (reservationType === 'private') {
      // 1. Ticket Price: price per person × number of people
      ticketPrice = ticketPricePerPerson * people;
      
      // 2. Jeep Price: fixed price based on jeep type and time slot
      jeepPrice = pkg.jeep[jeepType][timeSlot];
      
      // 3. Guide Price: fixed price based on guide option
      guidePrice = pkg.guide[guideOption];
      
      // 4. Meal Price: price per person × number of people
      if (mealOption === 'with') {
        if (includeBreakfast) {
          mealPrice += pkg.meals.breakfast * people;
        }
        if (includeLunch) {
          mealPrice += pkg.meals.lunch * people;
        }
      }
      
      // Total = Ticket + Jeep + Guide + Meals
      totalPrice = ticketPrice + jeepPrice + guidePrice + mealPrice;
    } 
    // ==========================================
    // SHARED RESERVATION CALCULATION
    // ==========================================
    else if (reservationType === 'shared') {
      // Number of seats this person is booking
      const seatsBooked = parseInt(selectedSeats) || parseInt(people);
      
      if (seatsBooked < 1 || seatsBooked > 7) {
        throw new Error("Invalid number of seats. Must be between 1 and 7.");
      }
      
      // 1. Ticket Price: price per person × number of seats
      ticketPrice = ticketPricePerPerson * seatsBooked;
      
      // 2. Shared Jeep Price: 
      //    - Price per person decreases as more seats are booked
      //    - Total cost is minimized according to members who book
      //    Example from document:
      //    1 person = $10
      //    2 people = $8 per person
      //    4 people = $5 per person
      //    5,6,7 people = $5 per person (fixed)
      const sharedPricePerPerson = pkg.shared[seatsBooked];
      
      // Get base jeep price (from the timeSlot)
      const baseJeepPrice = pkg.jeep[jeepType][timeSlot];
      
      // Calculate jeep cost for this booking
      // In shared model, the jeep cost is distributed
      jeepPrice = sharedPricePerPerson * seatsBooked;
      
      // 3. Guide Price: distributed among all passengers in the jeep
      //    For shared bookings, guide cost is shared
      //    Assuming full jeep capacity is 7
      const JEEP_CAPACITY = 7;
      guidePrice = (pkg.guide[guideOption] / JEEP_CAPACITY) * seatsBooked;
      
      // 4. Meal Price: price per person × number of seats
      if (mealOption === 'with') {
        if (includeBreakfast) {
          mealPrice += pkg.meals.breakfast * seatsBooked;
        }
        if (includeLunch) {
          mealPrice += pkg.meals.lunch * seatsBooked;
        }
      }
      
      // Total = Ticket + Shared Jeep + Shared Guide + Meals
      totalPrice = ticketPrice + jeepPrice + guidePrice + mealPrice;
    } else {
      throw new Error("Invalid reservation type. Must be 'private' or 'shared'.");
    }

    // Return calculated prices (rounded to 2 decimal places)
    return {
      ticketPrice: parseFloat(ticketPrice.toFixed(2)),
      jeepPrice: parseFloat(jeepPrice.toFixed(2)),
      guidePrice: parseFloat(guidePrice.toFixed(2)),
      mealPrice: parseFloat(mealPrice.toFixed(2)),
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      breakdown: {
        reservationType,
        people: reservationType === 'private' ? people : parseInt(selectedSeats),
        jeepType,
        timeSlot,
        guideOption,
        mealsIncluded: mealOption === 'with'
      }
    };

  } catch (error) {
    throw new Error(`Pricing calculation error: ${error.message}`);
  }
};

// ==========================================
// CREATE BOOKING
// ==========================================
export const createBooking = asyncHandler(async (req, res) => {
  try {
    // Validate required fields based on reservation type
    const { 
      reservationType, 
      park, 
      visitorType,
      selectedDate,
      pickupLocation,
      hotelWhatsapp
    } = req.body;

    // Basic validation
    if (!reservationType || !park || !visitorType || !selectedDate || !pickupLocation || !hotelWhatsapp) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Validate visitor type specific fields
    if (visitorType === 'foreign') {
      const { passportNumber, fullName, phoneNumber, email, accommodation } = req.body;
      if (!passportNumber || !fullName || !phoneNumber || !email || !accommodation) {
        return res.status(400).json({
          success: false,
          message: "Foreign visitors must provide: passport number, full name, phone, email, and accommodation"
        });
      }
    }

    if (visitorType === 'local') {
      const { nicNumber, localContact, localAccommodation } = req.body;
      if (!nicNumber || !localContact || !localAccommodation) {
        return res.status(400).json({
          success: false,
          message: "Local visitors must provide: NIC number, contact, and accommodation"
        });
      }
    }

    // Validate shared reservation specific fields
    if (reservationType === 'shared' && !req.body.selectedSeats) {
      return res.status(400).json({
        success: false,
        message: "Shared reservations must specify number of seats"
      });
    }

    // Calculate pricing automatically
    const pricing = await calculatePricing(req.body);
    
    // Prepare booking data
    const bookingData = {
      ...req.body,
      total: pricing.totalPrice,
      paymentStatus: "pending", // Default status
      createdAt: new Date()
    };
    
    // Create and save booking
    const booking = new Booking(bookingData);
    await booking.save();
    
    // Send success response with pricing breakdown
    res.status(201).json({ 
      success: true, 
      message: "Booking created successfully",
      booking,
      pricingBreakdown: pricing
    });
    
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
});

// ==========================================
// GET ALL BOOKINGS (Admin)
// ==========================================
export const getAllBookings = asyncHandler(async (req, res) => {
  try {
    // Optional filters
    const { reservationType, park, status, visitorType } = req.query;
    
    let filter = {};
    
    if (reservationType) filter.reservationType = reservationType;
    if (park) filter.park = park;
    if (status) filter.paymentStatus = status;
    if (visitorType) filter.visitorType = visitorType;
    
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    
    // Calculate statistics
    const stats = {
      total: bookings.length,
      private: bookings.filter(b => b.reservationType === 'private').length,
      shared: bookings.filter(b => b.reservationType === 'shared').length,
      pending: bookings.filter(b => b.paymentStatus === 'pending').length,
      confirmed: bookings.filter(b => b.paymentStatus === 'confirmed').length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.total || 0), 0)
    };
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      stats,
      bookings
    });
    
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// GET BOOKING BY ID
// ==========================================
export const getBookingById = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    res.status(200).json({
      success: true,
      booking
    });
    
  } catch (err) {
    console.error("Get booking error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// UPDATE BOOKING
// ==========================================
export const updateBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    // If booking details changed, recalculate price
    const fieldsAffectingPrice = [
      'reservationType', 'jeepType', 'timeSlot', 'people', 
      'selectedSeats', 'guideOption', 'mealOption', 
      'includeBreakfast', 'includeLunch', 'visitorType'
    ];
    
    const priceFieldsChanged = fieldsAffectingPrice.some(
      field => req.body[field] !== undefined && req.body[field] !== booking[field]
    );
    
    if (priceFieldsChanged) {
      const updatedData = { ...booking.toObject(), ...req.body };
      const pricing = await calculatePricing(updatedData);
      req.body.total = pricing.totalPrice;
    }
    
    // Update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking
    });
    
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required"
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        ...(paymentMethod && { paymentMethod })
      },
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Payment status updated",
      booking
    });
    
  } catch (err) {
    console.error("Update payment status error:", err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// DELETE BOOKING
// ==========================================
export const deleteBooking = asyncHandler(async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      deletedBooking: booking
    });
    
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// CALCULATE PRICE PREVIEW (Before Booking)
// ==========================================
export const calculatePrice = asyncHandler(async (req, res) => {
  try {
    const pricing = await calculatePricing(req.body);
    
    res.status(200).json({
      success: true,
      message: "Price calculated successfully",
      pricing
    });
    
  } catch (err) {
    console.error("Calculate price error:", err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// GET BOOKINGS BY DATE
// ==========================================
export const getBookingsByDate = asyncHandler(async (req, res) => {
  try {
    const { date } = req.params;
    
    const bookings = await Booking.find({ selectedDate: date }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      date,
      count: bookings.length,
      bookings
    });
    
  } catch (err) {
    console.error("Get bookings by date error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// ==========================================
// GET USER BOOKINGS (by email or phone)
// ==========================================
export const getUserBookings = asyncHandler(async (req, res) => {
  try {
    const { email, phoneNumber } = req.query;
    
    if (!email && !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number required"
      });
    }
    
    let filter = {};
    if (email) filter.email = email;
    if (phoneNumber) filter.$or = [
      { phoneNumber: phoneNumber },
      { localContact: phoneNumber }
    ];
    
    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
    
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});