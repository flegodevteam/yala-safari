import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-800 min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-50"
            src={hero}
            alt="Wildlife in Yala National Park"
            style={{ minHeight: "100vh", maxHeight: "100vh" }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-48 sm:px-6 lg:px-8 w-full">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              ABOUT US
            </h1>

            <p className="text-xl text-gray-600 mb-8 italic">
              Begin your amazing adventure.
            </p>

            <div className="space-y-6 text-gray-700">
              <p>
                Our yala safari offers an exceptional blend of luxury, comfort,
                and natural beauty, providing an idyllic escape into the heart
                of Sri Lanka's wildlife. Nestled in a serene and picturesque
                landscape, our bungalows immerse you in the soothing sights and
                sounds of nature while keeping you conveniently close to local
                restaurants, shops, and popular tourist attractions. Guests can
                embark on thrilling Yala National Park safaris led by expert
                guides passionate about the region's incredible biodiversity,
                ideally located in Tissamaharama. we serve as a
                perfect hub for exploring Yala, Bundala, and Udawalawa
                national parks, making it a must-visit destination for nature
                lovers.
              </p>

              <p>
                Our accommodations are thoughtfully designed for your comfort,
                featuring air conditioning, fans, mini fridges, and private
                washrooms, along with additional conveniences like towels,
                desks, and garden views that enhance your stay. Complimentary
                Wi-Fi is available throughout the property, and we offer a
                variety of extra services, including laundry, airport
                transportation, bicycle rentals, and guided walking or cycling
                tours. With an onsite restaurant serving delicious meals and a
                commitment to exceptional service, Our Hotel
                ensures your experience is as relaxing as it is unforgettable.
              </p>
            </div>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md transition duration-300"
            >
              Explore More
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {/* Safari Jeep Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img
                src="https://media.tacdn.com/media/attractions-splice-spp-674x446/10/48/03/3d.jpg"
                alt="Safari Jeep in Yala National Park"
                className="w-full h-auto object-cover rounded-xl transform hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">Yala Safari Adventures</h3>
                <p className="text-amber-200">
                  Experience the wild like never before
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="hidden lg:block absolute -bottom-8 -right-8 w-32 h-32 border-4 border-amber-400 rounded-full"></div>
            <div className="hidden lg:block absolute -top-8 -left-8 w-20 h-20 border-2 border-amber-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section - TripAdvisor & Google */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by travelers worldwide
            </p>
          </div>

          {/* Review Platform Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* TripAdvisor Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* TripAdvisor Owl Icon */}
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="w-10 h-10 text-green-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353-.264.179-.529.357-.784.546L.674 4.295l2.034 4.403c-.784 1.05-1.307 2.25-1.577 3.524C.4 14.553.848 17.663 3.014 19.99c1.902 2.034 4.59 3.05 7.278 2.758 2.688-.291 5.128-1.668 6.617-3.738 1.488-2.07 2.034-4.687 1.49-7.15-.546-2.463-2.07-4.59-4.143-5.773-.784-.446-1.63-.79-2.51-1.036-.879-.246-1.79-.378-2.688-.378-.358 0-.714.022-1.07.067zm-.015 2.045c.335-.022.67-.022.995.011 1.307.134 2.547.658 3.56 1.507 1.013.85 1.767 2.003 2.17 3.288.402 1.285.447 2.67.134 3.977-.313 1.307-.993 2.503-1.955 3.427-1.966 1.88-4.98 2.347-7.41 1.15-2.43-1.196-3.987-3.784-3.83-6.36.156-2.577 1.99-4.88 4.511-5.675.79-.246 1.623-.358 2.456-.335zm-5.362 2.645c-.201 0-.402.034-.592.1-.38.134-.714.402-.936.758-.223.357-.313.79-.246 1.196.067.402.29.769.614 1.024.324.257.737.39 1.15.38.413-.012.804-.168 1.105-.435.302-.268.502-.636.57-1.036.067-.402-.012-.815-.223-1.15-.212-.335-.535-.592-.926-.725-.19-.067-.392-.1-.592-.1zm10.682 0c-.201 0-.402.034-.592.1-.38.134-.714.402-.937.758-.223.357-.313.79-.246 1.196.067.402.29.769.614 1.024.324.257.737.39 1.15.38.413-.012.804-.168 1.105-.435.302-.268.502-.636.57-1.036.067-.402-.012-.815-.223-1.15-.212-.335-.535-.592-.926-.725-.19-.067-.392-.1-.592-.1z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        TripAdvisor
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-white font-semibold">
                          5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic">
                  "Yala Safari with Tharindu Gihan offers exceptional wildlife
                  experiences with expert guides who are passionate about Sri
                  Lanka's incredible biodiversity."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Read all reviews on TripAdvisor
                  </span>
                  <a
                    href="https://www.tripadvisor.com/Attraction_Review-g1102395-d9975853-Reviews-Yala_Safari_With_Tharindu_Gihan-Tissamaharama_Southern_Province.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    View Reviews
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Google Reviews Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Google Icon */}
                    <div className="bg-white rounded-full p-3">
                      <svg
                        className="w-10 h-10"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        Google Reviews
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-5 h-5 text-yellow-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-white font-semibold">
                          5.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4 italic">
                  "Amazing safari experience! Tharindu and his team are
                  incredibly knowledgeable and ensured we had the best wildlife
                  viewing opportunities."
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    See what guests say on Google
                  </span>
                  <a
                    href="https://www.google.com/search?kgmid=/g/11bwl3j4c8&hl=en-LK&q=Yala+Safari+with+Tharindu+Gihan&shndl=30&shem=lcuae,ptotple,shrtsdl&kgs=21fa4623b57ade5a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View Reviews
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Testimonials */}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Recent Guest Experiences
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote:
                  "The best wildlife experience of my life! Our guide spotted 3 leopards and countless other animals. Tharindu's knowledge of the park is exceptional!",
                author: "Sarah Johnson",
                location: "United Kingdom",
                rating: 5,
                platform: "TripAdvisor",
              },
              {
                quote:
                  "Professional team with deep knowledge of the park and its wildlife. The early morning safari was worth every penny. Highly recommended!",
                author: "Mark Thompson",
                location: "Australia",
                rating: 5,
                platform: "Google",
              },
              {
                quote:
                  "Amazing experience! We saw elephants, crocodiles, peacocks, and so many birds. The guide was patient and made sure we got the best photos.",
                author: "Priya Kapoor",
                location: "India",
                rating: 5,
                platform: "TripAdvisor",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white pt-8 pb-8 px-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      testimonial.platform === "Google"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {testimonial.platform}
                  </span>
                </div>
                <blockquote className="mb-6">
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </blockquote>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-bold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Reviews Button */}
          <div className="mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.google.com/search?kgmid=/g/11bwl3j4c8&hl=en-LK&q=Yala+Safari+with+Tharindu+Gihan&shndl=30&shem=lcuae,ptotple,shrtsdl&kgs=21fa4623b57ade5a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-600 hover:text-white transition-all"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353-.264.179-.529.357-.784.546L.674 4.295l2.034 4.403c-.784 1.05-1.307 2.25-1.577 3.524C.4 14.553.848 17.663 3.014 19.99c1.902 2.034 4.59 3.05 7.278 2.758 2.688-.291 5.128-1.668 6.617-3.738 1.488-2.07 2.034-4.687 1.49-7.15-.546-2.463-2.07-4.59-4.143-5.773-.784-.446-1.63-.79-2.51-1.036-.879-.246-1.79-.378-2.688-.378-.358 0-.714.022-1.07.067zm-.015 2.045c.335-.022.67-.022.995.011 1.307.134 2.547.658 3.56 1.507 1.013.85 1.767 2.003 2.17 3.288.402 1.285.447 2.67.134 3.977-.313 1.307-.993 2.503-1.955 3.427-1.966 1.88-4.98 2.347-7.41 1.15-2.43-1.196-3.987-3.784-3.83-6.36.156-2.577 1.99-4.88 4.511-5.675.79-.246 1.623-.358 2.456-.335zm-5.362 2.645c-.201 0-.402.034-.592.1-.38.134-.714.402-.936.758-.223.357-.313.79-.246 1.196.067.402.29.769.614 1.024.324.257.737.39 1.15.38.413-.012.804-.168 1.105-.435.302-.268.502-.636.57-1.036.067-.402-.012-.815-.223-1.15-.212-.335-.535-.592-.926-.725-.19-.067-.392-.1-.592-.1zm10.682 0c-.201 0-.402.034-.592.1-.38.134-.714.402-.937.758-.223.357-.313.79-.246 1.196.067.402.29.769.614 1.024.324.257.737.39 1.15.38.413-.012.804-.168 1.105-.435.302-.268.502-.636.57-1.036.067-.402-.012-.815-.223-1.15-.212-.335-.535-.592-.926-.725-.19-.067-.392-.1-.592-.1z"/>
                </svg>
                View TripAdvisor Reviews
              </a>
              <a
                href="https://www.google.com/search?kgmid=/g/11bwl3j4c8&hl=en-LK&q=Yala+Safari+with+Tharindu+Gihan&shndl=30&shem=lcuae,ptotple,shrtsdl&kgs=21fa4623b57ade5a"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                View Google Reviews
              </a>
            </div>
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