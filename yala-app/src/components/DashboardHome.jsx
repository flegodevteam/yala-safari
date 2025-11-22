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

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
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
                  <p className="text-3xl lg:text-4xl font-bold text-[#034123]">
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
      )}
    </div>
  );
};

export default DashboardHome;
