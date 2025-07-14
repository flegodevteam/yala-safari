import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting form data:", formData);

    fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Form submitted successfully:", data);
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="relative w-full h-screen overflow-hidden">
      {/* Elephant Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Elephant in the wild"
          className="w-full h-full object-cover brightness-75"
        />
      </div>
      
      {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wider">
          WELCOME TO YALA SAFRI
        </h1>
        
        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-white font-light mb-8">
          YALA SAFARI Contact
        </p>
        
        {/* Decorative Elements */}
          <div className="flex space-x-4">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          </div>
              </div>
            </div>

              <div className="flex-1 flex flex-col">
          <div className="mt-12 bg-white shadow overflow-hidden rounded-lg w-full mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Find Us on the Map
              </h2>
              <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-0" style={{maxWidth: "100vw"}}>
                <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps?q=6.4281,81.5186&z=15&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Yala Safari Location"
            ></iframe>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch justify-center flex-1">
            {/* Contact Form Section */}
          <div className="w-full md:w-1/2 max-w-2xl bg-white rounded-l-lg rounded-r-none shadow-md p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h1>
            <p className="text-lg mb-8 text-gray-600 italic">
              "Planning your dream safari or a serene escape at Wild Breeze?
              Contact us today! Whether it's about our exclusive offers, bookings,
              or any other inquiries, we're just a message away."
            </p>
            <form className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Mail
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Your phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter your subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  placeholder="Your message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition duration-200"
              >
                Submit
              </button>
            </form>
          </div>
          {/* Image Section */}
          <div className="w-full md:w-1/2 max-w-2xl flex">
            <img
              src="https://monkeysandmountains.com/wp-content/uploads/2015/01/rsz_leopard.jpg"
              alt="Wild Breeze Safari"
              className="w-full h-full object-cover rounded-r-lg rounded-l-none shadow-md"
              style={{ minHeight: 600, height: "100%" }}
            />
          </div>
        </div>

        
      </div>
    </div>
  );
}
