// RoomDetail.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RoomDetail = () => {
  const { roomType } = useParams();
  const navigate = useNavigate();

  // Room data for all types
  const allRoomDetails = {
    triple: {
      title: "Triple Room",
      description: "Ideal for small families or groups, our triple room offers spacious comfort with three cozy beds, modern amenities, and stylish decor.",
      amenities: ["Free WiFi", "Air Conditioning", "Hot Water"],
      menu: ["Select Menu", "Select Menu"],
      safety: ["0", "No allowance", "0", "No allowance"],
      pricing: ["€40", "Discount", "€40", "Total", "€40"],
      recommendations: ["Wellness - Yes Service...", "Wellness - Yes Service..."],
      extras: ["Pitch Coupons", "Pitch Coupons", "Water Bottle", "Water Bottle"]
    },
    double: {
      title: "Double Room",
      description: "Perfect for couples, our double room features a comfortable queen-sized bed with premium linens and elegant decor.",
      amenities: ["Free WiFi", "Air Conditioning", "Hot Water", "Mini Bar"],
      menu: ["Select Menu", "Select Menu"],
      safety: ["0", "No allowance", "0", "No allowance"],
      pricing: ["€32", "Discount", "€32", "Total", "€32"],
      recommendations: ["Wellness - Yes Service...", "Wellness - Yes Service..."],
      extras: ["Pitch Coupons", "Water Bottle"]
    },
    hostel: {
      title: "Hostel Room",
      description: "Budget-friendly shared accommodation with comfortable bunk beds and communal facilities.",
      amenities: ["Free WiFi", "Shared Bathroom", "Locker"],
      menu: ["Select Menu"],
      safety: ["0", "No allowance"],
      pricing: ["€10", "Discount", "€10", "Total", "€10"],
      recommendations: ["Basic Service..."],
      extras: ["Water Bottle"]
    }
  };

  // Fallback to triple if roomType doesn't exist
  const room = allRoomDetails[roomType] || allRoomDetails.triple;

  if (!room) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{room.title}</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-6">{room.description}</p>
        
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
          {room.amenities.map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">✓</span>
              {item}
            </li>
          ))}
        </ul>
        
        {/* Render other sections similarly */}
        
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Back to Rooms
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;