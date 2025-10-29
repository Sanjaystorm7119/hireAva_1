"use client";
import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { InterviewDataContext } from "../../../../context/InterviewDataContext";
import { Mic, MicOff, Timer } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { IconPhoneEnd } from "@tabler/icons-react";
import { toast } from "sonner";
import Vapi from "@vapi-ai/web";
import AlertConfirmation from "../../../interview/[interview_id]/start/_components/AlertConfirmation.jsx";
import { interviewPrompt } from "../../../../services/constants";
import axios from "axios";
import { supabase } from "../../../../lib/supabase";
import { useParams, useRouter } from "next/navigation";

function StartInterview() {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [callStarted, setCallStarted] = useState(false);
  const [vapiError, setVapiError] = useState("");
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const [loading, setLoading] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [callId, setCallId] = useState(null); // Add callId state
  const [interviewPhase, setInterviewPhase] = useState("ready"); // Track interview phase: ready, briefing, questions, ended
  const [isInterrupting, setIsInterrupting] = useState(false); // Track if AI is being interrupted
  const [interruptionCount, setInterruptionCount] = useState(0); // Track interruption frequency

  // Add timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false); // Track if timer has expired
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const timerRef = useRef(null);

  const router = useRouter();

  const { interview_id } = useParams();

  // Add ref to track if feedback is being generated
  const feedbackGenerating = useRef(false);
  const conversationRef = useRef(null);
  const interruptionTimeoutRef = useRef(null);
  const lastInterruptionTime = useRef(0);

  // Memoize vapi instance to prevent recreation on every render
  const vapi = useMemo(() => {
    console.log(
      "Creating Vapi instance with key:",
      process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ? "Key present" : "Key missing"
    );
    if (!process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY) {
      console.error("VAPI_PUBLIC_KEY is missing!");
      return null;
    }
    return new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  }, []);
  const { user } = useUser();

  // Helper function to format time as MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
  };

  // Initialize timer when interview info is available
  useEffect(() => {
    if (interviewInfo?.interviewData?.duration) {
      const durationInMinutes = parseInt(interviewInfo.interviewData.duration);
      const durationInSeconds = durationInMinutes * 60;
      setTimeLeft(durationInSeconds);
    }
  }, [interviewInfo]);

  // Timer countdown effect - Modified to not auto-end interview
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerActive(false);
            setTimerExpired(true); // Mark timer as expired but don't end interview
            toast.warning(
              "Interview time expired! Please complete the current question.",
              {
                duration: 5000,
              }
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerActive, timeLeft]);

  // Clean up timer and interruption timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (interruptionTimeoutRef.current) {
        clearTimeout(interruptionTimeoutRef.current);
      }
    };
  }, []);

  // Helper function to replace programming symbols with TTS-friendly equivalents
  const replaceSymbolsForTTS = (text) => {
    if (!text) return text;

    const replacements = {
      "===": "triple equals",
      "==": "double equals",
      "!==": "not triple equals",
      "!=": "not equals",
      "++": "plus plus",
      "--": "minus minus",
      "&&": "logical and",
      "||": "logical or",
      "<=": "less than or equal to",
      ">=": "greater than or equal to",
      "=>": "arrow function",
      "...": "spread operator",
      "+=": "plus equals",
      "-=": "minus equals",
      "*=": "multiply equals",
      "/=": "divide equals",
      "%": "modulo",
      "&": "ampersand",
      "|": "pipe",
      "^": "caret",
      "~": "tilde",
      "<<": "left shift",
      ">>": "right shift",
    };

    let result = text;

    // Sort by length (longest first) to avoid partial replacements
    const sortedReplacements = Object.entries(replacements).sort(
      ([a], [b]) => b.length - a.length
    );

    sortedReplacements.forEach(([symbol, replacement]) => {
      const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      result = result.replace(new RegExp(escapedSymbol, "g"), replacement);
    });

    return result;
  };

  // Helper function to clean conversation data and filter out system messages
  const cleanConversationData = (conversation) => {
    if (!conversation) return null;

    try {
      let conversationData;

      // Parse if it's a string
      if (typeof conversation === "string") {
        conversationData = JSON.parse(conversation);
      } else {
        conversationData = conversation;
      }

      // Filter out system messages and clean the data
      const cleanedConversation = conversationData
        .filter((item) => item.role !== "system")
        .map((item) => ({
          role: item.role,
          content: item.content,
          timestamp: item.timestamp || new Date().toISOString(),
        }));

      return cleanedConversation;
    } catch (error) {
      console.error("Error cleaning conversation data:", error);
      return null;
    }
  };

  // Update conversation ref when conversation state changes
  useEffect(() => {
    conversationRef.current = conversation;
  }, [conversation]);

  // Handle conversation messages
  useEffect(() => {
    if (!vapi) return;

    const handleMessage = (message) => {
      if (message?.conversation) {
        const convoString = JSON.stringify(message?.conversation);
        // console.log("Conversation string:", convoString);
        setConversation(convoString);
      }
    };

    vapi.on("message", handleMessage);

    return () => {
      vapi.off("message", handleMessage);
    };
  }, [vapi]);

  // Set up Vapi event listeners - REMOVE conversation from dependencies
  useEffect(() => {
    if (!vapi) return;

    // Debug: Log all Vapi events to understand the data flow
    const logEvent = (eventName, data) => {
      // console.log(`=== VAPI EVENT: ${eventName} ===`);
      // console.log("Event data:", data);
      // console.log("Event data keys:", Object.keys(data || {}));
      if (data?.call) {
        // console.log("call object:", data.call);
        // console.log("call.id:", data.call.id);
      }
      // console.log(`=== END VAPI EVENT: ${eventName} ===`);
    };

    vapi.on("call-start", (callData) => {
      logEvent("call-start", callData);
      // console.log("=== VAPI CALL-START DEBUG ===");
      // console.log("Full callData:", callData);
      // console.log("CallData keys:", Object.keys(callData || {}));
      // console.log("CallData.call:", callData?.call);
      // console.log("CallData.call.id:", callData?.call?.id);
      // console.log("CallData.call.id type:", typeof callData?.call?.id);

      // Vapi is not providing callId in client events, so generate our own
      const generatedCallId = `call_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setCallId(generatedCallId);
      // console.log("Generated Call ID:", generatedCallId);
      // console.log("Current callId state after set:", generatedCallId);

      // Try to get callId from Vapi if available (fallback)
      if (callData?.call?.id) {
        setCallId(callData.call.id);
        // console.log("Vapi Call ID captured and set:", callData.call.id);
      } else if (callData?.id) {
        setCallId(callData.id);
        // console.log("Vapi Call ID (alternative path):", callData.id);
      } else {
        // console.log("Using generated Call ID:", generatedCallId);
      }
      // console.log("=== END VAPI DEBUG ===");

      toast("Call Connected");
      setCallStarted(true);
      setInterviewPhase("briefing"); // Set to briefing phase
      setIsTimerActive(true); // Start timer when call starts
    });

    // vapi.on("error", (error) => {
    //   console.error("Vapi error:", error);
    //   setVapiError(error.message);
    //   toast.error("Call error: " + error.message);
    // });

    vapi.on("speech-start", (data) => {
      logEvent("speech-start", data);
      // console.log("Speech has started");
      setActiveUser(false);

      // Debounce rapid interruptions to prevent excessive processing
      const now = Date.now();
      const timeSinceLastInterruption = now - lastInterruptionTime.current;

      if (timeSinceLastInterruption < 200) {
        // Skip if too soon after last interruption
        return;
      }

      lastInterruptionTime.current = now;
      setIsInterrupting(true);

      // Clear any existing timeout
      if (interruptionTimeoutRef.current) {
        clearTimeout(interruptionTimeoutRef.current);
      }

      // Enhanced interruption handling with better error recovery and timing
      const handleInterruption = () => {
        try {
          // Update interruption count for adaptive timing
          setInterruptionCount((prev) => prev + 1);

          // Dynamic mute duration based on interruption frequency and phase
          let muteDuration = 300;
          if (interruptionCount > 3) {
            muteDuration = 500; // Longer mute for frequent interruptions
          } else if (interviewPhase === "briefing") {
            muteDuration = 250; // Shorter mute during briefing for better responsiveness
          }

          // Mute briefly to ensure clean interruption and prevent feedback
          vapi.setMuted(true);

          // Use requestAnimationFrame for better timing precision
          requestAnimationFrame(() => {
            interruptionTimeoutRef.current = setTimeout(() => {
              vapi.setMuted(false);
              setIsInterrupting(false);
            }, muteDuration);
          });
        } catch (err) {
          console.error("Failed to interrupt AI speech:", err);

          // Fallback: Try alternative interruption methods
          try {
            // Alternative approach: mute and unmute
            vapi.setMuted(true);
            interruptionTimeoutRef.current = setTimeout(() => {
              vapi.setMuted(false);
              setIsInterrupting(false);
            }, 200);
          } catch (fallbackErr) {
            console.error("Fallback interruption failed:", fallbackErr);
            setIsInterrupting(false);
          }
        }
      };

      // Execute interruption handling
      handleInterruption();
    });

    vapi.on("speech-end", (data) => {
      logEvent("speech-end", data);
      // console.log("Speech has ended");
      setActiveUser(true);
    });

    // Track conversation updates to monitor question progress and phase changes
    vapi.on("conversation-update", (data) => {
      logEvent("conversation-update", data);
      if (data.conversationUpdate?.role === "assistant") {
        const content = data.conversationUpdate.content?.[0]?.text || "";

        // Check if we're moving from briefing to questions phase
        if (
          interviewPhase === "briefing" &&
          (content.toLowerCase().includes("let's begin") ||
            content.toLowerCase().includes("first question") ||
            content.toLowerCase().includes("let's start"))
        ) {
          setInterviewPhase("questions");
        }

        // Check if AI is asking a new question (simple heuristic)
        if (
          content.includes("?") &&
          !content.toLowerCase().includes("clarification") &&
          !content.toLowerCase().includes("ready") &&
          !content.toLowerCase().includes("proceed")
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      }
    });

    vapi.on("call-end", (callData) => {
      logEvent("call-end", callData);
      // console.log("=== VAPI CALL-END DEBUG ===");
      // console.log("Call ended with data:", callData);
      // console.log("Current callId state:", callId);
      // console.log("callData.call:", callData?.call);
      // console.log("callData.call.id:", callData?.call?.id);

      toast("Interview ended");
      setInterviewPhase("ended"); // Set to ended phase
      setIsTimerActive(false); // Stop timer when call ends
      setTimerExpired(false); // Reset timer expired state

      // Ensure we have the callId - Vapi docs show it's in event.call.id
      const finalCallId = callId || callData?.call?.id;
      // console.log("Final Call ID for transcript:", finalCallId);
      // console.log("Final Call ID type:", typeof finalCallId);
      // console.log("=== END CALL-END DEBUG ===");

      // Use the conversation from the call-end event or the current state
      const finalConversation =
        callData?.conversation || conversationRef.current;

      // Generate feedback only once using the ref flag
      if (!feedbackGenerating.current) {
        feedbackGenerating.current = true;
        setLoading(true);
        setTimeout(() => {
          GenerateFeedback(finalConversation, finalCallId);
        }, 500);
      }
    });

    return () => {
      vapi.removeAllListeners();
    };
  }, [vapi, callId]); // Add callId to dependencies

  // Prompt the user when they try to close the tab/window while a call is active.
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // If a call is in progress, show the confirmation dialog
      if (callStarted) {
        // Standard way to trigger browser confirmation
        e.preventDefault();
        e.returnValue = ""; // legacy method for Chrome

        // Attempt to stop the call gracefully
        try {
          vapi?.stop?.();
        } catch (err) {
          // ignore
          toast.error("Failed to stop call");
        }

        // Try to persist a transcript backup using sendBeacon (best-effort)
        try {
          const payload = JSON.stringify({
            callId: callId,
            interviewId: interview_id,
            userEmail: user?.primaryEmailAddress?.emailAddress,
          });

          if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: "application/json" });
            navigator.sendBeacon("/api/save-transcript", blob);
          } else {
            // Fallback: synchronous XHR (may be blocked in some browsers)
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/api/save-transcript", false);
            xhr.setRequestHeader("Content-Type", "application/json");
            try {
              xhr.send(payload);
            } catch (err) {
              // ignore
            }
          }
        } catch (err) {
          // ignore sendBeacon errors
        }
      }
      // if not callStarted, do nothing special (allow unload)
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    // pagehide/unload are additional lifecycle events where we can try a best-effort save
    window.addEventListener("pagehide", handleBeforeUnload);
    window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
    };
  }, [callStarted, callId, vapi, interview_id, user]);

  const GenerateFeedback = async (conversation, callId, retryCount = 0) => {
    const maxRetries = 3;

    try {
      // console.log("Generating feedback with conversation:", conversation);
      if (!conversation) {
        console.warn("No conversation data available for feedback");
        setLoading(false);
        return;
      }

      // Clean the conversation data and filter out system messages
      const cleanedConversation = cleanConversationData(conversation);
      if (!cleanedConversation) {
        console.warn("Failed to clean conversation data");
        setLoading(false);
        return;
      }

      // Validate conversation data before sending
      let conversationData;
      try {
        conversationData = JSON.stringify(cleanedConversation);
        // console.log("Cleaned conversation data length:", conversationData.length);
      } catch (parseError) {
        console.error("Failed to process conversation data:", parseError);
        toast.error("Invalid conversation data");
        setLoading(false);
        return;
      }

      // Show loading toast for longer operations
      const loadingToast = toast.loading("Generating feedback...", {
        id: "feedback-loading",
      });

      const requestPayload = {
        conversation: conversationData,
        interview_id: interview_id,
        user_email: user.primaryEmailAddress?.emailAddress,
        call_id: callId, // Add callId to payload
        companyDetails: interviewInfo?.interviewData?.companyDetails || "",
      };

      // console.log("Making API request to /api/ai-feedback");

      const result = await axios.post("/api/ai-feedback", requestPayload, {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("Feedback API response:", result?.data);

      const Content = result.data.content;

      if (!Content) {
        throw new Error("No content received from API");
      }

      const final_content = Content.replace("```json", "").replace("```", "");
      // console.log("Final feedback content:", final_content);

      // Validate JSON before parsing
      let feedbackData;
      try {
        feedbackData = JSON.parse(final_content);
      } catch (jsonError) {
        console.error("Failed to parse feedback JSON:", jsonError);
        console.error("Raw content:", final_content);
        throw new Error("Invalid feedback format received");
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      toast.success("Feedback generated successfully!", {
        id: "feedback-success",
      });

      const { data, error } = await supabase
        .from("interview-feedback")
        .insert([
          {
            userName: user?.firstName,
            userEmail: user.primaryEmailAddress?.emailAddress,
            interview_Id: interview_id,
            feedback: feedbackData,
            recommendation: false,
            call_id: callId, // Add callId
            transcript: conversationData, // Add cleaned transcript without system messages
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        console.error("Supabase error details:", error);
        toast.error("Failed to save feedback to database");
        return;
      }

      // console.log("Database insert successful:", data);
      // console.log("=== END DATABASE DEBUG ===");

      // Backup: Also try to save transcript using the save-transcript API if callId is available
      if (callId) {
        try {
          await axios.post("/api/save-transcript", {
            callId: callId,
            interviewId: interview_id,
            userEmail: user.primaryEmailAddress?.emailAddress,
          });
          console.log("Transcript backup saved successfully");
        } catch (transcriptError) {
          console.error("Failed to save transcript backup:", transcriptError);
          // Don't fail the whole process if transcript saving fails
        }
      }

      // console.log("Feedback saved successfully:", data);
      router.replace("/interview/" + interview_id + "/completed");
    } catch (error) {
      console.error("Error generating feedback:", error);

      // Dismiss loading toast
      toast.dismiss("feedback-loading");

      // Enhanced error handling with specific status codes
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        console.error("Server error details:", {
          status: status,
          statusText: error.response.statusText,
          data: errorData,
          headers: error.response.headers,
        });

        switch (status) {
          case 400:
            toast.error("Invalid request data. Please try again.", {
              id: "feedback-error",
            });
            break;
          case 401:
            toast.error("Authentication error. Please check your API key.", {
              id: "feedback-error",
            });
            break;
          case 429:
            const retryAfter = errorData?.retryAfter || 60;
            if (retryCount < maxRetries) {
              toast.warning(
                `Rate limit hit. Retrying in ${retryAfter} seconds...`,
                {
                  id: "feedback-retry",
                }
              );
              setTimeout(() => {
                GenerateFeedback(conversation, callId, retryCount + 1);
              }, retryAfter * 1000);
              return;
            } else {
              toast.error("Rate limit exceeded. Please try again later.", {
                id: "feedback-error",
              });
            }
            break;
          case 500:
            console.error("Server internal error:", errorData);
            if (retryCount < maxRetries) {
              toast.warning(
                `Server error. Retrying in 5 seconds... (${
                  retryCount + 1
                }/${maxRetries})`,
                {
                  id: "feedback-retry",
                }
              );
              setTimeout(() => {
                GenerateFeedback(conversation, callId, retryCount + 1);
              }, 5000);
              return;
            } else {
              toast.error("Server error persisted. Please try again later.", {
                id: "feedback-error",
              });
            }
            break;
          default:
            toast.error(`Server error (${status}). Please try again.`, {
              id: "feedback-error",
            });
        }
      } else if (error.request) {
        console.error("Network error - no response received:", error.request);
        toast.error("Network error. Please check your connection.", {
          id: "feedback-error",
        });
      } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout:", error.message);
        toast.error("Request timed out. Please try again.", {
          id: "feedback-error",
        });
      } else {
        console.error("Unexpected error:", error.message);
        toast.error(
          error.message || "Failed to generate feedback. Please try again.",
          {
            id: "feedback-error",
          }
        );
      }
    } finally {
      // Reset the flag after feedback generation is complete
      feedbackGenerating.current = false;
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("useEffect triggered - interviewInfo:", interviewInfo);
    console.log("useEffect triggered - vapi:", vapi);
    if (interviewInfo && vapi) {
      console.log("Starting call...");
      startCall();
    } else {
      console.log("Not starting call - missing interviewInfo or vapi");
    }
  }, [interviewInfo, vapi]);

  const startCall = () => {
    // Check if vapi is available
    if (!vapi) {
      console.error("Vapi instance not available");
      toast.error("Vapi not initialized. Please check your API key.");
      return;
    }

    // Build the questions list with symbol replacements for better TTS pronunciation
    const questionsList = interviewInfo?.interviewData?.questionList
      ?.map((item, index) => {
        const processedQuestion = replaceSymbolsForTTS(item?.question);
        return `${index + 1}. ${processedQuestion}`;
      })
      .join("\n");

    // console.log("Questions to ask:", questionsList);
    // console.log(interviewInfo?.interviewData?.duration);

    const companyInfoText = interviewInfo?.interviewData?.companyDetails
      ? `\n\nCompany Details:\n${interviewInfo.interviewData.companyDetails}\n\n`
      : "";

    // Calculate total questions for dynamic termination handling
    const totalQuestions =
      interviewInfo?.interviewData?.questionList?.length || 0;

    const assistantOptions = {
      name: "Eva",
      firstMessage:
        "Hi " +
        user?.firstName +
        ",<break time='800ms'/> I am Eva and I will be conducting the interview. Let me first briefly tell you about the company. " +
        (interviewInfo?.interviewData?.companySummary ||
          `Welcome to ${
            interviewInfo?.interviewData?.companyDetails || "our company"
          }. We're excited to learn more about your experience with ${
            interviewInfo?.interviewData?.jobPosition || "this position"
          }.`) +
        "<break time='1.5s'/> Please let me know if you have any questions about the company, if you'd like to reschedule this interview, or if you're ready to proceed. I'm listening for your response.",
      maxDurationSeconds: 3600 + 300,
      endCallMessage:
        "Thank you for interviewing with us Today, have a great day, bye!",

      transcriber: {
        provider: "deepgram",
        model: "nova-3",
        language: "en",
      },
      voice: {
        provider: "vapi",
        voiceId: "Spencer",
        fallbackPlan: {
          voices: [
            // {
            //   provider: "cartesia",
            //   voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
            // },
            // {
            //   provider: "cartesia",
            //   voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
            // },
            {
              provider: "vapi",
              voiceId: "Spencer",
            },
            {
              provider: "vapi",
              voiceId: "Spencer",
            },
            {
              provider: "vapi",
              voiceId: "Spencer",
            },
            {
              provider: "cartesia",
              voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d",
            },
            // {
            //   provider: "playht",
            //   voiceId: "jennifer",
            // },
          ],
        },
      },
      model: {
        provider: "openai",
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `${interviewPrompt(questionsList)}${companyInfoText}

CRITICAL INTERVIEW FLOW:

PHASE 1 - COMPANY BRIEFING & READINESS CHECK:
After delivering the company briefing, you MUST:
1. PAUSE and wait for the candidate's response
2. Listen carefully for any of these responses:
   - Questions about the company (answer briefly, then ask "Any other questions before we begin?")
   - "I'm ready" / "Let's start" / "Proceed" / "Yes" → Move to Phase 2
   - Rescheduling requests → Follow RESCHEDULING HANDLING below
   - End interview requests → Follow TERMINATION HANDLING below
3. Do NOT proceed to questions until you get clear confirmation they're ready

PHASE 2 - INTERVIEW QUESTIONS:
You must ask ONLY these specific questions in the exact order listed below. Do not deviate from these questions or ask any follow-up questions unless the candidate asks for clarification.

TOTAL QUESTIONS: ${totalQuestions}

QUESTIONS TO ASK IN ORDER:
${questionsList}

IMPORTANT RULES:
- Ask questions one by one in the exact order listed above
- Wait for the candidate's complete answer before moving to the next question
- Do not ask any other questions beyond this list
- After the candidate answers the last question, say a short closing sentence (e.g. "Thank you — that concludes the interview.") and then WAIT for 2 seconds to allow the final audio to finish playing before invoking the endCall tool.
- If a candidate's answer is unclear, you may ask them to clarify or elaborate on their response
- Keep the interview focused and professional
- IMPORTANT: Even if the allocated time has expired, continue with the interview until all questions are completed. Do not end the interview early due to time constraints.

TERMINATION HANDLING:
If the candidate expresses a clear desire to end the interview early (phrases like "I want to end the interview", "bye", "goodbye", "I'm done", "let's stop here", "I need to go", "can we end this", "I'd like to stop", "I want to stop", "end this", "finish now", "that's enough", "I'm finished", "wrap this up", "conclude now"), follow these steps:
1. Acknowledge their request: "I understand you'd like to end the interview early."
2. Ask for confirmation: "Are you sure you'd like to conclude the interview now? We still have [X] questions remaining." (Replace [X] with the actual number of remaining questions)
3. If they confirm: say : "Thank you for your time today. We'll end the interview here." Then WAIT 2 seconds and invoke the endCall tool.
4. If they want to continue: "No problem, let's continue with the next question."

RESCHEDULING HANDLING:
If the candidate wants to reschedule (phrases like "I need to reschedule", "can we reschedule", "I want to reschedule", "schedule later", "different time", "not now", "later please", "can we do this another time", "I need to postpone"):
1. Acknowledge: "I understand you'd like to reschedule this interview."
2. Confirm: "Would you like me to end this call so you can contact us to arrange a new time?"
3. If yes: "No problem. I'll end the call now. Please contact us to reschedule at your convenience. Have a great day!" Then WAIT 2 seconds and invoke the endCall tool.
4. If no: "No problem, let's continue with the interview then."

INTERRUPTION HANDLING:
- ALWAYS listen for interruptions during ANY phase
- If candidate interrupts during company brief with questions or concerns:
  - IMMEDIATELY stop speaking and listen
  - Address their question/concern directly
  - If they want to reschedule: Follow the rescheduling handling process above
  - If they have clarification questions: Answer them briefly, then ask "Any other questions before we begin the interview?"
  - If they want to end: Follow the termination handling process above
  - If they're ready: "Great! Let's begin the interview with our first question."

Keep track of which question you're currently on to provide accurate remaining question count.`,
          },
        ],
        tools: [{ type: "endCall" }],
      },
      startSpeakingPlan: { waitSeconds: 2 },
      stopSpeakingPlan: {
        numWords: 1,
        voiceSeconds: 0.1,
        // Give a short backoff to ensure final words are played before tools like endCall execute
        backoffSeconds: 2,
      },
    };
    try {
      console.log("Starting Vapi call with options:", assistantOptions);
      vapi.start(assistantOptions);
      console.log("Vapi start called successfully");
      toast.success("Call started with AI Recruiter");
    } catch (err) {
      console.error("Failed to start call:", err);
      console.error("Error details:", err.message, err.stack);
      toast.error("Failed to start call: " + err.message);
      setVapiError("Failed to start call: " + err.message);
    }
  };
  const stopInterview = () => {
    try {
      console.log("Stopping interview manually");
      vapi.stop();
      setCallStarted(false);
      setInterviewPhase("ended"); // Set to ended phase
      setIsTimerActive(false); // Stop timer when interview is stopped
      setTimerExpired(false); // Reset timer expired state
      toast.success("Interview ended successfully");
      // Don't generate feedback here - let the call-end event handle it
      // The call-end event will fire automatically when vapi.stop() is called
    } catch (err) {
      console.error("Failed to stop call:", err);
      toast.error("Failed to end interview");
    }
  };

  const toggleMicrophone = () => {
    if (!callStarted) {
      toast.error("Please start the interview first");
      return;
    }
    try {
      if (isMicMuted) {
        vapi.setMuted(false);
        setIsMicMuted(false);
        toast.success("Microphone unmuted");
      } else {
        vapi.setMuted(true);
        setIsMicMuted(true);
        toast.success("Microphone muted");
      }
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
      toast.error("Failed to toggle microphone");
    }
  };

  return (
    <div className="p-10 lg:px-48 xl:px-56 ">
      <h2 className="font-bold text-xl flex justify-between ">
        Interview
        <span className="flex items-center gap-2 ">
          <Timer />
          <span
            className={`font-mono ${
              timeLeft <= 60 && timeLeft > 0 ? "text-red-500" : ""
            } ${timerExpired ? "text-red-500 font-bold" : ""}`}
          >
            {timerExpired ? "TIME EXPIRED" : formatTime(timeLeft)}
          </span>
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="bg-white h-[400px] rounded-4xl border flex items-center justify-center">
          <div className="relative">
            {!activeUser && !isInterrupting && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
            {isInterrupting && (
              <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-75 animate-pulse"></span>
            )}
            <Image
              src={"/evaSvg.svg"}
              height={100}
              width={100}
              className={`rounded-full object-cover transition-all duration-200 ${
                isInterrupting ? "scale-95" : "scale-100"
              }`}
              alt=""
            />
            {isInterrupting && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full animate-bounce"></div>
            )}
          </div>
        </div>

        <div className="bg-white h-[400px] rounded-4xl border flex flex-col items-center justify-center">
          <div className="relative">
            {activeUser && !isMicMuted && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
            {isMicMuted && (
              <span className="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping"></span>
            )}
            <h2
              className={`p-4 rounded-full ${
                isMicMuted ? "bg-red-300" : "bg-blue-300"
              } text-gray-800`}
            >
              {user?.firstName?.[0]?.toUpperCase()}
            </h2>
            <h2 className=" text-gray-800 rounded-full">
              {typeof user?.firstName === "string" && user.firstName.length > 0
                ? user.firstName[0].toUpperCase() + user.firstName.slice(1)
                : ""}
            </h2>
            {isMicMuted && (
              <div className="mt-2 text-red-500 text-sm font-medium">
                Microphone Muted
              </div>
            )}
          </div>
        </div>
      </div>
      {!loading && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={toggleMicrophone}
            className={`h-12 w-12 p-2 rounded-full cursor-pointer transition-colors ${
              isMicMuted
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            }`}
            title={isMicMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isMicMuted ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </button>
          <AlertConfirmation stopInterview={() => stopInterview()}>
            <IconPhoneEnd className="h-12 w-12 p-1  bg-red-400 text-white rounded-full cursor-pointer" />
          </AlertConfirmation>
        </div>
      )}
      <h2 className="text-gray-400 text-center">
        {loading
          ? "Generating feedback..."
          : callStarted
          ? isMicMuted
            ? `${
                interviewPhase === "briefing"
                  ? "Company briefing (Microphone muted) - Eva is listening for your response"
                  : interviewPhase === "questions"
                  ? `Interview in progress (Microphone muted)${
                      timerExpired
                        ? " - Time expired, completing remaining questions"
                        : ""
                    }`
                  : "Interview ended (Microphone muted)"
              }`
            : isInterrupting
            ? `${
                interviewPhase === "briefing"
                  ? "Company briefing - Eva is stopping to listen to you"
                  : interviewPhase === "questions"
                  ? `Interview in progress - Eva is stopping to listen to you${
                      timerExpired
                        ? " - Time expired, completing remaining questions"
                        : ""
                    }`
                  : "Interview ended - Eva is stopping to listen to you"
              }`
            : `${
                interviewPhase === "briefing"
                  ? "Company briefing - Eva is listening for your response"
                  : interviewPhase === "questions"
                  ? `Interview in progress${
                      timerExpired
                        ? " - Time expired, completing remaining questions"
                        : ""
                    }`
                  : "Interview ended"
              }`
          : "Interview ready to start"}
      </h2>

      {callStarted && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            💡 <strong>Tip:</strong>
            • Request to reschedule ("I need to reschedule", "different time")
            <br />• End the interview ("bye", "I'm done", "stop")
          </p>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
