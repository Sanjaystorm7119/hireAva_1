"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewdetailContainer from "../../_components/InterviewdetailContainer";
import CandidateList from "../../_components/CandidateList";

function InterviewDetails() {
  const { user } = useUser();
  const params = useParams();
  const interview_id = params?.interview_id;

  const [interviewDetail, setInterviewDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInterviewDetails = async () => {
      // Early return if no user
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data: result, error: fetchError } = await supabase
          .from("interviews")
          .select(
            `
            jobPosition,
            jobDescription,
            companyDetails,
            type,
            questionList,
            duration,
            interviewId,  
            created_at,
            interview_feedback:"interview-feedback"(userEmail,userName,feedback,created_at,transcript)
          `
          )
          .eq("userEmail", user.emailAddresses[0].emailAddress)
          .eq("interviewId", interview_id);

        if (fetchError) {
          setError(fetchError.message);
        } else {
          setInterviewDetail(result?.[0] || null);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && interview_id) {
      getInterviewDetails();
    }
  }, [user, interview_id]);

  if (isLoading) {
    return (
      <div className="mt-4">
        <h2 className="font-bold text-lg">Interview Details :</h2>
        <p className="text-gray-500 mt-2">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <h2 className="font-bold text-lg">Interview Details :</h2>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 mt-2">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="font-bold text-lg">Interview Details :</h2>
      <InterviewdetailContainer interviewDetail={interviewDetail} />
      <CandidateList
        CandidateDetails={interviewDetail?.["interview_feedback"]}
      />
    </div>
  );
}

export default InterviewDetails;
