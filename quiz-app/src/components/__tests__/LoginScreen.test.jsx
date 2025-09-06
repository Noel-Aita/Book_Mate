// src/components/__tests__/LoginScreen.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginScreen from "../LoginScreen";

describe("LoginScreen Component", () => {
  test("renders input and button", () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/enter your name/i);
    const button = screen.getByRole("button", { name: /enter/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test("alerts when input is empty", () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>
    );

    window.alert = jest.fn();
    const button = screen.getByRole("button", { name: /enter/i });
    fireEvent.click(button);

    expect(window.alert).toHaveBeenCalledWith("Please enter a username");
  });
});
