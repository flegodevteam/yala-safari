import { useEffect, useState } from "react";
import { apiEndpoints, authenticatedFetch } from "../config/api";

const DashboardHome = () => {
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
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
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
              <div key={stat.name} className="bg-white p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
              <h4 className="text-lg font-semibold text-gray-800">Recent Bookings</h4>
            </div>
            <div className="p-4 lg:p-6">
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customer}</p>
                        <p className="text-sm text-gray-500">{booking.package}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{booking.amount}</p>
                        <p className="text-sm text-gray-500">{booking.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent bookings found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHome;
