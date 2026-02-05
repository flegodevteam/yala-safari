import { useState } from "react";
import { apiEndpoints } from "../config/api";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaTripadvisor,
} from "react-icons/fa";
import contactUs from '../assets/y (7).jpg';
import formImg from '../assets/y (9).jpg';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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
        if (data.success) {
          setSubmitted(true);
          setSubmitMessage(data.message || "Thank you! Your message has been sent successfully.");
          setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } else {
          setSubmitted(false);
          setSubmitMessage("There was an error sending your message. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setSubmitted(false);
        setSubmitMessage("There was an error sending your message. Please try again.");
      });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#e6e6e6] to-white flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactUs}
            alt="Elephant in the wild"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#034123]/70"></div>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-wider">
            Contact Yala Safari
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light mb-8">
            Get in touch with us for your perfect safari adventure
          </p>
          <div className="flex space-x-4">
            <div className="w-3 h-3 rounded-full bg-[#fee000]"></div>
            <div className="w-3 h-3 rounded-full bg-[#f26b21]"></div>
            <div className="w-3 h-3 rounded-full bg-[#fee000]"></div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#034123]/10">
            <h2 className="text-2xl font-bold text-[#034123] mb-4">Address</h2>
            <p className="text-base text-[#333333]">191/6, Mahasenpura, Tissamaharama, <br/> Yala, Sri Lanka</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#034123]/10">
            <h2 className="text-2xl font-bold text-[#034123] mb-4">Contact</h2>
            <p className="text-base text-[#333333] mb-2">yalagihan@gmail.com</p>
            <p className="text-base text-[#333333]">+94 773 742 700</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#034123]/10">
            <h2 className="text-2xl font-bold text-[#034123] mb-4">Follow Us</h2>
            <p className="text-base text-[#333333] mb-4">Connect with us on</p>
            <div className="flex space-x-4">
              <a href="/" className="text-[#034123] hover:text-[#f26b21] transition-colors duration-300" aria-label="Facebook">
                <FaFacebook size={24} />
              </a>
              <a href="/" className="text-[#034123] hover:text-[#f26b21] transition-colors duration-300" aria-label="Instagram">
                <FaInstagram size={24} />
              </a>
              <a href="/" className="text-[#034123] hover:text-[#f26b21] transition-colors duration-300" aria-label="Twitter">
                <FaTwitter size={24} />
              </a>
              <a href="/" className="text-[#034123] hover:text-[#f26b21] transition-colors duration-300" aria-label="TripAdvisor">
                <FaTripadvisor size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#034123]/10 mb-16">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-[#034123] mb-6">
              Find Us on the Map
            </h2>
            <div className="w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.6869111443325!2d81.3003026!3d6.304803400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae69d00e28e9c7b%3A0xa31f7dfb5361f3af!2sYala%20Safari%20with%20Tharindu%20Gihan!5e0!3m2!1sen!2slk!4v1770270762897!5m2!1sen!2slk"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Yala Safari Location"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 mb-16">
          {/* Contact Form */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl shadow-lg p-10 border border-[#034123]/10">
            <h1 className="text-4xl font-bold mb-6 text-[#034123]">
              Contact Us
            </h1>
            <p className="text-lg mb-8 text-[#333333] italic">
              "Planning your dream safari or a serene escape at Yala? Contact us
              today! Whether it's about our exclusive offers, bookings, or any
              other inquiries, we're just a message away."
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-[#034123] mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-semibold text-[#034123] mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-base font-semibold text-[#034123] mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                  className="w-full px-4 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-base font-semibold text-[#034123] mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject (e.g., Safari Inquiry)"
                  className="w-full px-4 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-base font-semibold text-[#034123] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="4"
                  className="w-full px-4 py-3 bg-[#e6e6e6] border border-[#034123]/20 rounded-lg text-[#034123] placeholder-[#034123]/50 focus:outline-none focus:ring-2 focus:ring-[#f26b21] focus:border-[#f26b21] focus:bg-white transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f26b21] hover:bg-[#034123] text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit
              </button>
            </form>

            {/* Show success/error message */}
            {submitMessage && (
              <div className={`mt-6 p-4 rounded-lg ${
                submitted 
                  ? "bg-[#fee000]/20 border-2 border-[#fee000] text-[#034123]" 
                  : "bg-red-100 border-2 border-red-300 text-red-800"
              }`}>
                <p className="font-semibold">{submitMessage}</p>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 flex">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-[#034123]/10">
              <img
                src={formImg}
                alt="Wildlife in Yala National Park"
                className="w-full h-full object-cover"
                style={{ minHeight: 600 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#034123]/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
