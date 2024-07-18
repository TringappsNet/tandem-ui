import React, { useState } from 'react';
import styles from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../Redux/slice/auth/authSlice';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';
import backgroundImage from './bg-login.png';
import SnackbarComponent from '../Snackbar/Snackbar';

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
      dispatch(login({ email, password })).then((result) => {
        if (login.fulfilled.match(result)) {
          navigate('/dashboard');
        } else {
          setSnackbarMessage('Invalid credentials, Please give the valid credentials.');
          setSnackbarOpen(true);;
        }
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.loginBackground} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.card}>
        <div className={styles.section}>

          <div className={styles.header}>
            <img
              className={styles.logo}
              src="https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0"
              alt="Tandem Logo"
            />
            <h2 className={styles.name}>TANDEM INFRASTRUCTURE</h2>
          </div>
          <p style={{ color: 'rgb(127, 129, 133)' }}>Sign in to continue to TANDEM</p>

          <div className={styles.formContainer}>
            <form className={styles.loginsection} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="username">
                  Email ID
                </label>
                <input
                  id="username"
                  placeholder="Enter email"
                  value={email}
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