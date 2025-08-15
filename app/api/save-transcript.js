import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

export async function POST(req) {
  const { callId, interviewId, userEmail } = await req.json();

  try {
    // Fetch transcript from Vapi
    const vapiResponse = await fetch(
      `https://api.vapi.ai/v1/calls/${callId}/transcript`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        },
      }
    );

    const vapiData = await vapiResponse.json();
    console.log("Vapi transcript API response:", vapiData);

    // Transform Vapi log to UI transcript format and filter out system messages
    let transcript = [];

    if (vapiData && vapiData.length > 0) {
      transcript = vapiData
        .filter((item) => item.type === "conversation-update")
        .map((item) => {
          if (item.conversationUpdate?.role === "assistant") {
            return {
              ai_message: item.conversationUpdate.content[0]?.text || "",
              user_message: null,
              timestamp: item.conversationUpdate.timestamp,
            };
          } else if (item.conversationUpdate?.role === "user") {
            return {
              ai_message: null,
              user_message: item.conversationUpdate.content[0]?.text || "",
              timestamp: item.conversationUpdate.timestamp,
            };
          }
          return null;
        })
        .filter(Boolean);
    }

    if (transcript.length === 0) {
      transcript = [];
    }

    // **KEY FIX: Explicitly stringify the transcript to JSON**
    const transcriptJson = JSON.stringify(transcript);

    // Save transcript to interview-feedback table instead of interviews table
    const { data, error } = await supabase
      .from("interview-feedback")
      .update({
        transcript: transcriptJson,
        call_id: callId,
      })
      .eq("interview_Id", interviewId)
      .eq("userEmail", userEmail);

    if (error) {
      console.error("Error updating interview-feedback:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Transcript saved successfully",
    });
  } catch (error) {
    console.error("Error saving transcript:", error);
    return NextResponse.json(
      { error: "Failed to save transcript" },
      { status: 500 }
    );
  }
}
