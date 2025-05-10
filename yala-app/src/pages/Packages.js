import { Link } from 'react-router-dom';
import yaaa from '../assets/yaaa.jpeg';
import bund from '../assets/bund.jpg';
import bundala from '../assets/bundala.jpg';
import uda from '../assets/uda.jpg';

export default function Packages() {
  const parks = [
    {
      id: 'yala',
      name: 'Yala National Park',
      description: 'Famous for its leopard population and diverse wildlife',
      image: yaaa,
      packages: [
        {
          name: 'Morning Safari',
          duration: '4 hours',
          price: '$50',
          highlights: ['Leopard spotting', 'Bird watching', 'Early morning wildlife activity'],
        },
        {
          name: 'Afternoon Safari',
          duration: '4 hours',
          price: '$50',
          highlights: ['Elephant herds', 'Sunset views', 'Less crowded'],
        },
        {
          name: 'Full Day Safari',
          duration: '8 hours',
          price: '$120',
          highlights: ['Comprehensive exploration', 'Lunch included', 'Best chance for leopard sightings'],
        },
      ],
    },
    {
      id: 'bundala',
      name: 'Bundala National Park',
      description: 'A paradise for bird watchers with over 200 species',
      image: bundala,
      packages: [
        {
          name: 'Bird Watching Tour',
          duration: '5 hours',
          price: '$45',
          highlights: ['Flamingo spotting', 'Migratory birds', 'Wetland ecosystem'],
        },
      ],
    },
    {
      id: 'udawalawa',
      name: 'Udawalawa National Park',
      description: 'Best place to see elephants in their natural habitat',
      image: uda,
      packages: [
        {
          name: 'Elephant Safari',
          duration: '4 hours',
          price: '$45',
          highlights: ['Elephant herds', 'Bird species', 'Scenic reservoir views'],
        },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Safari Packages
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Choose from our range of safari experiences in Sri Lanka's most beautiful national parks.
        </p>
      </div>

      <div className="space-y-16">
        {parks.map((park) => (
          <section key={park.id} className="bg-white shadow overflow-hidden rounded-lg">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/3">
                <img
                  className="h-full w-full object-cover md:w-full"
                  src={park.image}
                  alt={park.name}
                />
              </div>
              <div className="p-8 md:w-2/3">
                <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
                  National Park
                </div>
                <h2 className="mt-2 text-2xl font-extrabold text-gray-900">{park.name}</h2>
                <p className="mt-3 text-base text-gray-500">{park.description}</p>
                
                <div className="mt-8 space-y-6">
                  {park.packages.map((pkg, idx) => (
                    <div key={idx} className="border-t border-gray-200 pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{pkg.name}</h3>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {pkg.duration}
                          </div>
                        </div>
                        <span className="text-xl font-bold text-green-600">{pkg.price}</span>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Highlights:</h4>
                        <ul className="mt-2 space-y-2">
                          {pkg.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start">
                              <svg
                                className="flex-shrink-0 h-5 w-5 text-green-500"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="ml-2 text-sm text-gray-700">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Added booking information section */}
                      <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900">Booking Information:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Accommodation</label>
                            <input 
                              type="text" 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              placeholder="Your accommodation details"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Pick Up Location</label>
                            <div className="mt-1 flex space-x-2">
                              <input 
                                type="text" 
                                className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                placeholder="GPS or manual entry"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">WhatsApp Number (Required)</label>
                            <input 
                              type="tel" 
                              required
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              placeholder="+94 77 123 4567"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Hotel Contact Number</label>
                            <input 
                              type="tel" 
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              placeholder="Hotel phone number"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
                          <textarea 
                            rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Any special requests or requirements"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <Link
                          to={`/booking?park=${park.id}&package=${pkg.name.toLowerCase().replace(' ', '-')}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        >
                          Book This Package
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 bg-green-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900">Can't find what you're looking for?</h3>
        <p className="mt-4 text-gray-600">
          We offer custom safari packages tailored to your preferences. Contact us to create your perfect wildlife experience.
        </p>
        <div className="mt-6">
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Request Custom Package
          </Link>
        </div>
      </div>
    </div>
  );
}