import React, { useState } from "react";

const timeslots = [
  "5:00 AM - 10:00 AM",
  "2:00 PM - 6:30 PM",
  "5:00 AM - 12:00 PM",
  "5:00 AM - 6:00 PM",
];

const addOns = [
  { id: "lunch", label: "Lunch (+$10)" },
  { id: "binocular", label: "Binocular Rental (+$5)" },
];

function getDatesInMonth(year, month) {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

export default function YalaSafariBooking() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    participants: 1,
    addOns: [],
    paymentMethod: "creditCard",
  });

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const dates = getDatesInMonth(year, month);

  function handleAddOnChange(id) {
    setFormData((prev) => {
      const addOns = prev.addOns.includes(id)
        ? prev.addOns.filter((a) => a !== id)
        : [...prev.addOns, id];
      return { ...prev, addOns };
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot.");
      return;
    }
    // Here integrate payment gateway & booking API calls
    alert(
  `Booking confirmed for ${formData.name} on ${selectedDate.toDateString()} at ${selectedTime}. Confirmation will be sent via email/SMS.`
);
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  // Disable past dates
  const isDateDisabled = (date) => date < today;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">
        Yala Safari Online Booking
      </h1>

      {/* Calendar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={prevMonth}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            &lt; Prev
          </button>
          <h2 className="text-xl font-semibold">
            {new Date(year, month).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button
            onClick={nextMonth}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Next &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-green-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-1">
          {Array(new Date(year, month, 1).getDay())
            .fill(null)
            .map((_, i) => (
              <div key={"empty" + i} />
            ))}
          {dates.map((date) => {
            const disabled = isDateDisabled(date);
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={date.toISOString()}
                disabled={disabled}
                onClick={() => setSelectedDate(date)}
                className={`p-2 rounded ${
                  disabled
                    ? "text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-200"
                }`}
                aria-label={`Select date ${date.toDateString()}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="timeSlot">
            Select Time Slot
          </label>
          <select
            id="timeSlot"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Select --</option>
            {timeslots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="contact">
            Contact Info (Email or Phone)
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Email or phone number"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="participants">
            Number of Participants
          </label>
          <input
            id="participants"
            name="participants"
            type="number"
            min="1"
            max="7"
            value={formData.participants}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <fieldset>
          <legend className="font-semibold mb-2">Add-on Services</legend>
          {addOns.map(({ id, label }) => (
            <label key={id} className="inline-flex items-center mr-6 mb-2">
              <input
                type="checkbox"
                checked={formData.addOns.includes(id)}
                onChange={() => handleAddOnChange(id)}
                className="form-checkbox h-5 w-5 text-green-600"
              />
              <span className="ml-2">{label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend className="font-semibold mb-2">Payment Method</legend>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={formData.paymentMethod === "creditCard"}
              onChange={handleInputChange}
              className="form-radio text-green-600"
            />
            <span className="ml-2">Credit Card</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={formData.paymentMethod === "paypal"}
              onChange={handleInputChange}
              className="form-radio text-green-600"
            />
            <span className="ml-2">PayPal</span>
          </label>
        </fieldset>

        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded text-yellow-800">
          <h3 className="font-semibold mb-1">Cancellation Policy</h3>
          <p>Cancel tours before 24 hours of the tour for 50% refund.</p>
          <p>Last-minute cancellations are non-refundable.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};
