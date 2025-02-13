import React from "react";
import leopardImage from "../assets/leopard.jpg";

const WildlifeSanctuary = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-gradient-to-b from-white to-gray-100 p-8">
      {/* Image Section */}
      <div className="md:w-1/3 p-4">
        <img
          className="rounded-lg shadow-lg border-4 border-green-700 transform transition-transform duration-5 hover:scale-105"
          src="https://www.autentic.com/images/resting-leopard-w820-ar.jpg "
          alt="Spotted deer in Wayanad Wildlife Sanctuary"
        />
      </div>

      {/* Content Section */}
      <div className="md:w-2/3 p-4 text-gray-800">
        <h2 className="text-xl md:text-2xl font-bold text-center md:text-left text-gray-900 uppercase mb-2">
          In the Heart of Conservation: Discovering Our Story
        </h2>
        <div className="border-b-2 border-green-700 w-24 mb-4"></div>
        <p className="text-sm md:text-base leading-relaxed">
          The Yala leopard refers to the Sri Lankan leopard (Panthera pardus
          kotiya), a subspecies of leopard endemic to Sri Lanka. It is most
          commonly spotted in Yala National Park, one of the best places in the
          world to observe these elusive big cats
        </p>
        <p className="text-sm md:text-base leading-relaxed mt-3">
          Known for their golden-yellow coats with dark rosettes, Sri Lankan
          leopards are apex predators in their habitat, as Sri Lanka lacks
          larger carnivores like tigers or lions.
        </p>
        <p className="text-sm md:text-base leading-relaxed mt-3">
          Due to habitat loss and poaching, they are classified as Vulnerable by
          the IUCN. Yala’s high leopard density makes it a prime destination for
          wildlife enthusiasts and photographers
        </p>
      </div>
    </div>
  );
};

export default WildlifeSanctuary;
