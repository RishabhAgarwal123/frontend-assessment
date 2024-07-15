import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to DoseSpot/i);
  expect(linkElement).toBeInTheDocument();
});
//add tests to the document
