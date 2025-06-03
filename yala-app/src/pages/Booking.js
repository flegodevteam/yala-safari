import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const YalaSafariBooking = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participants: 1,
    date: null,
    timeSlot: '',
    addOns: {
      lunch: false,
      binoculars: false,
      photographer: false
    },
    paymentMethod: 'creditCard',
    cardDetails: {
      number: '',
      expiry: '',
      cvv: ''
    }
  });

  // State for available time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Mock data for available dates (in a real app, this would come from an API)
  const availableDates = [
    new Date(2023, 10, 15),
    new Date(2023, 10, 16),
    new Date(2023, 10, 17),
    new Date(2023, 10, 18),
    new Date(2023, 10, 19),
    new Date(2023, 10, 20),
  ];

  // Mock time slots
  const timeSlots = [
    { id: 'morning', time: '05:30 AM - 09:30 AM', slots: 3 },
    { id: 'afternoon', time: '02:30 PM - 06:30 PM', slots: 2 },
    { id: 'fullday', time: '05:30 AM - 06:30 PM', slots: 1 }
  ];

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData({...formData, date: date});
    setAvailableTimeSlots(timeSlots.filter(slot => slot.slots > 0));
    
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setFormData({...formData, timeSlot: timeSlot});
    setBookingStep(3);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Booking submitted:', formData);
    setBookingConfirmed(true);
    setBookingStep(5);
  };

  // Custom date cell wrapper for calendar
  const DateCellWrapper = ({ children, value }) => {
    const isAvailable = availableDates.some(date => 
      moment(date).isSame(value, 'day')
    );
    
    return (
      <div 
        className={`h-full w-full p-1 ${isAvailable ? 'bg-green-50 hover:bg-green-100 cursor-pointer' : 'bg-gray-100 opacity-50'}`}
        onClick={isAvailable ? () => handleDateSelect(value) : null}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Yala National Park Safari Booking
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Reserve your unforgettable wildlife adventure
          </p>
        </div>

        {/* Booking Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center">
            <ol className="flex items-center space-x-8">
              {[1, 2, 3, 4, 5].map((step) => (
                <li key={step} className="flex items-center">
                  <span className={`flex items-center justify-center w-10 h-10 rounded-full ${bookingStep >= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} font-medium`}>
                    {step}
                  </span>
                  {step < 5 && (
                    <span className={`h-1 w-8 ${bookingStep > step ? 'bg-green-600' : 'bg-gray-200'}`}></span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Booking Form */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Step 1: Date Selection */}
          {bookingStep === 1 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Safari Date</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Calendar
                  localizer={localizer}
                  defaultView="month"
                  views={['month']}
                  min={new Date()}
                  max={moment().add(3, 'months').toDate()}
                  components={{
                    dateCellWrapper: DateCellWrapper
                  }}
                  className="h-96"
                />
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Available dates</span>
                </div>
                <button 
                  disabled={!selectedDate}
                  onClick={() => setBookingStep(2)}
                  className={`px-6 py-2 rounded-md ${selectedDate ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} font-medium`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Step 2: Time Slot Selection */}
          {bookingStep === 2 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Available Time Slots for {selectedDate && moment(selectedDate).format('MMMM D, YYYY')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {availableTimeSlots.map((slot) => (
                  <div 
                    key={slot.id}
                    onClick={() => handleTimeSlotSelect(slot.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${formData.timeSlot === slot.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
                  >
                    <h3 className="font-semibold text-lg capitalize">{slot.id.replace('-', ' ')}</h3>
                    <p className="text-gray-600">{slot.time}</p>
                    <p className="text-sm text-green-700 mt-2">{slot.slots} slots remaining</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setBookingStep(1)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
                >
                  Back
                </button>
                <button 
                  disabled={!formData.timeSlot}
                  onClick={() => setBookingStep(3)}
                  className={`px-6 py-2 rounded-md ${formData.timeSlot ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} font-medium`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Personal Details */}
          {bookingStep === 3 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Information</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Participants
                    </label>
                    <select
                      id="participants"
                      name="participants"
                      value={formData.participants}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Add-On Services</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="lunch"
                        name="addOns.lunch"
                        checked={formData.addOns.lunch}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="lunch" className="ml-2 block text-sm text-gray-700">
                        Packed Lunch ($8 per person)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="binoculars"
                        name="addOns.binoculars"
                        checked={formData.addOns.binoculars}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="binoculars" className="ml-2 block text-sm text-gray-700">
                        Binocular Rental ($5 per pair)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="photographer"
                        name="addOns.photographer"
                        checked={formData.addOns.photographer}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="photographer" className="ml-2 block text-sm text-gray-700">
                        Professional Photographer ($50)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button 
                    type="button"
                    onClick={() => setBookingStep(2)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBookingStep(4)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Payment Information */}
          {bookingStep === 4 && (
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Booking Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{selectedDate && moment(selectedDate).format('MMMM D, YYYY')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time Slot</p>
                      <p className="font-medium capitalize">{formData.timeSlot.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="font-medium">{formData.participants}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Add-Ons</p>
                      <p className="font-medium">
                        {Object.entries(formData.addOns)
                          .filter(([_, value]) => value)
                          .map(([key]) => key)
                          .join(', ') || 'None'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                        checked={formData.paymentMethod === 'creditCard'}
                        onChange={handleInputChange}
                        className="hidden peer"
                      />
                      <label 
                        htmlFor="creditCard"
                        className="block p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50"
                      >
                        <div className="flex items-center">
                          <svg className="w-6 h-6 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                          </svg>
                          <span>Credit Card</span>
                        </div>
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="hidden peer"
                      />
                      <label 
                        htmlFor="paypal"
                        className="block p-4 border border-gray-300 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50"
                      >
                        <div className="flex items-center">
                          <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.5 11.5h1.5v-4h-1.5v4zm3.5 0h1.5v-4h-1.5v4zm3.5 0h1.5v-4h-1.5v4zm-10.5-6c-1.104 0-2 .896-2 2v8c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-8c0-1.104-.896-2-2-2h-12zm12 1c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1h-12c-.552 0-1-.448-1-1v-8c0-.552.448-1 1-1h12z"/>
                          </svg>
                          <span>PayPal</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.paymentMethod === 'creditCard' && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardDetails.number"
                          value={formData.cardDetails.number}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardDetails.expiry"
                            value={formData.cardDetails.expiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cardCvv"
                            name="cardDetails.cvv"
                            value={formData.cardDetails.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Cancellation Policy</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Cancellation before 24 hours of the tour: 50% refund</li>
                          <li>Last minute cancellations: No refund</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button 
                    type="button"
                    onClick={() => setBookingStep(3)}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 5: Booking Confirmation */}
          {bookingStep === 5 && bookingConfirmed && (
            <div className="p-6 sm:p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
              <p className="mt-2 text-gray-600">
                Thank you for booking your Yala Safari adventure. A confirmation has been sent to {formData.email}.
              </p>
              <div className="mt-8 bg-gray-50 p-6 rounded-lg text-left max-w-md mx-auto">
                <h3 className="font-medium text-lg text-gray-800 mb-3">Booking Details</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Reference:</span> YALA-{Math.floor(Math.random() * 10000)}</p>
                  <p><span className="text-gray-600">Date:</span> {selectedDate && moment(selectedDate).format('MMMM D, YYYY')}</p>
                  <p><span className="text-gray-600">Time:</span> {formData.timeSlot === 'morning' ? '05:30 AM - 09:30 AM' : 
                    formData.timeSlot === 'afternoon' ? '02:30 PM - 06:30 PM' : '05:30 AM - 06:30 PM'}</p>
                  <p><span className="text-gray-600">Participants:</span> {formData.participants}</p>
                  {Object.entries(formData.addOns).some(([_, value]) => value) && (
                    <p><span className="text-gray-600">Add-Ons:</span> {Object.entries(formData.addOns)
                      .filter(([_, value]) => value)
                      .map(([key]) => {
                        switch(key) {
                          case 'lunch': return 'Packed Lunch';
                          case 'binoculars': return 'Binocular Rental';
                          case 'photographer': return 'Professional Photographer';
                          default: return key;
                        }
                      }).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => {
                    setBookingStep(1);
                    setBookingConfirmed(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      participants: 1,
                      date: null,
                      timeSlot: '',
                      addOns: {
                        lunch: false,
                        binoculars: false,
                        photographer: false
                      },
                      paymentMethod: 'creditCard',
                      cardDetails: {
                        number: '',
                        expiry: '',
                        cvv: ''
                      }
                    });
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                >
                  Make Another Booking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YalaSafariBooking;