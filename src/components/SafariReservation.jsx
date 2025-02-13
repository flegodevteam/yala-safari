import React from "react";
import yala from "../assets/yaala.png";

const SafariReservation = () => {
  return (
    <div
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Safari Reservation
        </h1>

        {/* Private & Shared Reservation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Private Reservation */}
          <div className="bg-white shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">Private Reservation</h2>
            <p className="font-bold">Yala, Bundala, Udawalawe</p>
            <p className="mt-2 font-semibold">Options (Yala)</p>
            <ul className="list-disc ml-6">
              <li>Block I</li>
              <li>Block IV</li>
            </ul>
            <p className="mt-4">Cost Calculation = Ticket Price + Jeep Price</p>
            <p>Jeep cost is divided among members. Ticket price per person:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>1 person - $10</li>
              <li>2 persons - $4</li>
              <li>4 persons - $2.5</li>
            </ul>
          </div>

          {/* Shared Reservation */}
          <div className="bg-green-300 shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">Shared Reservation</h2>
            <p className="font-bold">Yala</p>
            <p className="mt-2 font-semibold">Options (Yala)</p>
            <ul className="list-disc ml-6">
              <li>Block I</li>
              <li>Block IV</li>
            </ul>
            <p className="mt-4">
              Cost Calculation = Total cost minimized by members booking
              together.
            </p>
            <p>Ticket price per person:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>1 person - $10</li>
              <li>2 persons - $8</li>
              <li>4 persons - $5</li>
              <li>5-7 persons - $5 (fixed)</li>
            </ul>
          </div>
        </div>

        {/* Price & Visitor Options */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Basic Packages */}
          <div className="bg-white shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">
              Basic G, Luxury, Super Luxury
            </h2>
            <p>Price changes according to visiting time:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Morning (3-4 hours) - $5</li>
              <li>Extended Morning - $7</li>
              <li>Afternoon (3-4 hours) - $5</li>
              <li>Full Day - $10</li>
            </ul>
          </div>

          {/* Visitor Options */}
          <div className="bg-white shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">Visitor Options</h2>
            <p>Foreign Visitors:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>With Meals (Breakfast): Non-Vegetarian / Vegetarian</li>
              <li>Without Meals</li>
            </ul>
            <p className="mt-2">Local Visitors also available.</p>
          </div>
        </div>

        {/* Payment & Accommodation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            <ul className="list-disc ml-6">
              <li>Cash</li>
              <li>Bank Deposit (Slip Upload)</li>
              <li>Bank Transfer</li>
            </ul>
          </div>
          <div className="bg-white shadow-lg p-6 rounded-2xl transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-4">Accommodation</h2>
            <p>Pick-up location: GPS & manual entry</p>
            <p>WhatsApp number (Compulsory)</p>
            <p>Hotel contact number (Working)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafariReservation;
