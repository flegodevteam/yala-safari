import { useState } from "react";
import { apiEndpoints } from "../config/api";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTripadvisor,
} from "react-icons/fa";

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

    fetch(apiEndpoints.contact, {
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
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
      <div className="font-sans text-gray-800 max-w-md mx-auto p-6">
        {/* Main Heading */}
        <h1 className="text-3xl font-bold mb-8">Contact.</h1>

        {/* Address Section */}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Address</h2>
          <p className="text-base">Tissamaharama, Yala, Sri Lanka</p>
        </div>

        {/* Contact Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Contact</h2>
          <p className="text-base">yalagihan@gmail.com</p>
          <p className="text-base">+94 773 742 700</p>
        </div>

        {/* Follow Us Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
          <p className="text-base mb-3">Connect with me on</p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-pink-600 hover:text-pink-800">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-blue-400 hover:text-blue-600">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-green-600 hover:text-green-800">
              <FaTripadvisor size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mt-12 bg-white shadow overflow-hidden rounded-lg w-full mx-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Find Us on the Map
            </h2>
            <div
              className="w-screen relative left-1/2 right-1/2 -mx-[50vw] px-0"
              style={{ maxWidth: "100vw" }}
            >
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Contact Us
            </h1>
            <p className="text-lg mb-8 text-gray-600 italic">
              "Planning your dream safari or a serene escape at Yala? Contact us
              today! Whether it's about our exclusive offers, bookings, or any
              other inquiries, we're just a message away."
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-full transition duration-200"
              >
                Submit
              </button>
            </form>

            {/* Show success message */}
            {submitted && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                Thank you! Your message has been sent successfully.
              </div>
            )}
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
