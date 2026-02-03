import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import hero1 from '../assets/hero_1.jpeg';
import hero2 from '../assets/hero_2.jpeg';
import hero3 from '../assets/hero_3.jpeg';
import hero4 from '../assets/hero_4.jpeg';
import tiger from '../assets/tiger.jpeg';


const HERO_IMAGES = [
  { src: hero1, alt: 'Wildlife in Yala National Park' },
  { src: hero2, alt: 'Safari at Yala' },
  { src: hero3, alt: 'Yala safari experience' },
  { src: hero4, alt: 'Yala National Park wildlife' },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js"]'
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js';
      script.type = 'module';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Section - 4 image carousel */}
      <div className="relative min-h-screen flex items-center" >
        <div className="absolute inset-0 overflow-hidden">
          {HERO_IMAGES.map((img, index) => (
            <img
              key={index}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              src={img.src}
              alt={img.alt}
              style={{
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-green-900/20 z-[2]" aria-hidden />
        </div>
        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
        {/* Prev/Next arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 flex items-center justify-center text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="relative z-10 max-w-4xl mx-auto md:ml-20 w-full py-16 px-4 sm:py-24 sm:px-6 md:py-32 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" >
            Discover the Wild Beauty of Yala
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl max-w-3xl text-gray-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Experience unforgettable wildlife encounters with our expert-guided safari tours in Sri Lanka's most famous national parks.
          </p>
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap gap-4">
            <Link
              to="/packages"
              className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md shadow-sm text-white transition-colors duration-200"
              style={{ backgroundColor: '#f26b21' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#034123'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
            >
              Explore Packages
            </Link>      
          </div>
        </div>
      </div>

      {/* Featured Packages */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ color: '#034123' }}>
            Our Popular Safari Packages
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: '#333333' }}>
            Choose from our carefully curated safari experiences designed for all types of adventurers.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "Yala Morning Safari (Most Popular)" ,
              description: "Spot leopards and other wildlife at their most active time",
              duration: "4 hours",
              link: "/packages",
            },
            {
              name: "Evening Safari Yala Experience",
              description: "Comprehensive exploration with lunch included",
              duration: "8 hours",
              link: "/packages",
            },
            {
              name: "Extended Safari",
              description: "Specialized tour for bird enthusiasts",
              duration: "5 hours",
              link: "/packages",
            },
          ].map((pkg, index) => (
            <div key={index} className="pt-6 pb-8 px-6 bg-white rounded-lg shadow-lg flex flex-col border transition-transform duration-300 hover:scale-105 hover:shadow-xl" style={{ borderColor: 'rgba(3, 65, 35, 0.1)' }}>
              <div className="flex-1">
                <h3 className="text-xl font-bold" style={{ color: '#034123' }}>{pkg.name}</h3>
                <p className="mt-3 text-base" style={{ color: '#333333' }}>{pkg.description}</p>
                <div className="mt-4 flex items-center">
                  <span className="font-medium" style={{ color: '#f26b21' }}>{pkg.duration}</span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to={pkg.link}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200"
                  style={{ backgroundColor: '#f26b21' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#034123'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
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
            className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm transition-colors duration-200"
            style={{ borderColor: '#034123', color: '#034123', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#034123'; e.target.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#034123'; }}
          >
            View All Packages
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div style={{ backgroundColor: '#034123', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #f26b21 0%, transparent 70%)', transform: 'translate(-50%, -50%)' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #f26b21 0%, transparent 70%)', transform: 'translate(50%, 50%)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Content Section */}
            <div className="mb-12 lg:mb-0">
              <div className="inline-block mb-4">
                <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#f26b21' }}>
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                About Yala Safari
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: '#e6e6e6' }}>
                We are a team of passionate wildlife experts dedicated to providing authentic and responsible safari experiences in Sri Lanka's most beautiful national parks.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: '#d1d5db' }}>
                With years of experience and deep knowledge of the region's diverse ecosystems, we create unforgettable adventures that connect you with nature while promoting conservation and sustainable tourism.
              </p>
              
              {/* Key Features */}
              <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-2">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 mr-2" style={{ color: '#f26b21' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">Expert Guides</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 mr-2" style={{ color: '#f26b21' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">Trusted Team</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 mr-2" style={{ color: '#f26b21' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">Eco-Friendly</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <svg className="h-6 w-6 mr-2" style={{ color: '#f26b21' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span className="text-white font-semibold text-sm">Premium Experience</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 md:py-4 md:text-lg md:px-10"
                  style={{ color: '#034123' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#f26b21'; e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = '#034123'; }}
                >
                  Learn More About Us
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Image Section */}
            <div className="lg:mt-0 flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 rounded-3xl" style={{ background: 'linear-gradient(135deg,rgb(255, 255, 255),rgb(0, 102, 53))', opacity: 0.1, transform: 'rotate(-2deg)' }}></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-300 hover:scale-105">
                  <img
                    className="w-full h-auto object-cover"
                    src={tiger}
                    alt="Safari team at Yala National Park"
                    style={{ aspectRatio: '4/3' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center" style={{ color: '#034123' }}>
            What Our Guests Say
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "The best wildlife experience of my life! Our guide spotted 3 leopards and countless other animals.",
                author: "Sarah J.",
                rating: 5,
              },
              {
                quote: "Professional team with deep knowledge of the park and its wildlife. Highly recommended!",
                author: "Mark T.",
                rating: 5,
              },
              {
                quote: "The morning safari was magical. We saw elephants, crocodiles, and so many birds.",
                author: "Priya K.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div key={index} className="pt-8 pb-10 px-6 bg-white rounded-lg border shadow-sm transition-transform duration-300 hover:scale-105 hover:shadow-lg" style={{ borderColor: 'rgba(3, 65, 35, 0.1)' }}>
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5"
                      style={{ color: '#fee000' }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-6">
                  <p className="text-lg" style={{ color: '#333333' }}>{testimonial.quote}</p>
                </blockquote>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e6e6e6' }}>
                      <span className="text-sm font-medium" style={{ color: '#034123' }}>
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: '#034123' }}>{testimonial.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ background: 'linear-gradient(to right, #f26b21, #034123)' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl uppercase">
            <span className="block">Ready to explore?</span>
            <span className="block">Book your safari adventure today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white transition-colors duration-200"
                style={{ backgroundColor: '#f26b21' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#034123'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f26b21'}
              >
                Book Now
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border text-base font-medium rounded-md bg-white transition-colors duration-200"
                style={{ borderColor: '#034123', color: '#034123' }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#034123'; e.target.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.color = '#034123'; }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen green animation layer */}
      <div
        className="pointer-events-none"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          overflow: 'hidden',
        }}
      >
        <style>{`
          @keyframes greenSweep {
           
            50% {
              opacity: 0.5;
            }
         
          }
          .green-animation-layer {
            animation: greenSweep 50s linear infinite;
            position: absolute;
            top: -20vh;
            left: -50vw;
            width: 200vw;
            height: 140vh;
            display: flex;
            align-items: center;
            justify-content: center;
            filter: hue-rotate(140deg) saturate(1.8) brightness(0.85) contrast(1);
            opacity: 0.7;
          }
          .green-animation-layer dotlottie-wc {
            width: 2500px;
            height: 1800px;
            mix-blend-mode: screen;
          }
        `}</style>

        <div className="green-animation-layer">
          <dotlottie-wc
            src="https://lottie.host/fc2ebb78-2351-47a0-b7fa-6cccc64abd92/7hktCVsYEI.lottie"
            autoplay
            loop
          ></dotlottie-wc>
        </div>
      </div>
    </div>
  );
}
