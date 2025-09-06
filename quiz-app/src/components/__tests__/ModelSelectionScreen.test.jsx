// src/components/__tests__/ModeSelectionScreen.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ModeSelectionScreen from "../ModeSelectionScreen";
import { AuthContext } from "../../context/AuthContext";

const user = { username: "TestUser" };

describe("ModeSelectionScreen Component", () => {
  test("renders username and mode buttons", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter>
          <ModeSelectionScreen />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/single player/i)).toBeInTheDocument();
    expect(screen.getByText(/multiplayer/i)).toBeInTheDocument();
  });
});
