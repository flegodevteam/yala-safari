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
        
        {/* Recent Bookings */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Recent Bookings</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.package}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span>Add New Package</span>
                <FiPackage className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span>Update Availability</span>
                <FiCalendar className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <span>Create Blog Post</span>
                <FiFileText className="text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                  AD
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Admin updated Full Day Safari package</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold">
                  CM
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Content Manager published new blog post</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                  BA
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Booking Agent confirmed 3 new bookings</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const BookingsManager = () => {
    const [bookings, setBookings] = useState([
      { id: 1, customer: 'John Smith', package: 'Morning Safari', date: '2023-06-15', guests: 2, status: 'confirmed', total: 150 },
      { id: 2, customer: 'Sarah Johnson', package: 'Full Day Safari', date: '2023-06-16', guests: 4, status: 'confirmed', total: 600 },
      { id: 3, customer: 'Robert Chen', package: 'Private Safari', date: '2023-06-17', guests: 3, status: 'pending', total: 900 },
      { id: 4, customer: 'Emma Wilson', package: 'Morning Safari', date: '2023-06-18', guests: 2, status: 'cancelled', total: 150 },
    ]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
  
    const handleEdit = (booking) => {
      setCurrentBooking(booking);
      setIsModalOpen(true);
    };
  
    const handleStatusChange = (id, newStatus) => {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    };
  
    const handleDelete = (id) => {
      setBookingToDelete(id);
      setIsDeleteConfirmOpen(true);
    };
  
    const confirmDelete = () => {
      setBookings(bookings.filter(booking => booking.id !== bookingToDelete));
      setIsDeleteConfirmOpen(false);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const updatedBooking = {
        id: currentBooking?.id || Date.now(),
        customer: formData.get('customer'),
        package: formData.get('package'),
        date: formData.get('date'),
        guests: parseInt(formData.get('guests')),
        status: formData.get('status'),
        total: parseFloat(formData.get('total'))
      };
      
      if (currentBooking) {
        setBookings(bookings.map(booking => booking.id === currentBooking.id ? updatedBooking : booking));
      } else {
        setBookings([...bookings, updatedBooking]);
      }
      
      setIsModalOpen(false);
      setCurrentBooking(null);
    };
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Manage Bookings</h3>
          <button 
            onClick={() => { setCurrentBooking(null); setIsModalOpen(true); }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiBookmark className="mr-2" /> Add New Booking
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.package}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.guests}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(booking)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Add/Edit Booking Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {currentBooking ? 'Edit Booking' : 'Add New Booking'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                    <input
                      type="text"
                      name="customer"
                      defaultValue={currentBooking?.customer || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                    <select
                      name="package"
                      defaultValue={currentBooking?.package || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a package</option>
                      <option value="Morning Safari">Morning Safari</option>
                      <option value="Full Day Safari">Full Day Safari</option>
                      <option value="Private Safari">Private Safari</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={currentBooking?.date || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      defaultValue={currentBooking?.guests || 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount ($)</label>
                    <input
                      type="number"
                      name="total"
                      step="0.01"
                      defaultValue={currentBooking?.total || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={currentBooking?.status || 'pending'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {currentBooking ? 'Update' : 'Create'} Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Booking Deletion</h3>
                <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteConfirmOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const ReportsDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [reportType, setReportType] = useState('bookings');
  
    // Mock data for the charts
    const bookingData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Bookings',
          data: [12, 19, 15, 27, 22, 18],
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [1800, 2850, 2250, 4050, 3300, 2700],
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const popularPackages = [
      { name: 'Morning Safari', bookings: 84, revenue: 12600 },
      { name: 'Full Day Safari', bookings: 45, revenue: 13500 },
      { name: 'Private Safari', bookings: 12, revenue: 7200 },
    ];
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Reports & Analytics</h3>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="bookings">Bookings</option>
              <option value="revenue">Revenue</option>
              <option value="packages">Packages</option>
            </select>
            <button className="bg-indigo-600 text-white px-4 py-1 rounded-md text-sm hover:bg-indigo-700">
              Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Total Bookings</h4>
            <p className="text-3xl font-bold text-indigo-600">124</p>
            <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Total Revenue</h4>
            <p className="text-3xl font-bold text-green-600">$18,450</p>
            <p className="text-sm text-gray-500 mt-1">+8.2% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Average Booking Value</h4>
            <p className="text-3xl font-bold text-blue-600">$148.79</p>
            <p className="text-sm text-gray-500 mt-1">+3.5% from last month</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            {reportType === 'bookings' ? 'Bookings Over Time' : 
             reportType === 'revenue' ? 'Revenue Over Time' : 'Package Popularity'}
          </h4>
          <div className="h-80">
            {/* In a real app, you would use a charting library like Chart.js */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded">
              <p className="text-gray-500">Chart visualization would appear here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Most Popular Packages</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {popularPackages.map((pkg, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pkg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.bookings}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${pkg.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${(pkg.bookings / 141) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {Math.round((pkg.bookings / 141) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  const SettingsPanel = () => {
    const [settings, setSettings] = useState({
      siteTitle: 'Yala Safari',
      contactEmail: 'info@yalasafari.com',
      phoneNumber: '+94 77 123 4567',
      bookingConfirmation: true,
      paymentMethods: ['credit_card', 'paypal', 'bank_transfer']
    });
  
    const paymentOptions = [
      { id: 'credit_card', name: 'Credit Card' },
      { id: 'paypal', name: 'PayPal' },
      { id: 'bank_transfer', name: 'Bank Transfer' },
      { id: 'on_site', name: 'Pay On Site' }
    ];
  
    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings({
        ...settings,
        [name]: type === 'checkbox' ? checked : value
      });
    };
  
    const handlePaymentMethodChange = (methodId, isChecked) => {
      setSettings({
        ...settings,
        paymentMethods: isChecked
          ? [...settings.paymentMethods, methodId]
          : settings.paymentMethods.filter(id => id !== methodId)
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Save settings to server
      alert('Settings saved successfully!');
    };
  
    return (
      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">General Settings</h4>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input
                  type="text"
                  name="siteTitle"
                  value={settings.siteTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={settings.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Booking Settings</h4>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="bookingConfirmation"
                    checked={settings.bookingConfirmation}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send booking confirmation emails</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {paymentOptions.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`payment-${method.id}`}
                        checked={settings.paymentMethods.includes(method.id)}
                        onChange={(e) => handlePaymentMethodChange(method.id, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`payment-${method.id}`} className="ml-2 text-sm text-gray-700">
                        {method.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    );
  };