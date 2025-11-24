import { useEffect, useState } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [error, setError] = useState("");
  const [rawResponse, setRawResponse] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await authenticatedFetch(
          apiEndpoints.dashboard.overview
        );
        if (response.ok) {
          const result = await response.json();
          
          // Store raw response for debugging
          setRawResponse(result);
          console.log("Raw API Response:", result);
          
          // Handle API response structure: { stats: {...}, recentBookings: [...] }
          // Also handle wrapped structure: { success, data: { stats, recentBookings } }
          let data = result;
          
          if (result.success && result.data) {
            data = result.data;
          } else if (result.data) {
            data = result.data;
          }
          
          // Extract stats
          const statsData = data.stats || {};
          const recentBookingsList = data.recentBookings || [];
          
          const statsArray = [
            {
              name: "Total Bookings",
              value: statsData.totalBookings || 0,
              change: "+12%",
              changeType: "positive",
            },
            {
              name: "Total Revenue",
              value: formatCurrency(statsData.revenue || 0),
              change: "+8.2%",
              changeType: "positive",
            },
            {
              name: "Pending Bookings",
              value: statsData.pendingBookings || 0,
              change: "-2.5%",
              changeType: "negative",
            },
            {
              name: "Website Visitors",
              value: statsData.websiteVisitors || 0,
              change: "+24%",
              changeType: "positive",
            },
            {
              name: "Local Visitors",
              value: statsData.localVisitors || 0,
              change: "+18%",
              changeType: "positive",
            },
            {
              name: "Foreign Visitors",
              value: statsData.foreignVisitors || 0,
              change: "+32%",
              changeType: "positive",
            },
          ];
          
          setStats(statsArray);
          setRecentBookings(recentBookingsList);
          setPopularPackages(data.popularPackages || []);
          setError("");
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          setError(`Failed to fetch dashboard data: ${response.status} ${response.statusText}`);
          setRawResponse({ error: errorText, status: response.status });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("An error occurred while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">
          Dashboard Overview
        </h3>
        <p className="text-[#6b7280] text-base">Monitor your safari operations at a glance</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034123] mb-4"></div>
          <span className="text-[#4b5563] font-medium">Loading dashboard data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="space-y-4">
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl">
            <p className="font-semibold mb-2">{error}</p>
            <p className="text-sm">Check the raw response below to see the actual API structure.</p>
          </div>
          
       
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div 
                key={stat.name} 
                className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#6b7280] mb-2 uppercase tracking-wide">
                      {stat.name}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-[#034123] break-words">
                      {stat.value}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                      stat.changeType === "positive"
                        ? "bg-[#034123]/10 text-[#034123] border border-[#034123]/20"
                        : "bg-red-100/80 text-red-800 border border-red-300/60"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings Section */}
          {recentBookings.length > 0 && (
            <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
              <h4 className="text-xl font-bold text-[#034123] mb-4">
                Recent Bookings
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#034123]">
                        Booking ID
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#034123]">
                        Time Slot
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#034123]">
                        Safari Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#034123]">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#034123]">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-[#e5e7eb]/50 hover:bg-[#f9fafb]/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-[#1f2937] font-medium font-mono">
                          {booking._id?.substring(0, 8) || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-[#1f2937]">
                          <span className="px-2 py-1 bg-[#034123]/10 text-[#034123] rounded-lg text-xs font-semibold">
                            {booking.timeSlot ? booking.timeSlot.charAt(0).toUpperCase() + booking.timeSlot.slice(1) : "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#1f2937]">
                          {booking.date
                            ? new Date(booking.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6b7280]">
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Popular Packages Section */}
          {popularPackages.length > 0 && (
            <div className="mt-8 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
              <h4 className="text-xl font-bold text-[#034123] mb-4">
                Popular Packages
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-[#f9fafb]/50 backdrop-blur-sm p-4 rounded-xl border border-[#e5e7eb]/60 hover:shadow-md transition-all duration-300"
                  >
                    <div className="font-semibold text-[#034123] mb-2">
                      {pkg.name}
                    </div>
                    <div className="text-sm text-[#6b7280]">
                      <span className="font-medium text-[#034123]">
                        {pkg.bookingCount}
                      </span>{" "}
                      bookings
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHome;
