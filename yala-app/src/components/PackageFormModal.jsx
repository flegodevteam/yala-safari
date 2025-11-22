import { useState, useEffect } from 'react';
import { FiX, FiSave  } from 'react-icons/fi';
import { adminFetch, apiEndpoints } from '../config/api';

const PackageFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    park: 'yala',
    block: '',
    packageType: 'private',
    maxCapacity: 7,
    
    // Jeep Pricing
    jeep: {
      basic: { morning: 45, afternoon: 45, extended: 50, fullDay: 90 },
      luxury: { morning: 65, afternoon: 65, extended: 70, fullDay: 130 },
      superLuxury: { morning: 80, afternoon: 80, extended: 90, fullDay: 150 },
    },
    
    // Legacy Meals Pricing
    meals: { breakfast: 5, lunch: 6 },
    
    // DYNAMIC MEAL OPTIONS
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

  const [newFeature, setNewFeature] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await adminFetch(apiEndpoints.packages.base, {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Package created successfully!');
        if (onSuccess) onSuccess();
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

  // const updateMealItem = (mealType, index, field, value) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     mealOptions: {
  //       ...prev.mealOptions,
  //       [mealType]: prev.mealOptions[mealType].map((item, i) => 
  //         i === index ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
  //       )
  //     }
  //   }));
  // };

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

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-black/10 backdrop-blur-xl r"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-y-auto my-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-[#e5e7eb] p-4 lg:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-[#034123]">Create New Package</h2>
            <p className="text-sm text-[#6b7280] mt-1">Add a new safari package with custom pricing</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#f9fafb] text-[#6b7280] hover:text-[#034123] transition-all duration-300"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Basic Information */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 lg:mb-6 pb-3 border-b border-[#034123]/20">Basic Information</h3>
              
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

                <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
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
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Jeep Pricing ($)</h3>
              {['basic', 'luxury', 'superLuxury'].map((jeepType) => (
                <div key={jeepType} className="mb-6 pb-6 border-b border-[#e5e7eb] last:border-b-0">
                  <h4 className="font-bold mb-4 text-lg capitalize text-[#034123]">
                    {jeepType === 'superLuxury' ? 'Super Luxury' : jeepType} Jeep
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Meal Options */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20"> Meal Options</h3>

              {/* Breakfast Items */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-4 text-[#034123] border-b border-[#034123]/20 pb-2">Breakfast Items</h4>
                
                <div className="bg-[#034123]/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#034123]/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#034123] mb-2">Item Name *</label>
                      <input
                        type="text"
                        value={newBreakfastItem.name}
                        onChange={(e) => setNewBreakfastItem({...newBreakfastItem, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
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
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addBreakfastItem}
                        className="w-full bg-[#034123] hover:bg-[#026042] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.mealOptions.breakfast.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-[#034123]">{item.name}</p>
                        <p className="text-sm text-[#6b7280]">${item.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('breakfast', index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lunch Items */}
              <div>
                <h4 className="font-bold text-lg mb-4 text-[#f26b21] border-b border-[#f26b21]/20 pb-2">Lunch Items</h4>
                
                <div className="bg-[#f26b21]/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#f26b21]/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#034123] mb-2">Item Name *</label>
                      <input
                        type="text"
                        value={newLunchItem.name}
                        onChange={(e) => setNewLunchItem({...newLunchItem, name: e.target.value})}
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
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
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addLunchItem}
                        className="w-full bg-[#f26b21] hover:bg-[#e05a1a] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.mealOptions.lunch.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-[#034123]">{item.name}</p>
                        <p className="text-sm text-[#6b7280]">${item.price}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMealItem('lunch', index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guide Pricing */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Guide Pricing ($)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
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
                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
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
                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
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
                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Pricing */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Ticket Pricing ($ per person)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
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
                    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Package Features</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-[#034123]/10 text-[#034123] px-4 py-2 rounded-full flex items-center gap-2 border border-[#034123]/20"
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
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Package Highlights</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="bg-[#f26b21]/10 text-[#f26b21] px-4 py-2 rounded-full flex items-center gap-2 border border-[#f26b21]/20"
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
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e5e7eb]">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#034123] hover:bg-[#026042] text-white py-3 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Create Package
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#f9fafb] hover:bg-[#e5e7eb] text-[#4b5563] rounded-xl font-bold hover:shadow-lg transition-all duration-300 border border-[#d1d5db]/60 shadow-sm whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageFormModal;
