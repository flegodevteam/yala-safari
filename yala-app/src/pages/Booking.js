import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Booking() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    participants: 1,
    date: "",
    timeSlot: "",
    addOns: {
      lunch: false,
      binoculars: false,
      guide: false,
    },
    paymentMethod: "credit-card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableDates = generateAvailableDates();
  const timeSlots = ["08:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  function generateAvailableDates() {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("addOns.")) {
      const addOnName = name.split(".")[1];
      setBookingData((prev) => ({
        ...prev,
        addOns: {
          ...prev.addOns,
          [addOnName]: checked,
        },
      }));
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const calculateTotal = () => {
    const basePrice = 50 * bookingData.participants;
    let addOnsTotal = 0;

    if (bookingData.addOns.lunch) addOnsTotal += 15 * bookingData.participants;
    if (bookingData.addOns.binoculars)
      addOnsTotal += 5 * bookingData.participants;
    if (bookingData.addOns.guide) addOnsTotal += 20;

    return basePrice + addOnsTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the POST API
      const response = await axios.post("http://localhost:5000/api/bookings/", {
        ...bookingData,
        total: calculateTotal(),
      });

      // Handle success
      console.log("Booking submitted:", response.data);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        navigate("/booking-confirmation", {
          state: { bookingData, total: calculateTotal() },
        });
      }, 2000);
    } catch (error) {
      // Handle error
      console.error("Error submitting booking:", error);
      setIsSubmitting(false);
      alert("Failed to submit booking. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-md">
      {/* Progress Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Complete Your Booking
        </h2>
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${
                  currentStep >= step
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-xs mt-2 ${
                  currentStep >= step
                    ? "text-green-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step === 1 && "Details"}
                {step === 2 && "Extras"}
                {step === 3 && "Payment"}
              </span>
            </div>
          ))}
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className="h-1 bg-green-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600">
            Redirecting to your booking details...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="participants"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Participants{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="participants"
                    name="participants"
                    value={bookingData.participants}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Date <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Choose a date</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="timeSlot"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="timeSlot"
                    name="timeSlot"
                    value={bookingData.timeSlot}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    !bookingData.name ||
                    !bookingData.email ||
                    !bookingData.phone ||
                    !bookingData.date ||
                    !bookingData.timeSlot
                  }
                  className={`px-6 py-2 rounded-lg font-medium ${
                    !bookingData.name ||
                    !bookingData.email ||
                    !bookingData.phone ||
                    !bookingData.date ||
                    !bookingData.timeSlot
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Next: Add Extras
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add-ons */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Enhance Your Experience
              </h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="lunch"
                      name="addOns.lunch"
                      type="checkbox"
                      checked={bookingData.addOns.lunch}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="lunch"
                      className="font-medium text-gray-700"
                    >
                      Lunch Package - $15 per person
                    </label>
                    <p className="text-sm text-gray-500">
                      Delicious local meal with bottled water
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="binoculars"
                      name="addOns.binoculars"
                      type="checkbox"
                      checked={bookingData.addOns.binoculars}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="binoculars"
                      className="font-medium text-gray-700"
                    >
                      Binocular Rental - $5 per person
                    </label>
                    <p className="text-sm text-gray-500">
                      High-quality binoculars for better wildlife viewing
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="guide"
                      name="addOns.guide"
                      type="checkbox"
                      checked={bookingData.addOns.guide}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label
                      htmlFor="guide"
                      className="font-medium text-gray-700"
                    >
                      Expert Guide - $20 flat rate
                    </label>
                    <p className="text-sm text-gray-500">
                      Private guide with specialized wildlife knowledge
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Booking Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Base Price ({bookingData.participants}{" "}
                      {bookingData.participants === 1 ? "person" : "people"})
                    </span>
                    <span>${50 * bookingData.participants}</span>
                  </div>
                  {bookingData.addOns.lunch && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lunch Package</span>
                      <span>${15 * bookingData.participants}</span>
                    </div>
                  )}
                  {bookingData.addOns.binoculars && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Binocular Rental</span>
                      <span>${5 * bookingData.participants}</span>
                    </div>
                  )}
                  {bookingData.addOns.guide && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expert Guide</span>
                      <span>$20</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700"
                >
                  Next: Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Payment Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData((prev) => ({
                          ...prev,
                          paymentMethod: "credit-card",
                        }))
                      }
                      className={`p-3 border rounded-lg flex items-center justify-center ${
                        bookingData.paymentMethod === "credit-card"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <svg
                        className="h-6 w-6 mr-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData((prev) => ({
                          ...prev,
                          paymentMethod: "paypal",
                        }))
                      }
                      className={`p-3 border rounded-lg flex items-center justify-center ${
                        bookingData.paymentMethod === "paypal"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <svg
                        className="h-6 w-6 mr-2 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7.5 11.5c0 .833.667 1.5 1.5 1.5h3.5v-1.5H9v-1h2v-1.5H9v-1h2.5V6H9c-.833 0-1.5.667-1.5 1.5v4zm6 0c0 .833.667 1.5 1.5 1.5h1.5v-1.5H15v-1h1v-1.5h-1v-1h1.5V6H15c-.833 0-1.5.667-1.5 1.5v4zm6-6v12c0 1.104-.896 2-2 2H6c-1.104 0-2-.896-2-2V6c0-1.104.896-2 2-2h12c1.104 0 2 .896 2 2z" />
                      </svg>
                      PayPal
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBookingData((prev) => ({
                          ...prev,
                          paymentMethod: "cash",
                        }))
                      }
                      className={`p-3 border rounded-lg flex items-center justify-center ${
                        bookingData.paymentMethod === "cash"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    >
                      <svg
                        className="h-6 w-6 mr-2 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Cash on Arrival
                    </button>
                  </div>
                </div>

                {bookingData.paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={bookingData.cardNumber}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="cardExpiry"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={bookingData.cardExpiry}
                          onChange={handleChange}
                          placeholder="MM/YY"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cardCvc"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          CVC <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={bookingData.cardCvc}
                          onChange={handleChange}
                          placeholder="123"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {bookingData.paymentMethod === "paypal" && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You will be redirected to PayPal to complete your
                          payment after submitting this form.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {bookingData.paymentMethod === "cash" && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Please bring exact change for your payment on the day
                          of your safari.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">
                  Final Booking Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span>
                      {bookingData.date
                        ? new Date(bookingData.date).toLocaleDateString(
                            "en-US",
                            { weekday: "short", month: "short", day: "numeric" }
                          )
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span>{bookingData.timeSlot || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants</span>
                    <span>{bookingData.participants}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
                    <span>Total Amount</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (bookingData.paymentMethod === "credit-card" &&
                      (!bookingData.cardNumber ||
                        !bookingData.cardExpiry ||
                        !bookingData.cardCvc))
                  }
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isSubmitting ||
                    (bookingData.paymentMethod === "credit-card" &&
                      (!bookingData.cardNumber ||
                        !bookingData.cardExpiry ||
                        !bookingData.cardCvc))
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
