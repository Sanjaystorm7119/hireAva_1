"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewdetailContainer from "../../_components/InterviewdetailContainer";
import CandidateList from "../../_components/CandidateList";
function InterviewDetails() {
  const { user } = useUser();
  const { interview_id } = useParams();
  const [interviewDetail, setInterviewDetail] = useState(null);

  useEffect(() => {
    if (user) {
      GetInterviewDetails();
    }
  }, [user]);

  const GetInterviewDetails = async () => {
    const { data: result } = await supabase
      .from("interviews")
      .select(
        `
              jobPosition,
              jobDescription,
              type,
              questionList,
              duration,
              interviewId,  
              created_at,
              interview_feedback:"interview-feedback"(userEmail,userName,feedback,created_at,transcript)
            `
      )

      .eq("userEmail", user.emailAddresses[0]?.emailAddress)
      .eq("interviewId", interview_id);

    // console.log(result[0]);
    setInterviewDetail(result[0] || null);
  };

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
