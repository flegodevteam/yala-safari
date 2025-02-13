import React from "react";
import { motion } from "framer-motion";
import Ab1 from "../assets/ab11.jpg";
import Ce1 from "../assets/ce1.png";
import Team1 from "../assets/team1.jpg";
import yaala from "../assets/yaala.png";
import history from "../assets/history.jpg";
import tour from "../assets/tour.jpg";

const AboutUs = () => {
  // Team Members Data
  const team = [
    {
      name: "Dr. Alice Roberts",
      role: "Wildlife Biologist",
      img: Team1,
    },
    {
      name: "John Doe",
      role: "Sanctuary Manager",
      img: Team1,
    },
    {
      name: "Emily Clark",
      role: "Conservationist",
      img: Team1,
    },
    {
      name: "Mike Brown",
      role: "Veterinarian",
      img: Team1,
    },
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <header
        className="relative bg-cover bg-center h-80 flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: `url(${Ab1})`,
        }}
      >
        <motion.h1
          className="text-5xl font-bold drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          About Our Sanctuary
        </motion.h1>
      </header>

      {/* Mission, Values & History */}
      <section className="container mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Our Mission & Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold">Our Mission</h3>
            <p className="mt-2 text-gray-600">
              To protect and conserve wildlife through sustainable tourism and
              education.
            </p>
            <div
              className="h-40 bg-cover bg-center rounded-lg mt-4"
              style={{
                backgroundImage: `url(${yaala})`,
              }}
            ></div>
          </motion.div>

          {/* History */}
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold">Our History</h3>
            <p className="mt-2 text-gray-600">
              Founded in 1995, our sanctuary has rescued over 5,000 endangered
              animals.
            </p>
            <div
              className="h-40 bg-cover bg-center rounded-lg mt-4"
              style={{
                backgroundImage: `url(${history})`,
              }}
            ></div>
          </motion.div>

          {/* Values */}
          <motion.div
            className="p-6 bg-white shadow-lg rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <h3 className="text-xl font-semibold">Our Values</h3>
            <p className="mt-2 text-gray-600">
              Conservation, education, and ethical tourism guide our every
              action.
            </p>
            <div
              className="h-40 bg-cover bg-center rounded-lg mt-4"
              style={{
                backgroundImage: `url(${tour})`,
              }}
            ></div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white shadow-lg rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="rounded-full mx-auto"
                />
                <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Affiliations */}
      <section className="container mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold mb-8">
          Certifications & Affiliations
        </h2>
        <div className="flex justify-center space-x-8">
          <motion.img
            src={Ce1}
            alt="Certification"
            className="w-32 h-32"
            whileHover={{ scale: 1.1 }}
          />
          <motion.img
            src={Ce1}
            alt="Affiliation"
            className="w-32 h-32"
            whileHover={{ scale: 1.1 }}
          />
          <motion.img
            src={Ce1}
            alt="Sustainability"
            className="w-32 h-32"
            whileHover={{ scale: 1.1 }}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
