import { useEffect, useState } from 'react';
import { FiPackage, FiCalendar, FiFileText } from 'react-icons/fi';
import axios from 'axios';

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/dashboard/overview')
      .then(res => {
        const s = [
          { name: 'Total Bookings', value: res.data.stats.totalBookings, change: '+12%', changeType: 'positive' },
          { name: 'Revenue', value: `$${res.data.stats.revenue}`, change: '+8.2%', changeType: 'positive' },
          { name: 'Pending Bookings', value: res.data.stats.pendingBookings, change: '-2.5%', changeType: 'negative' },
          { name: 'Website Visitors', value: res.data.stats.websiteVisitors, change: '+24%', changeType: 'positive' },
        ];
        setStats(s);
        setRecentBookings(res.data.recentBookings);
      });
  }, []);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* You can also render recentBookings here */}
    </div>
  );
};

export default DashboardHome;