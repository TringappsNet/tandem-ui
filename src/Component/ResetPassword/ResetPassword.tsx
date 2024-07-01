import React, { useState } from 'react';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor'; // Adjust path as necessary
import styles from './ResetPassword.module.css';

const Reset: React.FC = () => {
    const [showResetForm, setShowResetForm] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setResponseMessage('Passwords do not match.');
            setResponseType('error');
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                oldPassword,
                newPassword,
                userId: 1,
            });

            if (response.status === 200) {
                setResponseMessage('Password reset successful.');
                setResponseType('success');
                setTimeout(() => {
                    setShowResetForm(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setResponseType('');
                }, 1000);
            } else {
                setResponseMessage(response.data.message || 'Password reset failed.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
    };

    return (
        <>
            {showResetForm && (
                <div className={styles.formContainer}>
                    <h2>Reset Password</h2>
                    {responseMessage && (
                        <div className={styles[responseType]}>
                            {responseMessage}
                        </div>
                    )}
                    <form onSubmit={handleResetPassword}>
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword">Old Password:</label>
                            <input
                                type="password"
                                id="oldPassword"
                                value={oldPassword}
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
