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
import Progress from "../../../../components/ui/progress";
import { useState } from "react";
import CandidateTranscriptDialogBox from "./CandidateTranscriptDialogBox";

function CandidateFeedbackDialogBox({ candidate }) {
  const [isOpen, setIsOpen] = useState(false);
  const feedback = candidate?.feedback?.feedback;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            View Report
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4">
                {/* Candidate Info Card */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center text-white font-semibold">
                      {candidate.userName?.[0]?.toUpperCase()}
                    </div>

                    {/* Candidate Info */}
                    <div>
                      <h3 className="font-medium text-foreground">
                        {candidate.userName}
                      </h3>
                      <h3 className="font-medium text-foreground">
                        {candidate.userEmail}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Completed on:{" "}
                        {moment(candidate.created_at).format("MMM DD, YYYY")}
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        feedback?.rating?.OverallRating < 5
                          ? "text-red-600"
                          : feedback?.rating?.OverallRating > 6 &&
                            feedback?.rating?.OverallRating <= 10
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {feedback?.rating?.OverallRating}/10
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Skills Assessment */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="mb-4 font-bold text-lg">Skills Assessment</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center gap-3">
                      <span className="font-medium min-w-0">
                        Technical Skills
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <Progress
                          value={feedback?.rating?.technicalSkills * 10}
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-fit">
                          {feedback?.rating?.technicalSkills}/10
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="font-medium min-w-0">
                        Communication Skills
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <Progress
                          value={feedback?.rating?.communicationSkills * 10}
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-fit">
                          {feedback?.rating?.communicationSkills}/10
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="font-medium min-w-0">
                        Problem Solving Skills
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <Progress
                          value={feedback?.rating?.problemSolving * 10}
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-fit">
                          {feedback?.rating?.problemSolving}/10
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <span className="font-medium min-w-0">Experience</span>
                      <div className="flex items-center gap-2 flex-1">
                        <Progress
                          value={feedback?.rating?.experience * 10}
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-fit">
                          {feedback?.rating?.experience}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-white p-4 rounded-lg border">
                  <h2 className="font-bold text-lg mb-3">
                    Performance Summary
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {feedback?.summary?.map((summary, index) => (
                      <li key={index} className="text-sm">
                        {summary}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation Message */}
                <div
                  className={`p-4 rounded-lg border ${
                    feedback?.Recommendation?.trim().toLowerCase() ===
                    "not recommended"
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <h2 className="font-bold text-lg mb-2">
                    Recommendation Message
                  </h2>
                  <p className="text-sm">{feedback?.RecommendationMessage}</p>
                </div>

                {/* Verdict */}
                <div
                  className={`p-4 rounded-lg border ${
                    feedback?.Recommendation?.trim().toLowerCase() ===
                    "not recommended"
                      ? "bg-red-50 border-red-200"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <h2 className="font-bold text-lg mb-2">Verdict</h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      feedback?.Recommendation?.trim().toLowerCase() ===
                      "not recommended"
                        ? "bg-red-200 text-red-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {feedback?.Recommendation}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <CandidateTranscriptDialogBox candidate={candidate} />
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CandidateFeedbackDialogBox;
