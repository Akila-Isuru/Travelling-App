import React from "react";

const Footer = () => {
  const quickLinks = [
    "Terms of Use", "Site Map", "Contact Us", "Investor Relations Unit",
    "Complaints", "Tenders", "Important Notices", "How to Fly Your Drone Legitimately"
  ];

  const otherSites = [
    "Sri Lanka Tourism Development Authority",
    "Sri Lanka Tourism Convention Bureau",
    "Sri Lanka Institute of Tourism & Hotel Management",
    "Ministry of Foreign Affairs",
    "Ministry of Tourism",
    "Sri Lanka Airport & Aviation Services",
    "Department of Immigration and Emigration",
    "Electronic Travel Authorization System"
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🇱🇰</span>
              </div>
              <span className="font-bold text-xl text-white">Sri Lanka Tourism</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Tourism Hotline:</span>
                <span className="text-blue-400">1912</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Ambulance Service:</span>
                <span className="text-red-400">1990</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a key={link} href="#" className="text-sm hover:text-blue-400 transition">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <h4 className="text-white font-semibold mb-3">Other Sites</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
            {otherSites.map((site) => (
              <a key={site} href="#" className="text-xs hover:text-blue-400 transition">
                {site}
              </a>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-800">
            <p>© 2026 All Rights Reserved by Sri Lanka Tourism Promotion Bureau</p>
            <p className="mt-1">Developed by Sri Lanka Tourism Development Authority ICT Department.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-blue-400">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;