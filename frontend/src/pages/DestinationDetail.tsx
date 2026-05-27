import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import { type Destination } from "../types";
import api from "../api/axiosInspector";

const DestinationDetail = () => {
  const { slug } = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/slug/${slug}`);
        setDestination(res.data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!destination)
    return <div className="pt-24 text-center">Destination not found</div>;

  return (
    <div>
      <Navbar />
      <div className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={destination.images[0]}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold">
              {destination.name}
            </h1>
            <p className="text-lg mt-2">{destination.location}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                About {destination.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {destination.description}
              </p>

              <h3 className="text-xl font-bold mt-8 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 gap-4">
                {destination.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${destination.name} ${idx + 1}`}
                    className="rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-4">Booking Information</h3>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Category:</span>{" "}
                    {destination.category}
                  </p>
                  <p>
                    <span className="font-semibold">Price per night:</span> $
                    {destination.pricePerNight}
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Book Now
                  </button>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DestinationDetail;
