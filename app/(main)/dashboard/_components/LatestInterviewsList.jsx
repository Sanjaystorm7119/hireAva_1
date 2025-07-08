"use client";
import { Plus, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "./InterviewCard";
import { motion, AnimatePresence } from "framer-motion";

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    setLoading(true);
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("userEmail", user.emailAddresses[0]?.emailAddress)
      .order("id", { ascending: false })
      .limit(6);
    console.log(interviews);
    setInterviewList(interviews);
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const emptyStateVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="my-8 px-4 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="font-bold text-2xl lg:text-3xl mb-6 text-gray-800"
        variants={itemVariants}
      >
        Previous Interviews
      </motion.h2>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-40"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </motion.div>
        ) : interviewList?.length === 0 ? (
          <motion.div
            key="empty"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center justify-center p-8 lg:p-12"
          >
            <Link href={"/dashboard/create-interview"} className="group">
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 lg:p-12 flex flex-col items-center text-center max-w-md mx-auto hover:shadow-lg transition-all duration-300"
                whileHover={{
                  scale: 1.02,
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Video className="text-blue-600 w-12 h-12 lg:w-16 lg:h-16" />
                </motion.div>
                <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  No previously created interviews!
                </h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Interview
                  </Button>
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="interviews"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {interviewList.map((interview, index) => (
              <motion.div
                key={interview.id || index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <InterviewCard interview={interview} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LatestInterviewsList;
