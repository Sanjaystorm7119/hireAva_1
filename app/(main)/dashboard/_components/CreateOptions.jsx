"use client";
import React from "react";
import { Phone, PhoneCall, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
function CreateOptions() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Link
        href={"/dashboard/create-interview"}
        className="bg-white border border-gray-200 rounded-l-lg rounded-ee-lg p-5 cursor-pointer"
      >
        <Video
          height={60}
          width={60}
          alt="Video"
          className="p-3 text-primary bg-blue-50 rounded-lg"
        />
        <h2 className="font-bold ">Create New interview</h2>
        <p className="text-gray-500">Get Hired from ANYWHERE through AI</p>
      </Link>
      {/* <div className="bg-white border border-gray-200 rounded-r-lg rounded-ss-lg p-5">
        <PhoneCall
          height={60}
          width={60}
          alt="Video"
          className="p-3 text-primary bg-blue-50 rounded-lg"
        />
        <h2 className="font-bold ">Create Phone Screening interviews</h2>
        <p className="text-gray-500">
          Create Phone Screening interviews with candidates
        </p>
      </div> */}
    </div>
  );
}

export default CreateOptions;
