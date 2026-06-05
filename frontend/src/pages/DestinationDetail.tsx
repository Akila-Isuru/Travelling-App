import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { type Destination } from "../types";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axiosInspector";

const DestinationDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await api.get(`/destinations/slug/${slug}`);
        const dest = res.data.data;
        setDestination(dest);

        if (dest.ratingsAverage) {
          setAvgRating(dest.ratingsAverage);
          setReviewsCount(dest.ratingsQuantity || 0);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [slug]);

  useEffect(() => {
    if (destination?._id) {
      fetchReviews();
    }
  }, [destination]);

  const fetchReviews = async () => {
    if (!destination?._id) return;
    try {
      const res = await api.get(`/reviews/destination/${destination._id}`);
      const fetchedReviews = res.data.data || [];
      setReviews(fetchedReviews);
      // Recalculate average from fetched reviews (if destination doesn't have aggregated)
      if (fetchedReviews.length > 0) {
        const total = fetchedReviews.reduce(
          (sum: number, r: any) => sum + r.rating,
          0,
        );
        const avg = total / fetchedReviews.length;
        setAvgRating(Math.round(avg * 10) / 10);
        setReviewsCount(fetchedReviews.length);
      } else {
        setAvgRating(destination?.ratingsAverage || 0);
        setReviewsCount(destination?.ratingsQuantity || 0);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const calcNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    const diff =
      new Date(bookingData.checkOut).getTime() -
      new Date(bookingData.checkIn).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const totalPrice = () => {
    if (!destination) return 0;
    return calcNights() * destination.pricePerNight * bookingData.guests;
  };

  const handleBooking = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setBookingError("Please select check-in and check-out dates.");
      return;
    }
    if (calcNights() < 1) {
      setBookingError("Check-out must be after check-in.");
      return;
    }
    setBookingError("");
    setBookingLoading(true);
    try {
      await api.post("/bookings", {
        destination: destination?._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice: totalPrice(),
        specialRequests: bookingData.specialRequests,
      });
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(
        err?.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!destination)
    return (
      <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <p
          className="text-[#1a3a5c] font-light"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.5rem",
          }}
        >
          Destination not found.
        </p>
      </div>
    );

  return (
    <div className="bg-[#faf8f4] min-h-screen">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');`}</style>
      <Navbar />

      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={destination.images[activeImage] || destination.images[0]}
            alt={destination.name}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full h-full object-cover absolute inset-0"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/60 via-transparent to-transparent" />

        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9922A] to-transparent" />

        {/* Thumbnails */}
        {destination.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {destination.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-14 h-10 overflow-hidden transition-all duration-300 ${
                  i === activeImage
                    ? "ring-2 ring-[#C9922A] scale-105"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Title */}
        <div className="absolute bottom-20 left-0 right-0 px-6 md:px-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px bg-[#C9922A]" />
              <span className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light">
                {destination.category}
              </span>
            </div>
            <h1
              className="text-white font-light leading-none mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontStyle: "italic",
              }}
            >
              {destination.name}
            </h1>
            <div className="flex items-center gap-2 text-white/60 text-sm font-light">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"
                />
              </svg>
              {destination.location}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#C9922A]" />
                <span className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light">
                  About
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "2rem",
                  fontStyle: "italic",
                }}
                className="text-[#1a3a5c] font-light mb-4"
              >
                Discover {destination.name}
              </h2>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                {destination.description}
              </p>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { label: "Location", value: destination.location },
                { label: "Category", value: destination.category },
                {
                  label: "Price / Night",
                  value: `$${destination.pricePerNight}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-gray-100 p-5"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}
                >
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9922A] font-light mb-1">
                    {item.label}
                  </p>
                  <p
                    className="text-[#1a3a5c] text-sm font-light"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.1rem",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Gallery */}
            {destination.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-[#C9922A]" />
                  <span className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light">
                    Gallery
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {destination.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveImage(idx)}
                      className={`cursor-pointer overflow-hidden ${
                        idx === 0 ? "col-span-2 h-64" : "h-44"
                      } ${activeImage === idx ? "ring-2 ring-[#C9922A]" : ""}`}
                    >
                      <img
                        src={img}
                        alt={`${destination.name} ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ✅ Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-[#C9922A]" />
                  <span className="text-[#C9922A] text-[10px] tracking-[0.35em] uppercase font-light">
                    Traveler Reviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={avgRating} size={5} />
                  <span className="text-[#1a3a5c] text-sm font-light">
                    ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="mb-5 text-[#C9922A] text-[10px] tracking-[0.2em] uppercase font-light border border-[#C9922A]/30 px-4 py-2 hover:bg-[#C9922A]/5 transition-colors"
                >
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </button>
              )}

              {showReviewForm && user && (
                <div className="mb-6">
                  <ReviewForm
                    destinationId={destination._id}
                    onReviewAdded={() => {
                      fetchReviews();
                      setShowReviewForm(false);
                    }}
                  />
                </div>
              )}

              <ReviewList reviews={reviews} onReviewDeleted={fetchReviews} />
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-100 overflow-hidden"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
                }}
              >
                <div className="bg-[#0a1628] px-6 py-5">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-5 h-px bg-[#C9922A]" />
                    <span className="text-[#C9922A] text-[10px] tracking-[0.3em] uppercase font-light">
                      Reserve
                    </span>
                  </div>
                  <p
                    className="text-white font-light"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "1.6rem",
                      fontStyle: "italic",
                    }}
                  >
                    Book Your Stay
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    From{" "}
                    <span
                      className="text-[#C9922A] text-lg font-light"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      ${destination.pricePerNight}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase ml-1">
                      / night
                    </span>
                  </p>
                </div>

                <div className="px-6 py-6 space-y-4">
                  {bookingSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-12 h-12 border border-[#C9922A] flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-5 h-5 text-[#C9922A]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p
                        className="text-[#1a3a5c] font-light"
                        style={{
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "1.2rem",
                          fontStyle: "italic",
                        }}
                      >
                        Booking Confirmed!
                      </p>
                      <p className="text-gray-400 text-xs mt-2 font-light">
                        Your reservation is pending confirmation.
                      </p>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-5 w-full py-3 bg-[#1a3a5c] text-white text-[11px] tracking-[0.2em] uppercase font-light hover:bg-[#C9922A] transition-colors duration-300"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                        }}
                      >
                        View My Bookings
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">
                          Check-In
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              checkIn: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 bg-[#faf8f4] text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors"
                          style={{ borderRadius: 0 }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">
                          Check-Out
                        </label>
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          min={
                            bookingData.checkIn ||
                            new Date().toISOString().split("T")[0]
                          }
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              checkOut: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 bg-[#faf8f4] text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors"
                          style={{ borderRadius: 0 }}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">
                          Guests
                        </label>
                        <select
                          value={bookingData.guests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guests: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2.5 border border-gray-200 bg-[#faf8f4] text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors"
                          style={{ borderRadius: 0 }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} Guest{n > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-400 font-light mb-1.5">
                          Special Requests
                        </label>
                        <textarea
                          value={bookingData.specialRequests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              specialRequests: e.target.value,
                            })
                          }
                          rows={2}
                          placeholder="Any special requirements..."
                          className="w-full px-3 py-2.5 border border-gray-200 bg-[#faf8f4] text-[#1a3a5c] text-sm font-light focus:outline-none focus:border-[#C9922A] transition-colors resize-none"
                          style={{ borderRadius: 0 }}
                        />
                      </div>

                      {/* Price Summary */}
                      {calcNights() > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-t border-gray-100 pt-4 space-y-2"
                        >
                          <div className="flex justify-between text-xs font-light text-gray-400">
                            <span>
                              ${destination.pricePerNight} × {calcNights()}{" "}
                              nights × {bookingData.guests} guest
                              {bookingData.guests > 1 ? "s" : ""}
                            </span>
                            <span>${totalPrice()}</span>
                          </div>
                          <div className="flex justify-between text-sm font-light">
                            <span className="text-[#1a3a5c] tracking-wide uppercase text-[10px]">
                              Total
                            </span>
                            <span
                              className="text-[#C9922A]"
                              style={{
                                fontFamily:
                                  "'Cormorant Garamond', Georgia, serif",
                                fontSize: "1.1rem",
                              }}
                            >
                              ${totalPrice()}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {bookingError && (
                        <p className="text-red-400 text-xs font-light">
                          {bookingError}
                        </p>
                      )}

                      <button
                        onClick={handleBooking}
                        disabled={bookingLoading}
                        className="w-full py-3.5 bg-[#C9922A] text-white text-[11px] tracking-[0.25em] uppercase font-light hover:bg-[#b07d20] transition-colors duration-300 disabled:opacity-50"
                        style={{
                          clipPath:
                            "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                        }}
                      >
                        {bookingLoading ? "Processing..." : "Reserve Now"}
                      </button>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full py-2.5 border border-[#1a3a5c]/20 text-[#1a3a5c] text-[11px] tracking-[0.2em] uppercase font-light hover:border-[#C9922A] hover:text-[#C9922A] transition-colors duration-300"
                      >
                        View My Bookings
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
