import { useState, useEffect } from "react";
import yalaImage from "../assets/yaala.png"; // Replace with your image paths
import bundalaImage from "../assets/bundala.jpg";
import udawalaweImage from "../assets/bund.jpg";
import jeepImage from "../assets/tour.jpg";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Calendar from "react-calendar";


const breakfastMenuItemsVeg = [
  { name: "Fresh tropical fruits", price: 2 },
  { name: "Toast & butter/jam", price: 1 },
  { name: "Local Sri Lankan pancakes", price: 1.5 },
  { name: "Tea or coffee", price: 1 },
  // Eggs will be handled by the "Include Eggs" checkbox
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
  // Add to your state declarations
  const [pickupLocation, setPickupLocation] = useState("");
  const [hotelWhatsapp, setHotelWhatsapp] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  // Add to your state declarations
  const [nicNumber, setNicNumber] = useState("");
  const [localContact, setLocalContact] = useState("");
  const [localAccommodation, setLocalAccommodation] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [loading, setLoading] = useState(true);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [privateAvailableDates, setPrivateAvailableDates] = useState([]);
  useEffect(() => {
    if (reservationType === "private") {
      // Example: Replace with your real API endpoint for private safari availability
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

  // Park images mapping
  const parkImages = {
    yala: yalaImage,
    bundala: bundalaImage,
    udawalawe: udawalaweImage,
  };

  // Pricing data
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

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    if (reservationType === "private") {
      const jeepPrice = pricing.jeep[jeepType][timeSlot];
      const guidePrice = pricing.guide[guideOption];
      total = jeepPrice * people + guidePrice;
    } else {
      total = pricing.shared[Math.min(people, 7)] * people;
    }

    // Add meal prices per person if meals are selected
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

  // Handler for lunch menu selection
  const handleLunchItemChange = (itemName) => {
    setSelectedLunchItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((i) => i !== itemName)
        : [...prev, itemName]
    );
  };

  const handleRefreshPricing = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/packages")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.jeep && data.shared && data.meals && data.guide)
          setPricing(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
                  } ${park !== "yala" ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={park !== "yala"}
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
                        Join other travelers. Only available in Yala.
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
                          Cost-effective
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
                          Fixed departure times
                        </li>
                      </ul>
                      {park !== "yala" && (
                        <div className="mt-3 text-sm text-red-500">
                          <svg
                            className="w-4 h-4 inline mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          Only available for Yala National Park
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                    onClick={() => setJeepType(type.id)}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                      jeepType === type.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
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

                    {reservationType === "shared" && (
                      <div className="mb-6">
                        <h3 className="font-medium mb-2">
                          Select Available Date:
                        </h3>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        >
                          <option value="">Select a date</option>
                          {availableDates.map((date) => (
                            <option key={date} value={date}>
                              {moment(date, "YYYY-MM-DD").format(
                                "MMMM D, YYYY"
                              )}
                            </option>
                          ))}
                        </select>

                        <h3 className="font-medium mb-2">
                          Select Available Seat:
                        </h3>
                        <select
                          value={selectedSeat}
                          onChange={(e) => setSelectedSeat(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                          <option value="">Select a seat</option>
                          {[1, 2, 3, 4, 5, 6, 7].map((seat) => (
                            <option key={seat} value={seat}>
                              Seat {seat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {/* Extra fields for foreign visitors */}
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

                    <button
                      className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center"
                      onClick={() => setShowBookingSection(true)}
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
            {showBookingSection && (
              <section className="mt-12 bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    7
                  </span>
                  Complete Your Booking
                </h2>
                {/* Example: Show calendar only for private safari */}
                {reservationType === "private" && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-2">Select Date</h3>
                    <Calendar
                      value={privateDate}
                      onChange={setPrivateDate}
                      minDate={new Date()}
                      maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                    />
                  </div>
                )}
                {/* Add your booking form fields here, e.g. card details, payment, etc. */}
                <div className="mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="cardNumber"
                  >
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter your card number"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="cardName"
                  >
                    Name on Card
                  </label>
                  <input
                    id="cardName"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter name on card"
                  />
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label
                      className="block font-semibold mb-1"
                      htmlFor="expiry"
                    >
                      Expiry
                    </label>
                    <input
                      id="expiry"
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1" htmlFor="cvc">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      type="text"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="CVC"
                    />
                  </div>
                </div>
                <button className="w-full mt-6 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg shadow-md transition-all">
                  Pay & Confirm Booking
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
