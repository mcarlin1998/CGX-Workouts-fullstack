import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock Home component since we are focusing on App component tests
jest.mock("./pages/Home/Home", () => () => <div>Home Page</div>);

test("renders App component with routing", () => {
  render(<App />);

  // Verify that the Home component is rendered at the root path
  expect(screen.getByText(/Home Page/i)).toBeInTheDocument();
});
