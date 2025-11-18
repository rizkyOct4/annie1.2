import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../../app/(main)/Login";
import { userContext } from "@/context";
import { describe, expect, it, vi } from "vitest";

describe("Login Component", () => {
  const mockGetLogin = vi.fn().mockResolvedValue("Success");
  const mockSetState = vi.fn();

  const renderLogin = () =>
    render(
      <userContext.Provider value={{ getLogin: mockGetLogin }}>
        <Login setState={mockSetState} />
      </userContext.Provider>
    );

  it("renders form inputs and buttons", () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^login$/i })
    ).toBeInTheDocument();
  });

  it("validates input and calls getLogin", async () => {
    renderLogin();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() =>
      expect(mockGetLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
    );
  });

  it("calls setState(false) when Sign Up is clicked", () => {
    renderLogin();
    fireEvent.click(screen.getByText("Sign Up"));
    expect(mockSetState).toHaveBeenCalledWith(false);
  });
});
