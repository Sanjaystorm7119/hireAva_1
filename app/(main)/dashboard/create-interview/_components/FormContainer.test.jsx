import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormContainer from "./FormContainer";

// Mock components used by FormContainer
jest.mock("../../../../../components/ui/select", () => ({
  Select: ({ onValueChange }) => (
    <select
      data-testid="select"
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      <option value="30">30 Mins</option>
    </select>
  ),
  SelectTrigger: ({ children }) => (
    <button data-testid="select-trigger">{children}</button>
  ),
  SelectValue: ({ children }) => (
    <span data-testid="select-value">{children}</span>
  ),
  SelectContent: ({ children }) => (
    <div data-testid="select-content">{children}</div>
  ),
  SelectItem: ({ children, value, onClick }) => (
    <div data-testid={`select-item-${value}`} role="option" onClick={onClick}>
      {children}
    </div>
  ),
}));

jest.mock("../../../../../components/ui/input", () => ({
  Input: ({ onChange, ...props }) => (
    <input type="text" onChange={onChange} {...props} />
  ),
}));

jest.mock("../../../../../components/ui/textarea", () => ({
  __esModule: true,
  default: ({ onChange, ...props }) => (
    <textarea onChange={onChange} {...props} />
  ),
}));

// Mocking constants
jest.mock("../../../../../services/constants", () => ({
  InterviewTypes: [
    {
      title: "Behavioral",
      icons: () => <span>🎯</span>,
      description: "Assess soft skills and personality",
    },
    {
      title: "Technical",
      icons: () => <span>💻</span>,
      description: "Test technical knowledge",
    },
  ],
}));

describe("FormContainer Component", () => {
  const mockFormData = {
    companyDetails: "HireEva Company",
    jobPosition: "Senior Developer",
    jobDescription: "Test Description",
    duration: "30",
  };

  const onHandleInputChange = jest.fn();
  const GoToNext = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the form with required fields", () => {
    render(
      <FormContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={GoToNext}
      />
    );

    expect(screen.getByText("Company Details")).toBeInTheDocument();
    expect(screen.getByText("Job Position")).toBeInTheDocument();
    expect(screen.getByText("Job Description")).toBeInTheDocument();
    expect(screen.getByText("Duration")).toBeInTheDocument();
    expect(screen.getByText("Interview Types")).toBeInTheDocument();
  });

  it("allows entering company details", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <FormContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={GoToNext}
      />
    );

    const companyInput = screen.getByPlaceholderText(
      /your interviewing partner/i
    );
    const positionInput = screen.getByPlaceholderText(/frontend developer/i);
    const descriptionInput = screen.getByPlaceholderText(
      /enter job description/i
    );

    await user.type(companyInput, mockFormData.companyDetails);
    await user.type(positionInput, mockFormData.jobPosition);
    await user.type(descriptionInput, mockFormData.jobDescription);

    jest.advanceTimersByTime(1000);

    expect(onHandleInputChange).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });

  it("handles duration selection", async () => {
    render(
      <FormContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={GoToNext}
      />
    );

    const select = screen.getByTestId("select");
    fireEvent.change(select, { target: { value: "30" } });

    jest.advanceTimersByTime(100);
    expect(onHandleInputChange).toHaveBeenCalledWith("duration", "30");
  });

  it("handles interview type selection", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <FormContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={GoToNext}
      />
    );

    const typeButton = screen.getByText("Behavioral");
    await user.click(typeButton);

    jest.advanceTimersByTime(100);
    expect(onHandleInputChange).toHaveBeenCalled();
  });

  it("enables next button when required fields are filled", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <FormContainer
        onHandleInputChange={onHandleInputChange}
        GoToNext={GoToNext}
        formData={mockFormData}
      />
    );

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await user.click(nextButton);

    expect(GoToNext).toHaveBeenCalled();
  });
});
