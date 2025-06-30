"use client";
import { Camera, Plus, Video } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl mb-2">Previous Interviews</h2>

      {interviewList?.length == 0 && (
        <Link href={"/dashboard/create-interview" } className="p-5 flex flex-col gap-3 items-center  ">
          <Video className="text-primary" />
          <h2 className="">No previously created interviews !!</h2>
          <Button className="bg-blue-400">
            
            <Plus /> Create New Interview
          </Button>
        </Link>
      )}
      
    </div>
  );
}


export default LatestInterviewsList;

