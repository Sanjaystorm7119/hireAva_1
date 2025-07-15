import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import moment from "moment";
import CandidateFeedbackDialogBox from "./CandidateFeedbackDialogBox";

function CandidateList({ CandidateDetails }) {
  const getRating = (candidate) => {
    if (
      !candidate.interview_feedback ||
      candidate.interview_feedback.length === 0 ||
      !candidate.interview_feedback[0]?.feedback?.feedback?.rating
        ?.OverallRating
    ) {
      return null;
    }
    return parseInt(
      candidate.interview_feedback[0].feedback.feedback.rating.OverallRating
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Candidate List ({CandidateDetails?.length || 0})
        </CardTitle>
      </CardHeader>

      <div className="px-4 pb-4">
        {CandidateDetails?.length > 0 ? (
          <div className="space-y-3">
            {CandidateDetails.map((candidate, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
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
                    <p className="text-sm text-muted-foreground">
                      Completed on:{" "}
                      {moment(candidate.created_at).format("MMM DD, YYYY")}
                    </p>
                  </div>
                </div>

                {/* Score and Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      <div
                        className={`text-lg font-semibold ${
                          parseInt(
                            candidate?.feedback?.feedback?.rating?.OverallRating
                          ) < 5
                            ? "text-red-600"
                            : parseInt(
                                candidate?.feedback?.feedback?.rating
                                  ?.OverallRating
                              ) === 5
                            ? "text-gray-600"
                            : "text-green-600"
                        }`}
                      >
                        {parseInt(
                          candidate?.feedback?.feedback?.rating?.OverallRating
                        )}
                        /10
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <CandidateFeedbackDialogBox candidate={candidate} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No candidates found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default CandidateList;
