import React, { useState, useEffect } from 'react';
import { FiPackage } from 'react-icons/fi';




const initialPackages = [
  {
    _id: '1',
    name: 'Safari Adventure',
    price: 299.99,
    duration: '3 days',
    status: 'active',
  },
  {
    _id: '2',
    name: 'Wildlife Explorer',
    price: 499.99,
    duration: '5 days',
    status: 'inactive',
  },
  {
    _id: '3',
    name: 'Luxury Safari',
    price: 999.99,
    duration: '7 days',
    status: 'active',
  },
];

const PackagesManager = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const fetchPackages = () => {
    setIsLoading(true);
    fetch('http://localhost:5000/api/packages')
      .then((response) => response.json())
      .then((data) => {
        setPackages(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedPackage = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      duration: formData.get('duration'),
      status: formData.get('status'),
    };

    const method = currentPackage ? 'PATCH' : 'POST';
    const url = currentPackage
      ? `http://localhost:5000/api/packages/${currentPackage._id}`
      : 'http://localhost:5000/api/packages';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPackage),
    })
      .then((res) => res.json())
      .then((data) => {
        if (currentPackage) {
          setPackages((prev) =>
            prev.map((pkg) => (pkg._id === data._id ? data : pkg))
          );
        } else {
          setPackages((prev) => [data, ...prev]);
        }
        setIsModalOpen(false);
        setCurrentPackage(null);
      })
      .catch((error) => console.error('Error saving package:', error));
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentPackage(null);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:5000/api/packages/${packageToDelete}`, {
      method: 'DELETE',
    })
      .then(() => {
        setPackages((prev) =>
          prev.filter((pkg) => pkg._id !== packageToDelete)
        );
        setIsDeleteConfirmOpen(false);
      })
      .catch((error) => console.error('Error deleting package:', error));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Manage Safari Packages
        </h3>
        <button
          onClick={() => {
            setCurrentPackage(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <FiPackage className="mr-2" /> Add New Package
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pkg.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pkg.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pkg.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setCurrentPackage(pkg);
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setPackageToDelete(pkg._id);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No packages available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentPackage ? 'Edit Package' : 'Add New Package'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentPackage?.name || ''}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={currentPackage?.price || ''}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  defaultValue={currentPackage?.duration || ''}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={currentPackage?.status || 'active'}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {currentPackage ? 'Update' : 'Create'}
                  
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this package? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesManager;
