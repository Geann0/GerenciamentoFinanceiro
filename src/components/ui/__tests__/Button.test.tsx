import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-primary");
  });

  it("applies correct variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-danger");
  });

  it("shows loading state", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toHaveClass(
      "opacity-50",
      "cursor-not-allowed"
    );
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
