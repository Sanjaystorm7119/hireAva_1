"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "../dashboard/_components/InterviewCard";
import Link from "next/link";
import { Loader, Plus, Video, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

function ScheduledInterview() {
  const { user } = useUser();

  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("interviews")
        .select(
          `
          jobPosition,
          jobDescription,
          duration,
          interviewId,
          interview_feedback:interview-feedback(userEmail)
        `
        )
        .eq("userEmail", user.emailAddresses[0]?.emailAddress)
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        return;
      }

      console.log("Data:", data);
      setInterviewList(data || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
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
      className="mt-8 px-4 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="font-bold text-xl lg:text-2xl mb-6 text-gray-800"
        variants={itemVariants}
      >
        Interview List with Candidate Feedback
      </motion.h2>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-40"
          >
            <div className="flex items-center gap-3 text-blue-600">
              <Loader className="animate-spin w-6 h-6" />
              <span className="text-lg font-medium">Loading interviews...</span>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <motion.div
              className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-red-600 mb-2">Error</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={GetInterviewList}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Retry
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : interviewList.length === 0 ? (
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
                key={interview.interviewId || index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <InterviewCard interview={interview} viewDetail={true} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ScheduledInterview;
