import { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import { adminFetch, apiEndpoints, authenticatedFetch, API_BASE_URL } from '../config/api';

const TaxiFormModal = ({ onClose, onSuccess, taxiId = null }) => {
  const isEditMode = Boolean(taxiId);
  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    vehicleType: 'Car',
    vehicleName: '',
    description: '',
    capacity: {
      passengers: 4,
      luggage: 2
    },
    pricing: {
      basePrice: 50,
      pricePerKm: 2.5,
      airportTransfer: 75,
      fullDayRate: 300,
      currency: 'USD'
    },
    features: [],
    images: [],
    driverInfo: {
      languagesSpoken: [],
      experience: ''
    },
    serviceAreas: [],
    isAvailable: true,
    isActive: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch taxi data when in edit mode
  useEffect(() => {
    if (isEditMode && taxiId) {
      fetchTaxi();
    }
  }, [taxiId, isEditMode]);

  const fetchTaxi = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(`${apiEndpoints.taxis.base}/${taxiId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          ...data.data,
          capacity: data.data.capacity || { passengers: 4, luggage: 2 },
          pricing: data.data.pricing || {
            basePrice: 50,
            pricePerKm: 2.5,
            airportTransfer: 75,
            fullDayRate: 300,
            currency: 'USD'
          },
          features: data.data.features || [],
          images: data.data.images || [],
          driverInfo: data.data.driverInfo || {
            languagesSpoken: [],
            experience: ''
          },
          serviceAreas: data.data.serviceAreas || [],
        });
      } else {
        alert('Failed to load taxi data');
        onClose();
      }
    } catch (error) {
      console.error('Error fetching taxi:', error);
      alert('Failed to load taxi');
      onClose();
    } finally {
      setLoading(false);
    }
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
      uploadFormData.append('category', 'taxi');
      uploadFormData.append('title', imageCaption || formData.vehicleName || 'Taxi Image');

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
          const newImage = {
            url: fullUrl,
            caption: imageCaption || '',
            isFeatured: formData.images.length === 0 // First image is featured by default
          };

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImage]
          }));

          // Reset upload form
          setImageFile(null);
          setImageCaption('');
          // Reset file input
          const fileInput = document.getElementById('image-upload-input');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEditMode
        ? `${apiEndpoints.taxis.base}/${taxiId}`
        : apiEndpoints.taxis.base;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await adminFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Taxi ${isEditMode ? 'updated' : 'created'} successfully!`);
        if (onSuccess) onSuccess();
      } else {
        alert(data.message || `Failed to ${isEditMode ? 'update' : 'save'} taxi`);
      }
    } catch (error) {
      console.error('Error saving taxi:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'save'} taxi`);
    } finally {
      setSaving(false);
    }
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

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        driverInfo: {
          ...prev.driverInfo,
          languagesSpoken: [...prev.driverInfo.languagesSpoken, newLanguage.trim()],
        },
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index) => {
    setFormData(prev => ({
      ...prev,
      driverInfo: {
        ...prev.driverInfo,
        languagesSpoken: prev.driverInfo.languagesSpoken.filter((_, i) => i !== index),
      },
    }));
  };

  const addServiceArea = () => {
    if (newServiceArea.trim()) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, newServiceArea.trim()],
      }));
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (index) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter((_, i) => i !== index),
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const setFeaturedImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isFeatured: i === index
      }))
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
            <p className="text-[#034123] font-semibold">Loading taxi data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-black/10 backdrop-blur-xl"
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
              {isEditMode ? 'Edit Taxi' : 'Create New Taxi'}
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              {isEditMode ? 'Update taxi details and information' : 'Add a new taxi to your fleet'}
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
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Vehicle Type *</label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    <option value="Car">Car</option>
                    <option value="Jeep">Jeep</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Van">Van</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Vehicle Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleName}
                    onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., Toyota Land Cruiser 2023"
                  />
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
                  placeholder="Describe the vehicle and its features..."
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Capacity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Passengers *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity.passengers}
                    onChange={(e) => setFormData({
                      ...formData,
                      capacity: {...formData.capacity, passengers: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Luggage *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.capacity.luggage}
                    onChange={(e) => setFormData({
                      ...formData,
                      capacity: {...formData.capacity, luggage: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Base Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.pricing.basePrice}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, basePrice: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Price Per Km *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.pricing.pricePerKm}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, pricePerKm: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    placeholder="2.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Airport Transfer *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.pricing.airportTransfer}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, airportTransfer: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    placeholder="75.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Full Day Rate *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.pricing.fullDayRate}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, fullDayRate: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    placeholder="300.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Currency *</label>
                  <select
                    required
                    value={formData.pricing.currency}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, currency: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="LKR">LKR</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Features</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                  placeholder="e.g., Air Conditioning, GPS Navigation"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
                >
                  <FiPlus className="w-5 h-5 inline mr-2" />
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

            {/* Images */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Images</h3>
              
              {/* Image Upload Section */}
              <div className="bg-[#034123]/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#034123]/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Upload Image *</label>
                    <input
                      id="image-upload-input"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Caption</label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      placeholder="Image caption"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={uploadingImage || !imageFile}
                  className="w-full bg-[#034123] hover:bg-[#026042] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

              {/* Image List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.images.map((image, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex-1 flex items-center gap-3">
                      <img 
                        src={image.url} 
                        alt={image.caption || `Image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-[#034123] text-sm truncate">{image.url}</p>
                        {image.caption && <p className="text-xs text-[#6b7280]">{image.caption}</p>}
                        {image.isFeatured && (
                          <span className="inline-block mt-1 px-2 py-1 bg-[#f26b21] text-white text-xs font-bold rounded">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!image.isFeatured && (
                        <button
                          type="button"
                          onClick={() => setFeaturedImage(index)}
                          className="px-3 py-1 text-xs bg-[#034123] hover:bg-[#026042] text-white rounded-lg transition-all duration-300"
                        >
                          Set Featured
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Info */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Driver Information</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#034123] mb-2">Experience</label>
                <textarea
                  rows="3"
                  value={formData.driverInfo.experience}
                  onChange={(e) => setFormData({
                    ...formData,
                    driverInfo: {...formData.driverInfo, experience: e.target.value}
                  })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
                  placeholder="e.g., 10+ years of professional driving experience"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#034123] mb-2">Languages Spoken</label>
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., English, Sinhala, Tamil"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-6 py-3 bg-[#f26b21] hover:bg-[#e05a1a] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
                  >
                    <FiPlus className="w-5 h-5 inline mr-2" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.driverInfo.languagesSpoken.map((language, index) => (
                    <div
                      key={index}
                      className="bg-[#f26b21]/10 text-[#f26b21] px-4 py-2 rounded-full flex items-center gap-2 border border-[#f26b21]/20"
                    >
                      <span className="font-medium">{language}</span>
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-[#f26b21] hover:text-[#e05a1a] font-bold hover:scale-110 transition-transform duration-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Service Areas</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                  className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                  placeholder="e.g., Colombo, Kandy, Airport Transfers"
                />
                <button
                  type="button"
                  onClick={addServiceArea}
                  className="px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
                >
                  <FiPlus className="w-5 h-5 inline mr-2" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="bg-[#034123]/10 text-[#034123] px-4 py-2 rounded-full flex items-center gap-2 border border-[#034123]/20"
                  >
                    <span className="font-medium">{area}</span>
                    <button
                      type="button"
                      onClick={() => removeServiceArea(index)}
                      className="text-[#034123] hover:text-[#026042] font-bold hover:scale-110 transition-transform duration-300"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                    className="mr-3 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                  />
                  <label htmlFor="isAvailable" className="font-semibold text-[#034123] cursor-pointer">Available</label>
                </div>
                <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-3 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                  />
                  <label htmlFor="isActive" className="font-semibold text-[#034123] cursor-pointer">Active</label>
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
                    {isEditMode ? 'Update Taxi' : 'Create Taxi'}
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

export default TaxiFormModal;

