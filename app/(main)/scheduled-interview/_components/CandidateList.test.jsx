import { render, screen } from "@testing-library/react";
import CandidateList from "./CandidateList";
import moment from "moment";

jest.mock("./CandidateFeedbackDialogBox", () => {
  return function MockFeedbackDialog({ candidate }) {
    return <div data-testid={`feedback-dialog-${candidate.userName}`} />;
  };
});

describe("CandidateList Component", () => {
  const mockCandidates = [
    {
      userName: "John Doe",
      userEmail: "john@example.com",
      created_at: "2025-10-31T10:00:00Z",
      feedback: {
        feedback: {
          rating: {
            OverallRating: "8",
          },
        },
      },
    },
    {
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      created_at: "2025-10-31T11:00:00Z",
      feedback: {
        feedback: {
          rating: {
            OverallRating: "4",
          },
        },
      },
    },
  ];

  it("renders the list of candidates with count", () => {
    render(<CandidateList CandidateDetails={mockCandidates} />);
    expect(screen.getByText("Candidate List (2)")).toBeInTheDocument();
  });

  it("displays candidate information and completion dates", () => {
    render(<CandidateList CandidateDetails={mockCandidates} />);

    mockCandidates.forEach((candidate) => {
      expect(screen.getByText(candidate.userName)).toBeInTheDocument();
      // Use a custom text matcher for the completion date since it's split across elements
      // Verify completion date display
      const candidateContainer = screen
        .getByText(candidate.userName)
        .closest("div");
      const completionText = candidateContainer.querySelector(
        ".text-sm.text-muted-foreground"
      );
      expect(completionText).toHaveTextContent("Completed on:");
      expect(completionText).toHaveTextContent(
        moment(candidate.created_at).format("MMM DD, YYYY")
      );
    });
  });

  it("shows candidate ratings with correct colors", () => {
    render(<CandidateList CandidateDetails={mockCandidates} />);

    // Check high rating (green)
    const highRating = screen.getByText("8/10");
    expect(highRating.className).toContain("text-green-600");

    // Check low rating (red)
    const lowRating = screen.getByText("4/10");
    expect(lowRating.className).toContain("text-red-600");
  });

  it("renders no candidates message when list is empty", () => {
    render(<CandidateList CandidateDetails={[]} />);
    expect(screen.getByText("No candidates found")).toBeInTheDocument();
  });

  it("renders feedback dialog for each candidate", () => {
    render(<CandidateList CandidateDetails={mockCandidates} />);

    mockCandidates.forEach((candidate) => {
      expect(
        screen.getByTestId(`feedback-dialog-${candidate.userName}`)
      ).toBeInTheDocument();
    });
  });
});
