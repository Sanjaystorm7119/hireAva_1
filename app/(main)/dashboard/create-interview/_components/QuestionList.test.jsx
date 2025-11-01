import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuestionList from "./QuestionList";
import axios from "axios";
import { act } from "react";

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      primaryEmailAddress: { emailAddress: "test@example.com" },
      Credits: "10",
    },
  }),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

jest.mock("../../../../../lib/supabase", () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => ({ data: [], error: null }),
      }),
    }),
  },
}));

// Mock axios with proper response structure
jest.mock("axios", () => ({
  post: jest.fn((url) => {
    if (url === "/api/aimodel") {
      return Promise.resolve({
        data: {
          content: `{
            "interviewQuestions": [
              {
                "question": "What is your experience with React?",
                "type": "technical"
              },
              {
                "question": "Describe a challenging project you worked on.",
                "type": "behavioral"
              }
            ]
          }`,
        },
      });
    }
    if (url === "/api/company-summary") {
      return Promise.resolve({
        data: {
          summary: "Test company summary",
        },
      });
    }
    return Promise.reject(new Error("Not found"));
  }),
}));

describe("QuestionList Component", () => {
  const mockFormData = {
    jobPosition: "Software Engineer",
    jobDescription: "Test job description",
    companyDetails: "Test company",
  };

  const mockQuestions = [
    {
      id: "1",
      question: "What is your experience with React?",
      type: "technical",
    },
    {
      id: "2",
      question: "Describe a challenging project you worked on.",
      type: "behavioral",
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it("allows adding a new question", async () => {
    const user = userEvent.setup();
    const onCreateInterviewLink = jest.fn();
    const { toast } = require("sonner");

    render(
      <QuestionList
        formData={mockFormData}
        onCreateInterviewLink={onCreateInterviewLink}
      />
    );

    // Wait for initial questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Fill in new question form
    const input = await screen.findByPlaceholderText("Enter your question...");
    await user.type(input, "New test question");

    const addButton = await screen.findByRole("button", {
      name: /Add Question/i,
    });
    await user.click(addButton);

    // Verify toast was called
    expect(toast).toHaveBeenCalledWith("Question added successfully");
  });

  it("shows the fixed final question", async () => {
    render(<QuestionList formData={mockFormData} />);

    // Wait for initial questions to load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const finalQuestionText = await screen.findByText(
      "Before we wrap up, do you have any questions for me?"
    );
    expect(finalQuestionText).toBeInTheDocument();

    const typeText = await screen.findByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "h2" &&
        /type:\s*closing/i.test(content)
      );
    });
    expect(typeText).toBeInTheDocument();
  });

  it("renders loading state when generating questions", async () => {
    render(<QuestionList formData={mockFormData} />);

    expect(screen.getByText("Preparing your interview")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Eva is crafting personalised questions based on given jobDescription and position"
      )
    ).toBeInTheDocument();

    // Wait for loading to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
