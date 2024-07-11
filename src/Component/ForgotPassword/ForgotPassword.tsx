import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { forgotPassword, clearState } from "../Redux/slice/auth/forgotPasswordSlice";
import { RootState } from "../Redux/reducers";
import { AppDispatch } from "../Redux/store"; 

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, successMessage, errorMessage } = useSelector(
    (state: RootState) => state.forgotPassword
  );

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearState());
        navigate("/login");
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [successMessage, dispatch, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
      setValidationErrorMessage("Email cannot be empty");
    } else if (!emailRegex.test(email)) {
      setValidationErrorMessage("Invalid email address");
    } else {
      setValidationErrorMessage("");
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
      return;
    }

    dispatch(forgotPassword(email));
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
            {successMessage && (
              <div className={styles.success}>{successMessage}</div>
            )}
            {errorMessage && (
              <div className={styles.failure}>{errorMessage}</div>
            )}
            {validationErrorMessage && (
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
            <button className={styles.loginbtn} type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
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