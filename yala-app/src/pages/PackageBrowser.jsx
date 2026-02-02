import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicFetch, apiEndpoints } from '../config/api';
import yalaImage from '../assets/yaala.png';
import bundalaImage from '../assets/bundala.jpg';
import udawalaweImage from '../assets/bund.jpg';
import lunugamweheraImage from '../assets/lunu.jpg';

const PackageBrowser = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPark, setSelectedPark] = useState('all');
  const navigate = useNavigate();

  const parkImages = {
    yala: yalaImage,
    bundala: bundalaImage,
    udawalawe: udawalaweImage,
    Lunugamwehera: lunugamweheraImage,
  };

  const fetchPackages = useCallback(async () => {
    try {
      const url = selectedPark === 'all'
        ? `${apiEndpoints.packages.base}?isActive=true`
        : apiEndpoints.packages.byPark(selectedPark);
      
      const response = await publicFetch(url);
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPark]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading) return <div className="p-8">Loading packages...</div>;

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            Safari Packages
          </h1>
          <p className="text-xl text-gray-600">
            Choose your perfect safari adventure
          </p>
        </div>

        {/* Park Filter */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {['all', 'yala', 'bundala', 'udawalawe', 'Lunugamwehera'].map((park) => (
            <button
              key={park}
              onClick={() => setSelectedPark(park)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize ${
                selectedPark === park
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {park === 'all' ? 'All Parks' : park}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={parkImages[pkg.park]}
                alt={pkg.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-green-800">{pkg.name}</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                    {pkg.park}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>

                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-700">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          ✓ {feature}
                        </span>
                      ))}
                      {pkg.features.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{pkg.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Pricing Preview */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Starting from:</span>
                    <span className="font-bold text-green-600 text-lg">
                      ${pkg.jeep.basic.morning}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/packages/${pkg._id}`)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  View Details & Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No packages available for {selectedPark === 'all' ? 'any park' : selectedPark}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageBrowser;