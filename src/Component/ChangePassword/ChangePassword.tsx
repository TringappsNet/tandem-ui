import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, validateResetToken } from '../Redux/slice/auth/changePasswordSlice';
import styles from './ChangePassword.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppDispatch } from '../Redux/store';
import { RootState } from '../Redux/reducers';
import backgroundImage from './bg-login.png';
import SnackbarComponent from '../Snackbar/Snackbar';
import logo from '../../assests/tandemlogo/tandem_logo.png'


const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const { isLoading, responseMessage, responseType, isTokenValid } = useSelector(
    (state: RootState) => state.changePassword
  );

  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [disableState, setDisableState] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');

  const resetToken = new URLSearchParams(location.search).get('resetToken');

  if (disableState === false) { }

  useEffect(() => {
    if (resetToken) {
      dispatch(validateResetToken({ resetToken }));
    } else {
      navigate('/forgotpassword');
    }
  }, [resetToken, dispatch, navigate]);

  useEffect(() => {
    if (isTokenValid === false) {
      navigate('/forgotpassword');
    }
  }, [isTokenValid, navigate]);

  const validatePassword = (password: string): string => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    if (password.trim() === '') {
      setDisableState(false);
      return '';
    } else if (password.length < 8) {
      setDisableState(false);
      return 'Password should contain at least 8 characters.';
    } else if (!specialCharPattern.test(password)) {
      setDisableState(false);
      return 'Password should contain at least one special character.';
    } else if ((password.match(numberPattern) || []).length < 2) {
      setDisableState(false);
      return 'Password should contain at least two numerical digits.';
    } else {
      setDisableState(true);
      return '';
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim() === '') {
      handleSnackbarOpen('Please enter your new password', 'error');
      return;
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      handleSnackbarOpen(passwordError, 'error');
      return;
    }

    if (confirmpassword.trim() === '') {
      handleSnackbarOpen('Please confirm your password', 'error');
      return;
    }

    if (password !== confirmpassword) {
      handleSnackbarOpen('Passwords do not match.', 'error');
      return;
    }

    dispatch(changePassword({ newPassword: password }));

    setTimeout(() => {
      navigate('/login');
    }, 5000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
    handleSnackbarClose();
  };

  const handleSnackbarOpen = (message: string, severity: 'error' | 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (responseMessage) {
      handleSnackbarOpen(responseMessage, responseType === 'success' ? 'success' : 'error');

      if (responseType === 'success') {
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      }
    }
  }, [responseMessage, responseType, navigate]);

  return (
    <div className={styles.loginBackground}>
      <div className={styles.curveUpper}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={logo} alt="Tandem Logo" />
          <h2 className={styles.name}>TANDEM INFRASTRUCTURE</h2>
        </div>
        <div className={styles.card}>
          <div className={styles.section}>
            <div className={styles.headingsection}>
              <h2>Forgot Password</h2>
            </div>
            <p className={styles.reset}>
              Your new password should be distinct from any of your prior passwords
            </p>
          </div>
          <div className={styles.formContainer}>
            <form className={styles.loginsection} onSubmit={handleSubmit}>
              <SnackbarComponent
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                style={{ backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#DE5242', color: '#FEF9FD' }}
              />
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleInputChange(e, setPassword)}
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
                  onChange={(e) => handleInputChange(e, setConfirmpassword)}
                />
              </div>
              <button
                className={styles.loginbtn}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;