"use client";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";
import { supabase } from "../../../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateInterviewLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState();
  const hasCalledAPI = useRef(false);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData && !hasCalledAPI.current) {
      hasCalledAPI.current = true;
      GenerateAIquestionList();
    }
  }, [formData]);

  const GenerateAIquestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/aimodel", {
        ...formData,
      });
      // console.log(result.data.content);
      const Content = result.data.content;
      const final_content = Content.replace("```json", "").replace("```", "");
      setQuestionList(JSON.parse(final_content)?.interviewQuestions);
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast("server error, try again");
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interviewId = uuidv4();
    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          questionList: questionList,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          interviewId: interviewId,
        },
      ])
      .select();
    setSaveLoading(false);
    // console.log(data);
    //update credits

    const userUpdate = await supabase
      .from("Users")
      .update({ credits: Number(user.Credits) - 1 })
      .eq("email", user?.userEmail)
      .select();
    // console.log(userUpdate);
    onCreateInterviewLink(interviewId);
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Preparing your interview</h2>
            <p className="text-primary font-medium  ">
              Ava is crafting personalised questions based on given
              jobDescription and position
            </p>
          </div>
        </div>
      )}
      {/* outide loading */}
      {questionList?.length > 0 && (
        <div className="p-5 border border-gray-300 rounded-2xl">
          {questionList.map((item, index) => (
            <div className="p-3 border border-gray-200 mb-3" key={index}>
              <h2 className="font-medium">{item.question}</h2>
              <h2 className="text-sm text-primary">Type: {item?.type}</h2>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end mt-2">
        <Button
          onClick={() => onFinish()}
          disabled={loading || saveLoading || !questionList?.length}
        >
          {saveLoading && <Loader2Icon className="animate-spin" />}
          Create Interview Link
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
