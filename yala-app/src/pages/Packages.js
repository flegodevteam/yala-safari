import { useState, useEffect } from "react";
import yalaImage from "../assets/yaala.png";
import bundalaImage from "../assets/bundala.jpg";
import udawalaweImage from "../assets/bund.jpg";
import jeepImage from "../assets/tour.jpg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Calendar from "react-calendar";
import Modal from "react-modal";
import jeep1 from "../assets/a1.jpeg";
import jeep2 from "../assets/a2.jpeg";
import jeep3 from "../assets/a3.jpeg";
import jeep4 from "../assets/a4.jpeg";
import jeep5 from "../assets/a5.jpeg";
import jeep6 from "../assets/a6.jpeg";
import jeep7 from "../assets/a7.jpeg";

const breakfastMenuItemsVeg = [
  { name: "Fresh tropical fruits", price: 2 },
  { name: "Toast & butter/jam", price: 1 },
  { name: "Local Sri Lankan pancakes", price: 1.5 },
  { name: "Tea or coffee", price: 1 },
];

const breakfastMenuItemsNonVeg = [
  { name: "Fresh tropical fruits", price: 2 },
  { name: "Pasta (any style)", price: 1.5 },
  { name: "Sandwiches", price: 1 },
  { name: "Local Sri Lankan pancakes", price: 1.5 },
  { name: "Tea or coffee", price: 1 },
];

const lunchMenuItemsVeg = [
  { name: "Rice & curry (veg)", price: 3 },
  { name: "Fresh salad", price: 1.5 },
  { name: "Seasonal fruit dessert", price: 1.5 },
  { name: "Bottled water & soft drink", price: 1 },
];

const lunchMenuItemsNonVeg = [
  { name: "Rice & curry (non-veg)", price: 3 },
  { name: "Grilled chicken or fish", price: 2.5 },
  { name: "Fresh salad", price: 1.5 },
  { name: "Seasonal fruit dessert", price: 1.5 },
  { name: "Bottled water & soft drink", price: 1 },
];

const jeepImages = [jeep1, jeep2, jeep3, jeep4, jeep5, jeep6, jeep7];

const Packages = () => {
  // State management
  const [reservationType, setReservationType] = useState("private");
  const [park, setPark] = useState("yala");
  const [block, setBlock] = useState("blockI");
  const [jeepType, setJeepType] = useState("basic");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [guideOption, setGuideOption] = useState("driver");
  const [visitorType, setVisitorType] = useState("foreign");
  const [mealOption, setMealOption] = useState("without");
  const [vegOption, setVegOption] = useState("non-veg");
  const [includeEggs, setIncludeEggs] = useState(false);
  const [includeLunch, setIncludeLunch] = useState(false);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [people, setPeople] = useState(1);
  const navigate = useNavigate();
  const [privateDate, setPrivateDate] = useState(new Date());
  const [pickupLocation, setPickupLocation] = useState("");
  const [hotelWhatsapp, setHotelWhatsapp] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [localContact, setLocalContact] = useState("");
  const [localAccommodation, setLocalAccommodation] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [sharedSelectedDate, setSharedSelectedDate] = useState(null);
  const [sharedSelectedSeat, setSharedSelectedSeat] = useState(null);
  const [sharedBookedSeats, setSharedBookedSeats] = useState([2, 5]);
  const [availableJeeps, setAvailableJeeps] = useState([]);
  const [selectedJeep, setSelectedJeep] = useState(null);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [privateAvailableDates, setPrivateAvailableDates] = useState([]);
  const [showJeepPopup, setShowJeepPopup] = useState(false);
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [selectedJeepIndex, setSelectedJeepIndex] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [formError, setFormError] = useState(""); // Validation error state

  // Example: already booked seats for each jeep (array of arrays)
  const [bookedSeats, setBookedSeats] = useState([
    [2, 5], // jeep 0
    [1], // jeep 1
    [], // jeep 2
    [3, 4], // jeep 3
    [6], // jeep 4
    [1, 2, 3, 4, 5, 6], // jeep 5 (fully booked)
    [], // jeep 6
  ]);

  useEffect(() => {
    if (reservationType === "private") {
      fetch(`http://localhost:5000/api/availability?type=private&park=${park}`)
        .then((res) => res.json())
        .then((data) => {
          setPrivateAvailableDates(data.dates || []);
        })
        .catch(() => setPrivateAvailableDates([]));
    }
  }, [reservationType, park]);

  const [selectedBreakfastItems, setSelectedBreakfastItems] = useState(
    (vegOption === "veg"
      ? breakfastMenuItemsVeg
      : breakfastMenuItemsNonVeg
    ).map((item) => item.name)
  );
  const [selectedLunchItems, setSelectedLunchItems] = useState(
    (vegOption === "veg" ? lunchMenuItemsVeg : lunchMenuItemsNonVeg).map(
      (item) => item.name
    )
  );

  const getBreakfastMenu = () => {
    return vegOption === "veg"
      ? breakfastMenuItemsVeg
      : breakfastMenuItemsNonVeg;
  };
  const getLunchMenu = () => {
    return vegOption === "veg" ? lunchMenuItemsVeg : lunchMenuItemsNonVeg;
  };

  useEffect(() => {
    setSelectedBreakfastItems(getBreakfastMenu().map((item) => item.name));
    setSelectedLunchItems(getLunchMenu().map((item) => item.name));
  }, [vegOption]);

  const parkImages = {
    yala: yalaImage,
    bundala: bundalaImage,
    udawalawe: udawalaweImage,
  };

  const defaultpricing = {
    jeep: {
      basic: { morning: 5, afternoon: 5, extended: 7, fullDay: 10 },
      luxury: { morning: 7, afternoon: 7, extended: 9, fullDay: 12 },
      superLuxury: { morning: 10, afternoon: 10, extended: 12, fullDay: 15 },
    },
    shared: {
      1: 10,
      2: 8,
      3: 7,
      4: 5,
      5: 5,
      6: 5,
      7: 5,
    },
    meals: {
      breakfast: 5,
      lunch: 6,
    },
    guide: {
      driver: 0,
      driverGuide: 10,
      separateGuide: 15,
    },
  };
  const [pricing, setPricing] = useState(defaultpricing);

  useEffect(() => {
    fetch("http://localhost:5000/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.jeep && data.shared && data.meals && data.guide)
          setPricing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (reservationType === "shared" && park === "yala") {
      setAvailableDates([
        "2025-07-05",
        "2025-07-06",
        "2025-07-08",
        "2025-07-10",
      ]);
    } else {
      setAvailableDates([]);
    }
  }, [reservationType, park]);

  if (
    loading ||
    !pricing ||
    !pricing.jeep ||
    !pricing.shared ||
    !pricing.meals ||
    !pricing.guide
  ) {
    return <div className="p-8">Loading...</div>;
  }

  const calculateTotal = () => {
    let total = 0;
    if (reservationType === "private") {
      const jeepPrice = pricing.jeep[jeepType][timeSlot];
      const guidePrice = pricing.guide[guideOption];
      total = jeepPrice * people + guidePrice;
    } else {
      total = pricing.shared[Math.min(people, 7)] * people;
    }
    if (mealOption === "with") {
      if (includeBreakfast) {
        total +=
          getBreakfastMenu()
            .filter((item) => selectedBreakfastItems.includes(item.name))
            .reduce((sum, item) => sum + item.price, 0) * people;
      }
      if (includeLunch) {
        total +=
          getLunchMenu()
            .filter((item) => selectedLunchItems.includes(item.name))
            .reduce((sum, item) => sum + item.price, 0) * people;
      }
    }
    return total.toFixed(2);
  };

  const handleBreakfastItemChange = (itemName) => {
    setSelectedBreakfastItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleLunchItemChange = (itemName) => {
    setSelectedLunchItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  };

  const reservationDate =
    reservationType === "shared" && sharedSelectedDate
      ? moment(sharedSelectedDate).format("MMMM D, YYYY")
      : reservationType === "private" && privateDate
      ? moment(privateDate).format("MMMM D, YYYY")
      : selectedDate
      ? moment(selectedDate).format("MMMM D, YYYY")
      : "-";
  const reservationSeat =
    reservationType === "shared" && sharedSelectedSeat
      ? sharedSelectedSeat
      : selectedSeats
      ? selectedSeats
      : "-";

  const handleConfirmBooking = async () => {
    // Validation
    if (!fullName.trim()) {
      setFormError("Full Name is required.");
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError("Phone Number is required.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Valid Email is required.");
      return;
    }
    if (
      reservationType === "shared" &&
      (selectedJeepIndex === null || selectedSeat === null)
    ) {
      setFormError("Please select your jeep and seat.");
      return;
    }
    setFormError("");

    const bookingData = {
      reservationType,
      park,
      block,
      jeepType,
      timeSlot,
      guideOption,
      visitorType,
      people,
      fullName,
      phoneNumber,
      email,
      pickupLocation,
      hotelWhatsapp,
      accommodation,
      passportNumber,
      nicNumber,
      localContact,
      localAccommodation,
      seat:
        reservationType === "shared" &&
        selectedJeepIndex !== null &&
        selectedSeat
          ? `Jeep ${selectedJeepIndex + 1}, Seat ${selectedSeat}`
          : reservationSeat,
      date: reservationDate,
      mealOption,
      vegOption,
      includeEggs,
      includeLunch,
      includeBreakfast,
      selectedBreakfastItems,
      selectedLunchItems,
      total: calculateTotal(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        navigate("/booking", {
          state: { total: calculateTotal(), email: email },
        });
      } else {
        setFormError("Booking failed. Please try again.");
      }
    } catch (err) {
      setFormError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with Hero Image */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-64">
          <img
            src={parkImages[park]}
            alt={park}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                Wildlife Safari Adventure
              </h1>
              <p className="text-xl text-green-100">
                Book your unforgettable jungle experience
              </p>
            </div>
          </div>
        </div>

        {/* Main Booking Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="flex divide-x divide-gray-200 border-b border-gray-200">
            {["Reservation", "Park", "Jeep", "Guide", "Meals", "Summary"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex-1 py-4 text-center font-medium text-green-700"
                >
                  {step}
                </div>
              )
            )}
          </div>

          <div className="p-6 md:p-8">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  1
                </span>
                Choose Your Safari Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setReservationType("private")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                    reservationType === "private"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 ${
                        reservationType === "private"
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Private Safari
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Exclusive jeep for your group. Available at all parks.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Flexible timing
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Personalized experience
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Show calendar for private safari */}
                  {reservationType === "private" && (
                    <div className="mt-6">
                      <label className="block font-semibold mb-2">
                        Select Date
                      </label>
                      <Calendar
                        value={privateDate}
                        onChange={setPrivateDate}
                        minDate={new Date()}
                        maxDate={
                          new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                        }
                        tileDisabled={({ date, view }) =>
                          view === "month" &&
                          privateAvailableDates.length > 0 &&
                          !privateAvailableDates.includes(
                            date.toISOString().slice(0, 10)
                          )
                        }
                        tileClassName={({ date, view }) =>
                          view === "month" &&
                          privateDate &&
                          date.toDateString() ===
                            new Date(privateDate).toDateString()
                            ? "react-calendar__tile--active bg-green-600 text-white rounded-full shadow font-bold"
                            : "rounded-full"
                        }
                      />
                      <div className="mt-2 text-sm text-gray-600">
                        Selected:{" "}
                        {privateDate
                          ? moment(privateDate).format("MMMM D, YYYY")
                          : "None"}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  onClick={() => setReservationType("shared")}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                    reservationType === "shared"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex-shrink-0 ${
                        reservationType === "shared"
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    ></div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Shared Safari
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Join other guests for a cost-effective safari
                        experience.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Fixed departure times
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          Share the adventure with others
                        </li>
                      </ul>
                    </div>
                  </div>
                  {reservationType === "shared" && (
                    <div className="mt-6">
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                        onClick={() => setShowDatePopup(true)}
                      >
                        Select Date
                      </button>
                    </div>
                  )}
                </div>
                {/* Date Selection Popup */}
                <Modal
                  isOpen={reservationType === "shared" && showBookingSection}
                  onRequestClose={() => setShowBookingSection(false)}
                  className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-32"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setShowBookingSection(false);
                      navigate("/booking", {
                        state: { total: calculateTotal() },
                      });
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200"
                        onClick={() => setShowBookingSection(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-green-600 text-white"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </Modal>

                {/* Date Selection Popup */}
                <Modal
                  isOpen={showDatePopup}
                  onRequestClose={() => setShowDatePopup(false)}
                  className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-32"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <h2 className="text-xl font-bold mb-4">
                    Select Your Safari Date
                  </h2>
                  <Calendar
                    value={sharedSelectedDate}
                    onChange={setSharedSelectedDate}
                    minDate={new Date()}
                    tileClassName={({ date, view }) =>
                      view === "month" &&
                      sharedSelectedDate &&
                      date.toDateString() === sharedSelectedDate.toDateString()
                        ? "react-calendar__tile--active bg-green-600 text-white rounded-full shadow font-bold"
                        : "rounded-full"
                    }
                    className="border rounded-xl shadow mb-6 p-2"
                  />
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      className="px-4 py-2 rounded bg-gray-200"
                      onClick={() => setShowDatePopup(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white"
                      disabled={!sharedSelectedDate}
                      onClick={() => {
                        setShowDatePopup(false);
                        setShowJeepPopup(true); // Show jeep selection popup
                      }}
                    >
                      OK
                    </button>
                  </div>
                </Modal>

                {/* Jeep Selection Popup */}
                <Modal
                  isOpen={showJeepPopup}
                  onRequestClose={() => setShowJeepPopup(false)}
                  className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mt-32"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <h2 className="text-xl font-bold mb-6">
                    Please select your jeep{" "}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {jeepImages.map((img, idx) => {
                      const isFullyBooked = bookedSeats[idx].length === 6;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!isFullyBooked) {
                              setSelectedJeepIndex(idx);
                              setShowJeepPopup(false);
                              setShowSeatPopup(true);
                            }
                          }}
                          className={`rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center p-2
            ${
              isFullyBooked
                ? "opacity-50 grayscale cursor-not-allowed border-gray-300"
                : ""
            }
            ${
              selectedJeepIndex === idx
                ? "border-green-600 ring-2 ring-green-400"
                : "border-gray-200 hover:border-green-400"
            }
          `}
                          disabled={isFullyBooked}
                        >
                          <img
                            src={img}
                            alt={`Jeep ${idx + 1}`}
                            className="w-32 h-24 object-cover mb-2 rounded"
                          />
                          <span className="font-semibold">Jeep {idx + 1}</span>
                          {isFullyBooked && (
                            <span className="text-xs text-red-500 mt-1">
                              Fully Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      className="px-4 py-2 rounded bg-gray-200"
                      onClick={() => {
                        setShowJeepPopup(false);
                        setShowDatePopup(true);
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white"
                      disabled={selectedJeepIndex === null}
                      onClick={() => {
                        setShowJeepPopup(false);
                        setShowSeatPopup(true);
                      }}
                    >
                      Next
                    </button>
                  </div>
                </Modal>

                {/* Seat Selection Popup */}
                <Modal
                  isOpen={showSeatPopup}
                  onRequestClose={() => setShowSeatPopup(false)}
                  className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto mt-32"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                >
                  <h2 className="text-xl font-bold mb-6">
                    Please select your seat
                  </h2>
                  <div className="flex flex-wrap gap-4 justify-center mb-6">
                    {[1, 2, 3, 4, 5, 6].map((seat) => {
                      const isBooked =
                        bookedSeats[selectedJeepIndex]?.includes(seat);
                      return (
                        <button
                          key={seat}
                          disabled={isBooked}
                          onClick={() => setSelectedSeat(seat)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2
            ${
              isBooked
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : ""
            }
            ${
              selectedSeat === seat
                ? "bg-green-600 text-white border-green-700"
                : "bg-white border-gray-300 hover:bg-green-100"
            }
          `}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button
                      className="px-4 py-2 rounded bg-gray-200"
                      onClick={() => {
                        setShowSeatPopup(false);
                        setShowJeepPopup(true);
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-green-600 text-white"
                      disabled={selectedSeat === null}
                      onClick={() => {
                        setShowSeatPopup(false);
                        // Proceed to next step or save selection
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </Modal>
              </div>
            </section>

            {/* 2. Park Selection */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  2
                </span>
                Select Your Wildlife Destination
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    id: "yala",
                    name: "Yala National Park",
                    description: "Famous for leopards and elephants",
                  },
                  {
                    id: "bundala",
                    name: "Bundala National Park",
                    description: "Birdwatcher's paradise",
                  },
                  {
                    id: "udawalawe",
                    name: "Udawalawe National Park",
                    description: "Elephant sightings guaranteed",
                  },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPark(p.id)}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      park === p.id
                        ? "ring-2 ring-green-500"
                        : "hover:shadow-md"
                    }`}
                  >
                    <img
                      src={parkImages[p.id]}
                      alt={p.name}
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {park === "yala" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3">Select Yala Block:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Block I", "Block II", "Block III & IV", "Block V"].map(
                      (blk) => (
                        <button
                          key={blk}
                          onClick={() =>
                            setBlock(
                              blk
                                .toLowerCase()
                                .replace(" & ", "")
                                .replace(" ", "")
                            )
                          }
                          className={`py-2 px-3 rounded text-sm ${
                            block ===
                            blk
                              .toLowerCase()
                              .replace(" & ", "")
                              .replace(" ", "")
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {blk}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* 3. Jeep Options */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  3
                </span>
                Choose Your Safari Vehicle
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    id: "basic",
                    name: "Basic Jeep",
                    features: [
                      "Standard seating",
                      "Pop-up roof",
                      "Basic comfort",
                    ],
                  },
                  {
                    id: "luxury",
                    name: "Luxury Jeep",
                    features: [
                      "Comfortable seats",
                      "Large viewing roof",
                      "Charging ports",
                    ],
                  },
                  {
                    id: "superLuxury",
                    name: "Super Luxury",
                    features: [
                      "Premium seats",
                      "360° viewing",
                      "Refreshments included",
                    ],
                  },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={
                      reservationType === "private"
                        ? () => setJeepType(type.id)
                        : undefined
                    }
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all
          ${
            reservationType === "private"
              ? jeepType === type.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
              : "border-gray-200 bg-white pointer-events-none opacity-60"
          }
        `}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{type.name}</h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        {/* Show dynamic price range */}$
                        {pricing.jeep[type.id]
                          ? `${pricing.jeep[type.id].morning}-${
                              pricing.jeep[type.id].fullDay
                            }`
                          : "-"}
                      </span>
                    </div>
                    <img
                      src={jeepImage}
                      alt={type.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <ul className="text-sm text-gray-600 space-y-1">
                      {type.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg
                            className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            {/* Time Slots */}
            <section className="mb-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {
                    id: "morning",
                    name: "Morning",
                    time: "5:30 AM - 9:30 AM",
                  },
                  {
                    id: "afternoon",
                    name: "Afternoon",
                    time: "2:30 PM - 6:30 PM",
                  },
                  {
                    id: "extended",
                    name: "Extended",
                    time: "5:30 AM - 12:00 PM",
                  },
                  {
                    id: "fullDay",
                    name: "Full Day",
                    time: "5:30 AM - 6:30 PM",
                  },
                ].map((slot) => (
                  <div
                    key={slot.id}
                    onClick={() => setTimeSlot(slot.id)}
                    className={`border rounded-lg p-3 cursor-pointer ${
                      timeSlot === slot.id
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{slot.name}</div>
                    <div className="text-sm text-gray-600">{slot.time}</div>
                    <div className="text-green-700 font-medium mt-1">
                      {/* Show dynamic price for selected jeep type and slot */}
                      {pricing.jeep[jeepType] && pricing.jeep[jeepType][slot.id]
                        ? `$${pricing.jeep[jeepType][slot.id]}`
                        : "-"}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Guide Options */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  4
                </span>
                Select Your Guide Option
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    id: "driver",
                    name: "Driver Only",
                    description:
                      "Basic transportation with a driver who knows the routes",
                  },
                  {
                    id: "driverGuide",
                    name: "Driver + Guide",
                    description:
                      "Driver who also serves as your wildlife guide",
                  },
                  {
                    id: "separateGuide",
                    name: "Separate Guide",
                    description:
                      "Dedicated driver and professional wildlife guide",
                  },
                ].map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setGuideOption(option.id)}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      guideOption === option.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{option.name}</h3>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        +${pricing.guide[option.id]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {option.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Visitor & Meal Options */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  5
                </span>
                Visitor Details & Meal Options
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visitor Type & People */}
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Visitor Type:</h3>
                    <div className="flex gap-3">
                      {["foreign", "local"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setVisitorType(type)}
                          className={`px-4 py-2 rounded capitalize ${
                            visitorType === type
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {type} Visitor
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Number of People:</h3>
                  </div>
                  {/* Foreign visitor fields */}
                  {visitorType === "foreign" && (
                    <div className="space-y-4 mt-6">
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="fullName"
                        >
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="pickupLocation"
                        >
                          Pickup Location
                        </label>
                        <input
                          id="pickupLocation"
                          type="text"
                          value={pickupLocation || ""}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter pickup location"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="hotelWhatsapp"
                        >
                          Hotel WhatsApp Number
                        </label>
                        <input
                          id="hotelWhatsapp"
                          type="text"
                          value={hotelWhatsapp || ""}
                          onChange={(e) => setHotelWhatsapp(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter WhatsApp number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="accommodation"
                        >
                          Accommodation Details
                        </label>
                        <input
                          id="accommodation"
                          type="text"
                          value={accommodation || ""}
                          onChange={(e) => setAccommodation(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter accommodation details"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="passportNumber"
                        >
                          Passport Number
                        </label>
                        <input
                          id="passportNumber"
                          type="text"
                          value={passportNumber || ""}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter passport number"
                        />
                      </div>
                    </div>
                  )}

                  {/* Extra fields for local visitors */}
                  {visitorType === "local" && (
                    <div className="space-y-4 mt-6">
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="fullName"
                        >
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter your email address"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="nicNumber"
                        >
                          NIC Number
                        </label>
                        <input
                          id="nicNumber"
                          type="text"
                          value={nicNumber}
                          onChange={(e) => setNicNumber(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter NIC number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="localContact"
                        >
                          Contact Number
                        </label>
                        <input
                          id="localContact"
                          type="text"
                          value={localContact}
                          onChange={(e) => setLocalContact(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter contact number"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="localAccommodation"
                        >
                          Accommodation Details
                        </label>
                        <input
                          id="localAccommodation"
                          type="text"
                          value={localAccommodation}
                          onChange={(e) =>
                            setLocalAccommodation(e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Enter accommodation details"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 12H4"
                        ></path>
                      </svg>
                    </button>
                    <span className="text-2xl font-bold w-10 text-center">
                      {people}
                    </span>
                    <button
                      onClick={() => setPeople(Math.min(7, people + 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Max 7 people for shared safaris
                  </p>
                </div>

                {/* Meal Options */}
                <div>
                  <h3 className="font-medium mb-3">Meal Options:</h3>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setMealOption("with")}
                      className={`px-4 py-2 rounded ${
                        mealOption === "with"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      With Meals
                    </button>
                    <button
                      onClick={() => setMealOption("without")}
                      className={`px-4 py-2 rounded ${
                        mealOption === "without"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Without Meals
                    </button>
                  </div>

                  {mealOption === "with" && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Meal Type:</h4>
                        <div className="flex gap-3">
                          {["non-veg", "veg"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setVegOption(type)}
                              className={`px-3 py-1 rounded text-sm capitalize ${
                                vegOption === type
                                  ? "bg-green-600 text-white"
                                  : "bg-white border border-gray-300 hover:bg-gray-100"
                              }`}
                            >
                              {type.replace("-", " ")}
                            </button>
                          ))}
                        </div>
                      </div>

                      {vegOption === "veg" && (
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="includeEggs"
                            checked={includeEggs}
                            onChange={() => setIncludeEggs(!includeEggs)}
                            className="mr-2 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                          <label htmlFor="includeEggs" className="select-none">
                            Include Eggs
                          </label>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="breakfast"
                              checked={includeBreakfast}
                              onChange={() =>
                                setIncludeBreakfast(!includeBreakfast)
                              }
                              className="mr-2 h-5 w-5 text-green-600 rounded border-gray-300"
                            />
                            <label htmlFor="breakfast" className="font-medium">
                              Breakfast
                            </label>
                          </div>
                        </div>
                        {includeBreakfast && (
                          <div className="ml-8 mb-2 text-sm text-gray-600">
                            <div className="font-semibold mb-1">
                              Select your breakfast items:
                            </div>
                            <ul className="list-disc">
                              {getBreakfastMenu().map((item) => (
                                <li
                                  key={item.name}
                                  className="flex items-center mb-1"
                                >
                                  {/* For veg, handle eggs separately */}
                                  {vegOption === "veg" &&
                                  item.name === "Eggs (any style)" ? null : (
                                    <>
                                      <input
                                        type="checkbox"
                                        id={`breakfast-${item.name}`}
                                        checked={selectedBreakfastItems.includes(
                                          item.name
                                        )}
                                        onChange={() =>
                                          handleBreakfastItemChange(item.name)
                                        }
                                        className="mr-2"
                                      />
                                      <label htmlFor={`breakfast-${item.name}`}>
                                        {item.name}{" "}
                                        <span className="text-green-700">
                                          +${item.price}
                                        </span>
                                      </label>
                                    </>
                                  )}
                                </li>
                              ))}
                              {/* Show eggs as a separate option for veg */}
                              {vegOption === "veg" && (
                                <li className="flex items-center mb-1">
                                  <input
                                    type="checkbox"
                                    id="includeEggs"
                                    checked={includeEggs}
                                    onChange={() =>
                                      setIncludeEggs(!includeEggs)
                                    }
                                    className="mr-2"
                                  />
                                  <label htmlFor="includeEggs">
                                    Eggs (any style){" "}
                                    <span className="text-green-700">
                                      +${1.5}
                                    </span>
                                  </label>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="lunch"
                              checked={includeLunch}
                              onChange={() => setIncludeLunch(!includeLunch)}
                              className="mr-2 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <label htmlFor="lunch" className="font-medium">
                              Lunch
                            </label>
                          </div>
                        </div>
                        {includeLunch && (
                          <div className="ml-8 mb-2 text-sm text-gray-600">
                            <div className="font-semibold mb-1">
                              Select your lunch items:
                            </div>
                            <ul className="list-disc">
                              {getLunchMenu().map((item) => (
                                <li
                                  key={item.name}
                                  className="flex items-center mb-1"
                                >
                                  <input
                                    type="checkbox"
                                    id={`lunch-${item.name}`}
                                    checked={selectedLunchItems.includes(
                                      item.name
                                    )}
                                    onChange={() =>
                                      handleLunchItemChange(item.name)
                                    }
                                    className="mr-2"
                                  />
                                  <label htmlFor={`lunch-${item.name}`}>
                                    {item.name}{" "}
                                    <span className="text-green-700">
                                      +${item.price}
                                    </span>
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 6. Summary & Booking */}
            <section>
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  6
                </span>
                Review Your Reservation
              </h2>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reservation Details */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-green-700">
                      Reservation Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Safari Type:</span>
                        <span className="font-medium">
                          {reservationType === "private" ? "Private" : "Shared"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">National Park:</span>
                        <span className="font-medium capitalize">{park}</span>
                      </div>
                      {park === "yala" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Block:</span>
                          <span className="font-medium">
                            {block.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jeep Type:</span>
                        <span className="font-medium capitalize">
                          {jeepType.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Slot:</span>
                        <span className="font-medium capitalize">
                          {timeSlot}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guide Option:</span>
                        <span className="font-medium capitalize">
                          {guideOption.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Meals:</span>
                        <span className="font-medium">
                          {mealOption === "with"
                            ? `${vegOption}${includeEggs ? " with eggs" : ""}${
                                includeLunch ? " + lunch" : ""
                              }`
                            : "None"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of People:</span>
                        <span className="font-medium">{people}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Card Holder:</span>
                        <span className="font-medium">{fullName || "-"}</span>
                      </div> */}
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Card Number:</span>
                        <span className="font-medium">
                          {cardNumber
                            ? `**** **** **** ${cardNumber.slice(-4)}`
                            : "-"}
                        </span>
                      </div> */}
                      {/* <div className="flex justify-between">
                        <span className="text-gray-600">Expiry Date:</span>
                        <span className="font-medium">{expiryDate || "-"}</span>
                      </div> */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{reservationDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seat Number:</span>
                        <span className="font-medium">
                          {reservationType === "shared" &&
                          selectedJeepIndex !== null &&
                          selectedSeat
                            ? `Jeep ${
                                selectedJeepIndex + 1
                              }, Seat ${selectedSeat}`
                            : reservationSeat}
                        </span>{" "}
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 text-green-700">
                      Price Summary
                    </h3>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="space-y-2 mb-4">
                        {reservationType === "private" && (
                          <>
                            <div className="flex justify-between">
                              <span>
                                Jeep (
                                {jeepType.replace(/([A-Z])/g, " $1").trim()}):
                              </span>
                              <span>${pricing.jeep[jeepType][timeSlot]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Guide:</span>
                              <span>+${pricing.guide[guideOption]}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Divided by {people} people:</span>
                              <span>
                                $
                                {(
                                  (pricing.jeep[jeepType][timeSlot] +
                                    pricing.guide[guideOption]) /
                                  people
                                ).toFixed(2)}{" "}
                                each
                              </span>
                            </div>
                          </>
                        )}
                        {reservationType === "shared" && (
                          <div className="flex justify-between">
                            <span>Shared Safari:</span>
                            <span>
                              ${pricing.shared[Math.min(people, 7)]} per person
                            </span>
                          </div>
                        )}
                        {mealOption === "with" && (
                          <>
                            <div className="flex justify-between">
                              <span>Breakfast ({vegOption}):</span>
                              <span>+${pricing.meals.breakfast}</span>
                            </div>
                            {includeLunch && (
                              <div className="flex justify-between">
                                <span>Lunch:</span>
                                <span>+${pricing.meals.lunch}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="border-t border-gray-300 pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total Price:</span>
                          <span className="text-green-700">
                            ${calculateTotal()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Error message here */}
                    {formError && (
                      <div className="mb-4 text-red-600 text-sm">
                        {formError}
                      </div>
                    )}

                    <button
                      className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center"
                      onClick={handleConfirmBooking}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      Confirm & Book Now
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
