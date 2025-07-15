"use client";
import axios from "axios";
import { Loader2Icon, Plus, Minus } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { supabase } from "../../../../../lib/supabase";
import { useUser } from "@clerk/nextjs";
import { v4 as uuidv4 } from "uuid";

function QuestionList({ formData, onCreateInterviewLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const hasCalledAPI = useRef(false);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "general",
  });

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
      const Content = result.data.content;
      const final_content = Content.replace("```json", "").replace("```", "");
      setQuestionList(JSON.parse(final_content)?.interviewQuestions || []);
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast("server error, try again");
      setLoading(false);
    }
  };

  const addQuestion = () => {
    if (!newQuestion.question.trim()) {
      toast("Please enter a question");
      return;
    }

    const questionToAdd = {
      ...newQuestion,
      // id: uuidv4(), // Add unique ID for easier management
    };

    setQuestionList([...questionList, questionToAdd]);
    setNewQuestion({ question: "", type: "general" });
    toast("Question added successfully");
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questionList.filter((_, i) => i !== index);
    setQuestionList(updatedQuestions);
    toast("Question removed successfully");
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const interviewId = uuidv4();

    try {
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

      if (error) {
        throw error;
      }

      // Update credits
      const userUpdate = await supabase
        .from("Users")
        .update({ credits: Number(user.Credits) - 1 })
        .eq("email", user?.userEmail)
        .select();

      if (userUpdate.error) {
        throw userUpdate.error;
      }

      toast("Interview created successfully");
      onCreateInterviewLink(interviewId);
    } catch (error) {
      console.error(error);
      toast("Error creating interview. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Preparing your interview</h2>
            <p className="text-primary font-medium">
              Eva is crafting personalised questions based on given
              jobDescription and position
            </p>
          </div>
        </div>
      )}

      {/* Question List */}
      {questionList?.length > 0 && (
        <div className="p-5 border border-gray-300 rounded-2xl">
          <h3 className="font-medium mb-3">Interview Questions</h3>
          {questionList.map((item, index) => (
            <div
              className="p-3 border border-gray-200 mb-3 rounded-lg"
              key={index}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="font-medium">{item.question}</h2>
                  <h2 className="text-sm text-primary">Type: {item?.type}</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeQuestion(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Add Question Form */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">Add Custom Question</h4>
            <div className="space-y-3">
              <Input
                placeholder="Enter your question..."
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({ ...newQuestion, question: e.target.value })
                }
                className="w-full"
              />
              <div className="flex gap-2">
                <Select
                  value={newQuestion.type}
                  onValueChange={(value) =>
                    setNewQuestion({ ...newQuestion, type: value })
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="oroblem solving">
                      Problem Solving
                    </SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={addQuestion}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </div>
          </div>
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
