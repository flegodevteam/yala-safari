import React from "react";
import { useNavigate } from "react-router-dom";
import SafariReservation from "../components/SafariReservation";

const SafariPackages = () => {
  const navigate = useNavigate();

  const packages = [
    {
      name: "Wildlife Safari",
      details: "Explore the rich wildlife with expert guides.",
      price: "$150 per person",
      groupSize: "4-6 people",
      duration: "6 hours",
      meal: "Vegetarian/Non-Vegetarian",
    },
    {
      name: "Luxury Safari",
      details: "Experience the safari in premium comfort.",
      price: "$300 per person",
      groupSize: "2-4 people",
      duration: "Full day",
      meal: "Gourmet options",
    },
    {
      name: "Budget Safari",
      details: "Affordable safari experience for everyone.",
      price: "$100 per person",
      groupSize: "6-10 people",
      duration: "4 hours",
      meal: "Basic meal included",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Safari Packages</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg transform hover:scale-105 ">
            <h3 className="text-xl font-semibold">{pkg.name}</h3>
            <p className="text-gray-700">{pkg.details}</p>
            <p className="font-bold">Price: {pkg.price}</p>
            <p>Group Size: {pkg.groupSize}</p>
            <p>Duration: {pkg.duration}</p>
            <p>Meal: {pkg.meal}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate("/online-booking")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Shared
              </button>
              <button
                onClick={() => navigate("/online-booking")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Private
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        {" "}
        {/* Add margin-top to create a gap */}
        <SafariReservation />
      </div>
    </div>
  );
};

export default SafariPackages;
