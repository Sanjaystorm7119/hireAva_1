"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Info, Loader, Video } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { InterviewDataContext } from "../../../context/InterviewDataContext";
import { useRouter } from "next/navigation";

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
    console.log(interviews[0]);
    setInterviewInfo({
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

  // Show loading state while data is being fetched
  if (loading || !isLoaded) {
    return (
      <div className="px-10 md:px-28 lg:px-48 xl:px-64 flex justify-center items-center min-h-screen">
        <div className="text-center animate-pulse">
          <Loader className="animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-64 ">
      <div
        className="flex flex-col justify-center items-center 
      border rounded-xl bg-white p-7 sm:px-10 md:px-16 lg:px-20 xl:px-30"
      >
        <Image
          width={100}
          height={100}
          className="h-[50px] w-[50px]"
          src={"../Ava_icon_32.svg"}
          alt="Ava_icon_32"
        />
        <h2 className="font-bold text-xl m-2">{interviewData?.jobPosition}</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4 " />
          {interviewData?.duration} Minutes
        </h2>

        {/* Display user info instead of input */}
        <div className="w-full p-3">
          <h2 className="font-semibold">Interview Candidate</h2>
          <div className="my-2 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{userData?.firstname}</p>
            <p className="text-sm text-gray-600">{userData?.email}</p>
          </div>
        </div>

        <div className="flex flex-col bg-blue-200 p-7 rounded-xl">
          <h2 className="flex gap-3 font-bold">
            <Info />
            Before you Begin
          </h2>
          <ul>
            <li> - Test Your Camera and Microphone </li>
            <li> - Ensure stable Internet Connection</li>
            <li> - Find a Quiet place for interview</li>
          </ul>
        </div>
        <Button
          onClick={() => onJoinInterview()}
          className="mt-5 w-full font-bold"
        >
          <Video /> Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
