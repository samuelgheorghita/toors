import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import allReducers from "../reducers";
import Navbar from "./Navbar";

function renderWithRedux(initialState) {
  const store = createStore(allReducers, initialState);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </Provider>
  );
}

describe("NAVBAR", () => {
  it("should show Login and Signup links when user is NOT logged in ", () => {
    renderWithRedux();

    const menu = screen.getAllByRole("button", { name: /menu button/i })[0];
    userEvent.click(menu);

    const loginLink = screen.getAllByRole("link", { name: /login/i })[0];
    const signupLink = screen.getAllByRole("link", { name: /signup/i })[0];
    const favoritesLink = screen.queryAllByRole("link", { name: /favorites/i });
    const myTrailsLink = screen.queryAllByRole("link", { name: /my trails/i });
    const settingsLink = screen.queryAllByRole("link", { name: /settings/i });

    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
    expect(favoritesLink).toHaveLength(0);
    expect(myTrailsLink).toHaveLength(0);
    expect(settingsLink).toHaveLength(0);
  });

  it("should NOT show Login and Signup links when user is logged in ", () => {
    renderWithRedux({ users: { username: "Test name" } });

    const menu = screen.getAllByRole("button", { name: /menu button/i })[0];
    userEvent.click(menu);

    const loginLink = screen.queryAllByRole("link", { name: /login/i });
    const signupLink = screen.queryAllByRole("link", { name: /signup/i });
    const favoritesLink = screen.queryAllByRole("link", { name: /favorites/i })[0];
    const myTrailsLink = screen.queryAllByRole("link", { name: /my trails/i })[0];
    const settingsLink = screen.queryAllByRole("link", { name: /settings/i })[0];

    expect(loginLink).toHaveLength(0);
    expect(signupLink).toHaveLength(0);
    expect(favoritesLink).toBeInTheDocument();
    expect(myTrailsLink).toBeInTheDocument();
    expect(settingsLink).toBeInTheDocument();
  });
});
