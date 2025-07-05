"use client";
import React, { useContext } from "react";
import { InterviewDataContext } from "../../../../context/InterviewDataContext";
import { Timer } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const { user } = useUser();

  return (
    <div className="p-10 lg:px-48 xl:px-56 ">
      <h2 className="font-bold text-xl flex justify-between ">
        Founding Full stack engineer role
        <span className="flex items-center gap-2 ">
          <Timer />
          00;00;00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white h-[400px] rounded-lg border flex items-center justify-center">
          <Image
            src={"/Ava_favicon.png"}
            height={100}
            width={100}
            className=" rounded-full object-cover"
            alt=""
          />
        </div>

        <div className="bg-white h-[400px] rounded-lg border flex items-center justify-center">
          {user?.firstName}
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
