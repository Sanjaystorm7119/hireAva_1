import {
  ArrowLeft,
  Clock,
  Copy,
  List,
  Mail,
  Plus,
  TicketCheckIcon,
} from "lucide-react";
import React from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
function InterviewLink({interviewId, formData}) {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/${interviewId}`;

  const GetInterviewURL = () => {
    return url;
  };
  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Copied");
  };

  return (
    <div className="flex flex-col  justify-center items-center">
      <TicketCheckIcon height={100} width={100} className="w-[80px] h-[80px]" />
      <h2 className="font-bold">The interview link is ready</h2>
      <p>Share this with your candidates to start the process</p>
      <div className="w-full p-7 mt-6 rounded-xl bg-blue-300">
        <div className="flex justify-between items-center gap-2">
          <h2 className="font-bold">Interview Link</h2>
          <h2 className="p-1 px-2 text-blue-800 bg-blue-200 rounded">
            Valid for 30 Days
          </h2>
        </div>
        <div className="mt-5 flex justify-center items-center gap-2">
          <Input
            className=" border-2"
            defaultValue={GetInterviewURL()}
            disabled={true}
          />
          <Button onClick={() => onCopyLink()}>
            <Copy /> Copy Link
          </Button>
        </div>
        <hr className="my-4"></hr>

        <div className="flex gap-5 ">
          <h2 className="text-sm flex gap-2  items-center">
            <Clock className="flex h-5 w-5" /> Duration {formData?.duration}
          </h2>
          <h2 className="text-sm flex gap-2 items-center">
            <List className="h-5 w-5" /> 10 questions
          </h2>
        </div>
        <hr className="mt-2"></hr>
      </div>

      <div className="bg-amber-200 p-5 *: rounded-xl mt-5 w-full ">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold">Share Via</h2>
          <div className="flex gap-2">
            <Button className="" variant={"outline"}>
              <Mail />
              Email
            </Button>
            <Button className="" variant={"outline"}>
              <Mail />
              Slack
            </Button>
            <Button className="" variant={"outline"}>
              <Mail />
              Whatsapp
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-row gap-2 justify-between">
        <Link href={"/dashboard"}>
          <Button variant={"outline"}>
            <ArrowLeft /> Back
          </Button>
        </Link>
        <Link href={"/dashboard/create-interview"}>
          <Button>
            <Plus />
            Add interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
