import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import moment from "moment";

function CandidateTranscriptDialogBox({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);

  // Temporary debugging to see the data structure
  console.log("=== TRANSCRIPT DEBUG ===");
  console.log("Full candidate object:", candidate);
  console.log("Interview feedback:", candidate?.interview_feedback);
  console.log("Direct transcript:", candidate?.transcript);

  // Parse transcript if it's a JSON string and filter out system messages
  let transcript = [];
  try {
    // Debug: Log the candidate structure to understand the data flow
    console.log("=== TRANSCRIPT DATA DEBUG ===");
    console.log("Full candidate object:", candidate);
    console.log("Candidate keys:", Object.keys(candidate || {}));
    console.log("Candidate.feedback:", candidate?.feedback);
    console.log("Candidate.interview_feedback:", candidate?.interview_feedback);

    // Try to get transcript from different possible locations
    let rawTranscript = null;

    // First, try to get transcript from the feedback object (same pattern as CandidateFeedbackDialogBox)
    if (candidate?.feedback?.transcript) {
      rawTranscript = candidate.feedback.transcript;
      console.log(
        "Found transcript in candidate.feedback.transcript:",
        rawTranscript
      );
    }
    // Second, try to get transcript from interview_feedback array
    else if (
      candidate?.interview_feedback &&
      candidate.interview_feedback.length > 0
    ) {
      // Find the first feedback record that actually has transcript data
      const feedbackRecordWithTranscript = candidate.interview_feedback.find(
        (record) => record.transcript && record.transcript !== null
      );

      if (feedbackRecordWithTranscript) {
        console.log(
          "Found feedback record with transcript:",
          feedbackRecordWithTranscript
        );
        rawTranscript = feedbackRecordWithTranscript.transcript;
        console.log("Transcript from feedback record:", rawTranscript);
      } else {
        console.log("No feedback record with transcript found");
      }
    }
    // Fallback to direct transcript field if available
    else if (candidate?.transcript) {
      rawTranscript = candidate.transcript;
      console.log("Found transcript in candidate.transcript:", rawTranscript);
    }

    console.log("Final rawTranscript to process:", rawTranscript);

    if (!rawTranscript || rawTranscript.length === 0) {
      console.log("No raw transcript data found");
      transcript = [];
    } else if (typeof rawTranscript === "string") {
      console.log("Parsing string transcript:", rawTranscript);
      try {
        rawTranscript = JSON.parse(rawTranscript);
        console.log("Parsed transcript:", rawTranscript);
      } catch (parseError) {
        console.error("Failed to parse transcript JSON:", parseError);
        transcript = [];
        return;
      }
    }

    // Ensure rawTranscript is an array before proceeding
    if (!Array.isArray(rawTranscript)) {
      console.log("Transcript is not an array:", rawTranscript);
      transcript = [];
    } else {
      // Filter out system messages and transform to clean format
      transcript = rawTranscript
        .filter((item) => item.role !== "system") // Remove system prompts
        .map((item) => {
          if (item.role === "assistant") {
            return {
              ai_message: item.content,
              user_message: null,
              timestamp: item.timestamp || new Date().toISOString(),
              role: "assistant",
            };
          } else if (item.role === "user") {
            return {
              ai_message: null,
              user_message: item.content,
              timestamp: item.timestamp || new Date().toISOString(),
              role: "user",
            };
          }
          return null;
        })
        .filter(Boolean); // Remove null items
    }

    console.log("Final cleaned transcript:", transcript);
    console.log("=== END TRANSCRIPT DEBUG ===");
  } catch (e) {
    console.error("Error parsing transcript:", e);
    transcript = [];
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    try {
      return moment(timestamp).format("HH:mm:ss");
    } catch (e) {
      return "";
    }
  };

  const formatMessage = (message) => {
    if (!message) return "";
    // Clean up escaped characters and format the message
    return message
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .trim();
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            View Transcript
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] bg-white">
          <DialogHeader>
            <DialogTitle>Interview Transcript</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4">
                {/* Candidate Info Header */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                      {candidate.userName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {candidate.userName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Interview Date:{" "}
                        {moment(candidate.created_at).format(
                          "MMM DD, YYYY HH:mm"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duration: {transcript.length} exchanges
                  </div>
                </div>

                {/* Chat-like Transcript Container */}
                <div className="bg-gray-50 border rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                    {transcript && transcript.length > 0 ? (
                      transcript.map((message, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                          {/* AI Message */}
                          {message.role === "assistant" && (
                            <div className="flex justify-start">
                              <div className="flex items-start gap-3 max-w-[80%]">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">
                                      AI
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-blue-700">
                                      HireEva
                                    </span>
                                    {message.timestamp && (
                                      <span className="text-xs text-gray-500">
                                        {formatTimestamp(message.timestamp)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                    {formatMessage(message.ai_message)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* User Message */}
                          {message.role === "user" && (
                            <div className="flex justify-end">
                              <div className="flex items-start gap-3 max-w-[80%]">
                                <div className="bg-green-500 rounded-lg p-3 shadow-sm border border-green-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-green-700">
                                      {candidate.userName}
                                    </span>
                                    {message.timestamp && (
                                      <span className="text-xs text-gray-500">
                                        {formatTimestamp(message.timestamp)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-white whitespace-pre-wrap">
                                    {formatMessage(message.user_message)}
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-semibold">
                                      {candidate.userName?.[0]?.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No transcript available for this interview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transcript Statistics */}
                {transcript && transcript.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {transcript.length}
                      </div>
                      <div className="text-xs text-gray-600">
                        Total Exchanges
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {
                          transcript.filter((m) => m.role === "assistant")
                            .length
                        }
                      </div>
                      <div className="text-xs text-gray-600">AI Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {transcript.filter((m) => m.role === "user").length}
                      </div>
                      <div className="text-xs text-gray-600">
                        User Responses
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-lg">
                        {transcript.reduce(
                          (total, m) =>
                            total +
                            (m.ai_message?.split(" ").length || 0) +
                            (m.user_message?.split(" ").length || 0),
                          0
                        )}
                      </div>
                      <div className="text-xs text-gray-600">Total Words</div>
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CandidateTranscriptDialogBox;
