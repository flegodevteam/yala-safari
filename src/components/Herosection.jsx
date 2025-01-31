import React from "react";
import yala from "../assets/yaala.png";

const HeroSection = () => {
  return (
    <div className="relative text-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${yala})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          Preserving the “Wild" for the future�
        </h1>
        <p className="mt-4 font-semibold text-amber-800 text-lg max-w-3xl">
          The mission statement of the Department of Wildlife Conservation (DWC)
          is, "To conserve wildlife and nature by the sustainable utilization of
          men, material and land through participatory management, research,
          education and law enforcement and ensure the maintenance of
          biodiversity and forest cover as exist today"
        </p>
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 text-lg font-medium text-blue-700 bg-white rounded hover:bg-gray-100">
            Book Now
          </button>
          <button className="px-6 py-3 text-lg font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600">
            Explore Tours
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
