"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
function Welcome() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <div className="flex bg-green-200 rounded-2xl justify-between items-center w-full px-2.5 py-1.5">
      <div className="">
        <p className="text-lg font-bold ">
          Welcome, {user.firstName || "User"}
        </p>
        <h2 className="text-gray-800 ">Hassle free Hiring with AI</h2>
      </div>
      <Image
        src={user.imageUrl}
        width={40}
        height={40}
        alt="userImage"
        className="h-[40px]  rounded-full "
      />
      {/* self-center --> for idividual centering vertical */}
    </div>
  );
}

export default Welcome;
