import { FiPackage, FiCalendar, FiFileText } from 'react-icons/fi';

const DashboardHome = () => {
  const stats = [
    { name: 'Total Bookings', value: '124', change: '+12%', changeType: 'positive' },
    { name: 'Revenue', value: '$18,450', change: '+8.2%', changeType: 'positive' },
    { name: 'Pending Bookings', value: '8', change: '-2.5%', changeType: 'negative' },
    { name: 'Website Visitors', value: '2,345', change: '+24%', changeType: 'positive' },
  ];

  const recentBookings = [
    { id: 1, name: 'John Smith', package: 'Morning Safari', date: '2023-06-15', status: 'confirmed' },
    { id: 2, name: 'Sarah Johnson', package: 'Full Day Safari', date: '2023-06-16', status: 'confirmed' },
    { id: 3, name: 'Robert Chen', package: 'Private Safari', date: '2023-06-17', status: 'pending' },
    { id: 4, name: 'Emma Wilson', package: 'Morning Safari', date: '2023-06-18', status: 'cancelled' },
  ];

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h3>
      
      {/* Stats Cards */}
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
      
      {/* Rest of the component code... */}
    </div>
  );
};

export default DashboardHome;