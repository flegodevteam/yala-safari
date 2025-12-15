import { useState, useEffect } from 'react';
import { FiX, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import { adminFetch, apiEndpoints } from '../config/api';

const RoomFormModal = ({ onClose, onSuccess, roomId = null }) => {
  const isEditMode = Boolean(roomId);
  const [loading, setLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    roomType: 'Standard',
    capacity: {
      adults: 2,
      children: 0
    },
    pricing: {
      perNight: 100,
      currency: 'USD'
    },
    amenities: [],
    images: [],
    location: {
      address: '',
      city: 'Yala',
      nearbyAttractions: []
    },
    availability: {
      isAvailable: true,
      totalRooms: 1
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in'
    },
    isActive: true,
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newAttraction, setNewAttraction] = useState('');
  const [newImage, setNewImage] = useState({
    url: '',
    caption: '',
    isFeatured: false
  });
  const [saving, setSaving] = useState(false);

  // Fetch room data when in edit mode
  useEffect(() => {
    if (isEditMode && roomId) {
      fetchRoom();
    }
  }, [roomId, isEditMode]);

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const response = await adminFetch(`${apiEndpoints.rooms.base}/${roomId}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData({
          ...data.data,
          amenities: data.data.amenities || [],
          images: data.data.images || [],
          location: data.data.location || {
            address: '',
            city: 'Yala',
            nearbyAttractions: []
          },
          availability: data.data.availability || {
            isAvailable: true,
            totalRooms: 1
          },
          policies: data.data.policies || {
            checkIn: '2:00 PM',
            checkOut: '11:00 AM',
            cancellationPolicy: 'Free cancellation up to 48 hours before check-in'
          }
        });
      } else {
        alert('Failed to load room data');
        onClose();
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      alert('Failed to load room');
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
        ? `${apiEndpoints.rooms.base}/${roomId}`
        : apiEndpoints.rooms.base;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await adminFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Room ${isEditMode ? 'updated' : 'created'} successfully!`);
        if (onSuccess) onSuccess();
      } else {
        alert(data.message || `Failed to ${isEditMode ? 'update' : 'save'} room`);
      }
    } catch (error) {
      console.error('Error saving room:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'save'} room`);
    } finally {
      setSaving(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const addAttraction = () => {
    if (newAttraction.trim()) {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          nearbyAttractions: [...prev.location.nearbyAttractions, newAttraction.trim()]
        }
      }));
      setNewAttraction('');
    }
  };

  const removeAttraction = (index) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        nearbyAttractions: prev.location.nearbyAttractions.filter((_, i) => i !== index)
      }
    }));
  };

  const addImage = () => {
    if (newImage.url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { ...newImage, url: newImage.url.trim() }]
      }));
      setNewImage({ url: '', caption: '', isFeatured: false });
    }
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
            <p className="text-[#034123] font-semibold">Loading room data...</p>
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
              {isEditMode ? 'Edit Room' : 'Create New Room'}
            </h2>
            <p className="text-sm text-[#6b7280] mt-1">
              {isEditMode ? 'Update room details and information' : 'Add a new accommodation room'}
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
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Room Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., Deluxe Ocean View Suite"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Room Type *</label>
                  <select
                    required
                    value={formData.roomType}
                    onChange={(e) => setFormData({...formData, roomType: e.target.value})}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Villa">Villa</option>
                    <option value="Family">Family</option>
                  </select>
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
                  placeholder="Describe the room and its features..."
                />
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Capacity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Adults *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity.adults}
                    onChange={(e) => setFormData({
                      ...formData,
                      capacity: {...formData.capacity, adults: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.capacity.children}
                    onChange={(e) => setFormData({
                      ...formData,
                      capacity: {...formData.capacity, children: Number(e.target.value)}
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
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Price Per Night ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.pricing.perNight}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {...formData.pricing, perNight: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                    placeholder="150.00"
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

            {/* Amenities */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Amenities</h3>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                  placeholder="e.g., Air Conditioning, Wi-Fi, TV"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-6 py-3 bg-[#034123] hover:bg-[#026042] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
                >
                  <FiPlus className="w-5 h-5 inline mr-2" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-[#034123]/10 text-[#034123] px-4 py-2 rounded-full flex items-center gap-2 border border-[#034123]/20"
                  >
                    <span className="font-medium">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
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
              <div className="bg-[#034123]/5 backdrop-blur-sm rounded-xl p-4 mb-4 border border-[#034123]/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Image URL *</label>
                    <input
                      type="text"
                      value={newImage.url}
                      onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      placeholder="/uploads/rooms/room-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#034123] mb-2">Caption</label>
                    <input
                      type="text"
                      value={newImage.caption}
                      onChange={(e) => setNewImage({...newImage, caption: e.target.value})}
                      className="w-full px-3 py-2 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                      placeholder="Image caption"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newImage.isFeatured}
                      onChange={(e) => setNewImage({...newImage, isFeatured: e.target.checked})}
                      className="mr-2 h-4 w-4 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#034123]">Featured Image</span>
                  </label>
                  <button
                    type="button"
                    onClick={addImage}
                    className="ml-auto bg-[#034123] hover:bg-[#026042] text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md"
                  >
                    <FiPlus className="w-4 h-4 inline mr-2" />
                    Add Image
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {formData.images.map((image, index) => (
                  <div key={index} className="bg-white/90 backdrop-blur-sm border border-[#e5e7eb]/60 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-[#034123]">{image.url}</p>
                      {image.caption && <p className="text-sm text-[#6b7280]">{image.caption}</p>}
                      {image.isFeatured && (
                        <span className="inline-block mt-1 px-2 py-1 bg-[#f26b21] text-white text-xs font-bold rounded">Featured</span>
                      )}
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

            {/* Location */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.location.address}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {...formData.location, address: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="123 Beach Road, Yala"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.location.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      location: {...formData.location, city: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="Yala"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#034123] mb-2">Nearby Attractions</label>
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  <input
                    type="text"
                    value={newAttraction}
                    onChange={(e) => setNewAttraction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttraction())}
                    className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="e.g., Yala National Park (5 km)"
                  />
                  <button
                    type="button"
                    onClick={addAttraction}
                    className="px-6 py-3 bg-[#f26b21] hover:bg-[#e05a1a] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold shadow-md whitespace-nowrap"
                  >
                    <FiPlus className="w-5 h-5 inline mr-2" />
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.location.nearbyAttractions.map((attraction, index) => (
                    <div
                      key={index}
                      className="bg-[#f26b21]/10 text-[#f26b21] px-4 py-2 rounded-full flex items-center gap-2 border border-[#f26b21]/20"
                    >
                      <span className="font-medium">{attraction}</span>
                      <button
                        type="button"
                        onClick={() => removeAttraction(index)}
                        className="text-[#f26b21] hover:text-[#e05a1a] font-bold hover:scale-110 transition-transform duration-300"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Availability</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={formData.availability.isAvailable}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {...formData.availability, isAvailable: e.target.checked}
                    })}
                    className="mr-3 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                  />
                  <label htmlFor="isAvailable" className="font-semibold text-[#034123] cursor-pointer">Available</label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Total Rooms *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.availability.totalRooms}
                    onChange={(e) => setFormData({
                      ...formData,
                      availability: {...formData.availability, totalRooms: Number(e.target.value)}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <h3 className="text-xl lg:text-2xl font-bold text-[#034123] mb-4 pb-3 border-b border-[#034123]/20">Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Check-In Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.policies.checkIn}
                    onChange={(e) => setFormData({
                      ...formData,
                      policies: {...formData.policies, checkIn: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="2:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#034123] mb-2">Check-Out Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.policies.checkOut}
                    onChange={(e) => setFormData({
                      ...formData,
                      policies: {...formData.policies, checkOut: e.target.value}
                    })}
                    className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm"
                    placeholder="11:00 AM"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#034123] mb-2">Cancellation Policy *</label>
                <textarea
                  required
                  rows="3"
                  value={formData.policies.cancellationPolicy}
                  onChange={(e) => setFormData({
                    ...formData,
                    policies: {...formData.policies, cancellationPolicy: e.target.value}
                  })}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-[#d1d5db]/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#034123]/50 focus:border-[#034123] transition-all duration-300 text-[#1f2937] placeholder-[#9ca3af] shadow-sm resize-none"
                  placeholder="Free cancellation up to 48 hours before check-in"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="bg-[#f9fafb]/50 backdrop-blur-sm rounded-2xl shadow-lg border border-[#e5e7eb]/60 p-4 lg:p-6">
              <div className="flex items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e5e7eb]/60">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="mr-3 h-5 w-5 text-[#034123] focus:ring-[#034123] border-[#d1d5db]/60 rounded cursor-pointer bg-white/90 backdrop-blur-sm"
                />
                <label htmlFor="isActive" className="font-semibold text-[#034123] cursor-pointer">Active Room</label>
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
                    {isEditMode ? 'Update Room' : 'Create Room'}
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

export default RoomFormModal;
