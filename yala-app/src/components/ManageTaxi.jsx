import { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPower,
  FiTruck,
  FiDollarSign,
} from "react-icons/fi";
import { adminFetch, apiEndpoints, API_BASE_URL } from "../config/api";
import TaxiFormModal from "./TaxiFormModal";

const ManageTaxi = () => {
  const [taxis, setTaxis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTaxiId, setEditingTaxiId] = useState(null);

  const fetchTaxis = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminFetch(apiEndpoints.taxis.base);
      const data = await response.json();

      if (data.success) {
        setTaxis(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching taxis:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxis();
  }, [fetchTaxis]);

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminFetch(
        `${apiEndpoints.taxis.base}/${id}/toggle-status`,
        { method: "PATCH" }
      );

      if (response.ok) {
        fetchTaxis();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this taxi?")) {
      try {
        const response = await adminFetch(
          `${apiEndpoints.taxis.base}/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          fetchTaxis();
        }
      } catch (error) {
        console.error("Error deleting taxi:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] flex flex-col justify-center items-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#034123] mb-6 mx-auto"></div>
          <p className="text-[#034123] font-semibold text-lg">
            Loading taxis...
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            Please wait while we fetch your taxis
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
                  <FiTruck className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-[#034123] mb-2 leading-tight">
                    Taxi Management
                  </h1>
                  <p className="text-[#6b7280] text-base lg:text-lg font-medium">
                    Manage and organize your taxi fleet
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
                <span className="hidden sm:inline">Create New Taxi</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Taxis Grid */}
        {taxis.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {taxis.map((taxi) => {
              const featuredImage = taxi.images?.find((img) => img.isFeatured) || taxi.images?.[0];
              const getImageUrl = (imagePath) => {
                if (!imagePath) return "/default-taxi.jpg";
                if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
                  return imagePath;
                }
                return `${API_BASE_URL}${imagePath}`;
              };
              const imageUrl = getImageUrl(featuredImage?.url);
              const currency = taxi.pricing?.currency || "USD";
              const currencySymbol = currency === "USD" ? "$" : currency;

              return (
                <div
                  key={taxi._id}
                  className="group bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Taxi Image */}
                  {imageUrl && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={taxi.vehicleName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b-2 border-[#e5e7eb]/60">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#034123] mb-3 leading-tight group-hover:text-[#026042] transition-colors duration-300">
                          {taxi.vehicleName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm lg:text-base text-[#6b7280] font-medium mb-2">
                          <span className="text-[#f26b21]">
                            <FiTruck />
                          </span>
                          <span className="capitalize">
                            {taxi.vehicleType}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-[#034123]">
                            {currencySymbol}{taxi.pricing?.basePrice || 0}
                          </span>
                          <span className="text-sm text-[#6b7280]">base +</span>
                          <span className="text-lg font-bold text-[#034123]">
                            {currencySymbol}{taxi.pricing?.pricePerKm || 0}/km
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-xl text-xs font-bold backdrop-blur-sm shadow-lg border-2 mt-2 ${
                            taxi.isActive && taxi.isAvailable
                              ? "bg-gradient-to-r from-[#034123]/20 to-[#026042]/20 text-[#034123] border-[#034123]/40"
                              : "bg-red-100/90 text-red-800 border-red-300/60"
                          }`}
                        >
                          {taxi.isActive && taxi.isAvailable ? (
                            <>
                              <span className="w-2 h-2 bg-[#034123] rounded-full animate-pulse"></span>
                              Active & Available
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                              {!taxi.isActive ? "Inactive" : "Unavailable"}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#4b5563] text-sm lg:text-base mb-6 line-clamp-3 leading-relaxed min-h-[4.5rem]">
                      {taxi.description ||
                        "No description available for this taxi."}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 lg:p-5 bg-gradient-to-br from-[#f9fafb] to-white rounded-2xl border border-[#e5e7eb]/60 shadow-inner">
                      <div className="text-center">
                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                          Passengers
                        </span>
                        <p className="text-lg lg:text-xl font-bold text-[#034123]">
                          {taxi.capacity?.passengers || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                          Luggage
                        </span>
                        <p className="text-lg lg:text-xl font-bold text-[#f26b21]">
                          {taxi.capacity?.luggage || 0}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="mb-6 p-4 bg-gradient-to-br from-[#fee000]/20 to-[#fee000]/10 rounded-xl border border-[#fee000]/30">
                      <div className="flex items-center gap-2 mb-2">
                        <FiDollarSign className="text-[#034123]" />
                        <span className="text-xs font-bold text-[#034123] uppercase">Pricing</span>
                      </div>
                      <div className="space-y-1 text-xs text-[#4b5563]">
                        <div className="flex justify-between">
                          <span>Airport Transfer:</span>
                          <span className="font-semibold">{currencySymbol}{taxi.pricing?.airportTransfer || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Full Day Rate:</span>
                          <span className="font-semibold">{currencySymbol}{taxi.pricing?.fullDayRate || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-[#e5e7eb]/60">
                      <button
                        onClick={() => setEditingTaxiId(taxi._id)}
                        className="w-full flex items-center justify-center gap-2 bg-[#034123] hover:bg-[#026042] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(taxi._id)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm ${
                          taxi.isActive
                            ? "bg-[#fee000] hover:bg-[#e6ce00] text-[#856404] border-2 border-[#fee000]/50"
                            : "bg-[#034123] hover:bg-[#026042] text-white"
                        }`}
                      >
                        <FiPower className="w-4 h-4" />
                        <span>{taxi.isActive ? "Deactivate" : "Activate"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(taxi._id)}
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

        {/* Empty State */}
        {taxis.length === 0 && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#034123]/20 to-[#f26b21]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#034123] to-[#026042] p-8 rounded-3xl shadow-xl">
                  <div className="text-7xl">🚕</div>
                </div>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-4">
                No Taxis Yet
              </h3>
              <p className="text-[#6b7280] text-lg lg:text-xl mb-8 leading-relaxed">
                Get started by creating your first taxi. Add vehicles to your fleet and start accepting bookings.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#f26b21] to-[#e05a1a] hover:from-[#e05a1a] hover:to-[#d04a10] text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-xl hover:scale-105 text-lg"
              >
                <FiPlus className="w-6 h-6" />
                Create Your First Taxi
              </button>
            </div>
          </div>
        )}

        {/* Create Taxi Modal */}
        {showCreateModal && (
          <TaxiFormModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchTaxis();
            }}
          />
        )}

        {/* Edit Taxi Modal */}
        {editingTaxiId && (
          <TaxiFormModal
            taxiId={editingTaxiId}
            onClose={() => setEditingTaxiId(null)}
            onSuccess={() => {
              setEditingTaxiId(null);
              fetchTaxis();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ManageTaxi;

