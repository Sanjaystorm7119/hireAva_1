import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /Click me/i });
    expect(button).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: /Click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByRole("button", { name: /Click me/i });
    expect(button).toBeDisabled();
  });

  it("renders with different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole("button", { name: /Default/i });
    expect(button).toHaveClass("bg-primary");

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole("button", { name: /Destructive/i });
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: /Outline/i });
    expect(button).toHaveClass("border");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole("button", { name: /Default/i });
    expect(button).toHaveClass("h-9");

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole("button", { name: /Small/i });
    expect(button).toHaveClass("h-8");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /Large/i });
    expect(button).toHaveClass("h-10");
  });
});
