import { useState, useEffect } from 'react';
import { FiX, FiSave, FiTrash2, FiUpload } from 'react-icons/fi';
import { adminFetch, apiEndpoints, authenticatedFetch, API_BASE_URL } from '../config/api';

const PackageFormModal = ({ onClose, onSuccess, packageId = null }) => {
  const isEditMode = Boolean(packageId);
  const [loading, setLoading] = useState(isEditMode);
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
    
    // Meals (boolean flags)
    meals: { breakfast: true, lunch: true },
    
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
    
    // Images
    images: [],
    featuredImage: '',
    
    // Shared pricing
    shared: { "1": 25, "2": 20, "3": 18, "4": 15, "5": 15, "6": 15, "7": 15 },
    
    // Available dates
    availableDates: { startDate: '', endDate: '' },
    
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingFeaturedImage, setUploadingFeaturedImage] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);

  // Fetch package data when in edit mode
  useEffect(() => {
    if (isEditMode && packageId) {
      fetchPackage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageId, isEditMode]);

  const fetchPackage = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(`${apiEndpoints.packages.base}/${packageId}`);
      const data = await response.json();
      
      if (data.success) {
        // Initialize mealOptions if not present
        const packageData = {
          ...data.package,
          mealOptions: data.package.mealOptions || {
            breakfast: [],
            lunch: []
          },
          images: data.package.images || [],
          featuredImage: data.package.featuredImage || '',
          shared: data.package.shared || { "1": 25, "2": 20, "3": 18, "4": 15, "5": 15, "6": 15, "7": 15 },
          availableDates: data.package.availableDates || { startDate: '', endDate: '' },
        };
        setFormData(packageData);
      } else {
        alert('Failed to load package data');
        onClose();
      }
    } catch (error) {
      console.error('Error fetching package:', error);
      alert('Failed to load package');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditMode
        ? `${apiEndpoints.packages.base}/${packageId}`
        : apiEndpoints.packages.base;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await adminFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Package ${isEditMode ? 'updated' : 'created'} successfully!`);
        if (onSuccess) onSuccess();
      } else {
        alert(data.message || `Failed to ${isEditMode ? 'update' : 'save'} package`);
      }
    } catch (error) {
      console.error('Error saving package:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'save'} package`);
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

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('Please select an image file');
      return;
    }

    setUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      uploadFormData.append('category', 'package');
      uploadFormData.append('title', formData.name || 'Package Image');

      const response = await authenticatedFetch(apiEndpoints.images.base, {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Get the URL from the response
        let imageUrl = '';
        if (result.url) {
          imageUrl = result.url;
        } else if (result.success && result.data && result.data.url) {
          imageUrl = result.data.url;
        } else if (result.data && result.data.url) {
          imageUrl = result.data.url;
        }

        if (imageUrl) {
          // Check if URL needs API_BASE_URL prefix
          const fullUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `${API_BASE_URL}${imageUrl}`;

          // Add image to images array
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, fullUrl]
          }));

          // Reset upload form
          setImageFile(null);
          // Reset file input
          const fileInput = document.getElementById('package-image-upload-input');
          if (fileInput) fileInput.value = '';
        } else {
          alert('Image uploaded but URL not found in response');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFeaturedImageUpload = async () => {
    if (!featuredImageFile) {
      alert('Please select an image file');
      return;
    }

    setUploadingFeaturedImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', featuredImageFile);
      uploadFormData.append('category', 'package');
      uploadFormData.append('title', `${formData.name || 'Package'} - Featured`);

      const response = await authenticatedFetch(apiEndpoints.images.base, {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        
        // Get the URL from the response
        let imageUrl = '';
        if (result.url) {
          imageUrl = result.url;
        } else if (result.success && result.data && result.data.url) {
          imageUrl = result.data.url;
        } else if (result.data && result.data.url) {
          imageUrl = result.data.url;
        }

        if (imageUrl) {
          // Check if URL needs API_BASE_URL prefix
          const fullUrl = imageUrl.startsWith('http') 
            ? imageUrl 
            : `${API_BASE_URL}${imageUrl}`;

          // Set as featured image
          setFormData(prev => ({
            ...prev,
            featuredImage: fullUrl
          }));

          // Reset upload form
          setFeaturedImageFile(null);
          // Reset file input
          const fileInput = document.getElementById('featured-image-upload-input');
          if (fileInput) fileInput.value = '';
        } else {
          alert('Image uploaded but URL not found in response');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to upload featured image');
      }
    } catch (error) {
      console.error('Error uploading featured image:', error);
      alert('Failed to upload featured image');
    } finally {
      setUploadingFeaturedImage(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (loading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-black/10 backdrop-blur-xl"
        onClick={onClose}
      >
        <div 
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-12"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#034123] mb-4"></div>
            <p className="text-[#034123] font-semibold">Loading package data...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <h2 className="text-2xl lg:text-3xl font-bold text-[#034123]">
              {isEditMode ? 'Edit Package' : 'Create New Package'}
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              {isEditMode ? 'Update package details and pricing' : 'Add a new safari package with custom pricing'}
            </p>
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
                 <div>
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Block</label>
                    <select
                      value={formData.block}
                      onChange={(e) => setFormData({...formData, block: e.target.value})}
                      className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    >
                      {/* <option value="">All Blocks</option> */}
                      <option value="blockI">Block I</option>
                      <option value="blockII">Block II</option>
                      <option value="blockIIIIV">Block III & IV</option>
                      <option value="blockV">Block V</option>
                    </select>
                  </div>

                {/* {formData.park === 'yala' && (
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
                )} */}

                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Package Type *</label>
                  <select
                    required
                    value={formData.packageType}
                    onChange={(e) => setFormData({...formData, packageType: e.target.value})}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    <option value="private">Private</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>

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
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
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
                      <div className="flex items-center p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60 w-full h-full">
                        <input
                          type="checkbox"
                          id="breakfast-vegetarian"
                          checked={newBreakfastItem.isVegetarian}
                          onChange={(e) => setNewBreakfastItem({...newBreakfastItem, isVegetarian: e.target.checked})}
                          className="mr-2 h-4 w-4 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer"
                        />
                        <label htmlFor="breakfast-vegetarian" className="text-sm font-semibold text-[#034123] cursor-pointer">Vegetarian</label>
                      </div>
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
                  <div>
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Description (optional)</label>
                    <input
                      type="text"
                      value={newBreakfastItem.description}
                      onChange={(e) => setNewBreakfastItem({...newBreakfastItem, description: e.target.value})}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      placeholder="e.g., Veg sandwich"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.mealOptions.breakfast.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#034123]">{item.name}</p>
                          {item.isVegetarian && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                              Vegetarian
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6b7280]">${item.price}</p>
                        {item.description && (
                          <p className="text-xs text-[#9ca3af] mt-1">{item.description}</p>
                        )}
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
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
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
  <label className="block text-sm font-semibold text-[#034123] mb-2">
    Price ($) *
  </label>
  <input
    type="number"
    min="0"
    step="0.01"
    value={newLunchItem.price}
    onChange={(e) =>
      setNewLunchItem({ ...newLunchItem, price: e.target.value })
    }
    className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl
               focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123]
               transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
    placeholder="0.00"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-[#034123] mb-2">
    &nbsp;
  </label>

  <div className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60
                  rounded-xl shadow-sm flex items-center">
    <input
      type="checkbox"
      id="lunch-vegetarian"
      checked={newLunchItem.isVegetarian}
      onChange={(e) =>
        setNewLunchItem({ ...newLunchItem, isVegetarian: e.target.checked })
      }
      className="mr-2 h-4 w-4 text-[#f26b21] focus:ring-[#f26b21]
                 border-[#d1d5db]/60 rounded cursor-pointer"
    />
    <label
      htmlFor="lunch-vegetarian"
      className="text-sm font-semibold text-[#034123] cursor-pointer"
    >
      Vegetarian
    </label>
  </div>
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
                  <div>
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Description (optional)</label>
                    <input
                      type="text"
                      value={newLunchItem.description}
                      onChange={(e) => setNewLunchItem({...newLunchItem, description: e.target.value})}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      placeholder="e.g., Traditional Sri Lankan curry"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {formData.mealOptions.lunch.map((item, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#034123]">{item.name}</p>
                          {item.isVegetarian && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-300">
                              Vegetarian
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#6b7280]">${item.price}</p>
                        {item.description && (
                          <p className="text-xs text-[#9ca3af] mt-1">{item.description}</p>
                        )}
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

            {/* Images */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Package Images</h3>
              
              {/* Featured Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#034123] mb-2">Featured Image</label>
                <div className="bg-[#f26b21]/5 backdrop-blur-sm rounded-xl p-4 border border-[#f26b21]/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="featured-image-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFeaturedImageFile(e.target.files[0])}
                      className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleFeaturedImageUpload}
                      disabled={uploadingFeaturedImage || !featuredImageFile}
                      className="px-6 py-2 bg-[#f26b21] hover:bg-[#e05a1a] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {uploadingFeaturedImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4" />
                          Upload Featured
                        </>
                      )}
                    </button>
                  </div>
                  {formData.featuredImage && (
                    <div className="mt-3 p-3 bg-white/90 rounded-lg border border-[#e5e7eb]/60">
                      <p className="text-xs text-[#6b7280] mb-2">Current Featured Image:</p>
                      <img 
                        src={formData.featuredImage} 
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({...prev, featuredImage: ''}))}
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove Featured Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Regular Images Upload */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#034123] mb-2">Additional Images</label>
                <div className="bg-[#034123]/5 backdrop-blur-sm rounded-xl p-4 border border-[#034123]/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="package-image-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage || !imageFile}
                      className="px-6 py-2 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Images List */}
              {formData.images.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex-1 flex items-center gap-3">
                        <img 
                          src={imageUrl} 
                          alt={`Package ${index + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <p className="font-semibold text-[#034123] text-sm truncate">{imageUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shared Pricing */}
            {formData.packageType === 'shared' && (
              <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
                <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Shared Package Pricing ($ per person)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div key={num}>
                      <label className="block text-sm font-semibold text-[#034123] mb-2">{num} {num === 1 ? 'Person' : 'People'}</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.shared[num] || 0}
                        onChange={(e) => setFormData({
                          ...formData,
                          shared: {...formData.shared, [num]: Number(e.target.value)}
                        })}
                        className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Dates */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Available Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.availableDates.startDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      availableDates: {...formData.availableDates, startDate: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.availableDates.endDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      availableDates: {...formData.availableDates, endDate: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
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
                    {isEditMode ? 'Update Package' : 'Create Package'}
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
