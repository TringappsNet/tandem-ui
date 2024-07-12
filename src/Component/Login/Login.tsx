import React, { useState } from 'react';
import styles from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Redux/slice/auth/authSlice';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Please fill in the Email');
      isValid = false;
    } else if (!password.trim()) {
      setPasswordError('Please fill in the Password');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (validateForm()) {
      dispatch(login({ email, password })).then((result) => {
        if (login.fulfilled.match(result)) {
          navigate('/dashboard');
        } else {
          setErrorMessage('Invalid email or password. Please try again.');
        }
      });
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
          <p>Sign in to continue to TANDEM</p>
          {(emailError || passwordError) && (
            <div className={styles.errorBox}>
              {emailError && <p className={styles.errorText}>{emailError}</p>}
              {passwordError && (
                <p className={styles.errorText}>{passwordError}</p>
              )}
            </div>
          )}
          {errorMessage && (
            <div className={styles.errorshow}>{errorMessage}</div>
          )}
          <form className={styles.loginsection} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="username">
                Email ID
              </label>
              <input
                id="username"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
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
            <button
              className={styles.loginbtn}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          {loading && (
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
