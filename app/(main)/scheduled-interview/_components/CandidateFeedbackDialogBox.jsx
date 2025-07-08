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

function CandidateFeedbackDialogBox({ candidate }) {
  const feedback = candidate?.feedback?.feedback;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            View Report
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription asChild>
              <div>
                {/* <h2>{candidate.userName}</h2> */}
                <div
                  // key={index}
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
                      <h3 className="font-medium text-foreground">
                        {candidate.userEmail}
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
                      <div
                        className={`text-lg font-semibold ${
                          feedback?.rating?.OverallRating < 5
                            ? "text-red-600"
                            : feedback?.rating?.OverallRating === 5
                            ? "text-gray-600"
                            : "text-green-600"
                        }`}
                      >
                        {feedback?.rating?.OverallRating}/10
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rating
                      </div>
                    </div>
                    {/* <CandidateFeedbackDialogBox candidate={candidate} /> */}
                  </div>
                </div>
                <div>
                  <h2 className="m-2 font-bold">Skills Assessment</h2>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <h2 className="flex justify-between items-center gap-5 ">
                      Technical Skils{" "}
                      <Progress
                        value={feedback?.rating?.technicalSkills * 10}
                      />{" "}
                      <span>{feedback?.rating?.technicalSkills}/10</span>
                    </h2>
                    {/* <hr></hr> */}
                    <h2 className="flex justify-between items-center gap-5">
                      Communication Skils{" "}
                      <Progress
                        value={feedback?.rating?.communicationSkills * 10}
                      />{" "}
                      <span>{feedback?.rating?.communicationSkills}/10</span>
                    </h2>
                    {/* <hr></hr> */}
                    <h2 className="flex justify-between items-center gap-5">
                      Problem Solving Skils{" "}
                      <Progress value={feedback?.rating?.problemSolving * 10} />{" "}
                      <span>{feedback?.rating?.problemSolving}/10</span>
                    </h2>
                    <h2 className="flex justify-between items-center gap-5">
                      Experience{" "}
                      <Progress value={feedback?.rating?.experience * 10} />{" "}
                      <span>{feedback?.rating?.experience}/10</span>
                    </h2>
                  </div>
                  <div className="mt-5">
                    <h2 className="font-bold">Performance Summary</h2>
                    <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
                      {feedback?.feedback?.summary?.map((summary, index) => (
                        <li key={index}>
                          <p>{summary}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={`m-2 p-5 rounded-md ${
                      feedback?.Recommendation?.trim().toLowerCase() ===
                      "not recommended"
                        ? "bg-red-200"
                        : "bg-green-200"
                    }`}
                  >
                    <h2 className="font-extrabold">
                      Recommendation message :{" "}
                    </h2>
                    <br></br>
                    <h2>{feedback?.RecommendationMessage}</h2>
                  </div>
                  <div
                    className={`m-2 p-5 rounded-md ${
                      feedback?.Recommendation?.trim().toLowerCase() ===
                      "not recommended"
                        ? "bg-red-200"
                        : "bg-green-200"
                    }`}
                  >
                    <h2 className="font-extrabold">Verdict : </h2>
                    <br></br>
                    <span className="p-1 bg-gray-200 rounded-lg font-bold">
                      {feedback?.Recommendation}
                    </span>
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
