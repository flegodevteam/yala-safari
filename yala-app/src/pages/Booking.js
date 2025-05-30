import { useState } from 'react';
import { FiCalendar, FiUser, FiMapPin, FiClock, FiDollarSign, FiCreditCard, FiMail, FiPhone } from 'react-icons/fi';

const Booking = () => {
  // Form state
  const [reservationType, setReservationType] = useState('private');
  const [location, setLocation] = useState('yala');
  const [block, setBlock] = useState('blockI');
  const [experience, setExperience] = useState('basic');
  const [duration, setDuration] = useState('morning');
  const [mealOption, setMealOption] = useState('without');
  const [visitorType, setVisitorType] = useState('local');
  const [paymentMethod, setPaymentMethod] = useState('bankTransfer');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [step, setStep] = useState(1);
  const [nicNo, setNicNo] = useState('');

  // Pricing structure
  const pricing = {
    private: {
      ticket: {
        local: 2000, // 2$ in local currency
        foreign: 2   // 2$ in dollars
      },
      jeep: 10000 // 10$ equivalent
    },
    shared: {
      1: { local: 10000, foreign: 10 },   // 10$
      2: { local: 8000, foreign: 8 },     // 8$
      4: { local: 5000, foreign: 5 },     // 5$
      5: { local: 5000, foreign: 5 },     // 5$ fixed
      6: { local: 5000, foreign: 5 },     // 5$ fixed
      7: { local: 5000, foreign: 5 }      // 5$ fixed
    }
  };

  // Experience multipliers
  const experienceMultipliers = {
    basic: 1,
    cLuxury: 1.5,
    superLuxury: 2
  };

  // Duration multipliers
  const durationMultipliers = {
    morning: 1,
    extendedMorning: 1.5,
    fullDay: 2.5
  };

  // Meal options pricing
  const mealPrices = {
    without: 0,
    breakfast: { local: 500, foreign: 5 },
    vegetarian: { local: 800, foreign: 8 },
    nonVegetarian: { local: 1000, foreign: 10 }
  };

  // Calculate total price
  const calculatePrice = () => {
    let basePrice;
    
    if (reservationType === 'private') {
      // Private safari calculation
      const ticketPrice = pricing.private.ticket[visitorType];
      const jeepPerPerson = pricing.private.jeep / Math.min(numberOfPersons, 4); // Max division by 4
      basePrice = (ticketPrice + jeepPerPerson) * numberOfPersons;
    } else {
      // Shared safari calculation
      // Find the closest available key in pricing.shared
const sharedKeys = Object.keys(pricing.shared).map(Number).sort((a, b) => a - b);
let closestSize = sharedKeys[0];
for (let i = 0; i < sharedKeys.length; i++) {
  if (numberOfPersons <= sharedKeys[i]) {
    closestSize = sharedKeys[i];
    break;
  }
}
basePrice = pricing.shared[closestSize][visitorType] * numberOfPersons;
    }

    // Apply experience multiplier
    const experiencePrice = basePrice * experienceMultipliers[experience];
    
    // Apply duration multiplier
    const durationPrice = experiencePrice * durationMultipliers[duration];
    
    // Add meal cost
    const mealPrice = mealOption === 'without' ? 0 : 
                     mealPrices[mealOption][visitorType] * numberOfPersons;
    
    return durationPrice + mealPrice;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit booking
      console.log({
        reservationType,
        location,
        block,
        experience,
        duration,
        mealOption,
        visitorType,
        paymentMethod,
        numberOfPersons,
        pickupLocation,
        whatsappNumber,
        contactNumber,
        specialRequirements,
        customerName,
        email,
        selectedDate,
        totalPrice: calculatePrice()
      });
      alert('Booking confirmed! Check your email for details.');
    }
  };

  const formatPrice = (price) => {
    return visitorType === 'local' ? 
      `LKR ${price.toLocaleString()}` : 
      `$${price.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Wildlife Safari Adventures</h1>
          <p className="text-green-600 mt-2">Book your unforgettable safari experience</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {stepNumber}
              </div>
              <span className="text-sm mt-2 text-gray-600">
                {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Guest Info' : 'Payment'}
              </span>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Step 1: Safari Details */}
          {step === 1 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiMapPin className="mr-2 text-green-600" />
                Safari Details
              </h2>

              {/* Reservation Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Reservation Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setReservationType('private')}
                    className={`py-3 px-4 rounded-lg border ${reservationType === 'private' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                  >
                    <div className="font-medium">Private Safari</div>
                    <div className="text-sm mt-1">Exclusive jeep for your group</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReservationType('shared')}
                    className={`py-3 px-4 rounded-lg border ${reservationType === 'shared' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                  >
                    <div className="font-medium">Shared Safari</div>
                    <div className="text-sm mt-1">Join other travelers</div>
                  </button>
                </div>
              </div>

              {/* Location & Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="yala">Yala National Park</option>
                    <option value="bandula">Bandula/Unduwatana</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Block</label>
                  <select
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="blockI">Block I</option>
                    <option value="blockIV">Block IV</option>
                  </select>
                </div>
              </div>

              {/* Experience & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Experience Tier</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="cLuxury">C. Luxury</option>
                    <option value="superLuxury">Super Luxury</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="morning">Morning (3h 45m)</option>
                    <option value="extendedMorning">Extended Morning (5h)</option>
                    <option value="fullDay">Full Day (10h)</option>
                  </select>
                </div>
              </div>

              {/* Meal Option */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Meal Option</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['without', 'breakfast', 'vegetarian', 'nonVegetarian'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setMealOption(option)}
                      className={`py-2 px-3 rounded-md border ${mealOption === option ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                    >
                      {option === 'without' ? 'Without Meals' : 
                       option === 'breakfast' ? 'With Breakfast' : 
                       option === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Persons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Number of Persons</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={reservationType === 'private' ? 10 : 7}
                      value={numberOfPersons}
                      onChange={(e) => setNumberOfPersons(parseInt(e.target.value) )|| 1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiUser className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Price Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">Estimated Price</h3>
                    <p className="text-sm text-gray-500">{numberOfPersons} person(s)</p>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatPrice(calculatePrice())}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Guest Information */}
          {step === 2 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiUser className="mr-2 text-green-600" />
                Guest Information
              </h2>

              {/* Visitor Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Visitor Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVisitorType('local')}
                    className={`py-3 px-4 rounded-lg border ${visitorType === 'local' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                  >
                    Local Visitor
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitorType('foreign')}
                    className={`py-3 px-4 rounded-lg border ${visitorType === 'foreign' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                  >
                    Foreign Visitor
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiMail className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              {visitorType === 'local' && (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">NIC No</label>
        <input
          type="text"
          value={nicNo}
          onChange={(e) => setNicNo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your National ID Card number"
          required
        />
      </div>
    )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <FiPhone className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>
                {visitorType === 'foreign' && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        required
                      />
                      <FiPhone className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Hotel address or GPS coordinates"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
                <textarea
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Any special needs or requests..."
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiCreditCard className="mr-2 text-green-600" />
                Payment Details
              </h2>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Safari Type:</span>
                    <span className="font-medium">{reservationType === 'private' ? 'Private' : 'Shared'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{location === 'yala' ? 'Yala' : 'Bandula'}, Block {block === 'blockI' ? 'I' : 'IV'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {duration === 'morning' ? 'Morning' : 
                       duration === 'extendedMorning' ? 'Extended Morning' : 'Full Day'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium capitalize">{experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meal Option:</span>
                    <span className="font-medium capitalize">
                      {mealOption === 'without' ? 'No Meals' : 
                       mealOption === 'breakfast' ? 'With Breakfast' : 
                       mealOption === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Persons:</span>
                    <span className="font-medium">{numberOfPersons}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">{formatPrice(calculatePrice())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['bankTransfer', 'bankDeposit', 'creditCard'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 px-4 rounded-lg border ${paymentMethod === method ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300'}`}
                    >
                      {method === 'bankTransfer' ? 'Bank Transfer' : 
                       method === 'bankDeposit' ? 'Bank Deposit' : 'Credit Card'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              {paymentMethod === 'creditCard' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Card Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">Card Holder</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm text-gray-600">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {(paymentMethod === 'bankTransfer' || paymentMethod === 'bankDeposit') && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    {paymentMethod === 'bankTransfer' ? 'Bank Transfer Instructions' : 'Bank Deposit Instructions'}
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Please transfer the total amount to the following account. Your booking will be confirmed once payment is received.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Bank Name:</p>
                      <p className="font-medium">Wildlife Safari Bank</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Name:</p>
                      <p className="font-medium">Safari Adventures Ltd</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Number:</p>
                      <p className="font-medium">1234567890</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Branch:</p>
                      <p className="font-medium">Colombo Main</p>
                    </div>
                  </div>
                  {paymentMethod === 'bankTransfer' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Receipt</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 mr-2 rounded text-green-600 focus:ring-green-500"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Booking;