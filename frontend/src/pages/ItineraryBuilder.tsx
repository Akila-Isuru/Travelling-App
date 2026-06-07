import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";

import {
  getItineraryById,
  updateItineraryDestination,
  removeFromItinerary,
  bookItinerary,
  initiateItineraryPayment,
} from "../services/itineraryService";
import { getDestinationBySlug } from "../services/destinationService";
import { useAuth } from "../hooks/useAuth";
import ItineraryMap from "../components/ItineraryMap";

const ItineraryBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      const res = await getItineraryById(id!);
      setItinerary(res.data);
    } catch (err) {
      console.error(err);
      navigate("/my-itineraries");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (index: number, field: string, value: any) => {
    setUpdating(true);
    try {
      const updates = { [field]: value };
      await updateItineraryDestination(itinerary._id, index, updates);
      await fetchItinerary();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (index: number) => {
    if (!confirm("Remove this destination?")) return;
    setUpdating(true);
    try {
      await removeFromItinerary(itinerary._id, index);
      await fetchItinerary();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleBookAll = async () => {
    if (!confirm("Book all destinations? You will be redirected to payment."))
      return;
    setUpdating(true);
    try {
      // 1. Create all bookings (status = pending)
      const res = await bookItinerary(itinerary._id);
      const itineraryId = res.data.itinerary._id; // or res.data.itineraryId

      // 2. Initiate payment for the total itinerary amount
      const paymentData = await initiateItineraryPayment(itineraryId);

      // 3. Start PayHere popup
      const payhere = (window as any).payhere;
      if (!payhere) {
        alert("Payment gateway not loaded. Please refresh.");
        return;
      }

      payhere.onCompleted = (orderId: string) => {
        console.log("Payment completed for itinerary:", orderId);
        navigate("/dashboard");
      };
      payhere.onDismissed = () => {
        alert(
          "Payment cancelled. Your itinerary bookings are saved as pending.",
        );
        navigate("/my-itineraries");
      };
      payhere.onError = (error: any) => {
        console.error("Payment error:", error);
        alert("Payment error occurred. Please contact support.");
        setUpdating(false);
      };

      payhere.startPayment(paymentData);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!itinerary) return <div>Itinerary not found</div>;

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <Navbar />
      <div className="pt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-light">{itinerary.name}</h1>
          <button
            onClick={() => navigate("/my-itineraries")}
            className="text-sm text-gray-500 hover:text-[#C9922A]"
          >
            ← Back to My Itineraries
          </button>
        </div>

        <div className="mb-8">
          <ItineraryMap
            destinations={itinerary.destinations.map(
              (d: any) => d.destinationId,
            )}
          />
        </div>

        {/* Destinations list */}
        <div className="space-y-4">
          {itinerary.destinations.map((item: any, idx: number) => {
            const dest = item.destinationId;
            return (
              <motion.div key={idx} className="bg-white border p-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{dest.name}</h3>
                    <p className="text-sm text-gray-500">{dest.location}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(idx)}
                    className="text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={item.checkIn?.split("T")[0]}
                      onChange={(e) =>
                        handleUpdate(idx, "checkIn", e.target.value)
                      }
                      className="w-full border p-1 text-sm"
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={item.checkOut?.split("T")[0]}
                      onChange={(e) =>
                        handleUpdate(idx, "checkOut", e.target.value)
                      }
                      className="w-full border p-1 text-sm"
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.guests}
                      onChange={(e) =>
                        handleUpdate(idx, "guests", parseInt(e.target.value))
                      }
                      className="w-full border p-1 text-sm"
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400">
                      Transport
                    </label>
                    <select
                      value={item.transportMode}
                      onChange={(e) =>
                        handleUpdate(idx, "transportMode", e.target.value)
                      }
                      className="w-full border p-1 text-sm"
                      disabled={updating}
                    >
                      <option value="car">Car</option>
                      <option value="train">Train</option>
                      <option value="bus">Bus</option>
                      <option value="flight">Flight</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2 text-right text-sm">
                  <span className="text-gray-500">Price: </span>
                  <span className="text-[#C9922A] font-medium">
                    $
                    {(
                      ((new Date(item.checkOut).getTime() -
                        new Date(item.checkIn).getTime()) /
                        (1000 * 60 * 60 * 24)) *
                      dest.pricePerNight *
                      item.guests
                    ).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total and Book All */}
        <div className="mt-8 bg-white p-4 border-t-2 flex justify-between items-center">
          <div>
            <span className="text-gray-500">Total for all destinations:</span>
            <span className="text-2xl font-bold text-[#C9922A] ml-2">
              ${itinerary.totalPrice}
            </span>
          </div>
          <button
            onClick={handleBookAll}
            disabled={updating || itinerary.destinations.length === 0}
            className="px-6 py-3 bg-[#C9922A] text-white uppercase text-sm tracking-wider disabled:opacity-50"
          >
            {updating ? "Processing..." : "Book All"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItineraryBuilder;
