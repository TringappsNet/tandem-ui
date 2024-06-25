import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import DealForm from '../Milestone/Milestone'; // Ensure correct import path
import styles from './Dashboard.module.css';
import { WidthFull } from '@mui/icons-material';

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

const deals = [
  {
    Name: "DD",
    "phone number": "2347",
    "deal ID": "Deal #1",
    "Status": "In Progress"
  },
  {
    Name: "ABC",
    "phone number": "23677",
    "deal ID": "Deal #2",
    "Status": "Started"
  },
  {
    Name: "XYZ",
    "phone number": "2897",
    "deal ID": "Deal #3",
    "Status": "Finished"
  },
  {
    Name: "YFZ",
    "phone number": "28487",
    "deal ID": "Deal #4",
    "Status": "Started"
  },
  {
    Name: "UFD",
    "phone number": "888487",
    "deal ID": "Deal #5",
    "Status": "In Progress"
  },
  {
    Name: "GHD",
    "phone number": "888487",
    "deal ID": "Deal #6",
    "Status": "Finished"
  },
  {
    Name: "GGHD",
    "phone number": "888487",
    "deal ID": "Deal #7",
    "Status": "Started"
  },
  {
    Name: "GGHD",
    "phone number": "888487",
    "deal ID": "Deal #8",
    "Status": "Started"
  },
  {
    Name: "GGHD",
    "phone number": "888487",
    "deal ID": "Deal #7",
    "Status": "Started"
  },
];

const gridData = [
  { id: 1, broker: "ABC", status: "Start", comments: "" },
  { id: 2, broker: "CBS", status: "Inprogress", comments: "" },
  { id: 3, broker: "HGT", status: "Start", comments: "" },
  { id: 4, broker: "UIY", status: "Inprogress", comments: "" },
  { id: 5, broker: "ABH", status: "Completed", comments: "" }
];

const Dashboard: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {
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
  const [showCards, setShowCards] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [openStepper, setOpenStepper] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resetFormRef = useRef<HTMLDivElement>(null);
  const inviteFormRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (responseMessage) {
      const timer = setTimeout(() => {
        setResponseMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [responseMessage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
        setShowResetForm(false);
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

  useEffect(() => {
    if (responseType === 'success') {
      const timer = setTimeout(() => {
        setShowResetForm(false);
        setShowInviteForm(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setEmail('');
        setRoleId(1);
        setResponseType('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [responseType]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleResetClick = () => {
    setShowResetForm(true);
    setShowInviteForm(false);
    setShowCards(false);
    setShowGrid(false);
    setDropdownOpen(false);
  };

  const handleInviteClick = () => {
    setShowInviteForm(true);
    setShowResetForm(false);
    setShowCards(false);
    setShowGrid(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('sessiontoken');
    localStorage.removeItem('userid');
    localStorage.removeItem('email');
    localStorage.removeItem('expireAt');
    onLogout();
    navigate('/', { replace: true });
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

  const handleCardsClick = () => {
    setShowCards(true);
    setShowResetForm(false);
    setShowInviteForm(false);
    setShowGrid(false);
  };

  const handleStatusClick = () => {
    setShowGrid(true);
    setShowCards(false);
    setShowResetForm(false);
    setShowInviteForm(false);
  };

  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case "Finished":
        return styles.statusButtonFinished;
      case "In Progress":
        return styles.statusButtonInProgress;
      case "Started":
        return styles.statusButtonStarted;
      default:
        return '';
    }
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
        <button
          style={{ textDecoration: 'none', color: '#fff' }}
          onClick={() => setOpenStepper(true)}
        >
          click here
        </button>
        <div className={styles.dropdown} ref={dropdownRef}>
          <span onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faEllipsisV} />
          </span>
          <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
            {dropdownOpen && (
              <>
                <div className={styles.dropdownItem}>
                  <button onClick={handleResetClick} className={styles.linkButton}>Reset</button>
                </div>
                <div className={styles.dropdownItem}>
                  <button onClick={handleInviteClick} className={styles.linkButton}>Send Invite</button>
                </div>
                <div className={styles.dropdownItem}>
                  <button onClick={handleLogout} className={styles.linkButton}>Log out</button>
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
          <button className={styles.sidePanelButton} onClick={handleCardsClick}>Cards</button>
          <button className={styles.sidePanelButton} onClick={handleStatusClick}>Status</button>
        </div>
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
        {showInviteForm && (
          <div className={styles.formContainer} ref={inviteFormRef}>
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
                <label htmlFor="role">Role:</label>
                <select id="role" name="role" value={roleId} onChange={(e) => setRoleId(parseInt(e.target.value, 10))}>
                  <option value={1}>Admin</option>
                  <option value={2}>User</option>
                  <option value={3}>Supervisor</option>
                </select>
              </div>
              <button type="submit">Send Invite</button>
            </form>
          </div>
        )}
        {showCards && (
          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Total Capacity</div>
              <div className={styles.cardContent}>Total Capacity Value</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Available Capacity</div>
              <div className={styles.cardContent}>Available Capacity Value</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Capacity in Use</div>
              <div className={styles.cardContent}>Capacity in Use Value</div>
            </div>
          </div>
        )}
        {showGrid && (
          <div className={styles.gridContainer}>
            <div className={styles.gridItem}>
              <div className={styles.gridTitle}>Battery</div>
              <div className={styles.gridStatus}>
                <span className={classNames(styles.statusButton, getStatusButtonClass("Finished"))}>Finished</span>
              </div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.gridTitle}>Work In Progress</div>
              <div className={styles.gridStatus}>
                <span className={classNames(styles.statusButton, getStatusButtonClass("In Progress"))}>In Progress</span>
              </div>
            </div>
            <div className={styles.gridItem}>
              <div className={styles.gridTitle}>Assignment</div>
              <div className={styles.gridStatus}>
                <span className={classNames(styles.statusButton, getStatusButtonClass("Started"))}>Started</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <>
        <Dialog
        fullScreen
          sx={{ margin:'30px'}}
          open={openStepper}
          onClose={() => setOpenStepper(false)}
          className={styles.popupmain}
        >
          <DialogTitle sx={{textAlign:'center'}}>
            Deal Form
            <IconButton
              aria-label="close"
              onClick={() => setOpenStepper(false)}
              sx={{
                position: 'absolute',
                right: 25,
                top: 8,
                width:40,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon sx={{color:'#999'}} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DealForm />
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default Dashboard;
