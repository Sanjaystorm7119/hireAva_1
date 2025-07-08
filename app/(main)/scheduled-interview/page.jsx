"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "../dashboard/_components/InterviewCard";
import Link from "next/link";
import { Loader, Plus, Video } from "lucide-react";
import { Button } from "../../../components/ui/button";

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

  if (loading) {
    return (
      <div className="mt-4">
        Loading interview ...
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h2 className="font-bold text-xl text-red-600">Error</h2>
        <p>{error}</p>
        <Button onClick={GetInterviewList} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="font-bold text-xl">
        Interview List with Candidate feedback
      </h2>

      {interviewList.length === 0 && (
        <Link
          href={"/dashboard/create-interview"}
          className="p-5 flex flex-col gap-3 items-center"
        >
          <div>
            <Video className="text-primary" />
            <h2 className="">No previously created interviews !!</h2>
            <Button className="bg-blue-400">
              <Plus /> Create New Interview
            </Button>
          </div>
        </Link>
      )}

      {interviewList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
          {interviewList.map((interview, index) => {
            return (
              <InterviewCard
                interview={interview}
                key={index}
                viewDetail={true}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScheduledInterview;
