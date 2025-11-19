import React from 'react';
import { FiBarChart2, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiCalendar } from 'react-icons/fi';

const ReportsDashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$125,430',
      change: '+12.5%',
      trend: 'up',
      icon: <FiDollarSign className="w-6 h-6" />,
      color: 'bg-[#034123]/10 text-[#034123] border-[#034123]/20'
    },
    {
      title: 'Active Bookings',
      value: '342',
      change: '+8.2%',
      trend: 'up',
      icon: <FiCalendar className="w-6 h-6" />,
      color: 'bg-[#f26b21]/10 text-[#f26b21] border-[#f26b21]/20'
    },
    {
      title: 'Customer Growth',
      value: '1,245',
      change: '+24%',
      trend: 'up',
      icon: <FiUsers className="w-6 h-6" />,
      color: 'bg-[#034123]/10 text-[#034123] border-[#034123]/20'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: <FiBarChart2 className="w-6 h-6" />,
      color: 'bg-red-100/80 text-red-800 border-red-300/60'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">Reports Dashboard</h2>
        <p className="text-[#6b7280] text-base">Analytics and insights for your safari operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1">
                {stat.trend === 'up' ? (
                  <FiTrendingUp className="w-4 h-4 text-[#034123]" />
                ) : (
                  <FiTrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-xs font-bold ${stat.trend === 'up' ? 'text-[#034123]' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-[#6b7280] mb-2 uppercase tracking-wide">
              {stat.title}
            </h3>
            <p className="text-3xl lg:text-4xl font-bold text-[#034123]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-[#034123] mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
            <p className="text-[#6b7280] text-sm font-medium">Chart visualization coming soon</p>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-[#034123] mb-4">Booking Trends</h3>
          <div className="h-64 flex items-center justify-center bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
            <p className="text-[#6b7280] text-sm font-medium">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default ReportsDashboard;