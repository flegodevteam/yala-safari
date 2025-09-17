import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "../config/api";

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(apiEndpoints.dashboard.overview).then((res) => {
      const s = [
        {
          name: "Total Bookings",
          value: res.data.stats.totalBookings,
          change: "+12%",
          changeType: "positive",
        },
        {
          name: "Revenue",
          value: `$${res.data.stats.revenue}`,
          change: "+8.2%",
          changeType: "positive",
        },
        {
          name: "Pending Bookings",
          value: res.data.stats.pendingBookings,
          change: "-2.5%",
          changeType: "negative",
        },
        {
          name: "Website Visitors",
          value: res.data.stats.websiteVisitors,
          change: "+24%",
          changeType: "positive",
        },
        {
          name: "Local Visitors",
          value: res.data.stats.localVisitors,
          change: "+24%",
          changeType: "positive",
        },
        {
          name: "Foreign Visitors",
          value: res.data.stats.foreignVisitors,
          change: "+24%",
          changeType: "positive",
        },
      ];
      setStats(s);
      setRecentBookings(res.data.recentBookings);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Dashboard Overview
      </h3>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">Loading ...</span>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
