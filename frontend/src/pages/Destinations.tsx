import React from "react";
import Navbar from "../components/Navbar";
import DestinationGrid from "../components/DestinationGrid";
import Footer from "../components/Footer";

const Destinations = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">Discover Sri Lanka</h1>
            <p className="text-gray-500 mt-2">Find your perfect destination in the pearl of the Indian Ocean</p>
          </div>
          <DestinationGrid />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Destinations;