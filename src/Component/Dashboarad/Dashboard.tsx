
import React, { useState, useEffect, useRef } from 'react';
import styles from './Dashboard.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import logo from './logo.jpeg';

interface DashboardProps {
  accessToken: string;
}

const Dashboard: React.FC<DashboardProps> = ({ accessToken }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState('');

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(1);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleResetClick = () => {
    setShowResetForm(true);
    setShowInviteForm(false);
    setDropdownOpen(false);
  };

  const handleInviteClick = () => {
    setShowInviteForm(true);
    setShowResetForm(false);
    setDropdownOpen(false);
  };

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
          roleId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('Invite sent successfully.');
        setResponseType('success');
      } else {
        setResponseMessage(data.message || 'Failed to send invite.');
        setResponseType('error');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
      setResponseType('error');
    }
  };

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

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
  }, [dropdownRef]);

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
        <div className={styles.dropdown} ref={dropdownRef}>
          <span onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </span>
          <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
            {dropdownOpen && (
              <>
                <div className={styles.dropdownItem}>
                  <a href="#">Log out</a>
                </div>
                <div className={styles.dropdownItem}>
                  <a href="#" onClick={handleResetClick}>Reset</a>
                </div>
                <div className={styles.dropdownItem}>
                  <a href="#" onClick={handleInviteClick}>Send Invite</a>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {responseMessage && (
        <div
          className={classNames(styles.responseMessage, {
            [styles.successMessage]: responseType === 'success',
            [styles.errorMessage]: responseType === 'error',
          })}
        >
          {responseMessage}
        </div>
      )}
      <div className={styles.sidePanel}>
        <div className={styles.sidePanelTitle}>Dashboard</div>
        <div className={styles.sidePanelButtons}>
          <button className={styles.sidePanelButton}>Profile</button>
          <button className={styles.sidePanelButton}>Cards</button>
        </div>
      </div>
      <div className={styles.mainContent}>
        {showResetForm && (
          <div className={styles.formContainer}>
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
                <label htmlFor="confirmPassword">Confirm Password:</label>
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
        {showInviteForm && (
          <div className={styles.formContainer}>
            <h2>Send Invite</h2>
            <form onSubmit={handleSendInvite}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="roles">Roles:</label>
                <select
                  id="roles"
                  name="roles"
                  value={roleId}
                  onChange={(e) => setRoleId(parseInt(e.target.value))}
                  required
                >
                  <option value="1" data-role="admin">Admin</option>
                  <option value="2" data-role="broker">Broker</option>
                </select>
              </div>
              <button type="submit">Send Invite</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
