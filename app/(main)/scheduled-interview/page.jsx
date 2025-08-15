"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "../dashboard/_components/InterviewCard";
import Link from "next/link";
import { Loader, Plus, Video, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion } from "framer-motion";

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
          interview_feedback:interview-feedback(userEmail, transcript, call_id)
        `
        )
        .eq("userEmail", user.emailAddresses[0]?.emailAddress)
        .order("id", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        return;
      }

      // Debug: Log the raw data from Supabase
      console.log("=== SUPABASE DATA DEBUG ===");
      console.log("Raw data from Supabase:", data);
      if (data && data.length > 0) {
        console.log("First interview data:", data[0]);
        console.log(
          "Interview feedback structure:",
          data[0]?.interview_feedback
        );
        console.log(
          "Transcript from feedback:",
          data[0]?.interview_feedback?.[0]?.transcript
        );
      }
      console.log("=== END SUPABASE DEBUG ===");

      // console.log("Data:", data);
      setInterviewList(data || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200"
      >
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <Loader className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ opacity: 0.3 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg font-semibold text-gray-700"
          >
            Loading your interviews...
          </motion.p>
          <motion.div
            className="flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-4 flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-red-50 to-pink-100 rounded-2xl border-2 border-dashed border-red-300 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/5 to-pink-400/5"></div>
        <div className="absolute top-4 right-4 w-20 h-20 bg-red-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-200/30 rounded-full blur-xl"></div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 text-center space-y-6"
        >
          {/* Error icon */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="text-white w-8 h-8" />
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ opacity: 0.3 }}
            />
          </motion.div>

          <div className="space-y-2">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-2xl font-bold text-red-700"
            >
              Oops! Something went wrong
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-red-600 max-w-md mx-auto"
            >
              {error}
            </motion.p>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={GetInterviewList}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
            >
              <motion.div
                className="bg-white/20 p-1 rounded-full"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span>Try Again</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <motion.h2
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-bold text-2xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Interview List with Candidate Feedback
      </motion.h2>

      {interviewList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-dashed border-green-300 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5"></div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-green-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-200/30 rounded-full blur-xl"></div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative z-10 text-center space-y-6"
          >
            {/* Animated icon */}
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Video className="text-white w-10 h-10" />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ opacity: 0.3 }}
              />
            </motion.div>

            {/* Text content */}
            <div className="space-y-2">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl font-bold text-gray-800"
              >
                Start Building Your Interview Portfolio
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-600 max-w-md mx-auto"
              >
                Create interviews and track your progress with detailed feedback
                from our AI system.
              </motion.p>
            </div>

            {/* Enhanced button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href={"/dashboard/create-interview"}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
                >
                  <motion.div
                    className="bg-white/20 p-1 rounded-full"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.div>
                  <span>Create Your First Interview</span>
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.button>
              </Link>
            </motion.div>

            {/* Additional features hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-center justify-center gap-6 text-sm text-gray-500 mt-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Detailed Feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>AI Analysis</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {interviewList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14"
        >
          {interviewList.map((interview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <InterviewCard interview={interview} viewDetail={true} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ScheduledInterview;
