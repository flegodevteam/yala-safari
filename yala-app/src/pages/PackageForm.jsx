import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#034123] mb-4"></div>
        <span className="text-[#4b5563] font-medium">Loading package data...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e6e6] via-white to-[#f5f5f5] py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#034123] mb-2">
              {isEditMode ? 'Edit Package' : 'Create New Package'}
            </h1>
            <p className="text-[#6b7280] text-base">
              {isEditMode ? 'Update package details and pricing' : 'Add a new safari package with custom pricing'}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/packages')}
            className="flex items-center gap-2 px-5 py-3 bg-white/95 backdrop-blur-xl hover:bg-white text-[#034123] font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
        {/* Basic Information */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#034123] mb-2">Package Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="e.g., Premium Yala Safari"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#034123] mb-2">Park *</label>
              <select
                required
                value={formData.park}
                onChange={(e) => setFormData({...formData, park: e.target.value})}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
              >
                <option value="yala">Yala National Park</option>
                <option value="bundala">Bundala National Park</option>
                <option value="udawalawe">Udawalawe National Park</option>
                <option value="Lunugamwehera">Lunugamwehera National Park</option>
              </select>
            </div>

            {formData.park === 'yala' && (
              <div>
                <label className="block text-sm font-semibold text-[#034123] mb-2">Block</label>
                <select
                  value={formData.block}
                  onChange={(e) => setFormData({...formData, block: e.target.value})}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
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
              <label className="block text-sm font-semibold text-[#034123] mb-2">Max Capacity</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({...formData, maxCapacity: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
              />
            </div>

            <div className="flex items-center p-4 bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-3 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
              />
              <label htmlFor="isActive" className="font-semibold text-[#034123] cursor-pointer">Active Package</label>
            </div>
          </div>

          <div className="mt-4 lg:mt-6">
            <label className="block text-sm font-semibold text-[#034123] mb-2">Description *</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
              placeholder="Describe the safari experience..."
            />
          </div>
        </div>

        {/* Jeep Pricing */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2 lg:mb-3 pb-3 border-b border-[#034123]/20">Jeep Pricing ($)</h2>
          <p className="text-sm text-[#6b7280] mb-4 lg:mb-6">Set prices for different jeep types and time slots</p>
          
          {['basic', 'luxury', 'superLuxury'].map((jeepType) => (
            <div key={jeepType} className="mb-6 lg:mb-8 pb-6 lg:pb-8 border-b border-[#e5e7eb] last:border-b-0">
              <h3 className="font-bold mb-4 text-lg lg:text-xl capitalize text-[#034123]">
                {jeepType === 'superLuxury' ? 'Super Luxury' : jeepType} Jeep
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                {['morning', 'afternoon', 'extended', 'fullDay'].map((slot) => (
                  <div key={slot}>
                    <label className="block text-sm mb-2 capitalize font-semibold text-[#034123]">
                      {slot === 'fullDay' ? 'Full Day' : slot}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.jeep[jeepType][slot]}
                      onChange={(e) => handleJeepPriceChange(jeepType, slot, e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
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
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2 lg:mb-3 pb-3 border-b border-[#034123]/20">Meal Options</h2>
          <p className="text-sm text-[#6b7280] mb-6 lg:mb-8">Add custom meal items with individual prices</p>

          {/* BREAKFAST ITEMS */}
          <div className="mb-8 lg:mb-10">
            <h3 className="font-bold text-lg lg:text-xl mb-4 lg:mb-5 text-[#034123] border-b border-[#034123]/20 pb-2">Breakfast Items</h3>
            
            {/* Add New Breakfast Item Form */}
            <div className="bg-[#034123]/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 mb-4 lg:mb-6 border border-[#034123]/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newBreakfastItem.name}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, name: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., Fresh Fruit Platter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBreakfastItem.price}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, price: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addBreakfastItem}
                    className="w-full bg-[#034123] hover:bg-[#026042] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 lg:mt-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Description (optional)</label>
                  <input
                    type="text"
                    value={newBreakfastItem.description}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, description: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex items-center p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                  <input
                    type="checkbox"
                    id="breakfast-veg"
                    checked={newBreakfastItem.isVegetarian}
                    onChange={(e) => setNewBreakfastItem({...newBreakfastItem, isVegetarian: e.target.checked})}
                    className="mr-2 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                  />
                  <label htmlFor="breakfast-veg" className="text-sm font-semibold text-[#034123] cursor-pointer">Vegetarian</label>
                </div>
              </div>
            </div>

            {/* Breakfast Items List */}
            <div className="space-y-3">
              {formData.mealOptions.breakfast.length === 0 ? (
                <p className="text-[#6b7280] text-center py-8 bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">No breakfast items added yet</p>
              ) : (
                formData.mealOptions.breakfast.map((item, index) => (
                  <div key={index} className="bg-[#f9fafb]/50 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMealItem('breakfast', index, 'name', e.target.value)}
                            className="font-semibold text-[#034123] border-b-2 border-transparent hover:border-[#034123]/30 focus:border-[#034123] outline-none px-2 py-1 bg-transparent"
                          />
                          {item.isVegetarian && (
                            <span className="bg-[#034123]/10 text-[#034123] text-xs px-3 py-1 rounded-full border border-[#034123]/20 font-semibold">🌱 Veg</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <label className="text-[#6b7280] font-semibold">Price:</label>
                            <div className="flex items-center gap-1">
                              <span className="text-[#034123] font-semibold">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateMealItem('breakfast', index, 'price', e.target.value)}
                                className="w-24 px-2 py-1.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.isVegetarian}
                              onChange={(e) => updateMealItem('breakfast', index, 'isVegetarian', e.target.checked)}
                              className="h-4 w-4 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                            />
                            <label className="text-[#6b7280] font-medium cursor-pointer">Vegetarian</label>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[#6b7280] mt-3 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-[#e5e7eb]/60">{item.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('breakfast', index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 flex-shrink-0"
                        title="Remove item"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LUNCH ITEMS */}
          <div>
            <h3 className="font-bold text-lg lg:text-xl mb-4 lg:mb-5 text-[#f26b21] border-b border-[#f26b21]/20 pb-2">Lunch Items</h3>
            
            {/* Add New Lunch Item Form */}
            <div className="bg-[#f26b21]/5 backdrop-blur-sm rounded-xl p-4 lg:p-5 mb-4 lg:mb-6 border border-[#f26b21]/20">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Item Name *</label>
                  <input
                    type="text"
                    value={newLunchItem.name}
                    onChange={(e) => setNewLunchItem({...newLunchItem, name: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., Rice & Curry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newLunchItem.price}
                    onChange={(e) => setNewLunchItem({...newLunchItem, price: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addLunchItem}
                    className="w-full bg-[#f26b21] hover:bg-[#e05a1a] text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                  >
                    + Add Item
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 lg:mt-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Description (optional)</label>
                  <input
                    type="text"
                    value={newLunchItem.description}
                    onChange={(e) => setNewLunchItem({...newLunchItem, description: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="Brief description"
                  />
                </div>
                <div className="flex items-center p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                  <input
                    type="checkbox"
                    id="lunch-veg"
                    checked={newLunchItem.isVegetarian}
                    onChange={(e) => setNewLunchItem({...newLunchItem, isVegetarian: e.target.checked})}
                    className="mr-2 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                  />
                  <label htmlFor="lunch-veg" className="text-sm font-semibold text-[#034123] cursor-pointer">Vegetarian</label>
                </div>
              </div>
            </div>

            {/* Lunch Items List */}
            <div className="space-y-3">
              {formData.mealOptions.lunch.length === 0 ? (
                <p className="text-[#6b7280] text-center py-8 bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">No lunch items added yet</p>
              ) : (
                formData.mealOptions.lunch.map((item, index) => (
                  <div key={index} className="bg-[#f9fafb]/50 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateMealItem('lunch', index, 'name', e.target.value)}
                            className="font-semibold text-[#034123] border-b-2 border-transparent hover:border-[#f26b21]/30 focus:border-[#f26b21] outline-none px-2 py-1 bg-transparent"
                          />
                          {item.isVegetarian && (
                            <span className="bg-[#034123]/10 text-[#034123] text-xs px-3 py-1 rounded-full border border-[#034123]/20 font-semibold">🌱 Veg</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <label className="text-[#6b7280] font-semibold">Price:</label>
                            <div className="flex items-center gap-1">
                              <span className="text-[#034123] font-semibold">$</span>
                              <input
                                type="number"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateMealItem('lunch', index, 'price', e.target.value)}
                                className="w-24 px-2 py-1.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.isVegetarian}
                              onChange={(e) => updateMealItem('lunch', index, 'isVegetarian', e.target.checked)}
                              className="h-4 w-4 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                            />
                            <label className="text-[#6b7280] font-medium cursor-pointer">Vegetarian</label>
                          </div>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[#6b7280] mt-3 bg-white/50 backdrop-blur-sm p-2 rounded-lg border border-[#e5e7eb]/60">{item.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('lunch', index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 flex-shrink-0"
                        title="Remove item"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Guide Pricing */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2 lg:mb-3 pb-3 border-b border-[#034123]/20">Guide Pricing ($)</h2>
          <p className="text-sm text-[#6b7280] mb-4 lg:mb-6">Set prices for different guide options</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60">
              <label className="block text-sm font-semibold text-[#034123] mb-2">Driver Only</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.guide.driver}
                onChange={(e) => setFormData({
                  ...formData,
                  guide: {...formData.guide, driver: Number(e.target.value)}
                })}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="0.00"
              />
              <p className="text-xs text-[#6b7280] mt-2">Basic transportation only</p>
            </div>
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60">
              <label className="block text-sm font-semibold text-[#034123] mb-2">Driver Guide</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.guide.driverGuide}
                onChange={(e) => setFormData({
                  ...formData,
                  guide: {...formData.guide, driverGuide: Number(e.target.value)}
                })}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="0.00"
              />
              <p className="text-xs text-[#6b7280] mt-2">Driver + wildlife guide</p>
            </div>
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60">
              <label className="block text-sm font-semibold text-[#034123] mb-2">Driver + Separate Guide</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.guide.separateGuide}
                onChange={(e) => setFormData({
                  ...formData,
                  guide: {...formData.guide, separateGuide: Number(e.target.value)}
                })}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="0.00"
              />
              <p className="text-xs text-[#6b7280] mt-2">Professional guide included</p>
            </div>
          </div>
        </div>

        {/* Ticket Pricing */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-2 lg:mb-3 pb-3 border-b border-[#034123]/20">Ticket Pricing ($ per person)</h2>
          <p className="text-sm text-[#6b7280] mb-4 lg:mb-6">National park entry fees</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60">
              <label className="block text-sm font-semibold text-[#034123] mb-2">Foreign Visitor</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tickets.foreign}
                onChange={(e) => setFormData({
                  ...formData,
                  tickets: {...formData.tickets, foreign: Number(e.target.value)}
                })}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="0.00"
              />
            </div>
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-[#e5e7eb]/60">
              <label className="block text-sm font-semibold text-[#034123] mb-2">Local Visitor</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tickets.local}
                onChange={(e) => setFormData({
                  ...formData,
                  tickets: {...formData.tickets, local: Number(e.target.value)}
                })}
                className="w-full px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-5 pb-3 border-b border-[#034123]/20">Package Features</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
              placeholder="e.g., Professional Guide, All Equipment Included"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {formData.features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#034123]/10 text-[#034123] px-4 py-2 rounded-full flex items-center gap-2 border border-[#034123]/20 hover:bg-[#034123]/20 transition-all duration-300"
              >
                <span className="font-medium">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-[#034123] hover:text-[#026042] font-bold hover:scale-110 transition-transform duration-300"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6 xl:p-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#034123] mb-4 lg:mb-5 pb-3 border-b border-[#034123]/20">Package Highlights</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 lg:mb-6">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
              className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
              placeholder="e.g., Leopard Sightings, Elephant Herds"
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-6 py-3 bg-[#f26b21] hover:bg-[#e05a1a] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {formData.highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-[#f26b21]/10 text-[#f26b21] px-4 py-2 rounded-full flex items-center gap-2 border border-[#f26b21]/20 hover:bg-[#f26b21]/20 transition-all duration-300"
              >
                <span className="font-medium">{highlight}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-[#f26b21] hover:text-[#e05a1a] font-bold hover:scale-110 transition-transform duration-300"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 sticky bottom-4 z-10 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 lg:p-6">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#034123] hover:bg-[#026042] text-white py-4 px-6 rounded-xl font-bold text-base lg:text-lg hover:shadow-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-5 h-5" />
                {isEditMode ? 'Update Package' : 'Create Package'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/packages')}
            className="px-6 lg:px-8 py-4 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] rounded-xl font-bold text-base lg:text-lg hover:shadow-lg transition-all duration-300 border border-[#d1d5db]/60 shadow-sm whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default PackageForm;