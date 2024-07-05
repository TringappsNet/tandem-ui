import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import Login from "./Component/Login/Login";
import Registration from "./Component/Registration/Registration";
import ForgotPassword from "./Component/ForgotPassword/ForgotPassword";
import ChangePassword from "./Component/ChangePassword/ChangePassword";
import Milestone from "./Component/DealForm/dealForm";
import Dashboard from "./Component/NewDashboard/Dashboard";
import Support from "./Component/Support/Support";
import store from "./Component/Redux/store";

jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    })),
  };
});

describe("App component", () => {
  test("renders login page when not authenticated", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  test("renders registration page", () => {
    render(
      <Router>
        <Registration />
      </Router>
    );
    expect(screen.getByText(/REGISTER HERE/i)).toBeInTheDocument();
  });

  test("renders forgot password page", () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    expect(screen.getByText(/Forgot Password?/i)).toBeInTheDocument();
  });

  test("renders change password page", () => {
    render(
      <Router>
        <ChangePassword />
      </Router>
    );
    expect(screen.getByText(/Set a New Password/i)).toBeInTheDocument();
  });

  test("renders dashboard when authenticated", () => {
    const mockToken = "mockAccessToken";
    localStorage.setItem("accessToken", mockToken);

    render(
      <Provider store={store}>
        <Router>
          <Dashboard />
        </Router>
      </Provider>
    );
    const navbarElement = screen.getByRole("navigation");
    expect(navbarElement).toBeInTheDocument();
  });

  test("renders milestone page", () => {
    render(
      <Provider store={store}>
        <Router>
          <Milestone />
        </Router>
      </Provider>
    );
    expect(screen.getByText(/Proposal/i)).toBeInTheDocument();
  });

  test("renders support page", () => {
    render(
      <Provider store={store}>
        <Router>
          <Support />
        </Router>
      </Provider>
    );
    expect(screen.getByLabelText(/Subject:/i)).toBeInTheDocument();
  });

  test("renders login page when route does not match", () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );
    expect(screen.getByText(/TANDEM INFRASTRUCTURE/i)).toBeInTheDocument();
  });
});
