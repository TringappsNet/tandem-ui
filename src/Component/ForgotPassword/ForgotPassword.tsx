import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { RootState } from '../Redux/store/index';
import {
  setResettingPassword,
  setResetPasswordSuccess,
  setResetPasswordError,
} from '../Redux/store/registerSlice';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const { resettingPassword, resetPasswordSuccess, resetPasswordError } = useSelector((state: RootState) => state.register);

  const [email, setEmail] = useState('');
  const [, setValidationErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setValidationErrorMessage('Email cannot be empty');
    } else if (!emailRegex.test(email)) {
      setValidationErrorMessage('Invalid email address');
    } else {
      setValidationErrorMessage('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === '') {
      setValidationErrorMessage('Please enter a valid email');
      return;
    }

    dispatch(setResettingPassword(true)); // Dispatch action to indicate password reset in progress

    try {
      const response = await axios.post('http://192.168.1.77:3008/auth/forgotpassword', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      if (data.message && response.status === 200) {
        dispatch(setResetPasswordSuccess(true)); // Password reset success
      } else {
        dispatch(setResetPasswordError('Password reset failed')); // Password reset failed
      }

    } catch (error: any) {
      if (error.message === 'Network Error') {
        dispatch(setResetPasswordError(error.message));
      } else {
        const res = error.response;
        if (res.status === 401 && res.data.message === 'Incorrect Email') {
          dispatch(setResetPasswordError('Incorrect Email! Please enter correct email.'));
        } else if (res.status === 401 && res.data.message === 'You are not a registered user') {
          dispatch(setResetPasswordError('You are not a registered user. Please Register.'));
        } else {
          dispatch(setResetPasswordError('Password reset failed.'));
        }
      }
    } finally {
      dispatch(setResettingPassword(false)); // Resetting password process complete
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
          <div className={styles.headingsection} >
            <h3>Forgot Password?</h3>
            <p>Reset your password here</p>
          </div>
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            {resetPasswordSuccess && (
              <div className={styles.success}>
                Reset link has been sent to your mail!
              </div>
            )}
            {resetPasswordError && (
              <div className={styles.failure}>
                {resetPasswordError}
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
            <button className={styles.loginbtn} type="submit" disabled={resettingPassword}>
              {resettingPassword ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className={styles.rememberpwd}>
            <p>Remember Password?</p>
            <Link to='/'>click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
