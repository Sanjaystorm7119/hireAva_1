"use client";
// import React from "react";
import { Plus, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
// import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "../../(main)/dashboard/_components/InterviewCard";
import { motion } from "framer-motion";

function AllInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select(
        `
      *,
      interview_feedback:interview-feedback(userEmail, transcript, call_id)
    `
      )
      .eq("userEmail", user.emailAddresses[0]?.emailAddress)
      .order("id", { ascending: false });

    // console.log(interviews);
    setInterviewList(interviews);
  };

  return (
    <div className="my-5 ">
      <h2 className="font-bold text-2xl mb-2">All Interviews</h2>
      {interviewList?.length == 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-dashed border-blue-300 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-400/5"></div>
          <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl"></div>

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
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Video className="text-white w-10 h-10" />
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
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
                Ready to Start Your First Interview?
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-600 max-w-md mx-auto"
              >
                Create your first interview session with AI-powered questions
                tailored to your needs.
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
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
                <span>AI-Powered Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real-time Feedback</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Practice Anytime</span>
              </div> */}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {interviewList && interviewList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {interviewList.map((interview, index) => {
            return <InterviewCard interview={interview} key={index} />;
          })}
        </div>
      )}
    </div>
  );
}

export default AllInterviews;
