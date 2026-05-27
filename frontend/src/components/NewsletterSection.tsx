import React, { useState } from "react";
import { motion } from "framer-motion";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thank you for subscribing!");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-light">
            Stay Updated
          </span>
          <h2 className="text-2xl md:text-3xl font-light mt-2 text-gray-800">
            Subscribe to Newsletter
          </h2>
          <p className="text-sm text-gray-500 font-light mt-3 max-w-md mx-auto">
            Get travel tips, exclusive offers, and destination guides
          </p>
          
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 text-sm font-light bg-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-800 text-white rounded-full text-sm font-light hover:bg-gray-700 transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;