// src/components/__tests__/MultiPlayerQuiz.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MultiPlayerQuiz from "./MultiPlayerQuiz";
import { AuthContext } from "../../context/AuthContext";

// Mock socket.io
jest.mock("../../services/socket", () => ({
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

const user = { username: "Player1" };

describe("MultiPlayerQuiz Component", () => {
  test("renders room container", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter>
          <MultiPlayerQuiz />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/room:/i)).toBeInTheDocument();
  });
});// src/components/__tests__/MultiPlayerQuiz.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MultiPlayerQuiz from "../MultiPlayerQuiz";
import { AuthContext } from "../../context/AuthContext";

// Mock socket.io
jest.mock("../../services/socket", () => ({
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
}));

const user = { username: "Player1" };

describe("MultiPlayerQuiz Component", () => {
  test("renders room container", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter>
          <MultiPlayerQuiz />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/room:/i)).toBeInTheDocument();
  });
});

