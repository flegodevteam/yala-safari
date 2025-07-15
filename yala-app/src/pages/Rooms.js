import React from 'react';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const navigate = useNavigate();

  const rooms = [
    {
      name: "Triple",
      roomType: "triple", // Added roomType identifier
      price: "€40",
      description: "Night",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Double",
      roomType: "double", // Added roomType identifier
      price: "€32",
      description: "Night",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Single",
      roomType: "single", // Added roomType identifier
      price: "€10",
      description: "Night",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  const handleRoomClick = (roomType) => {
    navigate(`/room/${roomType.toLowerCase()}`); // Ensure lowercase for consistency
  }

  return (
    <div className="font-sans">
      {/* Welcome Section */}
      <section
        className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-wide">
            WELCOME TO YALA SAFARI
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-100 mt-8">
            Hotel Rooms
          </h2>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-12 text-center">Rooms</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div 
                key={index}
                onClick={() => handleRoomClick(room.roomType)} // Pass roomType instead of room.roomType
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <p className="text-2xl font-semibold mt-1">{room.price} <span className="text-sm font-normal">{room.description}</span></p>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                  <p className="text-2xl font-semibold text-gray-800 mt-1">{room.price} <span className="text-sm font-normal text-gray-600">{room.description}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;