import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";

const RoomDetails = ({ onBack }) => {
  const { roomType } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Guest Details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [notes, setNotes] = useState("");
  
  // Booking Status
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await publicFetch(apiEndpoints.rooms.base);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Find room by roomType (case-insensitive)
          const foundRoom = data.data.find(
            r => r.isActive && r.roomType?.toLowerCase() === roomType?.toLowerCase()
          );
          
          if (foundRoom) {
            // Map API response to component structure
            const mappedRoom = {
              _id: foundRoom._id,
              name: foundRoom.name,
              roomType: foundRoom.roomType,
              price: foundRoom.pricing?.perNight || 0,
              currency: foundRoom.pricing?.currency || 'USD',
              description: foundRoom.description || "",
              amenities: foundRoom.amenities || [],
              images: foundRoom.images?.map(img => 
                img.url ? `${API_BASE_URL}${img.url}` : null
              ).filter(Boolean) || [],
              capacity: {
                adults: foundRoom.capacity?.adults || 0,
                children: foundRoom.capacity?.children || 0,
              },
              availability: {
                isAvailable: foundRoom.availability?.isAvailable || false,
                totalRooms: foundRoom.availability?.totalRooms || 0,
              },
              policies: {
                checkIn: foundRoom.policies?.checkIn || "2:00 PM",
                checkOut: foundRoom.policies?.checkOut || "11:00 AM",
                cancellationPolicy: foundRoom.policies?.cancellationPolicy || "Free cancellation up to 48 hours before check-in",
              },
            };
            
            // Set default adults to max capacity
            if (mappedRoom.capacity.adults > 0) {
              setAdults(mappedRoom.capacity.adults);
            }
            
            setRoom(mappedRoom);
          } else {
            setFetchError("Room not found");
          }
        } else {
          setFetchError("Failed to load room details");
        }
      } catch (err) {
        console.error("Error fetching room:", err);
        setFetchError("Failed to load room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (roomType) {
      fetchRoom();
    }
  }, [roomType]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
        <div className="text-center">
          <p className="text-lg" style={{ color: '#333333' }}>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !room) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{fetchError || "Room not found"}</p>
          <button
            onClick={() => navigate("/rooms")}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  const subtotal = roomCount * room.price;
  const discount = 0; // You can calculate discounts here
  const total = subtotal - discount;
  const currencySymbol = room.currency === 'USD' ? '$' : room.currency;

  const nextImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (room.images && room.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleBookNow = async () => {
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
    if (!checkInDate || !checkOutDate) {
      setError("Please select both Check-in and Check-out dates.");
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError("Check-out date must be after the Check-in date.");
      return;
    }
    if (adults < 1) {
      setError("At least 1 adult must be selected.");
      return;
    }
    if (roomCount < 1) {
      setError("At least 1 room must be selected.");
      return;
    }
    
    // Check capacity limits
    const maxGuests = (room.capacity?.adults || 0) + (room.capacity?.children || 0);
    const totalGuests = adults + children;
    if (maxGuests > 0 && totalGuests > maxGuests * roomCount) {
      setError(`Maximum ${maxGuests} guests per room. Please adjust your selection.`);
      return;
    }
    
    // Check availability
    if (room.availability && !room.availability.isAvailable) {
      setError("This room is currently not available.");
      return;
    }
    
    if (room.availability && roomCount > room.availability.totalRooms) {
      setError(`Only ${room.availability.totalRooms} room(s) available.`);
      return;
    }
    
    setError(""); // Clear error

    try {
      setSubmitting(true);
      
      // Format dates to ISO format with check-in/check-out times
      const checkInDateTime = new Date(`${checkInDate}T14:00:00`).toISOString();
      const checkOutDateTime = new Date(`${checkOutDate}T11:00:00`).toISOString();

      // Prepare booking data according to API structure
      const bookingData = {
        room: room._id,
        guestDetails: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          country: country.trim(),
          specialRequests: specialRequests.trim() || "",
        },
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
        guests: {
          adults: adults,
          children: children,
        },
        paymentStatus: "pending",
        bookingStatus: "pending",
        notes: notes.trim() || "",
      };

      // Log the booking data being sent
      console.log("📤 Sending room booking data:", bookingData);
      console.log("🌐 API URL:", `${API_BASE_URL}/api/room-bookings`);

      // Make API call
      const response = await publicFetch(`${API_BASE_URL}/api/room-bookings`, {
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
          console.log("✅ Room booking created successfully:", result.data);
          setBookingDetails({
            bookingId: result.data?._id || result.data?.id,
            bookingReference: result.data?.bookingReference,
            message: result.message || "Room booking created successfully!",
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
      console.error("❌ Error creating room booking:", err);
      setError(err.message || "An error occurred while creating your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-amber-600 p-4">
        <h1 className="text-2xl font-bold text-white text-center">
          {room.name}
        </h1>
      </div>

      {/* Room Image Gallery */}
      <div className="relative">
        {room.images && room.images.length > 0 ? (
          <>
            <img
              src={room.images[currentImageIndex] || room.images[0]}
              alt={room.name}
              className="w-full h-64 object-cover"
            />
            {room.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  &lt;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                >
                  &gt;
                </button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index
                          ? "bg-white"
                          : "bg-white bg-opacity-50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>

      {/* Room Description */}
      <div className="p-4 border-b">
        <p className="text-gray-700 mb-2">{room.description}</p>
        <div className="flex flex-wrap gap-2">
          {room.amenities.map((amenity, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Booking Details */}
      <div className="p-6">
        {bookingSuccess ? (
          // Success Confirmation Message
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Booking Pending!
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {bookingDetails?.message || "Your room booking has been created successfully."}
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
            <button
              onClick={onBack || (() => navigate("/rooms"))}
              className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Back to Rooms
            </button>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 font-semibold text-center">{error}</p>
              </div>
            )}
        {/* Dates */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Guests and Rooms */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Adults
              </h3>
              <p className="text-2xl font-bold">{adults}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>
              <button
                onClick={() => {
                  const maxAdults = room.capacity 
                    ? (room.capacity.adults || 0) * (roomCount || 1)
                    : 999;
                  setAdults(Math.min(maxAdults, adults + 1));
                }}
                className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                Children
              </h3>
              <p className="text-2xl font-bold">{children}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>
              <button
                onClick={() => {
                  const maxChildren = room.capacity 
                    ? (room.capacity.children || 0) * (roomCount || 1)
                    : 999;
                  setChildren(Math.min(maxChildren, children + 1));
                }}
                className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700"
              >
                +
              </button>
            </div>
          </div>
          
          {room.capacity && (room.capacity.adults > 0 || room.capacity.children > 0) && (
            <p className="text-xs text-gray-500 mt-2">
              Capacity: {room.capacity.adults} adults, {room.capacity.children} children per room
            </p>
          )}

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                No. of Rooms
              </h3>
              <p className="text-2xl font-bold">{roomCount}</p>
              {room.availability && room.availability.totalRooms > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {room.availability.totalRooms} available
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setRoomCount(Math.max(0, roomCount - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>
              <button
                onClick={() => {
                  const maxRooms = room.availability?.totalRooms || 999;
                  setRoomCount(Math.min(maxRooms, roomCount + 1));
                }}
                className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Price per Night</span>
            <span className="font-medium">{currencySymbol}{room.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">SubTotal ({roomCount} room{roomCount !== 1 ? 's' : ''})</span>
            <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium">{currencySymbol}{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Policies */}
        {room.policies && (
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">
              <p><strong>Check-in:</strong> {room.policies.checkIn}</p>
              <p><strong>Check-out:</strong> {room.policies.checkOut}</p>
            </div>
            <div className="text-center text-green-600 font-bold">
              {room.policies.cancellationPolicy.includes('Free') ? 'FREE CANCELLATION' : 'CANCELLATION POLICY'}
              <div className="text-xs text-gray-500 mt-1 font-normal">
                {room.policies.cancellationPolicy}
              </div>
            </div>
          </div>
        )}

        {/* Guest Details */}
        <div className="mb-6 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Guest Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Last name"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md"
                  placeholder="Country"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Any special requests..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Additional notes..."
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onBack || (() => navigate("/rooms"))}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700"
            disabled={submitting}
          >
            Back
          </button>
          <button
            onClick={handleBookNow}
            disabled={submitting}
            className={`flex-1 py-2 px-4 rounded-md ${
              submitting
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-amber-600 text-white hover:bg-amber-700"
            }`}
          >
            {submitting ? "Booking..." : "Book Now"}
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
