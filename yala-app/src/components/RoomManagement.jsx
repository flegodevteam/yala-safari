import React, { useState, useEffect } from 'react';
import { apiEndpoints, authenticatedFetch } from '../../config/api-updated';
import './RoomManagement.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    roomType: 'Double',
    capacity: { adults: 2, children: 0 },
    pricing: { perNight: 0, currency: 'USD' },
    amenities: [],
    location: { address: '', city: '', nearbyAttractions: [] },
    availability: { isAvailable: true, totalRooms: 1 },
    policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellationPolicy: '' }
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await authenticatedFetch(apiEndpoints.rooms.base);
      const data = await response.json();
      setRooms(data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    // Add room data
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object') {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    
    // Add images
    images.forEach((image, index) => {
      formDataToSend.append('images', image);
      formDataToSend.append('captions', `Image ${index + 1}`);
    });

    try {
      const url = editingRoom 
        ? apiEndpoints.rooms.byId(editingRoom._id)
        : apiEndpoints.rooms.base;
      
      const method = editingRoom ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(url, {
        method,
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingRoom ? 'Room updated successfully!' : 'Room created successfully!');
        setShowForm(false);
        setEditingRoom(null);
        resetForm();
        fetchRooms();
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      description: room.description,
      roomType: room.roomType,
      capacity: room.capacity,
      pricing: room.pricing,
      amenities: room.amenities || [],
      location: room.location || { address: '', city: '', nearbyAttractions: [] },
      availability: room.availability,
      policies: room.policies
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      const response = await authenticatedFetch(apiEndpoints.rooms.byId(id), {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Room deleted successfully!');
        fetchRooms();
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const response = await authenticatedFetch(apiEndpoints.rooms.toggle(id), {
        method: 'PATCH'
      });

      const data = await response.json();
      
      if (data.success) {
        fetchRooms();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      roomType: 'Double',
      capacity: { adults: 2, children: 0 },
      pricing: { perNight: 0, currency: 'USD' },
      amenities: [],
      location: { address: '', city: '', nearbyAttractions: [] },
      availability: { isAvailable: true, totalRooms: 1 },
      policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellationPolicy: '' }
    });
    setImages([]);
    setPreviewImages([]);
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="room-management">
      <div className="header">
        <h1>Room Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingRoom(null);
            resetForm();
          }}
        >
          {showForm ? 'Cancel' : '+ Add New Room'}
        </button>
      </div>

      {showForm && (
        <div className="room-form-container">
          <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
          <form onSubmit={handleSubmit} className="room-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Room Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Type *</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Family">Family</option>
                  <option value="Deluxe">Deluxe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price per Night (USD) *</label>
                <input
                  type="number"
                  name="pricing.perNight"
                  value={formData.pricing.perNight}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Total Rooms Available *</label>
                <input
                  type="number"
                  name="availability.totalRooms"
                  value={formData.availability.totalRooms}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Adults Capacity *</label>
                <input
                  type="number"
                  name="capacity.adults"
                  value={formData.capacity.adults}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Children Capacity</label>
                <input
                  type="number"
                  name="capacity.children"
                  value={formData.capacity.children}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Check-In Time</label>
                <input
                  type="text"
                  name="policies.checkIn"
                  value={formData.policies.checkIn}
                  onChange={handleInputChange}
                  placeholder="e.g., 2:00 PM"
                />
              </div>

              <div className="form-group">
                <label>Check-Out Time</label>
                <input
                  type="text"
                  name="policies.checkOut"
                  value={formData.policies.checkOut}
                  onChange={handleInputChange}
                  placeholder="e.g., 11:00 AM"
                />
              </div>

              <div className="form-group full-width">
                <label>Cancellation Policy</label>
                <textarea
                  name="policies.cancellationPolicy"
                  value={formData.policies.cancellationPolicy}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group full-width">
                <label>Room Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {previewImages.length > 0 && (
                  <div className="image-previews">
                    {previewImages.map((preview, index) => (
                      <img key={index} src={preview} alt={`Preview ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingRoom ? 'Update Room' : 'Create Room'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingRoom(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rooms-list">
        <h2>All Rooms ({rooms.length})</h2>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room._id} className="room-card">
              {room.images && room.images[0] && (
                <img src={room.images[0].url} alt={room.name} className="room-image" />
              )}
              <div className="room-details">
                <h3>{room.name}</h3>
                <p className="room-type">{room.roomType}</p>
                <p className="room-price">${room.pricing.perNight} / night</p>
                <p className="room-capacity">
                  👥 {room.capacity.adults} adults, {room.capacity.children} children
                </p>
                <p className="room-availability">
                  {room.availability.totalRooms} room(s) available
                </p>
                <div className={`room-status ${room.isActive ? 'active' : 'inactive'}`}>
                  {room.isActive ? '✅ Active' : '❌ Inactive'}
                </div>
              </div>
              <div className="room-actions">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(room)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-sm btn-warning"
                  onClick={() => toggleAvailability(room._id)}
                >
                  Toggle
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(room._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;