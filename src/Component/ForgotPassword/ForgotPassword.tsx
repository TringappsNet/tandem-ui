import React, { useState } from "react";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const Navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setValidationErrorMessage("Email cannot be empty");
      setShowFailureMessage(true);
    } else if (!emailRegex.test(email)) {
      setValidationErrorMessage("Invalid email address");
      setShowFailureMessage(true);
    } else {
      setShowFailureMessage(false);
      setShowSuccessMessage(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "") {
      setValidationErrorMessage("Please enter a valid email");
      setShowFailureMessage(true);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      const data = response.data;

      if (data.message && response.status === 200) {
        setShowSuccessMessage(true);
        setShowFailureMessage(false);

        setTimeout(() => {
          setShowSuccessMessage(false);
          setShowFailureMessage(false);
          Navigate("/"); // Redirect to login page after 3 seconds
        }, 3000);
        setEmail("");
      } else {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 500) {
          setValidationErrorMessage("Server error, please try again later");
        } else if (status === 401 && data.message === "Incorrect Email") {
          setValidationErrorMessage(
            "Incorrect Email! Please enter correct email."
          );
        } else if (
          status === 401 &&
          data.message === "You are not a registered user"
        ) {
          setValidationErrorMessage(
            "You are not a registered user. Please register."
          );
        } else {
          setValidationErrorMessage("An error occurred. Please try again.");
        }
      } else {
        setValidationErrorMessage("An error occurred. Please try again.");
      }

      setShowSuccessMessage(false);
      setShowFailureMessage(true);
    }
  };

  return (
    <div className="app">
      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.header}>
            <img
              src="https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0"
              alt="Tandem Logo"
            />
            <h2>TANDEM INFRASTRUCTURE</h2>
          </div>
          <div className={styles.headingsection}>
            <h3>Forgot Password?</h3>
            <p>Reset your password here</p>
          </div>
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            {showSuccessMessage && (
              <div className={styles.success}>
                Reset link has been sent to your mail!
              </div>
            )}
            {showFailureMessage && (
              <div className={styles.failure}>{validationErrorMessage}</div>
            )}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">
                Email ID
              </label>
              <input
                id="username"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <button className={styles.loginbtn} type="submit">
              Send Reset Link
            </button>
          </form>
          <div className={styles.rememberpwd}>
            <p>Remember Password?</p>
            <Link to="/">click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
