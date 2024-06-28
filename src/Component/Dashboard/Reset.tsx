import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const Reset: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resetFormRef = useRef<HTMLDivElement>(null);
    const inviteFormRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
                setShowResetForm(true);
            }
            if (inviteFormRef.current && !inviteFormRef.current.contains(event.target as Node)) {
                setShowInviteForm(false);
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
            setResponseMessage('Password match failed.');
            setResponseType('error');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.77:3008/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    userId: 1,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Password reset successful.');
                setResponseType('success');
            } else {
                setResponseMessage(data.message || 'Unsuccessful message.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
                {dropdownOpen && (
                    <>
                        <div className={styles.dropdownItem}>
                            <button className={styles.linkButton}>Reset</button>
                        </div>
                    </>
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reset;
