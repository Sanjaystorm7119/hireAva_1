"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Info, Loader, Video, CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { InterviewDataContext } from "../../../context/InterviewDataContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

function Interview() {
  const { interview_id } = useParams();
  const { user, isLoaded } = useUser();
  const [interviewData, setInterviewData] = useState();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  useEffect(() => {
    if (interview_id && isLoaded) {
      getInterviewDetails();
      if (user) {
        getUserDetails();
      }
    }
  }, [interview_id, isLoaded, user]);

  const getInterviewDetails = async () => {
    setLoading(true);
    try {
      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("jobPosition,jobDescription,duration")
        .eq("interviewId", interview_id);
      setInterviewData(interviews[0]);
      setLoading(false);
      if (interviews?.length == 0) {
        toast("Invalid Interview Link ");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  const onJoinInterview = async () => {
    setLoading(true);
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interviewId", interview_id);
    // console.log(interviews[0]);
    setInterviewInfo({
      // firstname: user.firstName,
      // email: user.emailAddresses[0]?.emailAddress,
      interviewData: interviews[0],
    });
    router.push(`/interview/${interview_id}/start`);
    setLoading(false);
  };

  const getUserDetails = async () => {
    try {
      let { data: users, error } = await supabase
        .from("Users")
        .select("firstname, email")
        .eq("clerk_user_id", user.id)
        .single();

      if (error) throw error;
      setUserData(users);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Fallback to Clerk data if not found in Users table
      setUserData({
        firstname: user.firstName,
        email: user.emailAddresses[0]?.emailAddress,
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pulseVariants = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Show loading state while data is being fetched
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="h-8 w-8 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600 font-medium">
            Loading interview details...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <motion.div className="text-center" variants={itemVariants}>
              <motion.div
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                  src="/evaSvg.svg"
                  alt="eva_icon_32"
                />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {interviewData?.jobPosition}
              </h1>
              <div className="flex items-center justify-center gap-2 text-blue-100">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {interviewData?.duration} Minutes
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 lg:p-10 space-y-8">
            {/* Candidate Information */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Interview Candidate
              </h2>
              <motion.div
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {userData?.firstname?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {userData?.firstname}
                    </p>
                    <p className="text-gray-600">{userData?.email}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Pre-Interview Guidelines */}
            <motion.div variants={itemVariants}>
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h2 className="flex items-center gap-3 font-bold text-blue-800 text-lg mb-4">
                  <Info className="h-6 w-6" />
                  Before you Begin
                </h2>
                <div className="space-y-3">
                  {[
                    { icon: "🎤", text: "Test Your Microphone" },
                    { icon: "🌐", text: "Ensure stable Internet Connection" },
                    { icon: "🔇", text: "Find a Quiet place for interview" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.text}</span>
                      <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Join Interview Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={pulseVariants}
              >
                <Button
                  onClick={() => onJoinInterview()}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Video className="h-5 w-5" />
                  )}
                  {loading ? "Joining..." : "Join Interview"}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Interview;
