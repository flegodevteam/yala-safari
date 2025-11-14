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
    packageType: 'private', // ONLY PRIVATE NOW
    maxCapacity: 7,
    
    // Jeep Pricing
    jeep: {
      basic: { morning: 45, afternoon: 45, extended: 50, fullDay: 90 },
      luxury: { morning: 65, afternoon: 65, extended: 70, fullDay: 130 },
      superLuxury: { morning: 80, afternoon: 80, extended: 90, fullDay: 150 },
    },
    
    // REMOVED: Shared Safari Pricing
    
    // Legacy Meals Pricing (keep for backward compatibility)
    meals: { breakfast: 5, lunch: 6 },
    
    // 🆕 DYNAMIC MEAL OPTIONS
    mealOptions: {
      breakfast: [],
      lunch: []
    },
    
    // Guide Pricing
    guide: { driver: 0, driverGuide: 15, separateGuide: 25 },
    
    // Ticket Pricing
    tickets: { foreign: 15, local: 5 },
    
    // Features & Highlights
    features: [],
    highlights: [],
    
    isActive: true,
  });

  // 🆕 New meal item states
  const [newBreakfastItem, setNewBreakfastItem] = useState({
    name: '',
    price: '',
    isVegetarian: false,
    description: ''
  });

  const [newLunchItem, setNewLunchItem] = useState({
    name: '',
    price: '',
    isVegetarian: false,
    description: ''
  });

  const [editingMealIndex, setEditingMealIndex] = useState({ type: null, index: null });

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
        // Initialize mealOptions if not present
        const packageData = {
          ...data.package,
          mealOptions: data.package.mealOptions || {
            breakfast: [],
            lunch: []
          }
        };
        setFormData(packageData);
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

  // REMOVED: handleSharedPriceChange - No shared safari

  // 🆕 MEAL OPTIONS HANDLERS

  const addBreakfastItem = () => {
    if (!newBreakfastItem.name || !newBreakfastItem.price) {
      alert('Please enter item name and price');
      return;
    }

    setFormData(prev => ({
      ...prev,
      mealOptions: {
        ...prev.mealOptions,
        breakfast: [
          ...prev.mealOptions.breakfast,
          {
            name: newBreakfastItem.name,
            price: Number(newBreakfastItem.price),
            isVegetarian: newBreakfastItem.isVegetarian,
            description: newBreakfastItem.description
          }
        ]
      }
    }));

    // Reset form
    setNewBreakfastItem({ name: '', price: '', isVegetarian: false, description: '' });
  };

  const addLunchItem = () => {
    if (!newLunchItem.name || !newLunchItem.price) {
      alert('Please enter item name and price');
      return;
    }

    setFormData(prev => ({
      ...prev,
      mealOptions: {
        ...prev.mealOptions,
        lunch: [
          ...prev.mealOptions.lunch,
          {
            name: newLunchItem.name,
            price: Number(newLunchItem.price),
            isVegetarian: newLunchItem.isVegetarian,
            description: newLunchItem.description
          }
        ]
      }
    }));

    // Reset form
    setNewLunchItem({ name: '', price: '', isVegetarian: false, description: '' });
  };

  const removeMealItem = (mealType, index) => {
    setFormData(prev => ({
      ...prev,
      mealOptions: {
        ...prev.mealOptions,
        [mealType]: prev.mealOptions[mealType].filter((_, i) => i !== index)
      }
    }));
  };

  const updateMealItem = (mealType, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      mealOptions: {
        ...prev.mealOptions,
        [mealType]: prev.mealOptions[mealType].map((item, i) => 
          i === index ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
        )
      }
    }));
  };

  // FEATURES & HIGHLIGHTS HANDLERS

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
          {isEditMode ? 'Update package details and pricing' : 'Add a new safari package with custom pricing'}
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

            {/* REMOVED: Package Type selector - Only private safari now */}
            <input type="hidden" value="private" name="packageType" />

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
          <h2 className="text-xl font-bold mb-4">🚙 Jeep Pricing ($)</h2>
          <p className="text-sm text-gray-600 mb-4">Set prices for different jeep types and time slots</p>
          
          {['basic', 'luxury', 'superLuxury'].map((jeepType) => (
            <div key={jeepType} className="mb-6 pb-6 border-b last:border-b-0">
              <h3 className="font-semibold mb-3 text-lg capitalize">
                {jeepType === 'superLuxury' ? 'Super Luxury' : jeepType} Jeep
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['morning', 'afternoon', 'extended', 'fullDay'].map((slot) => (
                  <div key={slot}>
                    <label className="block text-sm mb-1 capitalize font-medium text-gray-700">
                      {slot === 'fullDay' ? 'Full Day' : slot}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.jeep[jeepType][slot]}
                      onChange={(e) => handleJeepPriceChange(jeepType, slot, e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* REMOVED: Shared Safari Pricing - Only private safaris now */}

        {/* 🆕 DYNAMIC MEAL OPTIONS */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">🍽️ Meal Options</h2>
          <p className="text-sm text-gray-600 mb-6">Add custom meal items with individual prices</p>

          {/* BREAKFAST ITEMS */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 text-green-700">Breakfast Items</h3>
            
            {/* Add New Breakfast Item Form */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newBreakfastItem.name}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, name: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Fresh Fruit Platter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBreakfastItem.price}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, price: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addBreakfastItem}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={newBreakfastItem.description}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, description: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="breakfast-veg"
                    checked={newBreakfastItem.isVegetarian}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, isVegetarian: e.target.checked})}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="breakfast-veg" className="text-sm font-medium">Vegetarian</label>
                </div>
              </div>
            </div>

            {/* Breakfast Items List */}
            <div className="space-y-3">
              {formData.mealOptions.breakfast.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No breakfast items added yet</p>
              ) : (
                formData.mealOptions.breakfast.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMealItem('breakfast', index, 'name', e.target.value)}
                            className="font-semibold border-b border-transparent hover:border-gray-300 focus:border-green-500 outline-none px-1"
                          />
                          {item.isVegetarian && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">🌱 Veg</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="text-gray-600">Price:</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateMealItem('breakfast', index, 'price', e.target.value)}
                              className="ml-2 w-20 border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.isVegetarian}
                              onChange={(e) => updateMealItem('breakfast', index, 'isVegetarian', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-gray-600">Vegetarian</label>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('breakfast', index)}
                        className="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LUNCH ITEMS */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-orange-700">Lunch Items</h3>
            
            {/* Add New Lunch Item Form */}
            <div className="bg-orange-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Item Name *</label>
                  <input
                    type="text"
                    value={newLunchItem.name}
                    onChange={(e) => setNewLunchItem({...newLunchItem, name: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="e.g., Rice & Curry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newLunchItem.price}
                    onChange={(e) => setNewLunchItem({...newLunchItem, price: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addLunchItem}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-medium"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <input
                    type="text"
                    value={newLunchItem.description}
                    onChange={(e) => setNewLunchItem({...newLunchItem, description: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lunch-veg"
                    checked={newLunchItem.isVegetarian}
                    onChange={(e) => setNewLunchItem({...newLunchItem, isVegetarian: e.target.checked})}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="lunch-veg" className="text-sm font-medium">Vegetarian</label>
                </div>
              </div>
            </div>

            {/* Lunch Items List */}
            <div className="space-y-3">
              {formData.mealOptions.lunch.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No lunch items added yet</p>
              ) : (
                formData.mealOptions.lunch.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMealItem('lunch', index, 'name', e.target.value)}
                            className="font-semibold border-b border-transparent hover:border-gray-300 focus:border-orange-500 outline-none px-1"
                          />
                          {item.isVegetarian && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">🌱 Veg</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <label className="text-gray-600">Price:</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateMealItem('lunch', index, 'price', e.target.value)}
                              className="ml-2 w-20 border border-gray-300 rounded px-2 py-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.isVegetarian}
                              onChange={(e) => updateMealItem('lunch', index, 'isVegetarian', e.target.checked)}
                              className="mr-2"
                            />
                            <label className="text-gray-600">Vegetarian</label>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('lunch', index)}
                        className="ml-4 text-red-600 hover:text-red-800 font-bold text-xl"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Guide Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">👨‍✈️ Guide Pricing ($)</h2>
          <p className="text-sm text-gray-600 mb-4">Set prices for different guide options</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Basic transportation only</p>
            </div>
            <div>
              <label className="block font-semibold mb-2">Driver Guide</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.guide.driverGuide}
                onChange={(e) => setFormData({
                  ...formData,
                  guide: {...formData.guide, driverGuide: Number(e.target.value)}
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Driver + wildlife guide</p>
            </div>
            <div>
              <label className="block font-semibold mb-2">Driver + Separate Guide</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.guide.separateGuide}
                onChange={(e) => setFormData({
                  ...formData,
                  guide: {...formData.guide, separateGuide: Number(e.target.value)}
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Professional guide included</p>
            </div>
          </div>
        </div>

        {/* Ticket Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">🎫 Ticket Pricing ($ per person)</h2>
          <p className="text-sm text-gray-600 mb-4">National park entry fees</p>
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">✨ Package Features</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Professional Guide, All Equipment Included"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium"
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
                  className="text-green-600 hover:text-green-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">🌟 Package Highlights</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="flex-1 border border-gray-300 rounded px-3 py-2"
              placeholder="e.g., Leopard Sightings, Elephant Herds"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium"
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
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-400 shadow-lg"
          >
            {saving ? 'Saving...' : isEditMode ? '✓ Update Package' : '+ Create Package'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/packages')}
            className="px-8 py-4 bg-gray-300 text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-400 shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;