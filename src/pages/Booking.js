import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    package: searchParams.get('package') || '',
    park: searchParams.get('park') || '',
    jeepType: 'basic',
    date: null,
    time: '',
    duration: 'half-day',
    guests: 1,
    meals: 'none',
    specialRequests: '',
    paymentMethod: 'credit-card',
    name: '',
    email: '',
    phone: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateBookingData = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePrice = () => {
    // Base prices
    const basePrices = {
      'basic': 50,
      'luxury': 80,
      'super-luxury': 120,
    };

    // Duration multipliers
    const durationMultiplier = bookingData.duration === 'full-day' ? 1.8 : 1;

    // Meal costs
    const mealCost = bookingData.meals === 'none' ? 0 : 15;

    // Calculate total
    const basePrice = basePrices[bookingData.jeepType] * durationMultiplier;
    const total = (basePrice + mealCost) * bookingData.guests;

    return total;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <PackageSelection 
            bookingData={bookingData} 
            updateBookingData={updateBookingData} 
            nextStep={nextStep} 
          />
        );
      case 2:
        return (
          <DateTimeSelection 
            bookingData={bookingData} 
            updateBookingData={updateBookingData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 3:
        return (
          <GuestDetails 
            bookingData={bookingData} 
            updateBookingData={updateBookingData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 4:
        return (
          <Payment 
            bookingData={bookingData} 
            updateBookingData={updateBookingData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
            calculatePrice={calculatePrice}
          />
        );
      case 5:
        return (
          <Confirmation 
            bookingData={bookingData} 
            prevStep={prevStep} 
            calculatePrice={calculatePrice}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Safari Adventure</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`flex flex-col items-center ${i <= step ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                {i}
              </div>
              <span className="text-xs mt-1">
                {i === 1 && 'Package'}
                {i === 2 && 'Date/Time'}
                {i === 3 && 'Guests'}
                {i === 4 && 'Payment'}
                {i === 5 && 'Confirm'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
}

// Sub-components for each step of the booking process
function PackageSelection({ bookingData, updateBookingData, nextStep }) {
  const packages = [
    {
      id: 'yala-morning',
      name: 'Yala Morning Safari',
      description: 'Experience the wildlife at its most active during the early hours',
      duration: '3-4 hours',
      parks: ['Yala'],
    },
    {
      id: 'yala-full-day',
      name: 'Yala Full Day Safari',
      description: 'Full day exploration with lunch included',
      duration: '8-10 hours',
      parks: ['Yala'],
    },
    {
      id: 'bundala-bird',
      name: 'Bundala Bird Watching',
      description: 'Specialized tour for bird enthusiasts',
      duration: '4-5 hours',
      parks: ['Bundala'],
    },
    {
      id: 'udawalawa-elephant',
      name: 'Udawalawa Elephant Safari',
      description: 'Focus on elephant herds in their natural habitat',
      duration: '4 hours',
      parks: ['Udawalawa'],
    },
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Select Your Safari Package</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-green-500 ${bookingData.package === pkg.id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
            onClick={() => {
              updateBookingData('package', pkg.id);
              updateBookingData('park', pkg.parks[0]);
            }}
          >
            <h4 className="font-medium text-lg">{pkg.name}</h4>
            <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">{pkg.duration}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                {pkg.parks.join(', ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Select Jeep Type</h4>
        <div className="flex flex-wrap gap-3">
          {['basic', 'luxury', 'super-luxury'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full text-sm capitalize ${bookingData.jeepType === type ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => updateBookingData('jeepType', type)}
            >
              {type.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!bookingData.package}
          className={`px-6 py-2 rounded-md ${bookingData.package ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
        >
          Next: Select Date & Time
        </button>
      </div>
    </div>
  );
}

function DateTimeSelection({ bookingData, updateBookingData, nextStep, prevStep }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const availableTimes = ['05:30 AM', '06:00 AM', '02:00 PM', '02:30 PM'];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateBookingData('date', date);
  };

  const handleDurationChange = (duration) => {
    updateBookingData('duration', duration);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Select Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Available Time Slots</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                onClick={() => updateBookingData('time', time)}
                className={`p-2 border rounded-md text-sm ${bookingData.time === time ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
        <div className="flex gap-4">
          <button
            onClick={() => handleDurationChange('half-day')}
            className={`px-4 py-2 rounded-md ${bookingData.duration === 'half-day' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Half Day (3-4 hours)
          </button>
          <button
            onClick={() => handleDurationChange('full-day')}
            className={`px-4 py-2 rounded-md ${bookingData.duration === 'full-day' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Full Day (8-10 hours)
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!bookingData.date || !bookingData.time}
          className={`px-6 py-2 rounded-md ${bookingData.date && bookingData.time ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
        >
          Next: Guest Details
        </button>
      </div>
    </div>
  );
}

function GuestDetails({ bookingData, updateBookingData, nextStep, prevStep }) {
  const [localGuests, setLocalGuests] = useState(bookingData.guests);

  const handleGuestChange = (value) => {
    const newValue = Math.max(1, Math.min(10, value));
    setLocalGuests(newValue);
    updateBookingData('guests', newValue);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Guest Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
          <div className="flex items-center">
            <button 
              onClick={() => handleGuestChange(localGuests - 1)}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              -
            </button>
            <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
              {localGuests}
            </div>
            <button 
              onClick={() => handleGuestChange(localGuests + 1)}
              className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meal Options</label>
          <select
            value={bookingData.meals}
            onChange={(e) => updateBookingData('meals', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="none">No meals</option>
            <option value="vegetarian">Vegetarian Breakfast</option>
            <option value="non-vegetarian">Non-Vegetarian Breakfast</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
        <textarea
          value={bookingData.specialRequests}
          onChange={(e) => updateBookingData('specialRequests', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          rows={3}
          placeholder="Any special requirements or requests..."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-6 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          Next: Payment
        </button>
      </div>
    </div>
  );
}

function Payment({ bookingData, updateBookingData, nextStep, prevStep, calculatePrice }) {
  const totalPrice = calculatePrice();

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-6">Payment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Select Payment Method</h4>
          <div className="space-y-3">
            {[
              { id: 'credit-card', label: 'Credit/Debit Card', icon: '💳' },
              { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦' },
              { id: 'cash', label: 'Cash on Arrival', icon: '💵' },
            ].map((method) => (
              <div 
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer ${bookingData.paymentMethod === method.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                onClick={() => updateBookingData('paymentMethod', method.id)}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-3">{method.icon}</span>
                  <span>{method.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-3">Personal Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={bookingData.name}
                onChange={(e) => updateBookingData('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => updateBookingData('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => updateBookingData('phone', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Booking Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium">{bookingData.package.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Park:</span>
            <span className="font-medium">{bookingData.park}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Jeep Type:</span>
            <span className="font-medium capitalize">{bookingData.jeepType.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{bookingData.duration === 'half-day' ? 'Half Day' : 'Full Day'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{bookingData.guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Meals:</span>
            <span className="font-medium">
              {bookingData.meals === 'none' ? 'None' : 
               bookingData.meals === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!bookingData.name || !bookingData.email || !bookingData.phone}
          className={`px-6 py-2 rounded-md ${bookingData.name && bookingData.email && bookingData.phone ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors`}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

function Confirmation({ bookingData, prevStep, calculatePrice }) {
  const totalPrice = calculatePrice();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`YL${Math.floor(100000 + Math.random() * 900000)}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg
          className="h-6 w-6 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="mt-3 text-2xl font-medium text-gray-900">Booking Confirmed!</h3>
      <div className="mt-6 bg-gray-50 p-6 rounded-lg">
        <div className="text-lg font-medium text-gray-900 mb-4">
          Your Booking Reference: 
          <span className="ml-2 font-mono bg-gray-200 px-2 py-1 rounded">
            YL{Math.floor(100000 + Math.random() * 900000)}
          </span>
          <button
            onClick={copyToClipboard}
            className="ml-2 text-sm text-green-600 hover:text-green-800"
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-gray-600">
          We've sent a confirmation email to <span className="font-medium">{bookingData.email}</span> with all the details.
        </p>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h4>
        <ul className="space-y-3 text-left text-gray-600">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Our team will contact you within 24 hours to confirm pickup details
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Please bring your ID and this reference number on the day of your safari
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            For any questions, contact us at +94 76 123 4567
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 mr-4"
        >
          Print Confirmation
        </button>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}