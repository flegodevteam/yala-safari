import React, { useState, useEffect } from "react";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import {
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import { format } from "date-fns";

const BookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);

  const timeSlots = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const paymentMethods = [
    "Credit Card",
    "PayPal",
    "Bank Transfer",
    "Cash on Arrival",
  ];

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
    {
      value: "completed",
      label: "Completed",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new booking
  const createBooking = async (bookingData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/admin/create-booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create booking");
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  // Update booking
  const updateBooking = async (id, bookingData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  // Load bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEdit = (booking) => {
    setCurrentBooking(booking);
    setIsModalOpen(true);
  };

  const handleView = (booking) => {
    setViewBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    setBookingToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBooking(bookingToDelete);
      await fetchBookings(); // Refresh the list
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      setError(err.message);
      console.error("Error deleting booking:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      participants: parseInt(formData.get("participants")),
      date: new Date(formData.get("date")).toISOString(),
      timeSlot: formData.get("timeSlot"),
      addOns: {
        lunch: formData.get("lunch") === "on",
        binoculars: formData.get("binoculars") === "on",
        photographer: formData.get("photographer") === "on",
      },
      paymentMethod: formData.get("paymentMethod"),
      cardDetails: {
        number: formData.get("cardNumber") || "N/A",
        expiry: formData.get("cardExpiry") || "N/A",
        cvv: formData.get("cardCvv") || "N/A",
      },
      status: formData.get("status"),
    };

    try {
      if (currentBooking) {
        await updateBooking(currentBooking._id, bookingData);
      } else {
        await createBooking(bookingData);
      }
      await fetchBookings(); // Refresh the list
      setIsModalOpen(false);
      setCurrentBooking(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving booking:", err);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "" || status === undefined || status === null) {
      const statusOption = statusOptions.find((s) => s.value === "pending");
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            statusOption?.color || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusOption?.label || status}
        </span>
      );
    }
    const statusOption = statusOptions.find((s) => s.value === status);
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          statusOption?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusOption?.label || status}
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Booking Management
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={fetchBookings}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            disabled={loading}
          >
            <FiRefreshCw className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setCurrentBooking(null);
              setIsModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiCalendar className="mr-2" /> Add New Booking
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading bookings...</span>
        </div>
      )}

      {!loading && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No bookings found. Create your first booking!
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.date
                              ? format(new Date(booking.date), "MMM dd, yyyy")
                              : "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.timeSlot || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.participants}{" "}
                        {booking.participants === 1 ? "person" : "people"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.paymentMethod}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.cardDetails?.number ?? booking.cardDNumber}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleView(booking)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEye className="inline" />
                        </button>
                        <button
                          onClick={() => handleEdit(booking)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <FiEdit className="inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentBooking ? "Edit Booking" : "Add New Booking"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={currentBooking?.name || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={currentBooking?.email || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={currentBooking?.phone || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Participants
                    </label>
                    <input
                      type="number"
                      name="participants"
                      min="1"
                      max="20"
                      defaultValue={currentBooking?.participants || 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={
                        currentBooking?.date
                          ? new Date(currentBooking.date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      name="timeSlot"
                      defaultValue={currentBooking?.timeSlot || "08:00 AM"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      defaultValue={
                        currentBooking?.paymentMethod || paymentMethods[0]
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={currentBooking?.status || "pending"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add-ons
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="lunch"
                        defaultChecked={currentBooking?.addOns?.lunch || false}
                        className="mr-2"
                      />
                      Lunch Package
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="binoculars"
                        defaultChecked={
                          currentBooking?.addOns?.binoculars || false
                        }
                        className="mr-2"
                      />
                      Binoculars Rental
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="photographer"
                        defaultChecked={
                          currentBooking?.addOns?.photographer || false
                        }
                        className="mr-2"
                      />
                      Professional Photographer
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details (if applicable)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      defaultValue={
                        currentBooking?.cardDetails?.number ||
                        currentBooking?.cardDNumber ||
                        ""
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/YY"
                      defaultValue={
                        currentBooking?.cardDetails?.expiry ||
                        currentBooking?.cardDExpiry ||
                        ""
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      name="cardCvv"
                      placeholder="CVV"
                      defaultValue={
                        currentBooking?.cardDetails?.cvv ||
                        currentBooking?.cardDCvv ||
                        ""
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {currentBooking ? "Update" : "Create"} Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {isViewModalOpen && viewBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Booking Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">{viewBooking.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{viewBooking.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">{viewBooking.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Participants
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewBooking.participants}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewBooking.date
                        ? format(new Date(viewBooking.date), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time Slot
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewBooking.timeSlot || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewBooking.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(viewBooking.status)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900">
                      {viewBooking.createdAt
                        ? format(
                            new Date(viewBooking.createdAt),
                            "MMM dd, yyyy HH:mm"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add-ons
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          viewBooking.addOns.lunch
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-900">
                        Lunch Package
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          viewBooking.addOns.binoculars
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-900">
                        Binoculars Rental
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${
                          viewBooking.addOns.photographer
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                      <span className="text-sm text-gray-900">
                        Professional Photographer
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Details
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">
                        Card Number
                      </label>
                      <p className="text-sm text-gray-900">
                        {viewBooking.cardDetails?.number ||
                          viewBooking.cardDNumber ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        Expiry
                      </label>
                      <p className="text-sm text-gray-900">
                        {viewBooking.cardDetails?.expiry ||
                          viewBooking.cardDExpiry ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">CVV</label>
                      <p className="text-sm text-gray-900">
                        {viewBooking.cardDetails?.cvv ||
                          viewBooking.cardDCvv ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Booking Deletion
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this booking? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsManager;
