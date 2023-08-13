import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

describe("NAVBAR", () => {
  it("test ", () => {
    render(<Navbar />);

    getByRole("");
  });
});
