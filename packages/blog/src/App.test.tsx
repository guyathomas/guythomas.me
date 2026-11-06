import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("praises Arsh", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Arsh" })).toBeInTheDocument();
    expect(
      screen.getByText("The most wonderful person I know."),
    ).toBeInTheDocument();
  });
});
