import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminFetch, apiEndpoints } from '../config/api';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  // Use useCallback to memoize fetchPackages
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? apiEndpoints.packages.base 
        : `${apiEndpoints.packages.base}?isActive=${filter === 'active'}`;
      
      const response = await adminFetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
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
        { method: 'PATCH' }
      );
      
      if (response.ok) {
        fetchPackages();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const response = await adminFetch(
          `${apiEndpoints.packages.base}/${id}`,
          { method: 'DELETE' }
        );
        
        if (response.ok) {
          fetchPackages();
        }
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading packages...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Package Management</h1>
        <button
          onClick={() => navigate('/dashboard/packages/create')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          + Create New Package
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6">
        {['all', 'active', 'inactive'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{pkg.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{pkg.park} Park</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    pkg.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {pkg.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-semibold capitalize">{pkg.packageType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Bookings:</span>
                  <p className="font-semibold">{pkg.totalBookings || 0}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/dashboard/packages/edit/${pkg._id}`)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(pkg._id)}
                  className={`flex-1 px-4 py-2 rounded ${
                    pkg.isActive
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {pkg.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No packages found</p>
          <button
            onClick={() => navigate('/dashboard/packages/create')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Create your first package
          </button>
        </div>
      )}
    </div>
  );
};

export default PackageList;