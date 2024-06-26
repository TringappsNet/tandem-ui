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
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
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
    } else {
      setShowFailureMessage(false);
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
      setValidationErrorMessage('Please enter valid Email and Password');
      setShowFailureMessage(true);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const data = response.data;
      if (data.message === 'Login successful' && response.status === 200) {
        const { session, user } = data;
        console.log("data",data);
        dispatch(setCredentials({ user, session }));
        setShowSuccessMessage(true);
        setShowFailureMessage(false);
        navigate('/newdashboard');
       } else {
        setShowSuccessMessage(false);
        setShowFailureMessage(true);
      }
    } catch (error) {
      let message = 'Something went wrong. Please try again later.';
      // if (error.response && error.response.status === 401) {
      //   message = 'Incorrect Email or Password. Please try again.';
      // }
      setValidationErrorMessage(message);
      setShowSuccessMessage(false);
      setShowFailureMessage(true);
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
