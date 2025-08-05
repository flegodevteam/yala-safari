import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RoomDetails = ({ onBack }) => {
  const { roomType } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Error state

  // Enhanced room data with multiple images for each room type
  const roomData = {
    triple: {
      name: "Triple Room",
      price: 40,
      description: "Spacious room perfect for families or groups of three",
      images: [
        "https://a0.muscache.com/im/pictures/3cf78d22-1fbb-428d-9bd0-da9dcd36bc3e.jpg?im_w=720",
        "https://images.trvl-media.com/lodging/20000000/19960000/19956900/19956828/195f94c6.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
        "https://cf.bstatic.com/xdata/images/hotel/max1024x768/490714682.jpg?k=0014fe77b09d84339ccb5a604adf52665038651eee6241f7ad2a3212ece9c375&o=&hp=1",
      ],
      amenities: [
        "3 Single Beds",
        "Private Bathroom",
        "Air Conditioning",
        "Free WiFi",
      ],
    },
    double: {
      name: "Double Room",
      price: 32,
      description: "Comfortable room with a queen-size bed",
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      amenities: [
        "Queen Bed",
        "Private Bathroom",
        "Air Conditioning",
        "Free WiFi",
      ],
    },
    hostel: {
      name: "Hostel Bed",
      price: 10,
      description: "Budget-friendly shared accommodation",
      images: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      ],
      amenities: ["Single Bed", "Shared Bathroom", "Lockers", "Free WiFi"],
    },
  };

  const room = roomData[roomType?.toLowerCase()] || roomData.triple;
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const subtotal = roomCount * room.price;
  const discount = 0; // You can calculate discounts here
  const total = subtotal - discount;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  const handleBookNow = () => {
    // Validation
    if (!checkInDate || !checkOutDate) {
      setError("Please select both Check-in and Check-out dates.");
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError("Check-out date must be after the Check-in date.");
      return;
    }
    if (guestCount < 1) {
      setError("At least 1 guest must be selected.");
      return;
    }
    if (roomCount < 1) {
      setError("At least 1 room must be selected.");
      return;
    }
    setError(""); // Clear error
    navigate("/booking", {
      state: {
        roomType: room.name,
        checkInDate,
        checkOutDate,
        guestCount,
        roomCount,
        subtotal,
        discount,
        total,
      },
    });
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
        <img
          src={room.images[currentImageIndex]}
          alt={room.name}
          className="w-full h-64 object-cover"
        />
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              &lt;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-600 font-semibold text-center">
            {error}
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
                Total Guests
              </h3>
              <p className="text-2xl font-bold">{guestCount}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setGuestCount(Math.max(0, guestCount - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => setGuestCount(guestCount + 1)}
                className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                No. of Rooms
              </h3>
              <p className="text-2xl font-bold">{roomCount}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setRoomCount(Math.max(0, roomCount - 1))}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
              >
                -
              </button>
              <button
                onClick={() => setRoomCount(roomCount + 1)}
                className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="border-t border-b border-gray-200 py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">SubTotal</span>
            <span className="font-medium">€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium">€{discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="font-bold">Total</span>
            <span className="font-bold text-lg">€{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Free message */}
        <div className="text-center text-green-600 font-bold mb-6">
          FREE CANCELLATION
          <div className="text-xs text-gray-500 mt-1">
            Cancel up to 24 hours before check-in
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700"
          >
            Back
          </button>
          <button
            onClick={() => {
              handleBookNow();
            }}
            className="flex-1 py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
