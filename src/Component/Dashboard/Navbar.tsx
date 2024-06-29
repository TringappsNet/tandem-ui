import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('sessiontoken');
        localStorage.removeItem('userid');
        localStorage.removeItem('email');
        localStorage.removeItem('expireAt');
        onLogout();
        navigate('/', { replace: true });
    };

    const handleResetClick = () => {
        setShowResetForm(true);
        setDropdownOpen(false);
    };

    const handleInviteClick = () => {
        setShowInviteForm(true);
        setDropdownOpen(false);
    };

    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
                <div className={styles.buttonContainer}>
                    <button className={styles.createButton}>Create</button>
                    <div className={styles.dropdown} ref={dropdownRef}>
                        <span onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </span>
                        <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
                            {dropdownOpen && (
                                <>
                                    <div className={styles.dropdownItem}>
                                        <button onClick={handleInviteClick} className={styles.linkButton}>Send Invite</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <button className={styles.linkButton}>Support</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <button onClick={handleResetClick} className={styles.linkButton}>Reset</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <button onClick={handleLogout} className={styles.linkButton}>Log out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showResetForm && <ResetForm onClose={() => setShowResetForm(false)} />}
            {showInviteForm && <InviteForm onClose={() => setShowInviteForm(false)} />}
        </div>
    );
};

interface ResetFormProps {
    onClose: () => void;
}

const ResetForm: React.FC<ResetFormProps> = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const resetFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setResponseMessage('Password match failed.');
            setResponseType('error');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.223:3008/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                    userId: localStorage.getItem('userid'),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Password reset successful.');
                setResponseType('success');
                setTimeout(() => {
                    onClose();
                }, 2000);
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
        <div className={styles.overlay}>
            <div className={styles.formContainer} ref={resetFormRef}>
                <h2>Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className={styles.formGroup}>
                        <label htmlFor="oldPassword">Old Password:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            placeholder="Old password"
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
                            placeholder="New password"
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
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.invite}>Reset Password</button>
                </form>
                {responseMessage && (
                    <div className={`${styles.message} ${styles[responseType]}`}>
                        {responseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

interface InviteFormProps {
    onClose: () => void;
}

const InviteForm: React.FC<InviteFormProps> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('admin');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const inviteFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inviteFormRef.current && !inviteFormRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://192.168.1.223:3008/api/auth/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    roleId: 1,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Invitation sent successfully.');
                setResponseType('success');
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setResponseMessage(data.message || 'Failed to send invitation.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer} ref={inviteFormRef}>
                <h2>Send Invite</h2>
                <form onSubmit={handleSendInvite}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="roleId">Role:</label>
                        <select
                            id="roleId"
                            name="roleId"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required >
                            <option value="admin">Admin</option>
                            <option value="broker">Broker</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.invite}>Send Invite</button>
                </form>
                {responseMessage && (
                    <div className={`${styles.message} ${styles[responseType]}`}>
                        {responseMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;