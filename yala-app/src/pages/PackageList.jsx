import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPower,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";
import { adminFetch, apiEndpoints } from "../config/api";
import PackageFormModal from "../components/PackageFormModal";

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  // Use useCallback to memoize fetchPackages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? apiEndpoints.packages.base
          : `${apiEndpoints.packages.base}?isActive=${filter === "active"}`;

      const response = await adminFetch(url);
      const data = await response.json();

      if (data.success) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]); // Add filter as dependency

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]); // Now fetchPackages is properly included

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminFetch(
        `${apiEndpoints.packages.base}/${id}/toggle-status`,
        { method: "PATCH" }
      );

      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        const response = await adminFetch(
          `${apiEndpoints.packages.base}/${id}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          fetchPackages();
        }
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] flex flex-col justify-center items-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#034123] mb-6 mx-auto"></div>
          <p className="text-[#034123] font-semibold text-lg">
            Loading packages...
          </p>
          <p className="text-[#6b7280] text-sm mt-2">
            Please wait while we fetch your packages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-[#034123] to-[#026042] rounded-2xl shadow-lg">
                  <FiPackage className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-[#034123] mb-2 leading-tight">
                    Package Management
                  </h1>
                  <p className="text-[#6b7280] text-base lg:text-lg font-medium">
                    Manage and organize your safari packages
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
                <span className="hidden sm:inline">Create New Package</span>
                <span className="sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        {packages.length > 0 && (
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 lg:p-4 mb-8">
            <div className="flex flex-wrap gap-3">
              {[
                { key: "all", label: "All Packages", count: packages.length },
                {
                  key: "active",
                  label: "Active",
                  count: packages.filter((p) => p.isActive).length,
                },
                {
                  key: "inactive",
                  label: "Inactive",
                  count: packages.filter((p) => !p.isActive).length,
                },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 ${
                    filter === filterOption.key
                      ? "bg-gradient-to-r from-[#f26b21] to-[#e05a1a] text-white shadow-xl scale-105"
                      : "bg-[#f9fafb] text-[#4b5563] hover:bg-[#034123]/10 hover:text-[#034123] border-2 border-transparent hover:border-[#034123]/30 shadow-sm hover:shadow-md"
                  }`}
                >
                  <span>{filterOption.label}</span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      filter === filterOption.key
                        ? "bg-white/20 text-white"
                        : "bg-[#034123]/10 text-[#034123]"
                    }`}
                  >
                    {filterOption.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Packages Grid */}
        {packages.filter((pkg) => {
          if (filter === "all") return true;
          if (filter === "active") return pkg.isActive;
          if (filter === "inactive") return !pkg.isActive;
          return true;
        }).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages
              .filter((pkg) => {
                if (filter === "all") return true;
                if (filter === "active") return pkg.isActive;
                if (filter === "inactive") return !pkg.isActive;
                return true;
              })
              .map((pkg) => (
                <div
                  key={pkg._id}
                  className="group bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                >
                  <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b-2 border-[#e5e7eb]/60">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#034123] mb-3 leading-tight group-hover:text-[#026042] transition-colors duration-300">
                          {pkg.name.substring(0, 30)}...
                        </h3>
                        <div className="flex items-center gap-2 text-sm lg:text-base text-[#6b7280] font-medium">
                          <span className="text-[#f26b21]">
                            <FiMapPin />
                          </span>
                          <span className="capitalize">
                            {pkg.park} National Park
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-xl text-xs font-bold backdrop-blur-sm shadow-lg border-2 mt-2 ${
                            pkg.isActive
                              ? "bg-gradient-to-r from-[#034123]/20 to-[#026042]/20 text-[#034123] border-[#034123]/40"
                              : "bg-red-100/90 text-red-800 border-red-300/60"
                          }`}
                        >
                          {pkg.isActive ? (
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
                      {pkg.description ||
                        "No description available for this package."}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 lg:p-5 bg-gradient-to-br from-[#f9fafb] to-white rounded-2xl border border-[#e5e7eb]/60 shadow-inner">
                      <div className="text-center">
                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                          Type
                        </span>
                        <p className="text-lg lg:text-xl font-bold text-[#034123] capitalize">
                          {pkg.packageType || "Private"}
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                          Bookings
                        </span>
                        <p className="text-lg lg:text-xl font-bold text-[#f26b21]">
                          {pkg.totalBookings || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-[#e5e7eb]/60">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/packages/edit/${pkg._id}`)
                        }
                        className="w-full flex items-center justify-center gap-2 bg-[#034123] hover:bg-[#026042] text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm"
                      >
                        <FiEdit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(pkg._id)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm ${
                          pkg.isActive
                            ? "bg-[#fee000] hover:bg-[#e6ce00] text-[#856404] border-2 border-[#fee000]/50"
                            : "bg-[#034123] hover:bg-[#026042] text-white"
                        }`}
                      >
                        <FiPower className="w-4 h-4" />
                        <span>{pkg.isActive ? "Deactivate" : "Activate"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold shadow-md hover:scale-[1.02] text-sm"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {(packages.length === 0 ||
          packages.filter((pkg) => {
            if (filter === "all") return true;
            if (filter === "active") return pkg.isActive;
            if (filter === "inactive") return !pkg.isActive;
            return true;
          }).length === 0) && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#034123]/20 to-[#f26b21]/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#034123] to-[#026042] p-8 rounded-3xl shadow-xl">
                  <div className="text-7xl">📦</div>
                </div>
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-4">
                {filter === "all"
                  ? "No Packages Yet"
                  : filter === "active"
                  ? "No Active Packages"
                  : "No Inactive Packages"}
              </h3>
              <p className="text-[#6b7280] text-lg lg:text-xl mb-8 leading-relaxed">
                {filter === "all"
                  ? "Get started by creating your first safari package. Design amazing experiences for your customers."
                  : filter === "active"
                  ? "You don't have any active packages at the moment. Activate a package or create a new one."
                  : "All your packages are currently active. Great job managing your inventory!"}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#f26b21] to-[#e05a1a] hover:from-[#e05a1a] hover:to-[#d04a10] text-white font-bold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-xl hover:scale-105 text-lg"
              >
                <FiPlus className="w-6 h-6" />
                {filter === "all"
                  ? "Create Your First Package"
                  : "Create New Package"}
              </button>
            </div>
          </div>
        )}

        {/* Create Package Modal */}
        {showCreateModal && (
          <PackageFormModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchPackages();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PackageList;
