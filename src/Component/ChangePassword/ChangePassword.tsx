import React, { useState } from "react";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const Navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [disableState, setDisableState] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  const validatePassword = (password: string): string => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    if (password.trim() === "") {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      setDisableState(false);
      return "Password is required.";
    } else if (password.length < 8) {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      setDisableState(false);
      return "Password should be at least 8 characters long.";
    } else if (!specialCharPattern.test(password)) {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      setDisableState(false);
      return "Password should contain at least one special character.";
    } else if ((password.match(numberPattern) || []).length < 2) {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      setDisableState(false);
      return "Password should contain at least two numerical digits.";
    } else {
      setShowFailureMessage(false);
      setShowSuccessMessage(false);
      setDisableState(true);
      return "";
    }
  };

  const validateConfirmpassword = (
    password: string,
    confirmpassword: string
  ): string => {
    if (confirmpassword.trim() === "") {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      return "Password field cannot be empty.";
    } else if (password !== confirmpassword) {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      return "Passwords do not match.";
    } else {
      setShowFailureMessage(false);
      setShowSuccessMessage(false);
      return "";
    }
  };

  const handleValidation = (): boolean => {
    const passwordError = validatePassword(password);
    const confirmpasswordError = validateConfirmpassword(
      password,
      confirmpassword
    );

    if (passwordError || confirmpasswordError) {
      setValidationErrorMessage(passwordError || confirmpasswordError);
      return false;
    }

    setValidationErrorMessage("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === "" || confirmpassword === "") {
      setShowFailureMessage(true);
      setShowSuccessMessage(false);
      setValidationErrorMessage("Please enter values in all fields.");
      return;
    }

    if (!handleValidation()) {
      setShowSuccessMessage(false);
      setShowFailureMessage(true);
      return;
    }

    try {
      await axiosInstance.post("auth/change-password", {
        newPassword: password,
      });
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      setPassword("");
      setConfirmpassword("");
      Navigate("/login");
    } catch (error) {
      console.error("Password change failed:", error);
      setShowSuccessMessage(false);
      setShowFailureMessage(true);
      setValidationErrorMessage("Failed to change password. Please try again.");
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
            <h3>Set a New Password</h3>
            <p>
              Your new password should be distinct from any of your prior
              passwords
            </p>
          </div>
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            {showSuccessMessage && (
              <div className={styles.success}>
                Password changed successfully!
              </div>
            )}
            {showFailureMessage && (
              <div className={styles.failure}>{validationErrorMessage}</div>
            )}
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationErrorMessage(validatePassword(e.target.value));
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmpassword}
                disabled={!disableState}
                onChange={(e) => {
                  setConfirmpassword(e.target.value);
                  setValidationErrorMessage(
                    validateConfirmpassword(password, e.target.value)
                  );
                }}
              />
            </div>
            <button className={styles.loginbtn} type="submit">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
