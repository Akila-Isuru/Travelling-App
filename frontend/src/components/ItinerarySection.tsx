import React from "react";

const ItinerarySection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Plan Your Dream Holiday</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Each day on this island promises new experiences, discoveries, and life-long memories.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <p className="text-gray-600 text-center mb-6">
            With so much to do, let us help you with these itineraries created just for you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
              VIEW ALL ITINERARIES
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition">
              Find a Travel Agent
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition">
              Apply Sri Lankan Visa
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">🏄</div>
            <h3 className="font-bold text-lg">Adventure</h3>
            <p className="text-gray-500 text-sm">Surfing, hiking, and water sports</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">🕌</div>
            <h3 className="font-bold text-lg">Cultural</h3>
            <p className="text-gray-500 text-sm">Temples, festivals, and history</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">🍃</div>
            <h3 className="font-bold text-lg">Nature</h3>
            <p className="text-gray-500 text-sm">Wildlife, waterfalls, and tea estates</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItinerarySection;