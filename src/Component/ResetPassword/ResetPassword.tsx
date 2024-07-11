import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearResponse, resetState } from '../Redux/slice/auth/resetSlice';
import styles from './ResetPassword.module.css';
import { RootState } from '../Redux/reducers';
import { AppDispatch } from '../Redux/store';

interface ResetProps {
  onCloseDialog: () => void;
}

const Reset: React.FC<ResetProps> = ({ onCloseDialog }) => {
  const [showResetForm, setShowResetForm] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { responseMessage, responseType, status } = useSelector((state: RootState) => state.reset);

  const validatePassword = (password: string) => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    return hasSpecialChar && hasNumber && hasUpperCase;
  };

  const user_id: any = localStorage.getItem('user');
  const user = JSON.parse(user_id);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      dispatch(clearResponse());
      dispatch({
        type: 'reset/resetPassword/rejected',
        error: { message: 'Passwords do not match.' },
      });
      return;
    }

    if (!validatePassword(newPassword)) {
      dispatch(clearResponse());
      dispatch({
        type: 'reset/resetPassword/rejected',
        error: { message: 'Password must contain at least 1 special character, 1 number, and 1 capital letter.' },
      });
      return;
    }

    dispatch(resetPassword({ oldPassword, newPassword, userId: user.id }));
  };

  useEffect(() => {
    if (status === 'succeeded' || status === 'failed') {
      setTimeout(() => {
        setShowResetForm(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onCloseDialog(); 
        dispatch(resetState());
      }, 1000);
    }
  }, [status, onCloseDialog, dispatch]);

  return (
    <>
      {showResetForm && (
        <div className={styles.formContainer}>
          <h2>Reset Password</h2>
          {responseMessage && <div className={styles[responseType]}>{responseMessage}</div>}
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