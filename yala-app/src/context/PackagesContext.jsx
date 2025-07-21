import { createContext, useContext, useState, useEffect } from "react";
import yalaImage from "../assets/yaala.png";
import bundalaImage from "../assets/bundala.jpg";
import udawalaweImage from "../assets/bund.jpg";
import jeep1 from "../assets/a1.jpeg";
import jeep2 from "../assets/a2.jpeg"
import jeep3 from "../assets/a2.jpeg"
import jeep4 from "../assets/a2.jpeg"
import jeep5 from "../assets/a2.jpeg"
import jeep6 from "../assets/a2.jpeg"
import jeep7 from "../assets/a2.jpeg"
import jeepImage from "../assets/tour.jpg";
import moment from "moment";

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

const PackagesContext = createContext();
export const usePackages = () => useContext(PackagesContext);

export const PackagesProvider = ({ children }) => {
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
  const [privateDate, setPrivateDate] = useState(new Date());
  const [pickupLocation, setPickupLocation] = useState("");
  const [hotelWhatsapp, setHotelWhatsapp] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [localContact, setLocalContact] = useState("");
  const [localAccommodation, setLocalAccommodation] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeats, setSelectedSeats] = useState("");
  const [showDatePopup, setShowDatePopup] = useState(false);
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [sharedSelectedDate, setSharedSelectedDate] = useState(null);
  const [sharedSelectedSeat, setSharedSelectedSeat] = useState(null);
  const [showBookingSection, setShowBookingSection] = useState(false);
  const [privateAvailableDates, setPrivateAvailableDates] = useState([
    "2025-07-05",
    "2025-07-06",
    "2025-07-08",
    "2025-07-10",
  ]);
  // Jeep/seat selection
  const [showJeepPopup, setShowJeepPopup] = useState(false);
  const [selectedJeep, setSelectedJeep] = useState(null);

  // Static jeep data for demo
  const [availableJeeps, setAvailableJeeps] = useState([
    { id: 1, image: jeep1, bookedSeats: [2, 5] },
    { id: 2, image: jeep2, bookedSeats: [] },
    { id: 3, image: jeep3, bookedSeats: [1, 3, 6] },
    { id: 4, image: jeep4, bookedSeats: [] },
    { id: 5, image: jeep5, bookedSeats: [4] },
    { id: 6, image: jeep6, bookedSeats: [] },
    { id: 7, image: jeep7, bookedSeats: [2, 3, 4, 5, 6] },
  ]);

  // Pricing
  const pricing = {
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

  return (
    <PackagesContext.Provider
      value={{
        // State
        reservationType,
        setReservationType,
        park,
        setPark,
        block,
        setBlock,
        jeepType,
        setJeepType,
        timeSlot,
        setTimeSlot,
        guideOption,
        setGuideOption,
        visitorType,
        setVisitorType,
        mealOption,
        setMealOption,
        vegOption,
        setVegOption,
        includeEggs,
        setIncludeEggs,
        includeLunch,
        setIncludeLunch,
        includeBreakfast,
        setIncludeBreakfast,
        people,
        setPeople,
        privateDate,
        setPrivateDate,
        pickupLocation,
        setPickupLocation,
        hotelWhatsapp,
        setHotelWhatsapp,
        accommodation,
        setAccommodation,
        passportNumber,
        setPassportNumber,
        fullName,
        setFullName,
        phoneNumber,
        setPhoneNumber,
        email,
        setEmail,
        nicNumber,
        setNicNumber,
        localContact,
        setLocalContact,
        localAccommodation,
        setLocalAccommodation,
        availableDates,
        setAvailableDates,
        selectedDate,
        setSelectedDate,
        selectedSeats,
        setSelectedSeats,
        showDatePopup,
        setShowDatePopup,
        showSeatPopup,
        setShowSeatPopup,
        sharedSelectedDate,
        setSharedSelectedDate,
        sharedSelectedSeat,
        setSharedSelectedSeat,
        showBookingSection,
        setShowBookingSection,
        privateAvailableDates,
        setPrivateAvailableDates,
        pricing,
        selectedBreakfastItems,
        setSelectedBreakfastItems,
        selectedLunchItems,
        setSelectedLunchItems,
        getBreakfastMenu,
        getLunchMenu,
        handleBreakfastItemChange,
        handleLunchItemChange,
        parkImages,
        jeepImage,
        calculateTotal,
        reservationDate,
        reservationSeat,
        // Jeep/seat selection
        availableJeeps,
        setAvailableJeeps,
        showJeepPopup,
        setShowJeepPopup,
        selectedJeep,
        setSelectedJeep,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
};
