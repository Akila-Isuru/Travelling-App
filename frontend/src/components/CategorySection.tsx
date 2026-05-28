import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
    slug: "wildlife",
    image: img1,
    description: "Yala National Park Safari",
    location: "Southern Province",
    duration: "Full Day",
    tag: "01",
  },
  {
    id: 2,
    name: "Safari",
    slug: "safari",
    image: img2,
    description: "Meet the gentle giants",
    location: "Minneriya",
    duration: "Half Day",
    tag: "02",
  },
  {
    id: 3,
    name: "Heritage",
    slug: "sigiriya-rock",
    image: img3,
    description: "Temple of the Tooth Relic",
    location: "Kandy",
    duration: "3–4 Hours",
    tag: "03",
  },
  {
    id: 4,
    name: "Ancient",
    slug: "ancient",
    image: img4,
    description: "Sacred historical sites",
    location: "Anuradhapura",
    duration: "Full Day",
    tag: "04",
  },
  {
    id: 5,
    name: "Pristine",
    slug: "pristine",
    image: img5,
    description: "Golden sunny beaches",
    location: "Bentota",
    duration: "Flexible",
    tag: "05",
  },
  {
    id: 6,
    name: "Cultural",
    slug: "cultural",
    image: img6,
    description: "Traditional mask art",
    location: "Ambalangoda",
    duration: "2–3 Hours",
    tag: "06",
  },
  {
    id: 7,
    name: "Coastal",
    slug: "coastal",
    image: img7,
    description: "View the vast ocean",
    location: "Galle",
    duration: "Sunset Tour",
    tag: "07",
  },
  {
    id: 8,
    name: "Tropical",
    slug: "tropical",
    image: img8,
    description: "Island paradise vibes",
    location: "Mirissa",
    duration: "Weekend",
    tag: "08",
  },
  {
    id: 9,
    name: "Spiritual",
    slug: "spiritual",
    image: img9,
    description: "Serene summit moments",
    location: "Sigiriya",
    duration: "Sunset Hours",
    tag: "09",
  },
  {
    id: 10,
    name: "Wellness",
    slug: "wellness",
    image: img10,
    description: "Ayurvedic spa treatments",
    location: "Beruwala",
    duration: "2+ Hours",
    tag: "10",
  },
  {
    id: 11,
    name: "Therapy",
    slug: "therapy",
    image: img11,
    description: "Traditional foot massage",
    location: "Colombo",
    duration: "1 Hour",
    tag: "11",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();
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

  const handleExplore = (slug: string) => {
    navigate(`/destination/${slug}`);
  };

  const current = categories[currentIndex];

  return (
    <section className="relative min-h-screen bg-[#0a1628] w-full overflow-hidden">
      <div className="relative w-full h-screen">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between pt-6 px-6 md:px-12 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="text-[#C9922A] text-xs tracking-[0.3em] uppercase font-light">
              Explore Sri Lanka
            </span>
            <div className="w-6 h-px bg-[#C9922A]/40" />
          </div>
          <div className="text-white/30 text-[11px] tracking-widest">
            <span className="text-[#C9922A]">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(categories.length).padStart(2, "0")}
          </div>
        </div>

        {/* Slides */}
        <div className="relative w-full h-full overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-16">
                <div className="max-w-2xl">
                  <span className="text-[#C9922A] text-[10px] tracking-[0.3em] uppercase border border-[#C9922A]/30 px-3 py-1">
                    {current.duration}
                  </span>
                  <h2 className="text-white font-light text-[clamp(3.5rem,10vw,7rem)] leading-none my-4 italic">
                    {current.name}
                  </h2>
                  <p className="text-white/60 text-sm mb-7">
                    {current.description}
                  </p>

                  <button
                    onClick={() => handleExplore(current.slug)}
                    className="inline-flex items-center gap-3 text-[#C9922A] text-xs tracking-[0.25em] uppercase font-light group"
                  >
                    <span>Explore {current.name}</span>
                    <div className="w-6 h-px bg-[#C9922A] group-hover:w-10 transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Buttons & Thumbs */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-30 w-10 h-10 border border-white/20 text-white/60 hover:text-[#C9922A]"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-20 top-1/2 z-30 w-10 h-10 border border-white/20 text-white/60 hover:text-[#C9922A]"
        >
          →
        </button>

        <div className="absolute right-4 top-1/2 flex flex-col gap-2 z-30">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => goTo(idx)}
              className={`w-14 h-14 ${idx === currentIndex ? "ring-1 ring-[#C9922A]" : "opacity-50"}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
