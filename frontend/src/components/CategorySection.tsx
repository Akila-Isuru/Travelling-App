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
    name: "WILDLIFE",
    image: img1,
    description: "Yala National Park Safari",
    location: "Southern Province",
    duration: "Full Day",
  },
  {
    id: 2,
    name: "SAFARI",
    image: img2,
    description: "Meet the gentle giants",
    location: "Minneriya",
    duration: "Half Day",
  },
  {
    id: 3,
    name: "HERITAGE",
    image: img3,
    description: "Temple of the Tooth Relic",
    location: "Kandy",
    duration: "3-4 Hours",
  },
  {
    id: 4,
    name: "ANCIENT",
    image: img4,
    description: "Sacred historical sites",
    location: "Anuradhapura",
    duration: "Full Day",
  },
  {
    id: 5,
    name: "PRISTINE",
    image: img5,
    description: "Golden sunny beaches",
    location: "Bentota",
    duration: "Flexible",
  },
  {
    id: 6,
    name: "CULTURAL",
    image: img6,
    description: "Traditional mask art",
    location: "Ambalangoda",
    duration: "2-3 Hours",
  },
  {
    id: 7,
    name: "COASTAL",
    image: img7,
    description: "View the vast ocean",
    location: "Galle",
    duration: "Sunset Tour",
  },
  {
    id: 8,
    name: "TROPICAL",
    image: img8,
    description: "Island paradise vibes",
    location: "Mirissa",
    duration: "Weekend",
  },
  {
    id: 9,
    name: "SPIRITUAL",
    image: img9,
    description: "Serene sunset moments",
    location: "Sigiriya",
    duration: "Sunset Hours",
  },
  {
    id: 10,
    name: "WELLNESS",
    image: img10,
    description: "Ayurvedic spa treatments",
    location: "Beruwala",
    duration: "2+ Hours",
  },
  {
    id: 11,
    name: "THERAPY",
    image: img11,
    description: "Traditional foot massage",
    location: "Colombo",
    duration: "1 Hour",
  },
];

const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide with smoother timing
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = useCallback(() => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prevSlide = useCallback(() => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Smoother slide variants with will-change for performance
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 },
        opacity: { duration: 0.4, ease: "easeOut" },
        scale: { duration: 0.4, ease: "easeOut" },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 400, damping: 40, mass: 0.8 },
        opacity: { duration: 0.3, ease: "easeIn" },
        scale: { duration: 0.3, ease: "easeIn" },
      },
    }),
  };

  // Preload next image for smoother transition
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % categories.length;
    const img = new Image();
    img.src = categories[nextIndex].image;
  }, [currentIndex]);

  return (
    <section className="relative min-h-screen bg-black w-full overflow-hidden">
      
      {/* Full Screen Carousel */}
      <div className="relative w-full h-screen">
        
        {/* Header - Top Center */}
        <div className="absolute top-0 left-0 right-0 z-30 text-center pt-8 md:pt-12 px-4 pointer-events-none">
          <div className="inline-block mb-3">
            <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
              <span className="text-xs md:text-sm uppercase tracking-wider text-white/90">
                Discover Paradise
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
            Explore
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              {" "}Sri Lanka
            </span>
          </h2>
          
          <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-400 to-red-400 mx-auto rounded-full" />
        </div>

        {/* Navigation Buttons - Left and Right */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full p-3 md:p-4 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Main Slides - Optimized for smoothness */}
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
              style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            >
              {/* Background Image with GPU acceleration */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={categories[currentIndex].image}
                  alt={categories[currentIndex].name}
                  className="w-full h-full object-cover object-center will-change-transform"
                  style={{ imageRendering: "auto" }}
                  loading="eager"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
              </div>

              {/* Content - Bottom Left */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 lg:p-16">
                <div className="max-w-4xl">
                  {/* Tags */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs md:text-sm text-white border border-white/20">
                      {categories[currentIndex].duration}
                    </span>
                    <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-xs md:text-sm text-white border border-white/20">
                      {categories[currentIndex].location}
                    </span>
                  </div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-3 tracking-tighter"
                  >
                    {categories[currentIndex].name}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-base md:text-lg text-gray-200 mb-5 max-w-2xl"
                  >
                    {categories[currentIndex].description}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white font-semibold text-sm md:text-base shadow-2xl"
                  >
                    <span>Explore {categories[currentIndex].name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? "w-8 bg-yellow-400" 
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Navigation - RIGHT SIDE CORNER */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30">
          <div 
            className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto py-2 px-1"
            style={{ 
              scrollbarWidth: "thin", 
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {categories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 ${
                  idx === currentIndex 
                    ? "ring-3 ring-yellow-400 scale-110 shadow-2xl" 
                    : "ring-1 ring-white/40 hover:ring-white/80 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                  idx === currentIndex ? "opacity-0" : "opacity-100"
                }`}>
                  <span className="text-white text-[10px] md:text-xs font-bold text-center px-1 leading-tight">
                    {cat.name.split(" ")[0].substring(0, 4)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
          <div className="w-5 h-8 border border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-1.5 bg-white/40 rounded-full mt-1.5 animate-ping" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;