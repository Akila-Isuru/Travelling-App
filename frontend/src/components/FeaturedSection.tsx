import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FeaturedSection = () => {
  const features = [
    {
      id: 1,
      title: "Ayurveda Wellness",
      description: "Traditional healing treatments",
      icon: "🌿",
      link: "/wellness",
    },
    {
      id: 2,
      title: "Adventure Tours",
      description: "Hiking & water sports",
      icon: "⛰️",
      link: "/adventures",
    },
    {
      id: 3,
      title: "Cultural Tours",
      description: "Temple & heritage visits",
      icon: "🏯",
      link: "/culture",
    },
    {
      id: 4,
      title: "Beach Getaways",
      description: "Sunset & ocean views",
      icon: "🏖️",
      link: "/beaches",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 font-light">
            What We Offer
          </span>
          <h2 className="text-2xl md:text-3xl font-light mt-2 text-gray-800">
            Curated Experiences
          </h2>
          <div className="w-12 h-px bg-gray-200 mx-auto mt-3" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="text-center group cursor-pointer"
            >
              <Link to={feature.link}>
                <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-3xl transition-all duration-300 group-hover:bg-gray-100 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-light mt-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[10px] text-gray-400 font-light mt-1">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Divider Line */}
        <div className="flex justify-center gap-2 mt-12">
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-4 h-1 rounded-full bg-gray-400"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
