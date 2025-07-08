"use client";
import React from "react";
import { Phone, PhoneCall, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

function CreateOptions() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Link
          href={"/dashboard/create-interview"}
          className="block group"
        >
          <motion.div
            className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 h-full"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="mb-4"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Video
                height={60}
                width={60}
                className="p-3 text-blue-600 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300"
              />
            </motion.div>
            <h2 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
              Create New Interview
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Get Hired from ANYWHERE through AI
            </p>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.div
          className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 opacity-60 h-full relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
          <div className="relative z-10">
            <div className="mb-4">
              <PhoneCall
                height={60}
                width={60}
                className="p-3 text-gray-400 bg-gray-200 rounded-lg"
              />
            </div>
            <h2 className="font-bold text-lg mb-2 text-gray-500">
              Phone Screening Interviews
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create Phone Screening interviews with candidates
            </p>
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default CreateOptions;