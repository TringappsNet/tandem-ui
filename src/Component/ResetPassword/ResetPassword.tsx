import React, { useState } from "react";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import styles from "./ResetPassword.module.css";

interface ResetProps {
  onCloseDialog: () => void;
}

const Reset: React.FC<ResetProps> = ({ onCloseDialog }) => {
  const [showResetForm, setShowResetForm] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");

  const validatePassword = (password: string) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    return hasSpecialChar && hasNumber && hasUpperCase;
  };

  const user_id: any = localStorage.getItem("user");
  const user = JSON.parse(user_id);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setResponseMessage("Passwords do not match.");
      setResponseType("error");
      return;
    }

    if (!validatePassword(newPassword)) {
      setResponseMessage(
        "Password must contain at least 1 special character, 1 number, and 1 capital letter."
      );
      setResponseType("error");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        oldPassword,
        newPassword,
        userId: user.id,
      });

      if (response.status === 200) {
        setResponseMessage("Password reset successful.");
        setResponseType("success");
        setTimeout(() => {
          setShowResetForm(false);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setResponseType("");
          onCloseDialog(); // Close the dialog in Navbar
        }, 1000);
      } else {
        setResponseMessage(response.data.message || "Password reset failed.");
        setResponseType("error");
      }
    } catch (error) {
      setResponseMessage("An error occurred. Please try again.");
      setResponseType("error");
    }
  };

  return (
    <>
      {showResetForm && (
        <div className={styles.formContainer}>
          <h2>Reset Password</h2>
          {responseMessage && (
            <div className={styles[responseType]}>{responseMessage}</div>
          )}
          <form onSubmit={handleResetPassword}>
            <div className={styles.formGroup}>
              <label htmlFor="oldPassword">Old Password:</label>
              <input
                type="password"
                id="oldPassword"
                autoFocus
                value={oldPassword}
                placeholder="Enter your old password"
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                placeholder="Enter your new password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Reset Password</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Reset;
