import React from "react";

const destinations = [
  {
    name: "Yala National Park",
    description:
      "Yala National Park is known for its variety of wildlife, including leopards, elephants, and birds. It offers a unique safari experience.",
    bgImage: "url('')",
    blocks: [
      {
        name: "Block I",
        description:
          "Block I is the most visited region of Yala, famous for its leopard population and diverse wildlife.",
      },
      {
        name: "Block IV",
        description:
          "Block IV offers a more secluded experience with rich birdlife and untouched landscapes.",
      },
    ],
  },
  {
    name: "Bundala National Park",
    description:
      "A UNESCO biosphere reserve, Bundala is a paradise for bird watchers and home to migratory flamingos.",
  },
  {
    name: "Udawalawe National Park",
    description:
      "Famous for its large elephant population, Udawalawe is one of the best places to observe wild elephants up close.",
  },
];

const Destinations = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      <h2 className="text-4xl font-bold text-center text-green-700 mb-8">
        Destinations
      </h2>
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
        {destinations.map((destination, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 ">
              {destination.name}
            </h3>
            {destination.blocks ? (
              <ul className="mt-4 ">
                {destination.blocks.map((block, idx) => (
                  <li
                    key={idx}
                    className="mt-2 border-l-4 border-green-500 pl-4"
                  >
                    <h4 className="text-lg font-medium text-gray-700 ">
                      {block.name}
                    </h4>
                    <p className="text-gray-600">{block.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-600">{destination.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
