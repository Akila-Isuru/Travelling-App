import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "../assets/image-1.jpg";
import img2 from "../assets/image-2.jpg";
import img3 from "../assets/image-3.jpg";
import img4 from "../assets/image-4.jpg";
import img5 from "../assets/image-5.jpg";
import img6 from "../assets/image-6.jpg";
import img7 from "../assets/image-7.jpg";
import img8 from "../assets/image-8.jpg";
import img9 from "../assets/image-9.jpg";
import img10 from "../assets/image-10.avif";
import img11 from "../assets/image-11.avif";

const categories = [
  {
    id: 1,
    name: "Wildlife",
    image: img1,
    description: "Yala National Park Safari",
    location: "Southern Province",
    duration: "Full Day",
    tag: "01",
  },
  {
    id: 2,
    name: "Safari",
    image: img2,
    description: "Meet the gentle giants",
    location: "Minneriya",
    duration: "Half Day",
    tag: "02",
  },
  {
    id: 3,
    name: "Heritage",
    image: img3,
    description: "Temple of the Tooth Relic",
    location: "Kandy",
    duration: "3–4 Hours",
    tag: "03",
  },
  {
    id: 4,
    name: "Ancient",
    image: img4,
    description: "Sacred historical sites",
    location: "Anuradhapura",
    duration: "Full Day",
    tag: "04",
  },
  {
    id: 5,
    name: "Pristine",
    image: img5,
    description: "Golden sunny beaches",
    location: "Bentota",
    duration: "Flexible",
    tag: "05",
  },
  {
    id: 6,
    name: "Cultural",
    image: img6,
    description: "Traditional mask art",
    location: "Ambalangoda",
    duration: "2–3 Hours",
    tag: "06",
  },
  {
    id: 7,
    name: "Coastal",
    image: img7,
    description: "View the vast ocean",
    location: "Galle",
    duration: "Sunset Tour",
    tag: "07",
  },
  {
    id: 8,
    name: "Tropical",
    image: img8,
    description: "Island paradise vibes",
    location: "Mirissa",
    duration: "Weekend",
    tag: "08",
  },
  {
    id: 9,
    name: "Spiritual",
    image: img9,
    description: "Serene summit moments",
    location: "Sigiriya",
    duration: "Sunset Hours",
    tag: "09",
  },
  {
    id: 10,
    name: "Wellness",
    image: img10,
    description: "Ayurvedic spa treatments",
    location: "Beruwala",
    duration: "2+ Hours",
    tag: "10",
  },
  {
    id: 11,
    name: "Therapy",
    image: img11,
    description: "Traditional foot massage",
    location: "Colombo",
    duration: "1 Hour",
    tag: "11",
  },
];

const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = useCallback(
    (idx: number) => {
      setIsAutoPlaying(false);
      setDirection(idx > currentIndex ? 1 : -1);
      setCurrentIndex(idx);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    },
    [currentIndex],
  );

  const nextSlide = useCallback(
    () => goTo((currentIndex + 1) % categories.length),
    [currentIndex, goTo],
  );
  const prevSlide = useCallback(
    () => goTo((currentIndex - 1 + categories.length) % categories.length),
    [currentIndex, goTo],
  );

  // Preload next image
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % categories.length;
    const img = new Image();
    img.src = categories[nextIndex].image;
  }, [currentIndex]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 38 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 350, damping: 38 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  const current = categories[currentIndex];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');`}</style>

      <section className="relative min-h-screen bg-[#0a1628] w-full overflow-hidden">
        <div className="relative w-full h-screen">
          {/* Top bar - category counter */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pt-6 px-6 md:px-12 pointer-events-none">
            <div className="flex items-center gap-3">
              <span
                className="text-[#C9922A] text-xs tracking-[0.3em] uppercase font-light"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Explore Sri Lanka
              </span>
              <div className="w-6 h-px bg-[#C9922A]/40" />
            </div>
            <div className="text-white/30 text-[11px] tracking-widest">
              <span className="text-[#C9922A]">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(categories.length).padStart(2, "0")}
            </div>
          </div>

          {/* Slides */}
          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full will-change-transform"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/60 via-transparent to-transparent" />
                </div>

                {/* Slide Content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-16">
                  <div className="max-w-2xl">
                    {/* Meta tags */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[#C9922A] text-[10px] tracking-[0.3em] uppercase font-light border border-[#C9922A]/30 px-3 py-1">
                        {current.duration}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-white/50 text-[10px] tracking-widest uppercase font-light">
                        {current.location}
                      </span>
                    </div>

                    {/* Category name */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.5 }}
                      className="text-white font-light leading-none mb-2"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "clamp(3.5rem, 10vw, 7rem)",
                        fontStyle: "italic",
                      }}
                    >
                      {current.name}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="text-white/60 text-sm font-light tracking-wide mb-7"
                    >
                      {current.description}
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                      className="inline-flex items-center gap-3 text-[#C9922A] text-xs tracking-[0.25em] uppercase font-light group"
                    >
                      <span>Explore {current.name}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-px bg-[#C9922A] group-hover:w-10 transition-all duration-300" />
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Nav Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#C9922A] hover:text-[#C9922A] transition-all duration-300"
            aria-label="Previous"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Nav Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-20 md:right-28 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#C9922A] hover:text-[#C9922A] transition-all duration-300"
            aria-label="Next"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Progress dots */}
          <div className="absolute bottom-6 left-6 md:left-12 z-30 flex gap-1.5">
            {categories.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-px transition-all duration-400 ${idx === currentIndex ? "w-8 bg-[#C9922A]" : "w-4 bg-white/25 hover:bg-white/50"}`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Right Thumbnail Strip */}
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30">
            <div
              className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  onClick={() => goTo(idx)}
                  className={`relative flex-shrink-0 w-11 h-11 md:w-14 md:h-14 overflow-hidden transition-all duration-300 ${
                    idx === currentIndex
                      ? "ring-1 ring-[#C9922A] scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {idx !== currentIndex && (
                    <div className="absolute inset-0 bg-[#0a1628]/60" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CategorySection;
