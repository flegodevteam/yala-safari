import { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPower,
  FiHome,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";
import { adminFetch, apiEndpoints, API_BASE_URL } from "../config/api";
import RoomFormModal from "./RoomFormModal";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" or "bookings"
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  // Use useCallback to memoize fetchRooms
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch(apiEndpoints.rooms.base);
      const data = await response.json();

      if (data.success) {
        setRooms(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    setBookingsLoading(true);
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/room-bookings`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab, fetchBookings]);

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminFetch(
        `${apiEndpoints.rooms.base}/${id}/toggle-status`,
        { method: "PATCH" }
      );

      if (response.ok) {
        fetchRooms();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        const response = await adminFetch(
          `${apiEndpoints.rooms.base}/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          fetchRooms();
        }
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] flex flex-col justify-center items-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#034123] mb-6 mx-auto"></div>
          <p className="text-[#034123] font-semibold text-lg">
            Loading rooms...
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            Please wait while we fetch your rooms
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-[#034123] to-[#026042] rounded-2xl shadow-lg">
                  <FiHome className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-[#034123] mb-2 leading-tight">
                    Room Management
                  </h1>
                  <p className="text-[#6b7280] text-base lg:text-lg font-medium">
                    Manage and organize your accommodation rooms
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#f26b21] hover:bg-[#e05a1a] text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 shadow-lg hover:scale-105 whitespace-nowrap text-base"
              >
                <FiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Create New Room</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 lg:p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("rooms")}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 ${
                activeTab === "rooms"
                  ? "bg-gradient-to-r from-[#f26b21] to-[#e05a1a] text-white shadow-xl scale-105"
                  : "bg-[#f9fafb] text-[#4b5563] hover:bg-[#034123]/10 hover:text-[#034123] border-2 border-transparent hover:border-[#034123]/30 shadow-sm hover:shadow-md"
              }`}
            >
              <span>All Rooms</span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  activeTab === "rooms"
                    ? "bg-white/20 text-white"
                    : "bg-[#034123]/10 text-[#034123]"
                }`}
              >
                {rooms.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 ${
                activeTab === "bookings"
                  ? "bg-gradient-to-r from-[#f26b21] to-[#e05a1a] text-white shadow-xl scale-105"
                  : "bg-[#f9fafb] text-[#4b5563] hover:bg-[#034123]/10 hover:text-[#034123] border-2 border-transparent hover:border-[#034123]/30 shadow-sm hover:shadow-md"
              }`}
            >
              <span>Bookings</span>
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  activeTab === "bookings"
                    ? "bg-white/20 text-white"
                    : "bg-[#034123]/10 text-[#034123]"
                }`}
              >
                {bookings.length}
              </span>
            </button>
          </div>
        </div>

        {/* Rooms Grid */}
        {activeTab === "rooms" && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rooms.map((room) => {
                const featuredImage = room.images?.find((img) => img.isFeatured) || room.images?.[0];
                const getImageUrl = (imagePath) => {
                  if (!imagePath) return "/default-room.jpg";
                  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
                    return imagePath;
                  }
                  return `${API_BASE_URL}${imagePath}`;
                };
                const imageUrl = getImageUrl(featuredImage?.url);
                const price = room.pricing?.perNight || 0;
                const currency = room.pricing?.currency || "USD";
                const priceDisplay = currency === "USD" ? `$${price}` : `${currency} ${price}`;

                return (
                  <div
                    key={room._id}
                    className="group bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                  >
                    {/* Room Image */}
                    {imageUrl && (
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={room.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b-2 border-[#e5e7eb]/60">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#034123] mb-3 leading-tight group-hover:text-[#026042] transition-colors duration-300">
                            {room.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm lg:text-base text-[#6b7280] font-medium mb-2">
                            <span className="text-[#f26b21]">
                              <FiMapPin />
                            </span>
                            <span className="capitalize">
                              {room.roomType}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-[#034123]">
                              {priceDisplay}
                            </span>
                            <span className="text-sm text-[#6b7280]">/night</span>
                          </div>
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-xl text-xs font-bold backdrop-blur-sm shadow-lg border-2 mt-2 ${
                              room.isActive
                                ? "bg-gradient-to-r from-[#034123]/20 to-[#026042]/20 text-[#034123] border-[#034123]/40"
                                : "bg-red-100/90 text-red-800 border-red-300/60"
                            }`}
                          >
                            {room.isActive ? (
                              <>
                                <span className="w-2 h-2 bg-[#034123] rounded-full animate-pulse"></span>
                                Active
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                Inactive
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[#4b5563] text-sm lg:text-base mb-6 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                        {room.description ||
                          "No description available for this room."}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 lg:p-5 bg-gradient-to-br from-[#f9fafb] to-white rounded-2xl border border-[#e5e7eb]/60 shadow-inner">
                        <div className="text-center">
                          <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                            Capacity
                          </span>
                          <p className="text-lg lg:text-xl font-bold text-[#034123]">
                            {room.capacity?.adults || 0} Adults
                          </p>
                          {room.capacity?.children > 0 && (
                            <p className="text-sm text-[#6b7280]">
                              +{room.capacity.children} Children
                            </p>
                          )}
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                            Available
                          </span>
                          <p className="text-lg lg:text-xl font-bold text-[#f26b21]">
                            {room.availability?.totalRooms || 0}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 pt-4 border-t border-[#e5e7eb]/60">
                        <button
                          onClick={() => setEditingRoomId(room._id)}
                          className="w-full flex items-center justify-center gap-2 bg-[#034123] hover:bg-[#026042] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm"
                        >
                          <FiEdit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(room._id)}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm ${
                            room.isActive
                              ? "bg-[#fee000] hover:bg-[#e6ce00] text-[#856404] border-2 border-[#fee000]/50"
                              : "bg-[#034123] hover:bg-[#026042] text-white"
                          }`}
                        >
                          <FiPower className="w-4 h-4" />
                          <span>{room.isActive ? "Deactivate" : "Activate"}</span>
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Empty State for Rooms */}
        {activeTab === "rooms" && rooms.length === 0 && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#034123]/20 to-[#f26b21]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#034123] to-[#026042] p-8 rounded-3xl shadow-xl">
                  <div className="text-7xl">🏨</div>
                </div>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-4">
                No Rooms Yet
              </h3>
              <p className="text-[#6b7280] text-lg lg:text-xl mb-8 leading-relaxed">
                Get started by creating your first room. Design amazing accommodation experiences for your guests.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#f26b21] to-[#e05a1a] hover:from-[#e05a1a] hover:to-[#d04a10] text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-xl hover:scale-105 text-lg"
              >
                <FiPlus className="w-6 h-6" />
                Create Your First Room
              </button>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        {activeTab === "bookings" && (
          <>
            {bookingsLoading ? (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 lg:p-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#034123] mb-6 mx-auto"></div>
                <p className="text-[#034123] font-semibold text-lg">
                  Loading bookings...
                </p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {bookings.map((booking) => {
                  const getImageUrl = (imagePath) => {
                    if (!imagePath) return "/default-room.jpg";
                    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
                      return imagePath;
                    }
                    return `${API_BASE_URL}${imagePath}`;
                  };
                  const featuredImage = booking.room?.images?.find((img) => img.isFeatured) || booking.room?.images?.[0];
                  const imageUrl = getImageUrl(featuredImage?.url);
                  const checkIn = new Date(booking.checkIn);
                  const checkOut = new Date(booking.checkOut);
                  const formatDate = (date) => {
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  };

                  const getStatusColor = (status) => {
                    switch (status) {
                      case "confirmed":
                        return "bg-green-100 text-green-800 border-green-300";
                      case "pending":
                        return "bg-yellow-100 text-yellow-800 border-yellow-300";
                      case "cancelled":
                        return "bg-red-100 text-red-800 border-red-300";
                      default:
                        return "bg-gray-100 text-gray-800 border-gray-300";
                    }
                  };

                  const getPaymentStatusColor = (status) => {
                    switch (status) {
                      case "paid":
                        return "bg-green-100 text-green-800 border-green-300";
                      case "pending":
                        return "bg-yellow-100 text-yellow-800 border-yellow-300";
                      case "failed":
                        return "bg-red-100 text-red-800 border-red-300";
                      default:
                        return "bg-gray-100 text-gray-800 border-gray-300";
                    }
                  };

                  return (
                    <div
                      key={booking._id}
                      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                    >
                      {/* Booking Header */}
                      <div className="bg-gradient-to-r from-[#034123] to-[#026042] p-6 text-white">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {booking.room?.name || "Room Booking"}
                            </h3>
                            <p className="text-sm text-white/80">
                              Reference: {booking.bookingReference}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border-2 ${getStatusColor(
                                booking.bookingStatus
                              )}`}
                            >
                              {booking.bookingStatus?.toUpperCase() || "PENDING"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Room Image */}
                      {imageUrl && (
                        <div className="h-48 w-full overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={booking.room?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        {/* Guest Information */}
                        <div className="mb-6 pb-6 border-b border-[#e5e7eb]">
                          <h4 className="text-sm font-bold text-[#034123] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FiUser className="w-4 h-4" />
                            Guest Details
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <FiUser className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#4b5563]">
                                {booking.guestDetails?.firstName} {booking.guestDetails?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <FiMail className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#4b5563]">{booking.guestDetails?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <FiPhone className="w-4 h-4 text-[#6b7280]" />
                              <span className="text-[#4b5563]">{booking.guestDetails?.phone}</span>
                            </div>
                            {booking.guestDetails?.country && (
                              <div className="flex items-center gap-3 text-sm">
                                <FiMapPin className="w-4 h-4 text-[#6b7280]" />
                                <span className="text-[#4b5563]">{booking.guestDetails.country}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Dates */}
                        <div className="mb-6 pb-6 border-b border-[#e5e7eb]">
                          <h4 className="text-sm font-bold text-[#034123] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            Booking Period
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-[#6b7280] mb-1">Check In</p>
                              <p className="text-sm font-semibold text-[#034123]">
                                {formatDate(checkIn)}
                              </p>
                              <p className="text-xs text-[#6b7280]">
                                {checkIn.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#6b7280] mb-1">Check Out</p>
                              <p className="text-sm font-semibold text-[#034123]">
                                {formatDate(checkOut)}
                              </p>
                              <p className="text-xs text-[#6b7280]">
                                {checkOut.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-[#f9fafb] rounded-lg">
                            <p className="text-sm text-[#4b5563]">
                              <FiClock className="w-4 h-4 inline mr-2" />
                              {booking.numberOfNights} {booking.numberOfNights === 1 ? "Night" : "Nights"}
                            </p>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="mb-6 pb-6 border-b border-[#e5e7eb]">
                          <h4 className="text-sm font-bold text-[#034123] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <FiDollarSign className="w-4 h-4" />
                            Pricing
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#6b7280]">Room Rate:</span>
                              <span className="font-semibold text-[#034123]">
                                {booking.pricing?.currency || "USD"} {booking.pricing?.roomRate || 0}
                              </span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-2 border-t border-[#e5e7eb]">
                              <span className="text-[#034123]">Total Amount:</span>
                              <span className="text-[#f26b21]">
                                {booking.pricing?.currency || "USD"} {booking.pricing?.totalAmount || 0}
                              </span>
                            </div>
                            <div className="mt-2">
                              <span
                                className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border-2 ${getPaymentStatusColor(
                                  booking.paymentStatus
                                )}`}
                              >
                                Payment: {booking.paymentStatus?.toUpperCase() || "PENDING"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Guests */}
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-[#034123] uppercase tracking-wider mb-3">
                            Guests
                          </h4>
                          <div className="flex gap-4 text-sm">
                            <div>
                              <span className="text-[#6b7280]">Adults:</span>{" "}
                              <span className="font-semibold text-[#034123]">
                                {booking.guests?.adults || 0}
                              </span>
                            </div>
                            {booking.guests?.children > 0 && (
                              <div>
                                <span className="text-[#6b7280]">Children:</span>{" "}
                                <span className="font-semibold text-[#034123]">
                                  {booking.guests.children}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Special Requests */}
                        {booking.guestDetails?.specialRequests && (
                          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="text-sm font-bold text-[#034123] mb-2">Special Requests</h4>
                            <p className="text-sm text-[#4b5563]">
                              {booking.guestDetails.specialRequests}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {booking.notes && (
                          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="text-sm font-bold text-[#034123] mb-2">Notes</h4>
                            <p className="text-sm text-[#4b5563]">{booking.notes}</p>
                          </div>
                        )}

                        {/* Booking Date */}
                        <div className="text-xs text-[#6b7280] pt-4 border-t border-[#e5e7eb]">
                          <p>
                            Booked on: {new Date(booking.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 lg:p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#034123]/20 to-[#f26b21]/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-[#034123] to-[#026042] p-8 rounded-3xl shadow-xl">
                      <div className="text-7xl">📅</div>
                    </div>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-4">
                    No Bookings Yet
                  </h3>
                  <p className="text-[#6b7280] text-lg lg:text-xl mb-8 leading-relaxed">
                    No room bookings have been made yet. Bookings will appear here once guests make reservations.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <RoomFormModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchRooms();
            }}
          />
        )}

        {/* Edit Room Modal */}
        {editingRoomId && (
          <RoomFormModal
            roomId={editingRoomId}
            onClose={() => setEditingRoomId(null)}
            onSuccess={() => {
              setEditingRoomId(null);
              fetchRooms();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
