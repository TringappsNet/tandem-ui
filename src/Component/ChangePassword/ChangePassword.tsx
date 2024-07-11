import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../Redux/slice/auth/changePasswordSlice";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../Redux/store";
import { RootState } from "../Redux/reducers";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, responseMessage, responseType } = useSelector((state: RootState) => state.changePassword);

  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [disableState, setDisableState] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");

  const validatePassword = (password: string): string => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    if (password.trim() === "") {
      setDisableState(false);
      return "Password is required.";
    } else if (password.length < 8) {
      setDisableState(false);
      return "Password should be at least 8 characters long.";
    } else if (!specialCharPattern.test(password)) {
      setDisableState(false);
      return "Password should contain at least one special character.";
    } else if ((password.match(numberPattern) || []).length < 2) {
      setDisableState(false);
      return "Password should contain at least two numerical digits.";
    } else {
      setDisableState(true);
      return "";
    }
  };

  const validateConfirmpassword = (password: string, confirmpassword: string): string => {
    if (confirmpassword.trim() === "") {
      return "Password field cannot be empty.";
    } else if (password !== confirmpassword) {
      return "Passwords do not match.";
    } else {
      return "";
    }
  };

  const handleValidation = (): boolean => {
    const passwordError = validatePassword(password);
    const confirmpasswordError = validateConfirmpassword(password, confirmpassword);

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
      setValidationErrorMessage("Please enter values in all fields.");
      return;
    }

    if (!handleValidation()) {
      return;
    }

    dispatch(changePassword({ newPassword: password }));
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
            <p>Your new password should be distinct from any of your prior passwords</p>
          </div>
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            {responseType === 'success' && (
              <div className={styles.success}>{responseMessage}</div>
            )}
            {responseType === 'error' && (
              <div className={styles.failure}>{responseMessage}</div>
            )}
            {validationErrorMessage && (
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
                  const newPassword = e.target.value;
                  setPassword(newPassword);
                  setValidationErrorMessage(validatePassword(newPassword));
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
                  const newConfirmPassword = e.target.value;
                  setConfirmpassword(newConfirmPassword);
                  setValidationErrorMessage(validateConfirmpassword(password, newConfirmPassword));
                }}
              />
            </div>
            <button className={styles.loginbtn} type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
