"use client";
// import React from "react";
import { Plus, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import InterviewCard from "../../(main)/dashboard/_components/InterviewCard";

function AllInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getInterviewList();
  }, [user]);

  const getInterviewList = async () => {
    let { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("userEmail", user.emailAddresses[0]?.emailAddress)
      .order("id", { ascending: false });

    console.log(interviews);
    setInterviewList(interviews);
  };

  return (
    <div className="my-5 ">
      <h2 className="font-bold text-2xl mb-2">All Interviews</h2>
      {interviewList?.length == 0 && (
        <Link
          href={"/dashboard/create-interview"}
          className="p-5 flex flex-col gap-3 items-center  "
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
