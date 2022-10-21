import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import UserForm from "./UserForm";

test("validates registration form properly", () => {
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <UserForm />
    </MemoryRouter>
  );

  // empty fields
  userEvent.click(screen.getByRole("button", { name: "Sign In" }));

  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();

  // password length
  userEvent.type(screen.getByLabelText(/^password/i), "pass");
  userEvent.type(screen.getByLabelText(/confirm password/i), "pass");
  userEvent.click(screen.getByRole("button", { name: "Sign In" }));

  expect(
    screen.getByText(/must be at least 6 characters/i)
  ).toBeInTheDocument();

  // invalid email
  userEvent.type(screen.getByLabelText(/email/i), "test@that");
  userEvent.click(screen.getByRole("button", { name: "Sign In" }));
  expect(screen.getByText(/email address is invalid/i)).toBeInTheDocument();

  // password match
  userEvent.type(screen.getByLabelText(/^password/i), "password");
  userEvent.type(screen.getByLabelText(/confirm password/i), "passwords");
  userEvent.click(screen.getByRole("button", { name: "Sign In" }));

  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
});
