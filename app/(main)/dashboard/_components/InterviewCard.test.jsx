import { render, screen } from "@testing-library/react";
import InterviewCard from "./InterviewCard";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    user: {
      firstName: "John",
      lastName: "Doe",
      emailAddresses: [{ emailAddress: "john@example.com" }],
    },
  }),
}));

describe("InterviewCard Component", () => {
  const mockInterview = {
    id: "1",
    created_at: new Date("2025-10-31").toISOString(),
    duration: 30,
    candidates: [],
  };

  it("renders interview details", () => {
    render(<InterviewCard interview={mockInterview} />);
    const dateElement = screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === "h2" && content.includes("25");
    });
    expect(dateElement).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("Mins"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("candidates"))
    ).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<InterviewCard interview={mockInterview} />);
    expect(
      screen.getByRole("button", { name: /Copy Link/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });
});
