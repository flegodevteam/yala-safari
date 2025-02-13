import React, { useState } from "react";

const OnlineBooking = () => {
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    date: "",
    timeSlot: "",
    package: "",
    paymentMethod: "",
  });
  const [confirmation, setConfirmation] = useState("");

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmation(
      `Booking confirmed for ${booking.name} on ${booking.date} at ${booking.timeSlot}. Confirmation sent to ${booking.email}.`
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Book Now</h2>
      <form
        className="bg-white p-6 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        />
        <select
          name="timeSlot"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Time Slot</option>
          <option value="Morning">Morning (6 AM - 10 AM)</option>
          <option value="Afternoon">Afternoon (2 PM - 6 PM)</option>
        </select>
        <select
          name="package"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Safari Package</option>
          <option value="Wildlife Safari">Wildlife Safari</option>
          <option value="Luxury Safari">Luxury Safari</option>
          <option value="Budget Safari">Budget Safari</option>
        </select>
        <select
          name="paymentMethod"
          className="w-full p-2 border rounded-md mb-2"
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Confirm Booking
        </button>
      </form>
      {confirmation && (
        <div className="mt-4 p-4 bg-green-200 text-green-800 font-bold rounded-lg text-center">
          {confirmation}
        </div>
      )}
    </div>
  );
};

export default OnlineBooking;
