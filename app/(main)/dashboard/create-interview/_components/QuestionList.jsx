"use client";
import axios from "axios";
import { Loader2Icon, Plus, Minus, GripVertical, Save } from "lucide-react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Question Item Component
function SortableQuestionItem({ item, index, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 border border-gray-200 mb-3 rounded-lg bg-white"
    >
      <div className="flex justify-between items-start gap-2">
        <button
          className="cursor-grab active:cursor-grabbing mt-1 touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-medium">{item.question}</h2>
          <h2 className="text-sm text-primary">Type: {item?.type}</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(index)}
          className="ml-2 text-red-500 hover:text-red-700"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Fixed Final Question Component (non-draggable)
function FinalQuestionItem() {
  return (
    <div className="p-3 border-2 border-primary/30 mb-3 rounded-lg bg-blue-50">
      <div className="flex justify-between items-start gap-2">
        <div className="w-5 h-5 mt-1 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        </div>
        <div className="flex-1">
          <h2 className="font-medium">
            Before we wrap up, do you have any questions for me?
          </h2>
          <h2 className="text-sm text-primary">Type: Closing</h2>
          <p className="text-xs text-gray-500 mt-1">
            This question will always be asked at the end of the interview
          </p>
        </div>
      </div>
    </div>
  );
}

function QuestionList({ formData, onCreateInterviewLink }) {
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const hasCalledAPI = useRef(false);
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    type: "general",
  });

  // Default final question that's always added
  const FINAL_QUESTION = {
    id: "final-question-fixed",
    question: "Before we wrap up, do you have any questions for me?",
    type: "closing",
    isFixed: true,
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      const questions = JSON.parse(final_content)?.interviewQuestions || [];

      // Add unique IDs to questions for drag and drop
      const questionsWithIds = questions.map((q) => ({
        ...q,
        id: uuidv4(),
      }));

      setQuestionList(questionsWithIds);
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast("server error, try again");
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestionList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasUnsavedChanges(true);
        return newOrder;
      });
    }
  };

  const addQuestion = () => {
    if (!newQuestion.question.trim()) {
      toast("Please enter a question");
      return;
    }

    const questionToAdd = {
      ...newQuestion,
      id: uuidv4(),
    };

    setQuestionList([...questionList, questionToAdd]);
    setNewQuestion({ question: "", type: "general" });
    setHasUnsavedChanges(true);
    toast("Question added successfully");
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questionList.filter((_, i) => i !== index);
    setQuestionList(updatedQuestions);
    setHasUnsavedChanges(true);
    toast("Question removed successfully");
  };

  const saveQuestionOrder = async () => {
    if (!interviewId) {
      toast("No interview created yet");
      return;
    }

    setUpdateLoading(true);
    try {
      // Add the final question before saving
      const questionsToSave = [...questionList, FINAL_QUESTION];

      const { error } = await supabase
        .from("interviews")
        .update({ questionList: questionsToSave })
        .eq("interviewId", interviewId);

      if (error) {
        throw error;
      }

      setHasUnsavedChanges(false);
      toast("Question order saved successfully");
    } catch (error) {
      console.error(error);
      toast("Error saving question order");
    } finally {
      setUpdateLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const newInterviewId = uuidv4();

    try {
      // Add the final question to the list before saving
      const questionsToSave = [...questionList, FINAL_QUESTION];

      const { data, error } = await supabase
        .from("interviews")
        .insert([
          {
            ...formData,
            questionList: questionsToSave,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            interviewId: newInterviewId,
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

      setInterviewId(newInterviewId);
      setHasUnsavedChanges(false);
      toast("Interview created successfully");
      onCreateInterviewLink(newInterviewId);
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

      {/* Question List with Drag and Drop */}
      {questionList?.length > 0 && (
        <div className="p-5 border border-gray-300 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Interview Questions</h3>
            {hasUnsavedChanges && interviewId && (
              <Button
                onClick={saveQuestionOrder}
                disabled={updateLoading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {updateLoading ? (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Order
              </Button>
            )}
          </div>

          {/* Draggable Questions */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questionList.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              {questionList.map((item, index) => (
                <SortableQuestionItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRemove={removeQuestion}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Fixed Final Question */}
          <FinalQuestionItem />

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
                    <SelectItem value="problem solving">
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
