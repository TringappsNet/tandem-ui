import React, { useState } from 'react';
import styles from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Redux/slice/auth/authSlice';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';
import SnackbarComponent from '../Snackbar/Snackbar';
import logo from '../../assests/tandemlogo/tandem_logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    if (!email.trim()) {
      setSnackbarMessage('Please enter the email address');
      setSnackbarOpen(true);
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarOpen(true);
      isValid = false;
    } else if (!password.trim()) {
      setSnackbarMessage('Please enter the password');
      setSnackbarOpen(true);
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSnackbarMessage('');

    if (validateForm()) {
      dispatch(login({ email: email.trim(), password: password.trim() })).then((result) => {
        if (login.fulfilled.match(result)) {
          navigate('/dashboard');
        } else {
          const error:any = result.payload;
          setSnackbarMessage(error);
          setSnackbarOpen(true);
        }
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          <h1>Stay Connected.<br/>Stay Informed.</h1>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.headerlogo}>
          <img className={styles.logo} src={logo} alt="Tandem Logo" />
          <h2 className={styles.name}>TANDEM INFRASTRUCTURE <br /><span>REFERRAL PORTAL LOGIN</span></h2>
          </div>
        
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                placeholder="Enter email"
                value={email}
                autoComplete='off'
                autoFocus
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
              {loading ? 'Signing In...' : 'Sign in'}
            </button>
          </form>
          </div>

          {loading && (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
            </div>
          )}
      </div>
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={'error'}
        style={{backgroundColor: '#DE5242', color: '#FEF9FD'}}
      />
    </div>
  );
};

export default Login;
