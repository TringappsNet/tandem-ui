import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import DealForm from '../Milestone/Milestone';
import styles from './Dashboard.module.css';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { FiEdit } from "react-icons/fi";
// import { Deal } from '../Interface/DealFormObject';
// import 'bootstrap/dist/css/bootstrap.css';


interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

interface BrokerData {
  id: number;
  firstname: string;
  status: "",
  comments: ""
}

interface Deal {
  activeStep: number;
  status: string;
  propertyName: string | null;
  brokerName: string | null;
  dealStartDate: string | null;
  proposalDate: string | null;
  loiExecuteDate: string | null;
  leaseSignedDate: string | null;
  noticeToProceedDate: string | null;
  commercialOperationDate: string | null;
  potentialcommissiondate: string | null;
  potentialCommission: string | null;
  createdBy: number;
  updatedBy: number;
  isNew: boolean;
  id: number | null;
}

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
  const [roleId, setRoleId] = useState('admin');
  const [showCards, setShowCards] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [dealsData, setDealsData] = useState<Deal[]>([]);
  const [dealFormData, setDealFormData] = useState<Deal>();
  const [openStepper, setOpenStepper] = useState(false);
  const [isFirstSave, setIsFirstSave] = useState(true); // Track if it's the first save

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

  const fetchDeals = async () => {
    try {
      const response = await axiosInstance.get('/deals');
      const fetchedDeals: Deal[] = response.data.deals;
      setDealsData(fetchedDeals);
      console.log('Deals Fetched value:', response.data);
    } catch (error) {
      console.error('Error fetching broker names:', error);
    }
  };

  useEffect(() => {
    fetchDeals();
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
        setRoleId('admin');
        setResponseType('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [responseType]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [gridData, setGridData] = useState<BrokerData[]>([]);


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
      const response = await axiosInstance.post('/auth/reset-password', {
        oldPassword,
        newPassword,
        userId: 1, // Assuming userId needs to be sent in the request
      });

      if (response.status === 200) {
        setResponseMessage('Password reset successful.');
        setResponseType('success');
      } else {
        setResponseMessage(response.data.message || 'Unsuccessful message.');
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
      const response = await axiosInstance.post('/auth/invite', {
        email,
        roleId,
      });

      if (response.status === 200) {
        setResponseMessage('Invite sent successfully.');
        setResponseType('success');
      } else {
        setResponseMessage(response.data.message || 'Failed to send invite.');
        setResponseType('error');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
      setResponseType('error');
    }
  };

  useEffect(() => {
      const fetchBrokers = async () => {
        try {
          const response = await axiosInstance.get('/brokers');
          const res = response.data.user;
          console.log("Grid Data", res);
          const formattedData = res.map(({ id, firstname }: BrokerData) => ({ id, firstname, status:"", comments: "" }));
          console.log("format", formattedData)
          setGridData(formattedData);
        } catch (error) {
          console.error(`Error fetching broker data ${error}:`, error);
        }
      };
  
      fetchBrokers();
    }, []);

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

  const saveFormData = async () => {

    try {
      const deal: any = localStorage.getItem('dealdetails')
      const dealtemp: any = JSON.parse(deal)
      if (dealtemp.isNew && isFirstSave) {
        const response = await axiosInstance.post('/deals/deal', dealtemp);
        console.log('Form data saved:', response.data);
        localStorage.removeItem('dealdetails');
        setIsFirstSave(false);
        fetchDeals();
        return
      }

      const response = await axiosInstance.put(`/deals/deal/${dealtemp.id}`, dealtemp);
      console.log('Form data saved for put:', response.data);
      localStorage.removeItem('dealdetails');
      setIsFirstSave(true);
      fetchDeals();

    } catch (error) {
      console.error('Error saving form data:', error);
      return
    }
  };

  const editDealForm = (deal: Deal) => {
    setOpenStepper(true);
    setDealFormData(deal);
    console.log("card Deal respected value ", deal);
  }

  const createDealForm = () => {
    setOpenStepper(true);
    setDealFormData(undefined);
    // console.log("card Deal respected value ", deal);
  }

  const getStatusButtonClass = (status: string) => {
    switch (status) {
      case "Completed":
        return styles.statusButtonFinished;
      case "In-Progress":
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
        <div className={styles.buttonContainer}>
          <button className={styles.createButton} onClick={() => createDealForm()}>Create</button>
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
                    <button className={styles.linkButton}>Support</button>
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
              <button type="submit">Send Invite</button>
            </form>
          </div>
        )}
        {showCards && (
          <div className={styles.cardContainer}>
            <div className={styles.cardTags}>
              <span className={styles.tag}>Deals: </span>
              <span className={styles.tag}>In Progress:   </span>
              <span className={styles.tag}>Received Commission:  </span>
            </div>
            <div className={styles.cardList} >
              {dealsData.map((deal, index) => (
                <div key={index} className={styles.card}>
                  <div className={styles.cardTitle}>Deal #{deal.id} <div className={styles.hide}><FiEdit  onClick={() => editDealForm(deal)}/></div>
                  </div>
                  <div className={styles.cardContent}>
                    <p className={styles.brokerName}><span>Broker Name:</span> {deal.brokerName}</p>
                    <div className={styles.statusLine}>
                      <span className={styles.statusLabel}>Status:</span>
                      <span className={`${styles.statusButton} ${getStatusButtonClass(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {showGrid && (
          <div className={styles.gridContainer}>
            <table className={styles.grid}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Broker</th>
                  <th>Status</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {gridData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.id}</td>
                    <td>{data.firstname}</td>
                    <td>{data.status}</td>
                    <td>{data.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <>
        <Dialog
          fullScreen
          sx={{ margin: '30px 190px' }}
          open={openStepper}
          onClose={() => {
            setOpenStepper(false);
            saveFormData();
            setShowCards(true);
          }}
          className={styles.popupmain}
        >
          <DialogTitle sx={{ backgroundColor: '#262262', color: 'white' }}>
            Deal Form
            <IconButton
              aria-label="close"
              onClick={() => {
                setOpenStepper(false);
                saveFormData();
                setShowCards(true);
              }}
              sx={{
                position: 'absolute',
                right: 25,
                top: 8,
                width: 40,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon sx={{ color: '#999' }} />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DealForm selectedDeal={dealFormData} />
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default Dashboard;
