import React from "react";
import Image from "next/image";
import { Clock, Info, Video } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
function Interview() {
  return (
    <div className="px-10 md:px-28 lg:px-48 xl:px-64 ">
      {/* <InterviewHeader /> */}
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
        <h2 className="font-bold text-xl m-2">FULL STACK INTERVIEW</h2>
        <h2 className="flex gap-2 items-center text-gray-500 mt-3">
          <Clock className="h-4 w-4 " />
          30 Min
        </h2>
        <div className="w-full p-3">
          <h2 className="">Enter Full name</h2>
          <Input placeholder="John Doe" className="my-2" />
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
        <Button className='mt-5 w-full font-bold' >
          <Video /> Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
