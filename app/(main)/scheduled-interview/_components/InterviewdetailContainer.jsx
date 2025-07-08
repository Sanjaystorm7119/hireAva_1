import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import moment from "moment";
import { Calendar } from "lucide-react";
function InterviewdetailContainer({ interviewDetail }) {
  // Add null check before accessing properties
  if (!interviewDetail) {
    return <div>Loading...</div>;
  }

  const FormattedJobDescription = ({ description }) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();

          if (trimmedLine.endsWith(":")) {
            return (
              <h4
                key={index}
                className="font-semibold text-foreground mt-3 mb-1"
              >
                {trimmedLine}
              </h4>
            );
          }

          if (trimmedLine.match(/^[\u2022\-\*]\s/)) {
            return (
              <div key={index} className="ml-4 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">
                  {trimmedLine.replace(/^[\u2022\-\*]\s/, "")}
                </span>
              </div>
            );
          }

          return (
            <p
              key={index}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {trimmedLine}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">
            {interviewDetail?.jobPosition}
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction className="flex gap-1">
            <Calendar />
            Created at :{" "}
            {moment(interviewDetail?.created_at).format("MMM Do YY")}
          </CardAction>
        </CardHeader>

        <div className="flex justify-between">
          <CardContent>
            <CardTitle>Type:</CardTitle>
            <CardDescription className="mt-2">
              <ul className="list-none space-y-1">
                {JSON.parse(interviewDetail?.type).map((type, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">-</span>
                    <span className="capitalize">{type}</span>
                  </li>
                ))}
              </ul>
            </CardDescription>
          </CardContent>
          <CardContent>
            <CardTitle>Duration:</CardTitle>
            <CardDescription className="mt-2">
              {interviewDetail?.duration} Mins
            </CardDescription>
          </CardContent>
        </div>

        <CardContent>
          <CardTitle>Job Description:</CardTitle>
          <FormattedJobDescription
            description={interviewDetail?.jobDescription}
          />
        </CardContent>

        <CardContent>
          <CardTitle>Interview Questions:</CardTitle>
          <CardDescription>{interviewDetail?.questionsList}</CardDescription>
          <CardDescription>
            <div className="space-y-4 grid grid-cols-2 gap-3">
              {interviewDetail?.questionList?.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-fit">
                      Q{index + 1}:
                    </span>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-2">{item?.question}</p>
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                        {item?.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default InterviewdetailContainer;
