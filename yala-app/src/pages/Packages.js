import { useState, useEffect, useCallback } from "react";
import yalaImage from "../assets/yaala.png";
import bundalaImage from "../assets/bundala.jpg";
import udawalaweImage from "../assets/bund.jpg";
import jeepImage from "../assets/tour.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import Calendar from "react-calendar";
import Modal from "react-modal";
import lunugamweheraImage from "../assets/lunu.jpg";
import { apiEndpoints, publicFetch } from "../config/api";
import { toast } from "react-toastify";

const Packages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if a package was passed from navigation
  const preSelectedPackage = location.state?.selectedPackage;

  // ========================================
  // STATE DECLARATIONS
  // ========================================

  // Booking form states - REMOVED reservationType (always private) and jeepType (always luxury)
  const [park, setPark] = useState("yala");
  const [block, setBlock] = useState("blockI");
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

  // Customer information states
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

  // Date selection states - REMOVED shared safari states
  const [privateAvailableDates, setPrivateAvailableDates] = useState([]);

  // 🆕 PACKAGE SELECTION STATES (FROM API)
  const [availablePackages, setAvailablePackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(preSelectedPackage || null);
  const [showPackageSelector, setShowPackageSelector] = useState(!preSelectedPackage);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;

  // 🆕 FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPark, setFilterPark] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // 🆕 DYNAMIC MEAL ITEMS FROM API (NO HARDCODED MENU)
  const [breakfastMenuItems, setBreakfastMenuItems] = useState([]);
  const [lunchMenuItems, setLunchMenuItems] = useState([]);
  const [selectedBreakfastItems, setSelectedBreakfastItems] = useState([]);
  const [selectedLunchItems, setSelectedLunchItems] = useState([]);

  // 🆕 PRICING FROM API (NO HARDCODED PRICES)
  const [pricing, setPricing] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);

  // Park images mapping (only images are local, everything else from API)
  const parkImages = {
    yala: yalaImage,
    bundala: bundalaImage,
    udawalawe: udawalaweImage,
    Lunugamwehera: lunugamweheraImage,
  };

  // ========================================
  // 🆕 FETCH PACKAGES FROM API
  // ========================================
  const fetchPackages = useCallback(async () => {
    setPackagesLoading(true);
    try {
      const response = await publicFetch(
        `${apiEndpoints.packages.base}?isActive=true`
      );
      const data = await response.json();

      console.log("📦 Fetched packages from API:", data);

      if (data.success && data.packages) {
        setAvailablePackages(data.packages);

        // If preSelectedPackage exists, find and set it
        if (preSelectedPackage) {
          const foundPackage = data.packages.find(
            (pkg) => pkg._id === preSelectedPackage._id
          );
          if (foundPackage) {
            handlePackageSelect(foundPackage);
          }
        }
      } else {
        toast.error("Failed to load packages");
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Error loading packages. Please refresh the page.");
    } finally {
      setPackagesLoading(false);
      setLoading(false);
    }
  }, [preSelectedPackage]);

  // ========================================
  // 🆕 HANDLE PACKAGE SELECTION
  // ========================================
  // ========================================
  // 🆕 UPDATED: HANDLE PACKAGE SELECTION WITH MEAL OPTIONS
  // ========================================
  const handlePackageSelect = (pkg) => {
    console.log("📦 Package Selected:", pkg);

    setSelectedPackage(pkg);

    // Auto-fill booking form with package data
    setPark(pkg.park);
    if (pkg.block) setBlock(pkg.block);

    // 🆕 SET PRICING FROM PACKAGE (FROM API, NOT HARDCODED)
    setPricing({
      jeep: pkg.jeep,
      meals: pkg.meals || { breakfast: 5, lunch: 6 },
      guide: pkg.guide,
      tickets: pkg.tickets,
    });

    // 🆕 UPDATED: SET MEAL ITEMS FROM PACKAGE API DATA
    if (pkg.mealOptions) {
      console.log("🍽️ Loading meal options from API:", pkg.mealOptions);

      // Set breakfast items
      if (pkg.mealOptions.breakfast && Array.isArray(pkg.mealOptions.breakfast)) {
        setBreakfastMenuItems(pkg.mealOptions.breakfast);
        // Auto-select all breakfast items initially
        setSelectedBreakfastItems(
          pkg.mealOptions.breakfast.map((item) => item.name)
        );
        console.log("✅ Breakfast items loaded:", pkg.mealOptions.breakfast);
      } else {
        setBreakfastMenuItems([]);
        setSelectedBreakfastItems([]);
        console.log("⚠️ No breakfast items in package");
      }

      // Set lunch items
      if (pkg.mealOptions.lunch && Array.isArray(pkg.mealOptions.lunch)) {
        setLunchMenuItems(pkg.mealOptions.lunch);
        // Auto-select all lunch items initially
        setSelectedLunchItems(
          pkg.mealOptions.lunch.map((item) => item.name)
        );
        console.log("✅ Lunch items loaded:", pkg.mealOptions.lunch);
      } else {
        setLunchMenuItems([]);
        setSelectedLunchItems([]);
        console.log("⚠️ No lunch items in package");
      }
    } else {
      // No meal options in package - clear arrays
      console.log("⚠️ No mealOptions object in package");
      setBreakfastMenuItems([]);
      setLunchMenuItems([]);
      setSelectedBreakfastItems([]);
      setSelectedLunchItems([]);
    }

    // Set max capacity
    if (pkg.maxCapacity) {
      setPeople(Math.min(people, pkg.maxCapacity));
    }

    // Close package selector and show booking form
    setShowPackageSelector(false);
    toast.success(`${pkg.name} selected!`);
  };

  // ========================================
  // 🆕 UPDATED: HELPER FUNCTIONS TO GET FILTERED MEALS
  // ========================================

  const getBreakfastMenu = () => {
    // Return empty array if no breakfast items
    if (!breakfastMenuItems || breakfastMenuItems.length === 0) {
      console.log("⚠️ No breakfast menu items available");
      return [];
    }

    // Filter by vegetarian option if selected
    const filteredItems = breakfastMenuItems.filter((item) => {
      if (vegOption === "veg") {
        // For veg option, only show vegetarian items
        return item.isVegetarian === true;
      }
      // For non-veg, show all items
      return true;
    });

    console.log(`🍳 Breakfast menu (${vegOption}):`, filteredItems);
    return filteredItems;
  };

  const getLunchMenu = () => {
    // Return empty array if no lunch items
    if (!lunchMenuItems || lunchMenuItems.length === 0) {
      console.log("⚠️ No lunch menu items available");
      return [];
    }

    // Filter by vegetarian option if selected
    const filteredItems = lunchMenuItems.filter((item) => {
      if (vegOption === "veg") {
        // For veg option, only show vegetarian items
        return item.isVegetarian === true;
      }
      // For non-veg, show all items
      return true;
    });

    console.log(`🍽️ Lunch menu (${vegOption}):`, filteredItems);
    return filteredItems;
  };

  // ========================================
  // 🆕 UPDATED: useEffect TO HANDLE VEG OPTION CHANGES
  // ========================================
  useEffect(() => {
    // When veg option changes, update selected items to match filtered menu
    if (breakfastMenuItems.length > 0) {
      const filteredBreakfast = getBreakfastMenu();
      // Only keep selected items that are in the filtered menu
      setSelectedBreakfastItems((prev) =>
        prev.filter((itemName) =>
          filteredBreakfast.some((item) => item.name === itemName)
        )
      );
      console.log("🔄 Updated breakfast selection for", vegOption);
    }

    if (lunchMenuItems.length > 0) {
      const filteredLunch = getLunchMenu();
      // Only keep selected items that are in the filtered menu
      setSelectedLunchItems((prev) =>
        prev.filter((itemName) =>
          filteredLunch.some((item) => item.name === itemName)
        )
      );
      console.log("🔄 Updated lunch selection for", vegOption);
    }
  }, [vegOption]); // Re-run when vegOption changes

  // Note: Remove breakfastMenuItems and lunchMenuItems from dependency array
  // to avoid infinite loop - only vegOption should trigger this

  // 🆕 GET TICKET PRICE FROM API (NO HARDCODED PRICES)
  const getTicketPrice = () => {
    if (!pricing || !pricing.tickets) {
      console.warn("⚠️ No pricing data available, using fallback");
      return visitorType === "foreign" ? 15 : 5; // Fallback only
    }
    return visitorType === "foreign"
      ? pricing.tickets.foreign
      : pricing.tickets.local;
  };

  // 🆕 FILTER AND SEARCH LOGIC
  const getFilteredPackages = () => {
    let filtered = [...availablePackages];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pkg.park.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Park filter
    if (filterPark !== "all") {
      filtered = filtered.filter((pkg) => pkg.park === filterPark);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.jeep?.luxury?.morning || 0;
          const priceB = b.jeep?.luxury?.morning || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.jeep?.luxury?.morning || 0;
          const priceB = b.jeep?.luxury?.morning || 0;
          return priceB - priceA;
        });
        break;
      case "name":
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const filteredPackages = getFilteredPackages();

  // Pagination calculations
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = filteredPackages.slice(
    indexOfFirstPackage,
    indexOfLastPackage
  );
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ========================================
  // 🆕 CALCULATE TOTAL PRICE - USE API DATA (NO HARDCODED PRICES)
  // ========================================
  const calculateTotal = () => {
    if (!pricing) {
      console.warn("⚠️ No pricing available");
      return "0.00";
    }

    let total = 0;

    try {
      // PRIVATE SAFARI WITH LUXURY JEEP ONLY
      const jeepPrice = pricing.jeep?.luxury?.[timeSlot] || 0;
      const guidePrice = pricing.guide[guideOption] || 0;
      total = jeepPrice + guidePrice;

      // Add ticket price per person (FROM API)
      const ticketPrice = getTicketPrice();
      total += ticketPrice * people;

      // Add meal prices per person if meals are selected
      if (mealOption === "with") {
        if (includeBreakfast && selectedBreakfastItems.length > 0) {
          const breakfastTotal = getBreakfastMenu()
            .filter((item) => selectedBreakfastItems.includes(item.name))
            .reduce((sum, item) => sum + (item.price || 0), 0);
          total += breakfastTotal * people;

          // Add eggs if veg option and includeEggs is true
          if (vegOption === "veg" && includeEggs) {
            total += 1.5 * people;
          }
        }

        if (includeLunch && selectedLunchItems.length > 0) {
          const lunchTotal = getLunchMenu()
            .filter((item) => selectedLunchItems.includes(item.name))
            .reduce((sum, item) => sum + (item.price || 0), 0);
          total += lunchTotal * people;
        }
      }

      return total.toFixed(2);
    } catch (error) {
      console.error("Error calculating total:", error);
      return "0.00";
    }
  };

  // ========================================
  // MEAL ITEM HANDLERS
  // ========================================
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

  // ========================================
  // useEffect HOOKS
  // ========================================

  // 🆕 Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // 🆕 Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterPark, sortBy]);

  // 🆕 Update meal selections when vegOption changes
  useEffect(() => {
    if (breakfastMenuItems.length > 0) {
      const filteredBreakfast = getBreakfastMenu();
      setSelectedBreakfastItems(filteredBreakfast.map((item) => item.name));
    }
    if (lunchMenuItems.length > 0) {
      const filteredLunch = getLunchMenu();
      setSelectedLunchItems(filteredLunch.map((item) => item.name));
    }
  }, [vegOption]);

  // 🆕 Fetch private availability dates when needed
  useEffect(() => {
    if (selectedPackage) {
      const fetchPrivateAvailability = async () => {
        try {
          const response = await publicFetch(
            `${apiEndpoints.packages.base}/${selectedPackage._id}/availability`
          );
          const data = await response.json();

          if (data.success && data.availableDates) {
            setPrivateAvailableDates(data.availableDates);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        }
      };

      fetchPrivateAvailability();
    }
  }, [selectedPackage, park]);

  // 🆕 Handle preSelectedPackage from navigation
  useEffect(() => {
    if (preSelectedPackage && availablePackages.length > 0) {
      const foundPackage = availablePackages.find(
        (pkg) => pkg._id === preSelectedPackage._id
      );
      if (foundPackage) {
        handlePackageSelect(foundPackage);
      }
    }
  }, [preSelectedPackage, availablePackages]);


  // ========================================
  // VALIDATION & BOOKING
  // ========================================

  const validateBooking = () => {
    if (!selectedPackage) return "Please select a package first";
    if (!pricing) return "Package pricing not loaded. Please refresh the page.";
    if (!fullName.trim()) return "Full Name is required";
    if (!phoneNumber.trim()) return "Phone Number is required";
    if (!email.trim()) return "Email is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";

    if (visitorType === "foreign" && !passportNumber.trim())
      return "Passport Number is required";
    if (visitorType === "local" && !nicNumber.trim())
      return "NIC Number is required";
    if (!privateDate) return "Please select a date";

    return null;
  };

  const handleBookNow = () => {
    const error = validateBooking();
    if (error) {
      toast.error(error);
      return;
    }

    // Calculate meal price
    const calculateMealPrice = () => {
      let meal = 0;
      if (mealOption === "with") {
        if (includeBreakfast && selectedBreakfastItems && selectedBreakfastItems.length > 0) {
          const breakfastTotal = getBreakfastMenu()
            .filter((item) => selectedBreakfastItems.includes(item.name))
            .reduce((sum, item) => sum + (item.price || 0), 0);
          meal += breakfastTotal * people;

          // Add eggs if veg option and includeEggs is true
          if (vegOption === "veg" && includeEggs) {
            meal += 1.5 * people;
          }
        }

        if (includeLunch && selectedLunchItems && selectedLunchItems.length > 0) {
          const lunchTotal = getLunchMenu()
            .filter((item) => selectedLunchItems.includes(item.name))
            .reduce((sum, item) => sum + (item.price || 0), 0);
          meal += lunchTotal * people;
        }
      }
      return Number(meal.toFixed(2));
    };

    // Calculate all prices
    const ticketPricePerPerson = getTicketPrice();
    const calculatedTicketPrice = ticketPricePerPerson * people;

    // LUXURY JEEP ONLY
    const calculatedJeepPrice = pricing.jeep?.luxury?.[timeSlot] || 0;

    const calculatedGuidePrice = pricing.guide[guideOption] || 0;
    const calculatedMealPrice = calculateMealPrice();
    const calculatedTotalPrice =
      calculatedTicketPrice +
      calculatedJeepPrice +
      calculatedGuidePrice +
      calculatedMealPrice;

    console.log("📊 Frontend Calculation Summary:");
    console.log("   Package:", selectedPackage.name);
    console.log("   Ticket Price:", calculatedTicketPrice);
    console.log("   Luxury Jeep Price:", calculatedJeepPrice);
    console.log("   Guide Price:", calculatedGuidePrice);
    console.log("   Meal Price:", calculatedMealPrice);
    console.log("   TOTAL:", calculatedTotalPrice);

    // Prepare booking data
    const bookingData = {
      // Package information
      packageId: selectedPackage._id,
      packageName: selectedPackage.name,

      // Customer information
      customerName: fullName,
      customerEmail: email,
      customerPhone: phoneNumber,

      // Booking details - ALWAYS PRIVATE WITH LUXURY JEEP
      park,
      block,
      timeSlot,
      guideOption,
      visitorType,
      mealOption,
      vegOption,
      people,

      // Date selection
      date: privateDate,

      // Meal selections
      includeBreakfast,
      includeLunch,
      includeEggs,
      selectedBreakfastItems: includeBreakfast ? selectedBreakfastItems : [],
      selectedLunchItems: includeLunch ? selectedLunchItems : [],

      // Additional information
      pickupLocation,
      hotelWhatsapp,
      accommodation,
      passportNumber: visitorType === "foreign" ? passportNumber : "",
      nicNumber: visitorType === "local" ? nicNumber : "",
      localContact: visitorType === "local" ? localContact : "",
      localAccommodation: visitorType === "local" ? localAccommodation : "",

      // Price breakdown
      ticketPrice: calculatedTicketPrice,
      jeepPrice: calculatedJeepPrice,
      guidePrice: calculatedGuidePrice,
      mealPrice: calculatedMealPrice,
      totalPrice: calculatedTotalPrice,
    };

    console.log("📤 Sending booking data to backend:", bookingData);
    navigate("/booking/confirm", { state: bookingData });
  };

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading || packagesLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // RETURN JSX
  // ========================================

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with Hero Image */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-64">
          <img
            src={selectedPackage ? parkImages[selectedPackage.park] : parkImages[park]}
            alt={selectedPackage ? selectedPackage.park : park}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">
                {selectedPackage ? selectedPackage.name : "Wildlife Safari Adventure"}
              </h1>
              <p className="text-xl text-green-100">
                {selectedPackage
                  ? selectedPackage.description
                  : "Book your unforgettable jungle experience"}
              </p>
            </div>
          </div>
        </div>

        {/* 🆕 PACKAGE SELECTION SECTION */}
        {showPackageSelector && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-green-800">
                  Choose Your Package
                </h2>
                <p className="text-gray-600">
                  {filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Search Bar */}
              <div className="md:col-span-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Park Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {["all", "yala", "bundala", "udawalawe", "Lunugamwehera"].map((parkFilter) => (
                <button
                  key={parkFilter}
                  onClick={() => setFilterPark(parkFilter)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filterPark === parkFilter
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {parkFilter === "all" ? "All Parks" : parkFilter}
                </button>
              ))}
            </div>

            {/* Package Grid */}
            {packagesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500 mb-4 text-lg">
                  {searchQuery || filterPark !== "all"
                    ? "No packages match your filters"
                    : "No packages available at the moment"}
                </p>
                {(searchQuery || filterPark !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterPark("all");
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      {/* Package Image */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={parkImages[pkg.park] || yalaImage}
                          alt={pkg.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        {/* Luxury Jeep Badge */}
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            Luxury Jeep
                          </span>
                        </div>

                        {/* Highlights Badge */}
                        {pkg.highlights && pkg.highlights.length > 0 && (
                          <div className="absolute bottom-2 left-2">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              🌟 {pkg.highlights[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Package Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-green-800 mb-2 line-clamp-1">
                          {pkg.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {pkg.description}
                        </p>

                        {/* Park Location */}
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="capitalize">{pkg.park} National Park</span>
                        </div>

                        {/* Price - FROM API - LUXURY JEEP ONLY */}
                        <div className="flex items-center justify-between mb-3 pb-3 border-b">
                          <span className="text-sm text-gray-600">Starting from</span>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              ${pkg.jeep?.luxury?.morning || 0}
                            </div>
                            <div className="text-xs text-gray-500">luxury jeep</div>
                          </div>
                        </div>

                        {/* Max Capacity - FROM API */}
                        {pkg.maxCapacity && (
                          <div className="flex items-center text-xs text-gray-600 mb-3">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Max {pkg.maxCapacity} people
                          </div>
                        )}

                        {/* Features Preview - FROM API */}
                        {pkg.features && pkg.features.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {pkg.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200"
                                >
                                  ✓ {feature}
                                </span>
                              ))}
                              {pkg.features.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{pkg.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Ticket Prices - FROM API */}
                        {pkg.tickets && (
                          <div className="mb-4 text-xs">
                            <div className="flex justify-between text-gray-600">
                              <span>Foreign Ticket:</span>
                              <span className="font-semibold">${pkg.tickets.foreign}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                              <span>Local Ticket:</span>
                              <span className="font-semibold">${pkg.tickets.local}</span>
                            </div>
                          </div>
                        )}

                        {/* Select Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePackageSelect(pkg);
                          }}
                          className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
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
                          Select This Package
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstPackage + 1} to{" "}
                      {Math.min(indexOfLastPackage, filteredPackages.length)} of{" "}
                      {filteredPackages.length} packages
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${currentPage === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-green-600 hover:bg-green-50 border border-green-600"
                          }`}
                      >
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => paginate(pageNumber)}
                              className={`px-4 py-2 rounded-lg font-medium ${currentPage === pageNumber
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-green-600 hover:bg-green-50 border border-green-600"
                                }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span key={pageNumber} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${currentPage === totalPages
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white text-green-600 hover:bg-green-50 border border-green-600"
                          }`}
                      >
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Selected Package Banner */}
        {selectedPackage && !showPackageSelector && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-green-600 text-white p-3 rounded-full">
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
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-green-800 text-lg">
                  {selectedPackage.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Private Safari with Luxury Jeep - You can customize the details below
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedPackage(null);
                setPricing(null);
                setShowPackageSelector(true);
              }}
              className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
            >
              Change Package
            </button>
          </div>
        )}

        {/* Main Booking Card - Only show if package is selected */}
        {!showPackageSelector && selectedPackage && pricing && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Progress Steps */}
            <div className="flex divide-x divide-gray-200 border-b border-gray-200">
              {["Park", "Time & Guide", "Meals", "Visitor Info", "Summary"].map(
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
              {/* 1. PARK SELECTION - Display from API */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    1
                  </span>
                  Safari Park & Date
                </h2>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={parkImages[selectedPackage.park] || yalaImage}
                      alt={selectedPackage.park}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-green-800 capitalize">
                        {selectedPackage.park} National Park
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        Private Safari with Luxury Jeep
                      </p>
                      {selectedPackage.block && (
                        <p className="text-green-700 font-medium text-sm mt-2">
                          Block: {selectedPackage.block}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calendar for date selection */}
                <div className="mt-6">
                  <label className="block font-semibold mb-2">
                    Select Safari Date
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
              </section>

              {/* 2. TIME SLOT & GUIDE OPTIONS */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    2
                  </span>
                  Safari Time & Guide
                </h2>

                {/* Time Slots - Prices FROM API */}
                <div className="mb-8">
                  <h3 className="font-medium mb-3">Select Time Slot:</h3>
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
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${timeSlot === slot.id
                            ? "bg-green-100 border-green-500"
                            : "hover:bg-gray-50"
                          }`}
                      >
                        <div className="font-medium">{slot.name}</div>
                        <div className="text-sm text-gray-600">{slot.time}</div>
                        <div className="text-green-700 font-medium mt-1">
                          {/* PRICE FROM API - LUXURY JEEP ONLY */}
                          {pricing.jeep?.luxury?.[slot.id]
                            ? `$${pricing.jeep.luxury[slot.id]}`
                            : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guide Options - FROM API */}
                <div>
                  <h3 className="font-medium mb-3">Select Your Guide Option:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Driver Only - FROM API */}
                    {pricing.guide.driver !== undefined && (
                      <div
                        onClick={() => setGuideOption("driver")}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${guideOption === "driver"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">Driver Only</h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            +${pricing.guide.driver}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Basic transportation with a driver who knows the routes
                        </p>
                      </div>
                    )}

                    {/* Driver Guide - FROM API */}
                    {pricing.guide.driverGuide !== undefined && (
                      <div
                        onClick={() => setGuideOption("driverGuide")}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${guideOption === "driverGuide"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">Driver Guide</h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            +${pricing.guide.driverGuide}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Driver who also serves as your wildlife guide
                        </p>
                      </div>
                    )}

                    {/* Separate Guide - FROM API */}
                    {pricing.guide.separateGuide !== undefined && (
                      <div
                        onClick={() => setGuideOption("separateGuide")}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${guideOption === "separateGuide"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">
                            Driver + Guide
                          </h3>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            +${pricing.guide.separateGuide}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Dedicated driver and professional wildlife guide
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 3. MEAL OPTIONS */}
              // ========================================
              // 🆕 UPDATED: MEAL OPTIONS SECTION WITH PRICES
              // Replace the entire Meal Options section (Section 3) in your JSX
              // ========================================

              {/* 3. MEAL OPTIONS */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    3
                  </span>
                  Meal Options
                </h2>

                <div>
                  <h3 className="font-medium mb-3">Would you like meals with your safari?</h3>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setMealOption("with")}
                      className={`px-6 py-2 rounded-lg font-medium ${mealOption === "with"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Yes, Include Meals
                    </button>
                    <button
                      onClick={() => setMealOption("without")}
                      className={`px-6 py-2 rounded-lg font-medium ${mealOption === "without"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      No Thanks
                    </button>
                  </div>

                  {mealOption === "with" && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Meal Type:</h4>
                        <div className="flex gap-3">
                          {["non-veg", "veg"].map((type) => (
                            <button
                              key={type}
                              onClick={() => setVegOption(type)}
                              className={`px-4 py-2 rounded-lg text-sm capitalize font-medium ${vegOption === type
                                  ? "bg-green-600 text-white"
                                  : "bg-white border border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                              {type.replace("-", " ")}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* 🆕 BREAKFAST SECTION WITH PRICES */}
                        <div>
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="breakfast"
                                checked={includeBreakfast}
                                onChange={() => setIncludeBreakfast(!includeBreakfast)}
                                className="mr-3 h-5 w-5 text-green-600 rounded border-gray-300"
                              />
                              <label htmlFor="breakfast" className="font-semibold text-lg cursor-pointer">
                                🍳 Breakfast
                              </label>
                            </div>
                            {includeBreakfast && getBreakfastMenu().length > 0 && (
                              <span className="text-sm text-gray-600">
                                {selectedBreakfastItems.length} item{selectedBreakfastItems.length !== 1 ? 's' : ''} selected
                              </span>
                            )}
                          </div>

                          {/* 🆕 BREAKFAST MENU WITH INDIVIDUAL PRICES */}
                          {includeBreakfast && getBreakfastMenu().length > 0 ? (
                            <div className="ml-8 space-y-2">
                              {getBreakfastMenu().map((item) => (
                                <div
                                  key={item.name}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                                >
                                  <div className="flex items-center flex-1">
                                    <input
                                      type="checkbox"
                                      id={`breakfast-${item.name}`}
                                      checked={selectedBreakfastItems.includes(item.name)}
                                      onChange={() => handleBreakfastItemChange(item.name)}
                                      className="mr-3 h-4 w-4 text-green-600 rounded"
                                    />
                                    <label
                                      htmlFor={`breakfast-${item.name}`}
                                      className="cursor-pointer flex-1"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.name}</span>
                                        {item.isVegetarian && (
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            🌱 Veg
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                      )}
                                    </label>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="font-bold text-green-700">
                                      ${(item.price || 0).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500">per person</div>
                                  </div>
                                </div>
                              ))}

                              {/* 🆕 EGGS OPTION FOR VEG WITH PRICE */}
                              {vegOption === "veg" && (
                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                                  <div className="flex items-center flex-1">
                                    <input
                                      type="checkbox"
                                      id="includeEggs"
                                      checked={includeEggs}
                                      onChange={() => setIncludeEggs(!includeEggs)}
                                      className="mr-3 h-4 w-4 text-green-600 rounded"
                                    />
                                    <label htmlFor="includeEggs" className="cursor-pointer flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">Eggs (any style)</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                          🥚 Add-on
                                        </span>
                                      </div>
                                    </label>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="font-bold text-green-700">$1.50</div>
                                    <div className="text-xs text-gray-500">per person</div>
                                  </div>
                                </div>
                              )}

                              {/* 🆕 BREAKFAST SUBTOTAL */}
                              {selectedBreakfastItems.length > 0 && (
                                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      Breakfast Subtotal ({people} person{people > 1 ? 's' : ''}):
                                    </span>
                                    <span className="text-lg font-bold text-green-700">
                                      $
                                      {(
                                        (getBreakfastMenu()
                                          .filter((item) => selectedBreakfastItems.includes(item.name))
                                          .reduce((sum, item) => sum + (item.price || 0), 0) +
                                          (vegOption === "veg" && includeEggs ? 1.5 : 0)) *
                                        people
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : includeBreakfast ? (
                            <div className="ml-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                ⚠️ No breakfast options available for this package
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {/* 🆕 LUNCH SECTION WITH PRICES */}
                        <div>
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="lunch"
                                checked={includeLunch}
                                onChange={() => setIncludeLunch(!includeLunch)}
                                className="mr-3 h-5 w-5 text-green-600 rounded border-gray-300"
                              />
                              <label htmlFor="lunch" className="font-semibold text-lg cursor-pointer">
                                🍛 Lunch
                              </label>
                            </div>
                            {includeLunch && getLunchMenu().length > 0 && (
                              <span className="text-sm text-gray-600">
                                {selectedLunchItems.length} item{selectedLunchItems.length !== 1 ? 's' : ''} selected
                              </span>
                            )}
                          </div>

                          {/* 🆕 LUNCH MENU WITH INDIVIDUAL PRICES */}
                          {includeLunch && getLunchMenu().length > 0 ? (
                            <div className="ml-8 space-y-2">
                              {getLunchMenu().map((item) => (
                                <div
                                  key={item.name}
                                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                                >
                                  <div className="flex items-center flex-1">
                                    <input
                                      type="checkbox"
                                      id={`lunch-${item.name}`}
                                      checked={selectedLunchItems.includes(item.name)}
                                      onChange={() => handleLunchItemChange(item.name)}
                                      className="mr-3 h-4 w-4 text-green-600 rounded"
                                    />
                                    <label
                                      htmlFor={`lunch-${item.name}`}
                                      className="cursor-pointer flex-1"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.name}</span>
                                        {item.isVegetarian && (
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            🌱 Veg
                                          </span>
                                        )}
                                      </div>
                                      {item.description && (
                                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                      )}
                                    </label>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="font-bold text-orange-700">
                                      ${(item.price || 0).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500">per person</div>
                                  </div>
                                </div>
                              ))}

                              {/* 🆕 LUNCH SUBTOTAL */}
                              {selectedLunchItems.length > 0 && (
                                <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">
                                      Lunch Subtotal ({people} person{people > 1 ? 's' : ''}):
                                    </span>
                                    <span className="text-lg font-bold text-orange-700">
                                      $
                                      {(
                                        getLunchMenu()
                                          .filter((item) => selectedLunchItems.includes(item.name))
                                          .reduce((sum, item) => sum + (item.price || 0), 0) *
                                        people
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : includeLunch ? (
                            <div className="ml-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                ⚠️ No lunch options available for this package
                              </p>
                            </div>
                          ) : null}
                        </div>

                        {/* 🆕 TOTAL MEAL COST SUMMARY */}
                        {(includeBreakfast && selectedBreakfastItems.length > 0) ||
                          (includeLunch && selectedLunchItems.length > 0) ? (
                          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border-2 border-green-300">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">
                                Total Meal Cost ({people} person{people > 1 ? 's' : ''}):
                              </span>
                              <span className="text-2xl font-bold text-green-700">
                                $
                                {(
                                  (includeBreakfast
                                    ? (getBreakfastMenu()
                                      .filter((item) => selectedBreakfastItems.includes(item.name))
                                      .reduce((sum, item) => sum + (item.price || 0), 0) +
                                      (vegOption === "veg" && includeEggs ? 1.5 : 0)) *
                                    people
                                    : 0) +
                                  (includeLunch
                                    ? getLunchMenu()
                                      .filter((item) => selectedLunchItems.includes(item.name))
                                      .reduce((sum, item) => sum + (item.price || 0), 0) *
                                    people
                                    : 0)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : null}

                        {/* 🆕 NO MEALS SELECTED MESSAGE */}
                        {(!includeBreakfast && !includeLunch) && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                            <p className="text-sm text-gray-600">
                              Select breakfast or lunch to see available meal options
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 4. VISITOR DETAILS */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    4
                  </span>
                  Visitor Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* VISITOR TYPE & PEOPLE */}
                  <div>
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Visitor Type:</h3>
                      <div className="flex gap-3">
                        {["foreign", "local"].map((type) => (
                          <button
                            key={type}
                            onClick={() => setVisitorType(type)}
                            className={`px-4 py-2 rounded capitalize ${visitorType === type
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            {type} Visitor
                          </button>
                        ))}
                      </div>
                      {/* TICKET PRICE FROM API */}
                      <div className="mt-2 text-sm text-gray-600">
                        Ticket Price: ${getTicketPrice()} per person
                      </div>
                    </div>

                    {/* NUMBER OF PEOPLE */}
                    <div>
                      <h3 className="font-medium mb-3">Number of People:</h3>
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
                          onClick={() =>
                            setPeople(
                              Math.min(selectedPackage.maxCapacity || 7, people + 1)
                            )
                          }
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
                        Max {selectedPackage.maxCapacity || 7} people
                      </p>
                    </div>
                  </div>

                  {/* CONTACT INFORMATION FIELDS */}
                  <div>
                    {/* FOREIGN VISITOR FIELDS */}
                    {visitorType === "foreign" && (
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="fullName"
                          >
                            Full Name *
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="phoneNumber"
                          >
                            Phone Number *
                          </label>
                          <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="email"
                          >
                            Email Address *
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email address"
                            required
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
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter accommodation details"
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="passportNumber"
                          >
                            Passport Number *
                          </label>
                          <input
                            id="passportNumber"
                            type="text"
                            value={passportNumber || ""}
                            onChange={(e) => setPassportNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter passport number"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* LOCAL VISITOR FIELDS */}
                    {visitorType === "local" && (
                      <div className="space-y-4">
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="fullName"
                          >
                            Full Name *
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="phoneNumber"
                          >
                            Phone Number *
                          </label>
                          <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="email"
                          >
                            Email Address *
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                        <div>
                          <label
                            className="block font-semibold mb-1"
                            htmlFor="nicNumber"
                          >
                            NIC Number *
                          </label>
                          <input
                            id="nicNumber"
                            type="text"
                            value={nicNumber}
                            onChange={(e) => setNicNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter NIC number"
                            required
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
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter accommodation details"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 5. SUMMARY & BOOKING */}
              <section>
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <span className="bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    5
                  </span>
                  Review Your Reservation
                </h2>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* RESERVATION DETAILS */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-green-700">
                        Reservation Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-medium">
                            {selectedPackage.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Safari Type:</span>
                          <span className="font-medium">Private Safari</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">National Park:</span>
                          <span className="font-medium capitalize">
                            {selectedPackage.park}
                          </span>
                        </div>
                        {selectedPackage.block && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Block:</span>
                            <span className="font-medium">
                              {selectedPackage.block}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Jeep Type:</span>
                          <span className="font-medium">Luxury Jeep</span>
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
                          <span className="text-gray-600">Visitor Type:</span>
                          <span className="font-medium capitalize">
                            {visitorType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Meals:</span>
                          <span className="font-medium">
                            {mealOption === "with"
                              ? `${vegOption}${includeEggs ? " with eggs" : ""
                              }${includeBreakfast ? " + breakfast" : ""
                              }${includeLunch ? " + lunch" : ""}`
                              : "None"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Number of People:
                          </span>
                          <span className="font-medium">{people}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {privateDate
                              ? moment(privateDate).format("MMMM D, YYYY")
                              : "Not selected"}
                          </span>
                        </div>
                        {fullName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Customer Name:</span>
                            <span className="font-medium">{fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* PRICE SUMMARY - ALL FROM API */}
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-green-700">
                        Price Summary
                      </h3>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="space-y-2 mb-4">
                          {/* LUXURY JEEP PRICING */}
                          <div className="flex justify-between text-sm">
                            <span>Luxury Jeep:</span>
                            <span className="font-semibold">
                              ${pricing.jeep?.luxury?.[timeSlot] || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>
                              Guide (
                              {guideOption
                                .replace(/([A-Z])/g, " $1")
                                .trim()}):
                            </span>
                            <span className="font-semibold">
                              +${pricing.guide[guideOption] || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 italic">
                            <span>Per person share:</span>
                            <span>
                              $
                              {(
                                ((pricing.jeep?.luxury?.[timeSlot] || 0) +
                                  (pricing.guide[guideOption] || 0)) /
                                people
                              ).toFixed(2)}{" "}
                              each
                            </span>
                          </div>

                          {/* TICKET PRICING - FROM API */}
                          <div className="flex justify-between text-sm">
                            <span>
                              Tickets ({visitorType}, {people} person{people > 1 ? 's' : ''}):
                            </span>
                            <span className="font-semibold">
                              +${getTicketPrice() * people}
                            </span>
                          </div>

                          {/* MEAL PRICING - FROM API */}
                          {mealOption === "with" && (
                            <>
                              {includeBreakfast &&
                                selectedBreakfastItems.length > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span>
                                      Breakfast ({vegOption}
                                      {vegOption === "veg" && includeEggs
                                        ? " + eggs"
                                        : ""}
                                      ):
                                    </span>
                                    <span className="font-semibold">
                                      +$
                                      {(
                                        (getBreakfastMenu()
                                          .filter((item) =>
                                            selectedBreakfastItems.includes(
                                              item.name
                                            )
                                          )
                                          .reduce(
                                            (sum, item) =>
                                              sum + (item.price || 0),
                                            0
                                          ) +
                                          (vegOption === "veg" && includeEggs
                                            ? 1.5
                                            : 0)) *
                                        people
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              {includeLunch && selectedLunchItems.length > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span>Lunch ({vegOption}):</span>
                                  <span className="font-semibold">
                                    +$
                                    {(
                                      getLunchMenu()
                                        .filter((item) =>
                                          selectedLunchItems.includes(item.name)
                                        )
                                        .reduce(
                                          (sum, item) => sum + (item.price || 0),
                                          0
                                        ) * people
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* TOTAL PRICE */}
                        <div className="border-t border-gray-300 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">
                              Total Price:
                            </span>
                            <span className="text-2xl font-bold text-green-700">
                              ${calculateTotal()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-right">
                            Private Safari with Luxury Jeep
                          </p>
                        </div>
                      </div>

                      {/* BOOK NOW BUTTON */}
                      <button
                        className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={handleBookNow}
                        disabled={!pricing}
                      >
                        <svg
                          className="w-5 h-5"
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
                        {pricing
                          ? "Confirm & Book Now"
                          : "Loading pricing..."}
                      </button>

                      {!pricing && (
                        <p className="text-sm text-red-600 text-center mt-2">
                          Please wait while we load pricing information
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* NO PACKAGE SELECTED MESSAGE */}
        {!showPackageSelector && !selectedPackage && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Package Selected
            </h3>
            <p className="text-gray-600 mb-6">
              Please select a package to continue with your booking
            </p>
            <button
              onClick={() => setShowPackageSelector(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Browse Packages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;