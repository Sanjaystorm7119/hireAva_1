"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Progress from "../../../../components/ui/progress";
import React, { useState, useCallback } from "react";
import FormContainer from "./_components/FormContainer";
import QuestionListComponent from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "./_components/InterviewLink";
function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [interview_Id, setInterview_Id] = useState();

  // CRITICAL : Memoize function to prevent infinite re-renders
  const onHandleInputChange = useCallback((field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      console.log("Updated form data:", newData); //  console.log to show current data
      return newData;
    });
  }, []); // Empty dependency array as we are using functional update

  const onGoToNext = () => {
    console.log("Current formData:", formData);
    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData.type
    ) {
      toast("Please enter all details");
      return;
    } else {
      setStep(step + 1);
    }
  };

  const onCreateInterviewLink = (interviewId) => {
    setInterview_Id(interviewId);
    setStep(step + 1);
  };
  return (
    <div className="mt-5 p-2.5 bg-white rounded-2xl py-2.5">
      <div className="flex gap-2 items-center  ">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create new Interview</h2>
      </div>
      <Progress value={step * 33.33} className="my-5" />
      {/* {if(step==1) ? <FormContainer onHandleInputChange={onHandleInputChange} /> : step==2?<QuestionList/>:null} */}
      {step === 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={() => onGoToNext()}
        />
      ) : step === 2 ? (
        <QuestionListComponent
          formData={formData}
          onCreateInterviewLink={(interviewId) =>
            onCreateInterviewLink(interviewId)
          }
        />
      ) : step === 3 ? (
        <InterviewLink interviewId={interview_Id} formData={formData} />
      ) : null}
    </div>
  );
}

export default CreateInterview;
