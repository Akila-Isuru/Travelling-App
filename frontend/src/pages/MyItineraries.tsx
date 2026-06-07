import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getMyItineraries,
  deleteItinerary,
} from "../services/itineraryService";

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItineraries = async () => {
    try {
      const res = await getMyItineraries();
      setItineraries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this itinerary?")) {
      await deleteItinerary(id);
      fetchItineraries();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <Navbar />
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h1 className="text-3xl font-light mb-6">My Itineraries</h1>
        {itineraries.length === 0 ? (
          <p className="text-center text-gray-500">
            No itineraries yet. Start by clicking "Add to Itinerary" on any
            destination.
          </p>
        ) : (
          <div className="grid gap-4">
            {itineraries.map((it) => (
              <div
                key={it._id}
                className="bg-white border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <Link
                    to={`/itinerary/${it._id}`}
                    className="text-lg font-medium hover:text-[#C9922A]"
                  >
                    {it.name}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {it.destinations.length} destinations • ${it.totalPrice} •{" "}
                    {it.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last updated: {new Date(it.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/itinerary/${it._id}`}
                    className="px-3 py-1 text-sm border rounded"
                  >
                    Edit
                  </Link>
                  {it.status === "draft" && (
                    <button
                      onClick={() => handleDelete(it._id)}
                      className="px-3 py-1 text-sm border-red-300 text-red-500 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyItineraries;
