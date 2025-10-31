import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicFetch, apiEndpoints } from '../config/api';
import yalaImage from '../assets/yaala.png';
import bundalaImage from '../assets/bundala.jpg';
import udawalaweImage from '../assets/bund.jpg';
import lunugamweheraImage from '../assets/lunu.jpg';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  const parkImages = {
    yala: yalaImage,
    bundala: bundalaImage,
    udawalawe: udawalaweImage,
    Lunugamwehera: lunugamweheraImage,
  };

  useEffect(() => {
    fetchPackage();
  }, [id]);

  const fetchPackage = async () => {
    try {
      const response = await publicFetch(apiEndpoints.packages.byId(id));
      const data = await response.json();
      
      if (data.success) {
        setPkg(data.package);
      }
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    // Navigate to booking page with package data
    navigate('/packages', { state: { selectedPackage: pkg } });
  };

  if (loading) return <div className="p-8">Loading package details...</div>;
  if (!pkg) return <div className="p-8">Package not found</div>;

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Image */}
        <div className="relative rounded-xl overflow-hidden mb-8 h-96">
          <img
            src={parkImages[pkg.park]}
            alt={pkg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-white mb-2">{pkg.name}</h1>
              <p className="text-2xl text-green-100 capitalize">{pkg.park} National Park</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">About This Package</h2>
              <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Features */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Package Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-green-600 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {pkg.highlights && pkg.highlights.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Safari Highlights</h2>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold"
                    >
                      🦁 {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Pricing Details</h2>
              
              {/* Jeep Pricing */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Private Safari - Jeep Pricing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Jeep Type</th>
                        <th className="px-4 py-2 text-right">Morning</th>
                        <th className="px-4 py-2 text-right">Afternoon</th>
                        <th className="px-4 py-2 text-right">Extended</th>
                        <th className="px-4 py-2 text-right">Full Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['basic', 'luxury', 'superLuxury'].map((type) => (
                        <tr key={type} className="border-b">
                          <td className="px-4 py-3 font-semibold capitalize">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="px-4 py-3 text-right">${pkg.jeep[type].morning}</td>
                          <td className="px-4 py-3 text-right">${pkg.jeep[type].afternoon}</td>
                          <td className="px-4 py-3 text-right">${pkg.jeep[type].extended}</td>
                          <td className="px-4 py-3 text-right">${pkg.jeep[type].fullDay}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shared Safari Pricing */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Shared Safari - Per Person</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(pkg.shared).map(([seats, price]) => (
                    <div key={seats} className="bg-gray-100 p-3 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">${price}</div>
                      <div className="text-xs text-gray-600">{seats} seat{seats > 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Book This Package</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package Type:</span>
                  <span className="font-semibold capitalize">{pkg.packageType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Capacity:</span>
                  <span className="font-semibold">{pkg.maxCapacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket (Foreign):</span>
                  <span className="font-semibold">${pkg.tickets.foreign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ticket (Local):</span>
                  <span className="font-semibold">${pkg.tickets.local}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Starting from:</span>
                  <span className="text-3xl font-bold text-green-600">
                    ${pkg.jeep.basic.morning}
                  </span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
              >
                Book Now
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Price includes jeep, guide options available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;