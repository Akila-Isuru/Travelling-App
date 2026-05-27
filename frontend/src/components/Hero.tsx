import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* YouTube Background Video - Clean, No Controls */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
          src="https://www.youtube.com/embed/TlypXY8OOIQ?autoplay=1&mute=1&loop=1&playlist=TlypXY8OOIQ&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&color=white&start=0"
          title="Sri Lanka Tourism Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* Blue tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent mix-blend-overlay"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide drop-shadow-2xl animate-fade-in">
          AN ISLAND ESCAPE
          <span className="block text-3xl md:text-5xl mt-2 drop-shadow-xl">
            AWAITS YOU
          </span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100 drop-shadow-lg animate-fade-in-up">
          Discover the Pearl of the Indian Ocean - Where ancient heritage meets
          pristine beaches
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <Link
            to="/destinations"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Destinations
          </Link>
          <button
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=TlypXY8OOIQ",
                "_blank",
              )
            }
            className="border-2 border-white hover:bg-white hover:text-blue-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Watch Video
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10">
        <svg
          className="w-6 h-6 text-white drop-shadow-lg"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;