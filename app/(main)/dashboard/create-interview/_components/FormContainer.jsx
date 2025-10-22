"use client";
import { Input } from "../../../../../components/ui/input";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Textarea from "../../../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { InterviewTypes } from "../../../../../services/constants";
import { Button } from "../../../../../components/ui/button";
import { ArrowRight } from "lucide-react";

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState([]);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [duration, setDuration] = useState(""); // Add duration state

  // Stable debounce function using useCallback
  const createDebounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Memoized debounced handlers
  const debouncedJobPositionChange = useMemo(
    () =>
      createDebounce((value) => {
        if (onHandleInputChange) {
          onHandleInputChange("jobPosition", value);
        }
      }, 600),
    [onHandleInputChange, createDebounce]
  );

  const debouncedJobDescriptionChange = useMemo(
    () =>
      createDebounce((value) => {
        if (onHandleInputChange) {
          onHandleInputChange("jobDescription", value);
        }
      }, 300),
    [onHandleInputChange, createDebounce]
  );

  const debouncedCompanyDetailsChange = useMemo(
    () =>
      createDebounce((value) => {
        if (onHandleInputChange) {
          onHandleInputChange("companyDetails", value);
        }
      }, 400),
    [onHandleInputChange, createDebounce]
  );

  // Handle interview type changes with proper condition check
  useEffect(() => {
    if (interviewType.length > 0 && onHandleInputChange) {
      onHandleInputChange("type", interviewType);
    }
  }, [interviewType, onHandleInputChange]);

  // Memoized event handlers
  const handleJobPositionChange = useCallback(
    (event) => {
      const value = event.target.value;
      setJobPosition(value);
      debouncedJobPositionChange(value);
    },
    [debouncedJobPositionChange]
  );

  const handleJobDescriptionChange = useCallback(
    (event) => {
      const value = event.target.value;
      setJobDescription(value);
      debouncedJobDescriptionChange(value);
    },
    [debouncedJobDescriptionChange]
  );

  const handleCompanyDetailsChange = useCallback(
    (event) => {
      const value = event.target.value;
      setCompanyDetails(value);
      debouncedCompanyDetailsChange(value);
    },
    [debouncedCompanyDetailsChange]
  );

  // Fixed duration handler with local state
  const handleDurationChange = useCallback(
    (value) => {
      setDuration(value); // Update local state first
      if (onHandleInputChange) {
        onHandleInputChange("duration", value);
      }
    },
    [onHandleInputChange]
  );

  const AddInterviewType = useCallback((type) => {
    setInterviewType((prev) => {
      const isIncluded = prev.includes(type);
      if (!isIncluded) {
        return [...prev, type];
      } else {
        return prev.filter((item) => item !== type);
      }
    });
  }, []);

  // Memoize interview type buttons
  const interviewTypeButtons = useMemo(
    () =>
      InterviewTypes.map((type, index) => (
        <div
          key={index}
          className={`flex items-center cursor-pointer
         hover:bg-secondary gap-2 p-1 px-2 border border-gray-200
         bg-white rounded-2xl ${
           interviewType.includes(type.title) && "bg-blue-50 text-primary"
         }`}
          onClick={() => AddInterviewType(type.title)}
        >
          <type.icons />
          <span>{type.title}</span>
        </div>
      )),
    [interviewType, AddInterviewType]
  );

  return (
    <div>
      <div className="mx-2">
        <div>
          <h2 className="text-sm font-medium ">Company Details</h2>
          <Input
            placeholder="HireEva - Your interviewing Partner"
            required
            className="mt-2"
            value={companyDetails}
            onChange={handleCompanyDetailsChange}
          />
        </div>
        <div>
          <h2 className="text-sm font-medium mt-2">Job Position</h2>
          <Input
            placeholder="Frontend Developer"
            required
            className="mt-2"
            value={jobPosition}
            onChange={handleJobPositionChange}
          />
        </div>

        <div className="mt-2">
          <h2 className="text-sm font-medium">Job Description</h2>
          <Textarea
            placeholder="Enter job description"
            required
            className="mt-2"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
          />
        </div>

        <div className="mt-2">
          <h2 className="text-sm font-medium">Duration</h2>
          <Select value={duration} onValueChange={handleDurationChange}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="select Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 Mins</SelectItem>
              <SelectItem value="10">10 Mins</SelectItem>
              <SelectItem value="15">15 Mins</SelectItem>
              <SelectItem value="30">30 Mins</SelectItem>
              <SelectItem value="45">45 Mins</SelectItem>
              <SelectItem value="60">60 Mins</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-2">
            <h2 className="text-sm font-medium mb-2">Interview Types</h2>
            <div className="flex gap-3 flex-wrap">{interviewTypeButtons}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end" onClick={() => GoToNext()}>
        <Button className="mt-2">
          Next <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default FormContainer;
