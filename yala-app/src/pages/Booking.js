import { useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {enUS} from 'date-fns/locale';

const SafariBooking = () => {
  // Form state
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [activeTab, setActiveTab] = useState('creditCard');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    cardDetails: {
      nameOnCard: '',
      cardNumber: '',
      expiry: '',
      cvv: ''
    },
    addOns: {
      lunch: false,
      binoculars: false,
      guide: false
    },
    saveCard: false
  });
  const [bookingComplete, setBookingComplete] = useState(false);

  // Available time slots with prices
  const timeSlots = [
    { id: 'morning', label: 'Morning Safari (5:30 AM - 9:30 AM)', price: 50 },
    { id: 'afternoon', label: 'Afternoon Safari (2:30 PM - 6:30 PM)', price: 50 },
    { id: 'fullday', label: 'Full Day Experience', price: 90 }
  ];

  // Calculate totals
  const selectedSlot = timeSlots.find(slot => slot.id === timeSlot);
  const basePrice = selectedSlot ? selectedSlot.price * formData.participants : 0;
  const addOnsTotal = 
    (formData.addOns.lunch ? 8 * formData.participants : 0) + 
    (formData.addOns.binoculars ? 5 * formData.participants : 0) + 
    (formData.addOns.guide ? 15 : 0);
  const tax = (basePrice + addOnsTotal) * 0.1; // 10% tax
  const total = basePrice + addOnsTotal + tax;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('cardDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [field]: value
        }
      }));
    } else if (name.startsWith('addOns.')) {
      const addOn = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        addOns: {
          ...prev.addOns,
          [addOn]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process payment and booking here
    setBookingComplete(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Yala Safari Adventures</h1>
          <p className="mt-2 text-lg text-gray-600">Book your unforgettable wildlife experience</p>
        </div>

        {!bookingComplete ? (
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="md:flex">
              {/* Left Column - Booking Form */}
              <div className="md:w-2/3 p-8 border-r border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Select Date</h3>
                  <div className="border rounded-xl overflow-hidden">
                    <Calendar
                      date={date}
                      onChange={setDate}
                      minDate={new Date()}
                      maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days in future
                      color="#059669" 
                      locale={enUS}
                    />
                  </div>
                </div>

                {/* Time Slot Selection */}
                {date && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3">Available Time Slots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setTimeSlot(slot.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${timeSlot === slot.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                        >
                          <h4 className="font-medium">{slot.label}</h4>
                          <p className="text-green-600 font-semibold mt-1">${slot.price} per person</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Participant Count */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Number of Participants</h3>
                  <select
                    name="participants"
                    value={formData.participants}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>

                {/* Add-On Services */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Enhance Your Experience</h3>
                  <div className="space-y-3">
                    <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="addOns.lunch"
                        checked={formData.addOns.lunch}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Packed Lunch</span>
                          <span className="text-green-600">+$8 per person</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Delicious local cuisine packed for your safari</p>
                      </div>
                    </label>
                    <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="addOns.binoculars"
                        checked={formData.addOns.binoculars}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Binocular Rental</span>
                          <span className="text-green-600">+$5 per pair</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">High-quality binoculars for wildlife spotting</p>
                      </div>
                    </label>
                    <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-green-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="addOns.guide"
                        checked={formData.addOns.guide}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Expert Guide</span>
                          <span className="text-green-600">+$15</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Professional wildlife guide for your group</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Payment Summary */}
              <div className="md:w-1/3 p-8 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>
                
                {/* Payment Method Tabs */}
                <div className="mb-6">
                  <div className="flex border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('creditCard')}
                      className={`py-2 px-4 font-medium ${activeTab === 'creditCard' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('paypal')}
                      className={`py-2 px-4 font-medium ${activeTab === 'paypal' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      PayPal
                    </button>
                  </div>
                </div>

                {/* Credit Card Form */}
                {activeTab === 'creditCard' && (
                  <div className="mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                          type="text"
                          name="cardDetails.nameOnCard"
                          value={formData.cardDetails.nameOnCard}
                          onChange={handleChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          name="cardDetails.cardNumber"
                          value={formData.cardDetails.cardNumber}
                          onChange={handleChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            name="cardDetails.expiry"
                            value={formData.cardDetails.expiry}
                            onChange={handleChange}
                            placeholder="MM/YY"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            name="cardDetails.cvv"
                            value={formData.cardDetails.cvv}
                            onChange={handleChange}
                            placeholder="•••"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="saveCard"
                        checked={formData.saveCard}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Save card for future bookings</span>
                    </label>
                  </div>
                )}

                {/* PayPal Option */}
                {activeTab === 'paypal' && (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">You'll be redirected to PayPal to complete your payment after booking confirmation.</p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    {timeSlot && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>{timeSlots.find(s => s.id === timeSlot)?.label} × {formData.participants}</span>
                        <span className="font-medium">${basePrice.toFixed(2)}</span>
                      </div>
                    )}
                    {formData.addOns.lunch && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Packed Lunch × {formData.participants}</span>
                        <span>${(8 * formData.participants).toFixed(2)}</span>
                      </div>
                    )}
                    {formData.addOns.binoculars && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Binocular Rental × {formData.participants}</span>
                        <span>${(5 * formData.participants).toFixed(2)}</span>
                      </div>
                    )}
                    {formData.addOns.guide && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span>Expert Guide</span>
                        <span>$15.00</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 font-bold">
                      <span>Total</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <h3 className="font-medium text-yellow-800 text-sm">Cancellation Policy</h3>
                  <ul className="text-xs text-yellow-700 list-disc pl-5 mt-1 space-y-1">
                    <li>50% refund if cancelled 24+ hours before</li>
                    <li>No refund for last-minute cancellations</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!date || !timeSlot}
                  className={`w-full py-3 px-4 rounded-lg ${date && timeSlot ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'} text-white font-bold text-lg shadow-md transition-colors`}
                >
                  Pay ${total.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Booking Confirmation */
          <div className="bg-white shadow-xl rounded-lg overflow-hidden text-center max-w-2xl mx-auto">
            <div className="bg-green-600 p-6">
              <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <h2 className="text-2xl font-bold text-white mt-4">Booking Confirmed!</h2>
            </div>
            <div className="p-8">
              <p className="text-lg text-gray-600 mb-6">
                Thank you for booking with Yala Safari Adventures. A confirmation has been sent to <span className="font-medium">{formData.email}</span>.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Booking Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Booking Reference</p>
                    <p className="font-medium">YALA-{Math.floor(Math.random() * 10000)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time Slot</p>
                    <p className="font-medium">{timeSlots.find(s => s.id === timeSlot)?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Participants</p>
                    <p className="font-medium">{formData.participants}</p>
                  </div>
                  {Object.entries(formData.addOns).some(([_, val]) => val) && (
                    <div className="md:col-span-2">
                      <p className="text-gray-600">Add-Ons</p>
                      <p className="font-medium">
                        {Object.entries(formData.addOns)
                          .filter(([_, val]) => val)
                          .map(([key]) => {
                            switch(key) {
                              case 'lunch': return 'Packed Lunch';
                              case 'binoculars': return 'Binocular Rental';
                              case 'guide': return 'Expert Guide';
                              default: return key;
                            }
                          }).join(', ')}
                      </p>
                    </div>
                  )}
                  <div className="md:col-span-2 pt-4 border-t border-gray-200">
                    <p className="text-gray-600">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600">${total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md transition-colors"
              >
                Book Another Safari
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafariBooking;