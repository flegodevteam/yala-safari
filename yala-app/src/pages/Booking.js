import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FiChevronDown,
  FiInfo,
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiDollarSign,
  FiCreditCard,
} from "react-icons/fi";

const Booking = () => {
  // Form state
  const [reservationType, setReservationType] = useState("private");
  const [location, setLocation] = useState("yala");
  const [block, setBlock] = useState("block1");
  const [visitorType, setVisitorType] = useState("foreign");
  const [packageType, setPackageType] = useState("basic");
  const [duration, setDuration] = useState("morning");
  const [mealOption, setMealOption] = useState("non-veg");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [numPersons, setNumPersons] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [hotelContact, setHotelContact] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [addOns, setAddOns] = useState({
    lunch: false,
    binoculars: false,
  });
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  


  // Pricing data
  const pricing = {
    private: {
      basic: { morning: 50, extendedMorning: 70, afternoon: 50, fullDay: 100 },
      luxury: {
        morning: 80,
        extendedMorning: 100,
        afternoon: 80,
        fullDay: 150,
      },
      superLuxury: {
        morning: 120,
        extendedMorning: 150,
        afternoon: 120,
        fullDay: 200,
      },
    },
    shared: {
      1: 10,
      2: 9,
      3: 8,
      4: 7,
      5: 5,
    },
    meals: {
      "non-veg": 15,
      veg: 10,
      none: 0,
    },
  };

  // Calculate total cost
  const calculateTotal = () => {
    let basePrice = 0;

    if (reservationType === "private") {
      basePrice = pricing.private[packageType][duration];
      // Jeep cost is divided by number of persons
      basePrice +=
        (packageType === "basic" ? 50 : packageType === "luxury" ? 80 : 120) /
        numPersons;
    } else {
      basePrice =
        numPersons >= 5 ? pricing.shared[5] : pricing.shared[numPersons];
    }

    // Add meal cost for foreign visitors
    if (visitorType === "foreign" && reservationType === "private") {
      basePrice += pricing.meals[mealOption];
    }
    if (addOns.lunch) basePrice += pricing.addOns.lunch;
    if (addOns.binoculars) basePrice += pricing.addOns.binoculars;
    return basePrice * numPersons;
  };

  const availableTimeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "01:00 PM",
    "02:00 PM",
  ];

   const handleAddOnChange = (e) => {
    setAddOns({ ...addOns, [e.target.name]: e.target.checked });
  };




const handleSubmit = async (e) => {
  e.preventDefault();

  const bookingData = {
    reservationType,
    location,
    block,
    packageType,
    duration,
    visitorType,
    mealOption,
    paymentMethod,
    numPersons,
    pickupLocation,
    whatsappNumber,
    hotelContact,
    accommodation,
    totalAmount: calculateTotal(),
    customerName,
      customerEmail,
      customerPhone,
      selectedDate,
      selectedTime,
      addOns,
      cardNumber: paymentMethod === "creditCard" ? cardNumber : undefined,
      cardExpiry: paymentMethod === "creditCard" ? cardExpiry : undefined,
      cardCvc: paymentMethod === "creditCard" ? cardCvc : undefined,
    // status is optional, backend defaults to "pending"
  };

  try {
    const response = await fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (response.ok) {
      setShowSummary(true);
    } else {
      const error = await response.json();
      alert("Booking failed: " + error.error);
    }
  } catch (err) {
    alert("Network error: " + err.message);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-800">
           Safari Booking
          </h1>
          <p className="mt-2 text-green-600">
            Experience the wild like never before
          </p>
        </div>

        {!showSummary ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <form onSubmit={handleSubmit}>
                {/* Reservation Type */}
                  <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2" /> Customer Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="p-2 border rounded"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      className="p-2 border rounded"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCalendar className="mr-2" /> Select Date & Time
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      minDate={new Date()}
                      placeholderText="Select a date"
                      className="p-2 border rounded"
                      required
                    />
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="p-2 border rounded"
                      required
                    >
                      <option value="">Select Time Slot</option>
                      {availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2" /> Reservation Type
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setReservationType("private")}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        reservationType === "private"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="font-medium">Private Safari</div>
                      <div className="text-sm mt-1 text-gray-500">
                        Exclusive jeep for your group
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReservationType("shared")}
                      className={`py-3 px-4 rounded-lg border-2 transition-all ${
                        reservationType === "shared"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="font-medium">Shared Safari</div>
                      <div className="text-sm mt-1 text-gray-500">
                        Join other travelers
                      </div>
                    </button>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiMapPin className="mr-2" /> Safari Location
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {["yala", "bundala", "udawalawa"].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocation(loc)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          location === loc
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        <div className="font-medium capitalize">{loc}</div>
                      </button>
                    ))}
                  </div>
                  {location === "yala" && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {["block1", "block4"].map((blk) => (
                        <button
                          key={blk}
                          type="button"
                          onClick={() => setBlock(blk)}
                          className={`py-2 px-4 rounded-lg border-2 transition-all ${
                            block === blk
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <div className="font-medium">
                            {blk === "block1" ? "Block I" : "Block IV"}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Package and Duration */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCalendar className="mr-2" /> Safari Package
                  </h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {["basic", "luxury", "superLuxury"].map((pkg) => (
                      <button
                        key={pkg}
                        type="button"
                        onClick={() => setPackageType(pkg)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all ${
                          packageType === pkg
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        disabled={reservationType === "shared"}
                      >
                        <div className="font-medium capitalize">
                          {pkg === "basic"
                            ? "Basic G"
                            : pkg === "luxury"
                            ? "Luxury"
                            : "Super Luxury"}
                        </div>
                        {reservationType === "shared" && (
                          <div className="text-xs mt-1 text-gray-500">
                            Only for private
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
                    <FiClock className="mr-2" /> Duration
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { value: "morning", label: "Morning (3-4hrs)" },
                      { value: "extendedMorning", label: "Extended Morning" },
                      { value: "afternoon", label: "Afternoon (3-4hrs)" },
                      { value: "fullDay", label: "Full Day" },
                    ].map((time) => (
                      <button
                        key={time.value}
                        type="button"
                        onClick={() => setDuration(time.value)}
                        className={`py-2 px-3 rounded-lg border-2 transition-all ${
                          duration === time.value
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        disabled={reservationType === "shared"}
                      >
                        <div className="font-medium">{time.label}</div>
                        {reservationType === "private" && (
                          <div className="text-xs text-gray-500">
                            ${pricing.private[packageType][time.value]}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visitor Details */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Visitor Information
                  </h2>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visitor Type
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        {["foreign", "local"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setVisitorType(type)}
                            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                              visitorType === type
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {type === "foreign" ? "Foreign" : "Local"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="numPersons"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Number of Persons
                      </label>
                      <select
                        id="numPersons"
                        value={numPersons}
                        onChange={(e) =>
                          setNumPersons(parseInt(e.target.value))
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {visitorType === "foreign" &&
                    reservationType === "private" && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meal Option
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                          {["non-veg", "veg", "none"].map((meal) => (
                            <button
                              key={meal}
                              type="button"
                              onClick={() => setMealOption(meal)}
                              className={`py-2 px-3 rounded-lg border-2 transition-all ${
                                mealOption === meal
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-200 hover:border-green-300"
                              }`}
                            >
                              <div className="font-medium capitalize">
                                {meal === "non-veg"
                                  ? "Non-Veg"
                                  : meal === "veg"
                                  ? "Vegetarian"
                                  : "No Meal"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {meal !== "none"
                                  ? `+$${pricing.meals[meal]}`
                                  : ""}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="accommodation"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Accommodation Details
                      </label>
                      <input
                        type="text"
                        id="accommodation"
                        value={accommodation}
                        onChange={(e) => setAccommodation(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="pickupLocation"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pickup Location (GPS + Description)
                      </label>
                      <input
                        type="text"
                        id="pickupLocation"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="whatsappNumber"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          id="whatsappNumber"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="hotelContact"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Hotel Contact Number
                        </label>
                        <input
                          type="tel"
                          id="hotelContact"
                          value={hotelContact}
                          onChange={(e) => setHotelContact(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCreditCard className="mr-2" /> Payment Method
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {reservationType === "private" ? (
                      <>
                        {["cash", "bankDeposit", "bankTransfer"].map(
                          (method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-3 px-4 rounded-lg border-2 transition-all ${
                                paymentMethod === method
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-200 hover:border-green-300"
                              }`}
                            >
                              <div className="font-medium capitalize">
                                {method === "bankDeposit"
                                  ? "Bank Deposit"
                                  : method === "bankTransfer"
                                  ? "Bank Transfer"
                                  : "Cash"}
                              </div>
                            </button>
                          )
                        )}
                      </>
                    ) : (
                      <div className="col-span-3 py-3 px-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700">
                        <div className="font-medium">
                          Bank Transfer (Required for Shared Safaris)
                        </div>
                      </div>
                    )}
                  </div>
                  {paymentMethod === "bankDeposit" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Deposit Slip
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      Estimated Total
                    </h3>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {reservationType === "private" ? (
                      <p>
                        Includes jeep and entry fees for {numPersons} person(s)
                      </p>
                    ) : (
                      <p>Shared safari rate for {numPersons} person(s)</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-green-700">
                  Booking Confirmation
                </h2>
                <p className="text-green-600 mt-2">
                  Your safari adventure is booked!
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reservation Type:</span>
                    <span className="font-medium">
                      {reservationType === "private"
                        ? "Private Safari"
                        : "Shared Safari"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium capitalize">
                      {location === "yala"
                        ? `Yala (${
                            block === "block1" ? "Block I" : "Block IV"
                          })`
                        : location}
                    </span>
                  </div>
                  {reservationType === "private" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package:</span>
                        <span className="font-medium capitalize">
                          {packageType === "basic"
                            ? "Basic G"
                            : packageType === "luxury"
                            ? "Luxury"
                            : "Super Luxury"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {duration === "morning"
                            ? "Morning (3-4hrs)"
                            : duration === "extendedMorning"
                            ? "Extended Morning"
                            : duration === "afternoon"
                            ? "Afternoon (3-4hrs)"
                            : "Full Day"}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visitor Type:</span>
                    <span className="font-medium">
                      {visitorType === "foreign" ? "Foreign" : "Local"}
                    </span>
                  </div>
                  {visitorType === "foreign" &&
                    reservationType === "private" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meal Option:</span>
                        <span className="font-medium capitalize">
                          {mealOption === "non-veg"
                            ? "Non-Vegetarian"
                            : mealOption === "veg"
                            ? "Vegetarian"
                            : "No Meal"}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Persons:</span>
                    <span className="font-medium">{numPersons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">
                      {paymentMethod === "bankDeposit"
                        ? "Bank Deposit"
                        : paymentMethod === "bankTransfer"
                        ? "Bank Transfer"
                        : "Cash"}
                    </span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">
                      Total Amount:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Accommodation:</span>{" "}
                    {accommodation}
                  </p>
                  <p>
                    <span className="font-medium">Pickup Location:</span>{" "}
                    {pickupLocation}
                  </p>
                  <p>
                    <span className="font-medium">WhatsApp:</span>{" "}
                    {whatsappNumber}
                  </p>
                  <p>
                    <span className="font-medium">Hotel Contact:</span>{" "}
                    {hotelContact}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      We'll contact you via WhatsApp within 24 hours to confirm
                      your booking details and provide payment instructions if
                      needed.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSummary(false)}
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
