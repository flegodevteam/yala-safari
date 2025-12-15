import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import taxiImage from "../assets/y (17).jpg";
import heroImage from "../assets/y (14).jpg";
import { apiEndpoints, publicFetch, API_BASE_URL } from "../config/api";


const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await publicFetch(apiEndpoints.rooms.base);
        const data = await response.json();
        
        if (data.success && data.data) {
          // Map API response to component structure
          const mappedRooms = data.data
            .filter(room => room.isActive) // Only show active rooms
            .map(room => {
              // Get featured image or first image
              const featuredImage = room.images?.find(img => img.isFeatured) || room.images?.[0];
              const imageUrl = featuredImage?.url 
                ? `${API_BASE_URL}${featuredImage.url}` 
                : "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
              
              // Format price
              const currency = room.pricing?.currency || 'USD';
              const perNight = room.pricing?.perNight || 0;
              const price = currency === 'USD' ? `$${perNight}` : `${currency}${perNight}`;
              
              return {
                _id: room._id,
                name: room.name,
                roomType: room.roomType,
                price: price,
                description: room.description || "per Night",
                features: room.amenities || [],
                image: imageUrl,
              };
            });
          setRooms(mappedRooms);
        } else {
          setError("Failed to load rooms");
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (roomId, roomType) => {
    navigate(`/room/${roomType.toLowerCase()}`);
  };

  const handleTaxiServiceClick = () => {
    navigate("/taxi-service");
  };

  return (
    <div className="font-sans" style={{ background: 'linear-gradient(to bottom, #e6e6e6, #ffffff)' }}>
      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url("${heroImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}></div>
        <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight" style={{ color: '#034123' }}>
            Welcome to Yala Safari
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mt-4" style={{ color: '#333333' }}>
            Hotel Rooms & Taxi Service
          </h2>
          <p className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#333333' }}>
            Experience comfort and convenience with our premium accommodations and reliable transportation services.
          </p>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: '#034123' }}>
              Our Rooms
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg" style={{ color: '#333333' }}>
              Choose from our comfortable accommodations designed for your comfort and convenience.
            </p>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: '#333333' }}>Loading rooms...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg" style={{ color: '#333333' }}>No rooms available at the moment.</p>
            </div>
          )}

          {!loading && !error && rooms.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => handleRoomClick(room._id, room.roomType)}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-105"
                  style={{ borderColor: 'rgba(3, 65, 35, 0.1)' }}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold shadow-lg" style={{ backgroundColor: '#fee000', color: '#034123' }}>
                        {room.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#034123' }}>
                      {room.name}
                    </h3>
                    <p className="text-base mb-4" style={{ color: '#333333' }}>
                      {room.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {room.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm" style={{ color: '#333333' }}>
                          <svg className="h-4 w-4 mr-2 flex-shrink-0" style={{ color: '#f26b21' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors duration-200"
                      style={{ backgroundColor: '#f26b21' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#034123'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Taxi Service Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#034123' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Taxi Service
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg" style={{ color: '#e6e6e6' }}>
              Need a ride? We offer reliable taxi services for airport transfers, sightseeing, and more. Book your taxi with us for a comfortable and safe journey.
            </p>
          </div>
          
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="mb-8 lg:mb-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={taxiImage}
                  alt="Taxi Service"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
            <div>
              <ul className="space-y-4 mb-8">
                {[
                  "Airport Pickup & Drop",
                  "Safari Park Transfers",
                  "City Tours",
                  "24/7 Availability",
                  "Professional Drivers",
                  "Comfortable Vehicles"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center mr-3 flex-shrink-0" style={{ color: '#fee000' }}>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-lg text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ backgroundColor: '#f26b21' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#fee000'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
                onClick={handleTaxiServiceClick}
              >
                Book a Taxi
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
