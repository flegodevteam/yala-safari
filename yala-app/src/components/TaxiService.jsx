import { useState, useEffect } from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserAlt,
  FaMoneyBillWave,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";

const TaxiService = () => {
  // Customer Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  
  // Trip Details
  const [serviceType, setServiceType] = useState("Airport Transfer");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  
  // Passengers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [luggage, setLuggage] = useState(0);
  
  // Additional Fields
  const [specialRequests, setSpecialRequests] = useState("");
  const [notes, setNotes] = useState("");
  
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [error, setError] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchTaxis = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await publicFetch(apiEndpoints.taxis.base);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Map API response to component structure
          const mappedVehicles = data.data
            .filter(taxi => taxi.isActive && taxi.isAvailable)
            .map(taxi => {
              // Get featured image or first image
              const featuredImage = taxi.images?.find(img => img.isFeatured) || taxi.images?.[0];
              let imageUrl = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
              if (featuredImage?.url) {
                // Handle both absolute and relative URLs
                imageUrl = featuredImage.url.startsWith('http') 
                  ? featuredImage.url 
                  : `${API_BASE_URL}${featuredImage.url}`;
              }
              
              return {
                id: taxi._id,
                name: taxi.vehicleName || taxi.vehicleType,
                vehicleType: taxi.vehicleType,
                image: imageUrl,
                capacity: taxi.capacity?.passengers || 0,
                luggage: taxi.capacity?.luggage || 0,
                pricePerKm: taxi.pricing?.pricePerKm || 0,
                basePrice: taxi.pricing?.basePrice || 0,
                airportTransfer: taxi.pricing?.airportTransfer || 0,
                fullDayRate: taxi.pricing?.fullDayRate || 0,
                currency: taxi.pricing?.currency || 'USD',
                description: taxi.description || "",
                features: taxi.features || [],
                serviceAreas: taxi.serviceAreas || [],
                driverInfo: taxi.driverInfo || {},
                images: taxi.images || [],
              };
            });
          setVehicleTypes(mappedVehicles);
        } else {
          setFetchError("Failed to load taxi vehicles");
        }
      } catch (err) {
        console.error("Error fetching taxis:", err);
        setFetchError("Failed to load taxi vehicles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTaxis();
  }, []);

  // eslint-disable-next-line no-unused-vars -- reserved for future price display
  const calculateEstimatedPrice = (distance) => {
    if (!selectedVehicle) return 0;
    const price = (distance * selectedVehicle.pricePerKm) + (selectedVehicle.basePrice || 0);
    return price.toFixed(2);
  };

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : currency;
  };

  const handleBookTaxi = async () => {
    // Validation
    if (!firstName.trim()) {
      setError("First Name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last Name is required.");
      return;
    }
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone is required.");
      return;
    }
    if (!country.trim()) {
      setError("Country is required.");
      return;
    }
    if (!pickupLocation.trim()) {
      setError("Pickup Location is required.");
      return;
    }
    if (!dropoffLocation.trim()) {
      setError("Dropoff Location is required.");
      return;
    }
    if (!pickupDate) {
      setError("Please select a Pickup Date.");
      return;
    }
    if (!pickupTime) {
      setError("Please select a Pickup Time.");
      return;
    }
    if (!selectedVehicle) {
      setError("Please select a vehicle.");
      return;
    }
    setError("");

    try {
      setSubmitting(true);
      
      // Format pickupDate to ISO format with time
      const dateTime = new Date(`${pickupDate}T${pickupTime}`);
      const pickupDateTime = dateTime.toISOString();

      // Prepare booking data according to API structure
      const bookingData = {
        taxi: selectedVehicle.id,
        customerDetails: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim(),
        },
        tripDetails: {
          serviceType: serviceType,
          pickupLocation: pickupLocation.trim(),
          dropoffLocation: dropoffLocation.trim(),
          pickupDate: pickupDateTime,
          pickupTime: pickupTime,
          distance: 0,
          duration: 0,
        },
        passengers: {
          adults: adults,
          children: children,
          luggage: luggage,
        },
        specialRequests: specialRequests.trim() || "",
        paymentStatus: "pending",
        bookingStatus: "pending",
        notes: notes.trim() || "",
      };

      // Log the booking data being sent
      console.log("📤 Sending booking data:", bookingData);
      console.log("🌐 API URL:", `${API_BASE_URL}/api/taxi-bookings`);

      // Make API call
      const response = await publicFetch(`${API_BASE_URL}/api/taxi-bookings`, {
        method: "POST",
        body: JSON.stringify(bookingData),
      });

      console.log("📥 Response status:", response.status);
      console.log("📥 Response ok:", response.ok);

      // Parse response
      let result;
      try {
        const responseText = await response.text();
        console.log("📥 Response text:", responseText);
        result = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("❌ Error parsing response:", parseError);
        setError("Invalid response from server. Please try again.");
        return;
      }

      console.log("📥 Parsed result:", result);

      if (response.ok) {
        // Check if booking was successful
        if (result.success || result.data) {
          // Success - show confirmation message
          console.log("✅ Booking created successfully:", result.data);
          setBookingDetails({
            bookingId: result.data?._id || result.data?.id,
            bookingReference: result.data?.bookingReference,
            message: result.message || "Booking created successfully!",
          });
          setBookingSuccess(true);
          setError(""); // Clear any previous errors
        } else {
          // Response OK but no success flag or data
          const errorMessage = result.message || result.error || "Booking failed. Please try again.";
          console.error("❌ Booking failed:", errorMessage);
          setError(errorMessage);
        }
      } else {
        // Handle error response
        const errorMessage = result.message || result.error || `Server error: ${response.status} ${response.statusText}`;
        console.error("❌ Booking failed:", errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error("❌ Error creating taxi booking:", err);
      setError(err.message || "An error occurred while creating your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-700">Loading taxi vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-red-600 mb-4">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Yala Safari Taxi Service
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Reliable transportation for your safari adventure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              {bookingSuccess ? (
                // Success Confirmation Message
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <FaCheckCircle className="h-20 w-20 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Booking Confirmed!
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    {bookingDetails?.message || "Your taxi booking has been created successfully."}
                  </p>
                  {bookingDetails?.bookingReference && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Booking Reference:</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {bookingDetails.bookingReference}
                      </p>
                    </div>
                  )}
                  {bookingDetails?.bookingId && (
                    <p className="text-sm text-gray-500 mt-4">
                      Booking ID: {bookingDetails.bookingId}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-6">
                    A confirmation email has been sent to your email address.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Book Your Taxi
                  </h2>

                  <div className="space-y-6">
                {/* Customer Details Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaEnvelope className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaGlobe className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Details Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Trip Details
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="Airport Transfer">Airport Transfer</option>
                      <option value="City Transfer">City Transfer</option>
                      <option value="Full Day">Full Day</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Location *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter pickup location"
                      />
                    </div>
                  </div>
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dropoff Location *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={dropoffLocation}
                        onChange={(e) => setDropoffLocation(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter dropoff location"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Time *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passengers Section */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Passengers & Luggage
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adults
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          {Array.from({ length: 8 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Children
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUserAlt className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={children}
                          onChange={(e) => setChildren(parseInt(e.target.value))}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          {Array.from({ length: 9 }, (_, i) => i).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Luggage
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaCar className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          value={luggage}
                          onChange={(e) => setLuggage(parseInt(e.target.value))}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                        >
                          {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Additional Information
                  </h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Additional notes (e.g., Flight number, etc.)"
                    />
                  </div>
                </div>

                    {/* Error Display in Form */}
                    {error && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 font-semibold text-center">{error}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Vehicle
              </h2>

              <div className="space-y-4">
                {vehicleTypes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No vehicles available at the moment.</p>
                  </div>
                ) : (
                  vehicleTypes.map((vehicle) => {
                    const totalPassengers = adults + children;
                    return (
                    <div
                      key={vehicle.id}
                      onClick={() => {
                        // Check if vehicle can accommodate selected passengers
                        if (vehicle.capacity >= totalPassengers) {
                          setSelectedVehicle(vehicle);
                          setError("");
                        } else {
                          setError(`This vehicle can only accommodate up to ${vehicle.capacity} passengers. Please select a different vehicle or reduce passenger count.`);
                        }
                      }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedVehicle?.id === vehicle.id
                          ? "border-amber-500 ring-2 ring-amber-200 bg-amber-50"
                          : totalPassengers > vehicle.capacity
                          ? "border-gray-200 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">
                            {vehicle.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            {vehicle.vehicleType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {vehicle.description}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              <FaUserAlt className="inline mr-1" />{" "}
                              {vehicle.capacity} {vehicle.capacity === 1 ? "person" : "people"}
                              <br />
                              {vehicle.luggage > 0 && (
                                <span className="ml-2">• {vehicle.luggage} luggage</span>
                              )}
                            </span>
                            <span className="font-bold text-amber-600">
                              {getCurrencySymbol(vehicle.currency)}{vehicle.pricePerKm}/km
                            </span>
                          </div>
                          {vehicle.features && vehicle.features.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {vehicle.features.slice(0, 3).map((feature, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                    {feature}
                                  </span>
                                ))}
                                {vehicle.features.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{vehicle.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}

                {/* Price Estimate */}
                {/* {selectedVehicle && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          Base Price:
                        </span>
                        <span className="font-bold text-amber-600">
                          {getCurrencySymbol(selectedVehicle.currency)}{selectedVehicle.basePrice || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">
                          Estimated Price (50km):
                        </span>
                        <span className="text-xl font-bold text-amber-600">
                          {getCurrencySymbol(selectedVehicle.currency)}{calculateEstimatedPrice(50)}
                        </span>
                      </div>
                      {selectedVehicle.airportTransfer > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Airport Transfer:
                          </span>
                          <span className="font-medium text-gray-700">
                            {getCurrencySymbol(selectedVehicle.currency)}{selectedVehicle.airportTransfer}
                          </span>
                        </div>
                      )}
                      {selectedVehicle.fullDayRate > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Full Day Rate:
                          </span>
                          <span className="font-medium text-gray-700">
                            {getCurrencySymbol(selectedVehicle.currency)}{selectedVehicle.fullDayRate}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Actual price may vary based on exact distance
                    </p>
                  </div>
                )} */}

                {error && (
                  <div className="mb-4 text-red-600 font-semibold text-center">
                    {error}
                  </div>
                )}
                {/* Book Now Button */}
                <button
                  disabled={
                    submitting ||
                    !selectedVehicle ||
                    !firstName ||
                    !lastName ||
                    !email ||
                    !phone ||
                    !country ||
                    !pickupLocation ||
                    !dropoffLocation ||
                    !pickupDate ||
                    !pickupTime
                  }
                  className={`w-full mt-6 py-3 px-4 rounded-md font-bold text-white ${
                    submitting ||
                    !selectedVehicle ||
                    !firstName ||
                    !lastName ||
                    !email ||
                    !phone ||
                    !country ||
                    !pickupLocation ||
                    !dropoffLocation ||
                    !pickupDate ||
                    !pickupTime
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                  onClick={handleBookTaxi}
                >
                  {submitting ? "Submitting..." : "Book Taxi Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <FaCar className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              24/7 Service
            </h3>
            <p className="text-gray-600">
              Available anytime for your convenience
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <FaMoneyBillWave className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Fixed Prices
            </h3>
            <p className="text-gray-600">No hidden charges or surprises</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <FaUserAlt className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Local Drivers
            </h3>
            <p className="text-gray-600">
              Experienced drivers who know the area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiService;
