import { render, screen } from "@testing-library/react";
import Welcome from "./Welcome";

jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    isLoaded: true,
    user: {
      firstName: "John",
      lastName: "Doe",
    },
  }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

describe("Welcome Component", () => {
  it("renders welcome message and user name", () => {
    render(<Welcome />);
    const welcomeText = screen.getByText((content, element) => {
      return (
        element.tagName.toLowerCase() === "p" && content.includes("Welcome")
      );
    });
    expect(welcomeText.textContent).toMatch(/Welcome,.*John/);
    expect(
      screen.getByText("Hassle free Interviews with EVA")
    ).toBeInTheDocument();
  });
});
