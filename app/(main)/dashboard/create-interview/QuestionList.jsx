"use client";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (formData) {
      if (formData) {
        GenerateAIquestionList;
      }
    }
  }, [formData]);
  const GenerateAIquestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });
      console.log(result);
    } catch (e) {
      toast("server error, try again");
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border-gray-100 flex gap-5 items-center">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2>Generating Questions</h2>
            <p>
              Ava is crafting personalised questions based on jobDescription and
              position
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
