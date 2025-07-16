import { useState } from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

const TaxiService = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const vehicleTypes = [
    {
      id: 1,
      name: "Standard Car",
      image:
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      capacity: 3,
      pricePerKm: 2.5,
      description: "Comfortable sedan for small groups",
    },
    {
      id: 2,
      name: "SUV",
      image:
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      capacity: 6,
      pricePerKm: 3.5,
      description: "Spacious vehicle for families",
    },
    {
      id: 3,
      name: "Luxury Van",
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      capacity: 8,
      pricePerKm: 4.5,
      description: "Premium comfort for large groups",
    },
  ];

  const calculateEstimatedPrice = (distance) => {
    if (!selectedVehicle) return 0;
    return (distance * selectedVehicle.pricePerKm).toFixed(2);
  };

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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Book Your Taxi
              </h2>

              <div className="space-y-6">
                {/* Pickup Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
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

                {/* Drop Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Drop Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Enter drop location"
                    />
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pickup Date
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
                      Pickup Time
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

                {/* Passengers */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passengers
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserAlt className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "person" : "people"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Vehicle
              </h2>

              <div className="space-y-4">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedVehicle?.id === vehicle.id
                        ? "border-amber-500 ring-2 ring-amber-200 bg-amber-50"
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
                        <p className="text-sm text-gray-600">
                          {vehicle.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            <FaUserAlt className="inline mr-1" />{" "}
                            {vehicle.capacity} people
                          </span>
                          <span className="font-bold text-amber-600">
                            €{vehicle.pricePerKm}/km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Price Estimate */}
                {selectedVehicle && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        Estimated Price (50km):
                      </span>
                      <span className="text-xl font-bold text-amber-600">
                        €{calculateEstimatedPrice(50)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Actual price may vary based on exact distance
                    </p>
                  </div>
                )}

                {/* Book Now Button */}
                <button
                  disabled={
                    !selectedVehicle || !pickupLocation || !dropLocation
                  }
                  className={`w-full mt-6 py-3 px-4 rounded-md font-bold text-white ${
                    !selectedVehicle || !pickupLocation || !dropLocation
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-amber-600 hover:bg-amber-700"
                  }`}
                  onClick={() => {
                    if (selectedVehicle && pickupLocation && dropLocation) {
                      window.location.href = "/booking";
                    }
                  }}
                >
                  Book Taxi Now
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
