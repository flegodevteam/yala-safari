import { useEffect, useState } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const DashboardHome = ({ onNavigate }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await authenticatedFetch(
          apiEndpoints.dashboard.overview
        );
        if (response.ok) {
          const res = await response.json();
          const s = [
            {
              name: "Total Bookings",
              value: res.stats.totalBookings,
              change: "+12%",
              changeType: "positive",
            },
            {
              name: "Revenue",
              value: `$${res.stats.revenue}`,
              change: "+8.2%",
              changeType: "positive",
            },
            {
              name: "Pending Bookings",
              value: res.stats.pendingBookings,
              change: "-2.5%",
              changeType: "negative",
            },
            {
              name: "Website Visitors",
              value: res.stats.websiteVisitors,
              change: "+24%",
              changeType: "positive",
            },
            {
              name: "Local Visitors",
              value: res.stats.localVisitors,
              change: "+24%",
              changeType: "positive",
            },
            {
              name: "Foreign Visitors",
              value: res.stats.foreignVisitors,
              change: "+24%",
              changeType: "positive",
            },
          ];
          setStats(s);
          setRecentBookings(res.recentBookings);
          setLoading(false);
        }
      } catch (error) {
        console.error("DashboardHome: Error fetching dashboard data:", error);
        console.error("DashboardHome: Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        setLoading(false);

        // Set fallback stats for display
        const fallbackStats = [
          {
            name: "Total Bookings",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
          {
            name: "Revenue",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
          {
            name: "Pending Bookings",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
          {
            name: "Website Visitors",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
          {
            name: "Local Visitors",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
          {
            name: "Foreign Visitors",
            value: "N/A",
            change: "Error loading",
            changeType: "neutral",
          },
        ];
        setStats(fallbackStats);
        setRecentBookings([]);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
        Dashboard Overview
      </h3>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {!loading && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="bg-white p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">
                      {stat.name}
                    </p>
                    <p className="mt-1 text-xl lg:text-3xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        stat.changeType === "positive"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-800">
                  Recent Bookings
                </h4>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate("bookings")}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View All
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 lg:p-6">
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.customer}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.package}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {booking.amount}
                        </p>
                        <p className="text-sm text-gray-500">{booking.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent bookings found
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {onNavigate && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 lg:p-6 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800">
                  Quick Actions
                </h4>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => {
                      console.log(
                        "DashboardHome: Packages button clicked, onNavigate:",
                        typeof onNavigate
                      );
                      onNavigate("packages");
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-4 h-4 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Packages
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      console.log(
                        "DashboardHome: Bookings button clicked, onNavigate:",
                        typeof onNavigate
                      );
                      onNavigate("bookings");
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Bookings
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      console.log(
                        "DashboardHome: Blog button clicked, onNavigate:",
                        typeof onNavigate
                      );
                      onNavigate("blog");
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Blog
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      console.log(
                        "DashboardHome: Media button clicked, onNavigate:",
                        typeof onNavigate
                      );
                      onNavigate("media");
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Media
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardHome;
