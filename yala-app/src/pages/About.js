import guides from "../assets/guides.jpg"; 



export default function About() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
             Yala Safari
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Our story, mission, and commitment to responsible tourism.
          </p>
        </div>
  
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
                <div className="mt-4 text-gray-500 space-y-4">
                  <p>
                    Founded in 2010, Yala Safari began with a small team of wildlife enthusiasts who wanted to share the beauty of Sri Lanka's national parks with the world. What started as a single jeep operation has grown into one of the most respected safari providers in the region.
                  </p>
                  <p>
                    Our founder, a former park ranger with over 20 years of experience, established the company with a vision to create sustainable wildlife tourism that benefits both visitors and local communities.
                  </p>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:ml-8 md:w-1/2">
                <img
                  className="rounded-lg shadow-lg"
                  src="/about-story.jpg"
                  alt="Our founder in Yala National Park"
                />
              </div>
            </div>
          </div>
        </div>
  
        <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Exceptional Wildlife Experiences",
                  description: "Provide unforgettable safari adventures with expert guides who know the parks intimately.",
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  ),
                },
                {
                  title: "Conservation Focus",
                  description: "Promote responsible tourism that supports wildlife conservation and habitat protection.",
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Community Engagement",
                  description: "Create economic opportunities for local communities through ethical tourism practices.",
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-green-500 rounded-md shadow-lg">
                          {item.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{item.title}</h3>
                      <p className="mt-5 text-base text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-2 text-gray-600">
              Meet the passionate professionals who make your safari experience exceptional.
            </p>
            
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Kamal Perera",
                  role: "Head Guide",
                  experience: "15 years in Yala",
                  bio: "Kamal's sharp eyes can spot a leopard at 500 meters. His knowledge of animal behavior is unparalleled.",
                  image: guides,
                },
                {
                  name: "Nimal Fernando",
                  role: "Senior Guide",
                  experience: "12 years in Bundala",
                  bio: "A bird expert who can identify species by their calls alone. Nimal's tours are a favorite among ornithologists.",
                  image: guides,
                },
                {
                  name: "Sunil Rathnayake",
                  role: "Guide & Naturalist",
                  experience: "10 years in Udawalawa",
                  bio: "Specializes in elephant behavior and conservation. Sunil's passion for pachyderms is contagious.",
                  image: guides,
                },
              ].map((member, index) => (
                <div key={index} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            className="h-24 w-24 rounded-full object-cover"
                            src={member.image}
                            alt={member.name}
                          />
                          <span className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {member.experience}
                          </span>
                        </div>
                      </div>
                      <h3 className="mt-6 text-lg font-medium text-gray-900 text-center">{member.name}</h3>
                      <p className="mt-1 text-sm text-green-600 text-center">{member.role}</p>
                      <p className="mt-4 text-base text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900">Certifications & Affiliations</h2>
            <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { name: "Sri Lanka Tourism", image: "/cert1.png" },
                { name: "Wildlife Conservation Society", image: "/cert2.png" },
                { name: "Eco Tourism Certified", image: "/cert3.png" },
                { name: "Guides Association", image: "/cert4.png" },
              ].map((cert, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <img
                    className="max-h-16"
                    src={cert.image}
                    alt={cert.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
