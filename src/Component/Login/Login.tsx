import React, { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: (accessToken: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (password: string) => {
    if (password === '') {
      setPasswordError('Password cannot be empty');
      return;
    } else {
      setPasswordError('');
      return;
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    try {
      const response = await axios.post('http://192.168.1.223:3008/auth/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      if (data.status_code === 200 && data.message) {
        setShowSuccessMessage(true);
        setShowFailureMessage(false);
        onLoginSuccess(data.access_token);  // Pass the access token to the parent component
      } else {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
      }
    } catch (error) {
      setShowSuccessMessage(false);
      setShowFailureMessage(true);
    }
  };

  return (
    <div className='app'>
      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.header}>
            <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
            <h2>TANDEM INFRASTRUCTURE</h2>
          </div>

          <p>Sign in to continue to TANDEM</p>
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            {showSuccessMessage && (
              <div className={styles.success}>
                You have <b>successfully</b> signed in.
              </div>
            )}
            {showFailureMessage && (
              <div className={styles.failure}>
                You have <b>failed</b> signed in.
              </div>
            )}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">Email ID</label>
              <input
                id="username"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <p className={styles.error}>{emailError}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <p className={styles.error}>{passwordError}</p>}
            </div>

            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
            <button className={styles.loginbtn} type="submit">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
