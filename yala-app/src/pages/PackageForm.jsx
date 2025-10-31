import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminFetch, apiEndpoints } from '../config/api';

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    park: 'yala',
    block: '',
    packageType: 'both',
    maxCapacity: 7,
    
    // Jeep Pricing
    jeep: {
      basic: { morning: 5, afternoon: 5, extended: 7, fullDay: 10 },
      luxury: { morning: 7, afternoon: 7, extended: 9, fullDay: 12 },
      superLuxury: { morning: 10, afternoon: 10, extended: 12, fullDay: 15 },
    },
    
    // Shared Pricing
    shared: { 1: 10, 2: 8, 3: 7, 4: 5, 5: 5, 6: 5, 7: 5 },
    
    // Meals Pricing
    meals: { breakfast: 5, lunch: 6 },
    
    // Guide Pricing
    guide: { driver: 0, driverGuide: 10, separateGuide: 15 },
    
    // Ticket Pricing
    tickets: { foreign: 15, local: 5 },
    
    // Features & Highlights
    features: [],
    highlights: [],
    
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchPackage();
    }
  }, [id]);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(`${apiEndpoints.packages.base}/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(data.package);
      }
    } catch (error) {
      console.error('Error fetching package:', error);
      alert('Failed to load package');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditMode
        ? `${apiEndpoints.packages.base}/${id}`
        : apiEndpoints.packages.base;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await adminFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Package ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/dashboard/packages');
      } else {
        alert(data.message || 'Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Failed to save package');
    } finally {
      setSaving(false);
    }
  };

  const handleJeepPriceChange = (jeepType, timeSlot, value) => {
    setFormData(prev => ({
      ...prev,
      jeep: {
        ...prev.jeep,
        [jeepType]: {
          ...prev.jeep[jeepType],
          [timeSlot]: Number(value),
        },
      },
    }));
  };

  const handleSharedPriceChange = (seats, value) => {
    setFormData(prev => ({
      ...prev,
      shared: {
        ...prev.shared,
        [seats]: Number(value),
      },
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Edit Package' : 'Create New Package'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? 'Update package details' : 'Add a new safari package'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Package Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Premium Yala Safari"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Park *</label>
              <select
                required
                value={formData.park}
                onChange={(e) => setFormData({...formData, park: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="yala">Yala National Park</option>
                <option value="bundala">Bundala National Park</option>
                <option value="udawalawe">Udawalawe National Park</option>
                <option value="Lunugamwehera">Lunugamwehera National Park</option>
              </select>
            </div>

            {formData.park === 'yala' && (
              <div>
                <label className="block font-semibold mb-2">Block</label>
                <select
                  value={formData.block}
                  onChange={(e) => setFormData({...formData, block: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">All Blocks</option>
                  <option value="blockI">Block I</option>
                  <option value="blockII">Block II</option>
                  <option value="blockIIIIV">Block III & IV</option>
                  <option value="blockV">Block V</option>
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-2">Package Type *</label>
              <select
                required
                value={formData.packageType}
                onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="both">Private & Shared</option>
                <option value="private">Private Only</option>
                <option value="shared">Shared Only</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-2">Max Capacity</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({...formData, maxCapacity: Number(e.target.value)})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2 h-5 w-5"
              />
              <label htmlFor="isActive" className="font-semibold">Active Package</label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block font-semibold mb-2">Description *</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Describe the safari experience..."
            />
          </div>
        </div>

        {/* Jeep Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Jeep Pricing ($)</h2>
          
          {['basic', 'luxury', 'superLuxury'].map((jeepType) => (
            <div key={jeepType} className="mb-6">
              <h3 className="font-semibold mb-3 capitalize">
                {jeepType.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['morning', 'afternoon', 'extended', 'fullDay'].map((slot) => (
                  <div key={slot}>
                    <label className="block text-sm mb-1 capitalize">
                      {slot.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.jeep[jeepType][slot]}
                      onChange={(e) => handleJeepPriceChange(jeepType, slot, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Shared Safari Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Shared Safari Pricing ($ per person)</h2>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
            {[1, 2, 3, 4, 5, 6, 7].map((seats) => (
              <div key={seats}>
                <label className="block text-sm mb-1">{seats} Seat{seats > 1 ? 's' : ''}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shared[seats]}
                  onChange={(e) => handleSharedPriceChange(seats, e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Meals & Guide Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Meals */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Meals Pricing ($)</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Breakfast</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.meals.breakfast}
                  onChange={(e) => setFormData({
                    ...formData,
                    meals: {...formData.meals, breakfast: Number(e.target.value)}
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Lunch</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.meals.lunch}
                  onChange={(e) => setFormData({
                    ...formData,
                    meals: {...formData.meals, lunch: Number(e.target.value)}
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Guide */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Guide Pricing ($)</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Driver Only</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.guide.driver}
                  onChange={(e) => setFormData({
                    ...formData,
                    guide: {...formData.guide, driver: Number(e.target.value)}
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Driver + Guide</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.guide.driverGuide}
                  onChange={(e) => setFormData({
                    ...formData,
                    guide: {...formData.guide, driverGuide: Number(e.target.value)}
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Separate Guide</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.guide.separateGuide}
                  onChange={(e) => setFormData({
                    ...formData,
                    guide: {...formData.guide, separateGuide: Number(e.target.value)}
                  })}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Ticket Pricing ($)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Foreign Visitor</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tickets.foreign}
                onChange={(e) => setFormData({
                  ...formData,
                  tickets: {...formData.tickets, foreign: Number(e.target.value)}
                })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Local Visitor</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tickets.local}
                onChange={(e) => setFormData({
                  ...formData,
                  tickets: {...formData.tickets, local: Number(e.target.value)}
                })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Package Features</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Professional Guide"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Package Highlights</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Leopard Sightings"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{highlight}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Package' : 'Create Package'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/packages')}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;