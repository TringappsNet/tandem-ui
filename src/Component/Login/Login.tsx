// Login.tsx

import React, { useState } from 'react';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../Redux/slice/authSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showFailureMessage, setShowFailureMessage] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState('You have failed signed in.');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setValidationErrorMessage('Email cannot be empty');
      setShowFailureMessage(true);
    } else if (!emailRegex.test(email)) {
      setValidationErrorMessage('Invalid email address');
      setShowFailureMessage(true);
    } else {
      setShowFailureMessage(false);
      setShowSuccessMessage(false);
    }
  };

  const validatePassword = (password: string) => {
    if (password === '') {
      setValidationErrorMessage('Password cannot be empty');
      setShowFailureMessage(true);
      return;
    } else {
      setShowFailureMessage(false);
      return;
    }
  };

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
    if (email === '' || password === '') {
      setValidationErrorMessage('Please Enter valid Email and Password');
      setShowFailureMessage(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      if (data.message && response.status === 200) {
        const { token,expiresAt } = data.session;
        
        const expirationDate = new Date(expiresAt);
        if (expirationDate > new Date()) {


        dispatch(setCredentials({ token, userId: data.user.id, email: data.user.email  }));

        setShowSuccessMessage(true);
        setShowFailureMessage(false);

        navigate('/newdashboard');
        }
      } else {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
      }
    } catch (error: any) {
      try {
        const res = error.response;
        if (res.status === 500 && res.data.message === 'internal server error') {
          let message = 'Server busy. Try again later';
          setValidationErrorMessage(message);
          setShowSuccessMessage(false);
          setShowFailureMessage(true);
        } else if (res.status === 401 && res.data.message === 'Incorrect Password') {
          let message = 'Incorrect Password! Please Enter Correct Password.';
          setValidationErrorMessage(message);
          setShowSuccessMessage(false);
          setShowFailureMessage(true);
        } else if (res.status === 401 && res.data.message === 'You are not a registered user') {
          const message = 'You are not a registered user. Please Register and sign in again';
          setValidationErrorMessage(message);
          setShowSuccessMessage(false);
          setShowFailureMessage(true);
        } else {
          setShowSuccessMessage(false);
          setShowFailureMessage(true);
        }
      } catch (e: any) {
        setValidationErrorMessage(e.message);
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
      }
    } finally {
      setIsLoading(false);
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
                {validationErrorMessage}
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
            </div>
            <Link to="/forgotpassword" className={styles.forgotPassword}>
              Forgot password?
            </Link>
            <button className={styles.loginbtn} type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          {isLoading && (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
