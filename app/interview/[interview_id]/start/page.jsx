"use client";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { InterviewDataContext } from "../../../../context/InterviewDataContext";
import { Mic, Phone, PhoneCall, Timer } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { IconPhoneEnd } from "@tabler/icons-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "../../../interview/[interview_id]/start/_components/AlertConfirmation.jsx";
import { interviewPrompt } from "../../../../services/constants";
import axios from "axios";
function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [callStarted, setCallStarted] = useState(false);
  const [vapiError, setVapiError] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();

  // Memoize vapi instance to prevent recreation on every render
  const vapi = useMemo(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY),
    []
  );
  const { user } = useUser();

  // Set up Vapi event listeners
  useEffect(() => {
    if (!vapi) return;

    vapi.on("call-start", () => {
      console.log("Call started");
      toast("Call Connected");
      setCallStarted(true);
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      setVapiError(error.message);
      toast.error("Call error: " + error.message);
    });

    vapi.on("speech-start", () => {
      console.log("Speech has started");
      setActiveUser(false);
    });

    vapi.on("speech-end", () => {
      console.log("Speech has ended");
      setActiveUser(true);
    });

    // Move message listener inside useEffect
    vapi.on("message", (message) => {
      console.log("Message received:", message?.conversation);
      setConversation(message?.conversation);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      toast("Interview ended");
      // Add small delay to ensure conversation state is updated
      setTimeout(() => {
        GenerateFeedback();
      }, 500);
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, [vapi]);
  vapi.on("message", (message) => {
    console.log(message?.conversation);
    setConversation(message?.conversation);
    // setActiveUser(true);
  });

  const GenerateFeedback = async () => {
    const result = await axios.post("/api/ai-feedback", {
      conversation: conversation,
    });
    console.log(result?.data);
    const Content = result.data.content;
    const final_content = Content.replace("```json", "").replace("```", "");
    console.log(final_content);
    //Save to DB
  };

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  const startCall = () => {
    let questionsList = "";
    interviewInfo?.interviewData?.questionList.forEach((item, index) => {
      questionsList = item?.question + "," + questionsList;
    });
    console.log("Questions List:----------------", questionsList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        user?.firstName +
        " how are you , Ready for your interview on " +
        interviewInfo?.interviewData?.jobPosition,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "vapi",
        voiceId: "Spencer",
        fallbackPlan: {
          voices: [
            {
              provider: "cartesia",
              voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
            },
            { provider: "playht", voiceId: "jennifer" },
          ],
        },
      },
      model: {
        provider: "openai",
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `${interviewPrompt}`,
          },
        ],
        tools: [{ type: "endCall" }],
      },
      startSpeakingPlan: { waitSeconds: 2 },
      stopSpeakingPlan: {
        numWords: 1,
        voiceSeconds: 0.1,
        backoffSeconds: 0,
      },
    };

    try {
      vapi.start(assistantOptions);
      toast.success("Call started with AI Recruiter");
    } catch (err) {
      console.error("Failed to start call:", err);
      toast.error("Failed to start call");
      setVapiError("Failed to start call");
    }
  };

  const stopInterview = () => {
    try {
      vapi.stop();
      setCallStarted(false);
      toast.success("Interview ended successfully");
    } catch (err) {
      console.error("Failed to stop call:", err);
      toast.error("Failed to end interview");
    }
  };

  return (
    <div className="p-10 lg:px-48 xl:px-56 ">
      <h2 className="font-bold text-xl flex justify-between ">
        Interview
        <span className="flex items-center gap-2 ">
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white h-[400px] rounded-4xl border flex items-center justify-center">
          <div className="relative">
            {!activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
            <Image
              src={"/Ava_favicon.png"}
              height={100}
              width={100}
              className=" rounded-full object-cover"
              alt=""
            />
          </div>
        </div>

        <div className="bg-white h-[400px] rounded-4xl border flex flex-col items-center justify-center">
          <div className="relative">
            {activeUser && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
            <h2 className="bg-blue-300 text-gray-800 p-4 rounded-full">
              {user?.firstName?.[0]?.toUpperCase()}
            </h2>
            <h2 className=" text-gray-800 rounded-full">
              {typeof user?.firstName === "string" && user.firstName.length > 0
                ? user.firstName[0].toUpperCase() + user.firstName.slice(1)
                : ""}
            </h2>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-4">
        <Mic className="h-12 w-12 p-2  bg-gray-500 text-white rounded-full cursor-pointer" />
        <AlertConfirmation stopInterview={() => stopInterview()}>
          <IconPhoneEnd className="h-12 w-12 p-1  bg-red-400 text-white rounded-full cursor-pointer" />
        </AlertConfirmation>
      </div>
      <h2 className="text-gray-400 text-center">
        {callStarted ? "Interview in progress ..." : "Interview ready to start"}
      </h2>
    </div>
  );
}

export default StartInterview;
