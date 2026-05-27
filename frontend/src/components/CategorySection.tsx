import React from "react";

const categories = [
  {
    name: "WILD",
    icon: "🐘",
    color: "from-green-500 to-green-700",
    description: "Safaris & Wildlife",
  },
  {
    name: "HERITAGE",
    icon: "🏛️",
    color: "from-amber-600 to-amber-800",
    description: "Ancient Cities",
  },
  {
    name: "PRISTINE",
    icon: "🏖️",
    color: "from-cyan-500 to-blue-600",
    description: "Beaches",
  },
  {
    name: "BLISS",
    icon: "🧘",
    color: "from-purple-500 to-purple-700",
    description: "Ayurveda & Wellness",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Discover Sri Lanka
          </h2>
          <p className="text-gray-500 mt-2">
            Experience the wonders of the teardrop island
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${cat.color} p-8 text-center`}>
                <div className="text-6xl mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-white/80 text-sm">{cat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
