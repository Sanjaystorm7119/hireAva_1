import {
  ArrowLeft,
  Clock,
  Copy,
  List,
  Mail,
  Plus,
  TicketCheckIcon,
  MessageSquare,
  Phone,
} from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { supabase } from "../../../../../lib/supabase";

function InterviewLink({ interviewId, formData }) {
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/${interviewId}`;

  const GetInterviewURL = () => {
    return url;
  };

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Copied");
  };

  const fetchQuestionCount = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("interviews")
        .select("questionList")
        .eq("interviewId", interviewId)
        .single();

      if (error) {
        console.error("Supabase error:", error.message || error);
        toast("Error fetching questions");
        return;
      }

      if (data && data.questionList) {
        try {
          // Parse the JSON string to get the actual array
          const questions =
            typeof data.questionList === "string"
              ? JSON.parse(data.questionList)
              : data.questionList;
          setQuestionCount(Array.isArray(questions) ? questions.length : 0);
        } catch (parseError) {
          console.error("Error parsing questionList:", parseError.message);
          setQuestionCount(0);
        }
      } else {
        setQuestionCount(0);
      }
    } catch (error) {
      console.error("Fetch error:", error.message || "Unknown error");
      toast("Error fetching questions");
      setQuestionCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch question count when component mounts
  useEffect(() => {
    if (interviewId) {
      fetchQuestionCount();
    }
  }, [interviewId]);

  return (
    <div className="flex flex-col justify-center items-center">
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
            className="border-2"
            defaultValue={GetInterviewURL()}
            disabled={true}
          />
          <Button onClick={() => onCopyLink()}>
            <Copy /> Copy Link
          </Button>
        </div>

        <hr className="my-4" />

        <div className="flex gap-5">
          <h2 className="text-sm flex gap-2 items-center">
            <Clock className="flex h-5 w-5" />
            Duration {formData?.duration} Minutes
          </h2>
          <h2 className="text-sm flex gap-2 items-center">
            <List className="h-5 w-5" />
            {loading ? "Loading..." : questionCount} questions
          </h2>
        </div>

        <hr className="mt-2" />
      </div>

      <div className="bg-amber-200 p-5 rounded-xl mt-5 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold">Share Via</h2>
          <div className="flex gap-2">
            <Button className="" variant={"outline"}>
              <Mail />
              Email
            </Button>
            <Button className="" variant={"outline"}>
              <MessageSquare />
              Slack
            </Button>
            <Button className="" variant={"outline"}>
              <Phone />
              WhatsApp
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
