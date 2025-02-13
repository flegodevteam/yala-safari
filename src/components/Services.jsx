import React from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    name: "Santha Yala Safari",
    image:
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/09/f2/0f/25.jpg",
    rating: 5,
    tours: 1,
    price: "$112.00",
    link: "#",
  },
  {
    name: "Sugathe's Yala Jeep Safaris",
    image:
      "https://media2.thrillophilia.com/images/photos/000/053/505/original/1558512267_elephants-murchison.jpg?",
    rating: 4,
    tours: 1,
    price: "$199.00",
    link: "#",
  },
  {
    name: "Janaka Safari",
    image:
      "https://www.yalasafarigamedrives.com/img/fullday-safari-in-yala-national-park.jpg",
    rating: 5,
    tours: 1,
    price: "$299.00",
    link: "#",
  },
];

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
      <div className="flex items-center mt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-yellow-500 ${
              i < service.rating ? "" : "opacity-50"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold text-orange-500">
          {service.price} / Day
        </span>
        <a
          onClick={() => navigate("/online-booking")}
          href={service.link}
          className="text-blue-600 font-semibold hover:underline"
        >
          Book Now →
        </a>
      </div>
    </div>
  );
};

const ServicesList = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-gray-800">Our Best Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
