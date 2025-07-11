import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-50"
            src={hero}
            alt="Wildlife in Yala National Park"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover the Wild Beauty of Yala
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl">
            Experience unforgettable wildlife encounters with our expert-guided
            safari tours in Sri Lanka's most famous national parks.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/packages"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Book Your Safari
            </Link>
            
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Popular Safari Packages
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-500">
            Choose from our carefully curated safari experiences designed for
            all types of adventurers.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Yala Morning Safari",
              description:
                "Spot leopards and other wildlife at their most active time",
              duration: "4 hours",
              link: "/booking?package=morning",
            },
            {
              name: "Full Day Yala Experience",
              description: "Comprehensive exploration with lunch included",
              duration: "8 hours",
              link: "/booking?package=fullday",
            },
            {
              name: "Bundala Bird Watching",
              description: "Specialized tour for bird enthusiasts",
              duration: "5 hours",
              link: "/booking?package=birdwatching",
            },
          ].map((pkg, index) => (
            <div
              key={index}
              className="pt-6 pb-8 px-6 bg-white rounded-lg shadow-lg flex flex-col"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="mt-3 text-base text-gray-500">
                  {pkg.description}
                </p>
                <div className="mt-4 flex items-center">
                  <span className="text-green-600 font-medium">
                    {pkg.price}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    {pkg.duration}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/packages"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/packages"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-700 bg-green-100 hover:bg-green-200"
          >
            View All Packages
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              About Yala Safari
            </h2>
            <p className="mt-5 max-w-xl text-lg text-green-100">
              We are a team of passionate wildlife experts dedicated to
              providing authentic and responsible safari experiences in Sri
              Lanka's most beautiful national parks.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Link
                  to="/about"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:ml-16">
            <img
              className="w-full rounded-lg shadow-xl"
              src="/about-image.jpg"
              alt="Safari team"
              width={600}
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            What Our Guests Say
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "The best wildlife experience of my life! Our guide spotted 3 leopards and countless other animals.",
                author: "Sarah J.",
                rating: 5,
              },
              {
                quote:
                  "Professional team with deep knowledge of the park and its wildlife. Highly recommended!",
                author: "Mark T.",
                rating: 5,
              },
              {
                quote:
                  "The morning safari was magical. We saw elephants, crocodiles, and so many birds.",
                author: "Priya K.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="pt-8 pb-10 px-6 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6">
                  <p className="text-lg text-gray-700">{testimonial.quote}</p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-sm font-medium">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to explore?</span>
            <span className="block text-green-600">
              Book your safari adventure today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Book Now
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
