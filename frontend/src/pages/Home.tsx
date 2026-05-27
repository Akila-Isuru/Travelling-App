import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import DestinationGrid from "../components/DestinationGrid";
import ItinerarySection from "../components/ItinerarySection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <CategorySection />
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Popular Destinations</h2>
        <DestinationGrid />
      </div>
      <ItinerarySection />
      <Footer />
    </div>
  );
};

export default Home;
