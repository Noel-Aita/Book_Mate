// src/components/__tests__/ResultsScreen.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResultsScreen from "../ResultsScreen";
import { AuthContext } from "../../context/AuthContext";

const user = { username: "TestUser" };

describe("ResultsScreen Component", () => {
  test("renders single-player score", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={[{ pathname: "/results", state: { scores: [{ username: "TestUser", score: 5 }], mode: "single" } }]}>
          <Routes>
            <Route path="/results" element={<ResultsScreen />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/player: testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/your score: 5/i)).toBeInTheDocument();
  });

  test("renders multiplayer scores", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter initialEntries={[{
          pathname: "/results",
          state: { scores: [{ username: "Player1", score: 3 }, { username: "Player2", score: 4 }], mode: "multi" }
        }]}>
          <Routes>
            <Route path="/results" element={<ResultsScreen />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/multiplayer scores/i)).toBeInTheDocument();
    expect(screen.getByText(/player1: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/player2: 4/i)).toBeInTheDocument();
  });
});
