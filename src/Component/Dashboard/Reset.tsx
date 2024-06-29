import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './DashboardComp.module.css';
//import 'bootstrap/dist/css/bootstrap.css';

const Reset: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resetFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
                setShowResetForm(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setResponseMessage('New passwords do not match.');
            setResponseType('error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3008/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    // userId should be obtained from authentication context or props
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Password reset successful.');
                setResponseType('success');
                setShowResetForm(false);
            } else {
                setResponseMessage(data.message || 'Password reset failed.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>Menu</button>
            <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })} ref={dropdownRef}>
                {dropdownOpen && (
                    <div className={styles.dropdownItem}>
                        <button className={styles.linkButton} onClick={() => setShowResetForm(true)}>Reset Password</button>
                    </div>
                )}
            </div>

            <div className={styles.mainContent}>
                {showResetForm && (
                    <div className={styles.formContainer} ref={resetFormRef}>
                        <h2>Reset Password</h2>
                        <form onSubmit={handleResetPassword}>
                            <div className={styles.formGroup}>
                                <label htmlFor="oldPassword">Old Password:</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    placeholder="Enter the old password"
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
                                    name="newPassword"
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
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Reset Password</button>
                        </form>
                        {responseMessage && (
                            <div className={responseType === 'success' ? styles.success : styles.error}>
                                {responseMessage}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reset;