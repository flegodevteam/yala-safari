import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import yala from "../assets/yaala.png";
import h1 from "../assets/h1.jpg";
import h2 from "../assets/h2.jpg"; // Add more images if needed
import ab11 from "../assets/ab11.jpg";

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="relative text-black w-full" style={{ height: "50vh" }}>
      <Slider {...settings} className="w-full h-full">
        {[yala, h1, ab11].map((image, index) => (
          <div key={index} className="w-full h-[50vh]">
            <img
              src={image}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-40">
        <h1 className="text-4xl font-bold md:text-5xl">
          Preserving the “Wild" for the future
        </h1>
        <p className="mt-4 font-semibold text-lg max-w-3xl">
          The mission statement of the Department of Wildlife Conservation (DWC)
          is, "To conserve wildlife and nature by the sustainable utilization of
          resources."
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
