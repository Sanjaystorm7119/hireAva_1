import React, { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import moment from "moment";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
function InterviewdetailContainer({ interviewDetail }) {
  // Add null check before accessing properties
  if (!interviewDetail) {
    return <div>Loading...</div>;
  }

  const [companySummary, setCompanySummary] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [isCompanyDetailsOpen, setIsCompanyDetailsOpen] = useState(false);
  const [isCompanySummaryOpen, setIsCompanySummaryOpen] = useState(false);

  useEffect(() => {
    const fetchCompanySummary = async () => {
      if (
        !interviewDetail?.jobPosition ||
        !interviewDetail?.jobDescription ||
        !interviewDetail?.companyDetails
      ) {
        return;
      }

      setIsSummaryLoading(true);
      setSummaryError("");
      try {
        const response = await fetch("/api/company-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobPosition: interviewDetail.jobPosition,
            jobDescription: interviewDetail.jobDescription,
            companyDetails: interviewDetail.companyDetails,
          }),
        });

        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Failed to fetch summary" }));
          throw new Error(err.error || "Failed to fetch summary");
        }

        const data = await response.json();
        setCompanySummary(data.summary || "");
      } catch (e) {
        setSummaryError(e.message || "Error generating company summary");
      } finally {
        setIsSummaryLoading(false);
      }
    };

    fetchCompanySummary();
  }, [
    interviewDetail?.jobPosition,
    interviewDetail?.jobDescription,
    interviewDetail?.companyDetails,
  ]);

  const FormattedJobDescription = ({ description }) => {
    if (!description) return null;

    const lines = description.split("\n").filter((line) => line.trim());

    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          const lineKey = `line-${index}-${trimmedLine.slice(0, 10)}`;

          if (trimmedLine.endsWith(":")) {
            return (
              <h4
                key={lineKey}
                className="font-semibold text-foreground mt-3 mb-1"
              >
                {trimmedLine}
              </h4>
            );
          }

          if (trimmedLine.match(/^[\u2022\-\*]\s/)) {
            return (
              <div key={lineKey} className="ml-4 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">
                  {trimmedLine.replace(/^[\u2022\-\*]\s/, "")}
                </span>
              </div>
            );
          }

          return (
            <p
              key={lineKey}
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
                {(() => {
                  try {
                    const types =
                      typeof interviewDetail?.type === "string"
                        ? JSON.parse(interviewDetail.type)
                        : interviewDetail?.type || [];
                    return types.map((type, index) => (
                      <li
                        key={`type-${index}-${type}`}
                        className="flex items-center"
                      >
                        <span className="mr-2">-</span>
                        <span className="capitalize">{type}</span>
                      </li>
                    ));
                  } catch (error) {
                    console.error("Error parsing interview type:", error);
                    return (
                      <li className="text-red-500">
                        Error loading interview types
                      </li>
                    );
                  }
                })()}
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
                  key={`question-${index}-${item?.question?.slice(0, 20)}`}
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
      <br />

      {/* company details and summary */}
      <Card>
        <CardContent>
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsCompanyDetailsOpen((prev) => !prev)}
          >
            <CardTitle>Company Details</CardTitle>
            {isCompanyDetailsOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          {isCompanyDetailsOpen && (
            <CardDescription className="mt-2">
              <FormattedJobDescription
                description={interviewDetail?.companyDetails}
              />
            </CardDescription>
          )}
        </CardContent>

        <CardContent>
          <div
            className="flex items-center justify-between cursor-pointer select-none"
            onClick={() => setIsCompanySummaryOpen((prev) => !prev)}
          >
            <CardTitle>Company Summary</CardTitle>
            {isCompanySummaryOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          {isCompanySummaryOpen && (
            <CardDescription className="mt-2">
              {isSummaryLoading && <span>Generating summary...</span>}
              {!isSummaryLoading && summaryError && (
                <span className="text-red-600">{summaryError}</span>
              )}
              {!isSummaryLoading && !summaryError && companySummary && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {companySummary}
                </p>
              )}
            </CardDescription>
          )}
        </CardContent>
      </Card>
      {/* company details and summary */}
    </div>
  );
}

export default InterviewdetailContainer;
