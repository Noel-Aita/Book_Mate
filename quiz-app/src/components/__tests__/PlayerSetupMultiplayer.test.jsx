// src/components/__tests__/PlayerSetupMultiplayer.test.jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlayerSetupMultiplayer from "../PlayerSetupMultiplayer";
import { AuthContext } from "../../context/AuthContext";

const user = { username: "Player1" };

describe("PlayerSetupMultiplayer Component", () => {
  test("renders room input and join button", () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <MemoryRouter>
          <PlayerSetupMultiplayer />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const input = screen.getByPlaceholderText(/enter room name/i);
    const button = screen.getByText(/join \/ create room/i);

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
