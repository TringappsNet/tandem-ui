import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle, Box } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import LandlordGrid from '../Grids/landlordGrid/Landlord';
import SiteGrid from '../Grids/SiteGrid/SiteGrid';
import InviteBroker from '../Grids/inviteBroker-grid/InviteBroker-grid';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../Redux/store/index';
import { RootState } from '../Redux/reducers';
import Profile from '../Profile/profile';
import Support from '../Support/Support';
import DealForm from '../DealForm/dealForm';
import ConfirmationModal from '../AlertDialog/AlertDialog';
import { openDealForm } from '../Redux/slice/deal/dealFormSlice';
import { logoutUser } from '../Redux/slice/auth/authSlice';
import {
  closeSendInvite,
  openSendInvite,
} from '../Redux/slice/auth/sendInviteSlice';
import { closeReset, openReset } from '../Redux/slice/auth/resetSlice';
import { closeSupport, openSupport } from '../Redux/slice/support/supportSlice';
import { closeProfile, openProfile } from '../Redux/slice/profile/profileSlice';
import { CgProfile } from "react-icons/cg";
import { RiSendPlaneLine } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { IoLogOutOutline } from 'react-icons/io5';
import SnackbarComponent from '../Snackbar/Snackbar';
import { fetchSites } from '../Redux/slice/site/siteSlice';
import { fetchBrokerDealDetails, fetchDealDetails } from '../Redux/slice/deal/dealSlice';
import logo from '../../assests/tandemlogo/tandem_logo.png'
import { fetchBrokerDeals } from '../Redux/slice/deal/dealsDataSlice';
interface NavbarProps {
  links: {
    disabled: boolean | undefined;
    name: string;
    href: string;
    onClick?: () => void;
  }[];
}

const Navbar: React.FC<NavbarProps> = ({ links }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userdetails = useSelector((state: RootState) => state.auth);
  const sites = useSelector((state: RootState) => state.site.sites);
  const deals = useSelector((state: RootState) => state.deal.dealDetails);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [availableSites, setAvailableSites] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dealFormOpen = useSelector((state: RootState) => state.dealForm.open);
  const profileOpen = useSelector((state: RootState) => state.profile.open);
  const inviteOpen = useSelector((state: RootState) => state.sendInvite.open);
  const resetOpen = useSelector((state: RootState) => state.reset.open);
  const supportOpen = useSelector((state: RootState) => state.contact.open);

  useEffect(() => {
    if (userdetails.isAdmin) {
      dispatch(fetchSites());
    }
  }, [dispatch,userdetails]);

  useEffect(() => {
    if (userdetails.isAdmin === true) {
      dispatch(fetchDealDetails());
    } else {
      dispatch(fetchBrokerDeals(userdetails.user?.id || 0))
      dispatch(fetchBrokerDealDetails(userdetails.user?.id || 0));
    }
  }, [dispatch, userdetails]);


  useEffect(() => {
    if (userdetails.isAdmin) {
      const filteredSites = sites.filter((site) =>
        !deals.some((deal) => deal.propertyName === `${site.addressline1}, ${site.addressline2}`)
      );
      setAvailableSites(filteredSites);
    }

  }, [sites, deals,userdetails]);

  const handleOpenPopup = (componentName: string) => {
    setSelectedComponent(componentName);
    setOpenPopup(true);

    if (componentName === 'SendInvite') {
      dispatch(openSendInvite());
    } else if (componentName === 'Profile') {
      dispatch(openProfile());
    } else if (componentName === 'Reset') {
      dispatch(openReset());
    } else if (componentName === 'Support') {
      dispatch(openSupport());
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedComponent(null);

    if (selectedComponent === 'SendInvite') {
      dispatch(closeSendInvite());
    } else if (selectedComponent === 'Profile') {
      dispatch(closeProfile());
    } else if (selectedComponent === 'Reset') {
      dispatch(closeReset());
    } else if (selectedComponent === 'Support') {
      dispatch(closeSupport());
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setSnackbarMessage('Logout failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setShowLogoutConfirmation(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleRoute = (route: string) => {
    if (route === 'property') {
      navigate('/property');
      setActivePage('property');
      localStorage.setItem('activePage', 'property');
    } else if (route === 'landlord') {
      navigate('/landlord');
      setActivePage('landlord');
      localStorage.setItem('activePage', 'landlord');
    } else if (route === 'invitebroker') {
      navigate('/invitebroker');
      setActivePage('invitebroker');
      localStorage.setItem('activePage', 'invitebroker');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const pathname = location.pathname;
    let currentPage = 'dashboard';

    if (pathname.includes('/property')) {
      currentPage = 'property';
    } else if (pathname.includes('/landlord')) {
      currentPage = 'landlord';
    } else if (pathname.includes('/invitebroker')) {
      currentPage = 'invitebroker';
    } else if (pathname.includes('/deals')) {
      currentPage = 'deals';
    }

    setActivePage(currentPage);
    localStorage.setItem('activePage', currentPage);
  }, [location]);




  useEffect(() => {
    const storedActivePage = localStorage.getItem('activePage');
    if (storedActivePage) {
      setActivePage(storedActivePage);
    }
  }, []);

  const handlelogoclick = () => {
    setActivePage('dashboard');
    localStorage.setItem('activePage', 'dashboard');
    navigate('/dashboard');
  };

  const handleCards = () => {
    navigate('/deals');
  };
  const handleDealsClick = () => {
    handleCards();
    localStorage.setItem('activePage', 'deals');
    setActivePage('deals');
  };

  const handleCreateDealClick = () => {
    if (availableSites.length === 0) {

      setSnackbarMessage(
        'Unable to create deal, properties are either assigned or unavailable !'
      );
      setSnackbarOpen(true);
    } else {
      dispatch(openDealForm());
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <nav className={styles.navbarcontainer}>
        <div className={styles.headersection}>
          <div className={styles.header} onClick={handlelogoclick}>
            <img
              src={logo}
              alt="Tandem Logo"
            />
            <h3>TANDEM INFRASTRUCTURE</h3>
          </div>
          {userdetails.isAdmin && (
            <>
              <p
                onClick={handleDealsClick}
                className={`${styles.navItem} ${activePage === 'deals' ? styles.active : ''}`}
              >
                DEALS
              </p>
              <p
                onClick={() => handleRoute('property')}
                className={`${styles.navItem} ${activePage === 'property' ? styles.active : ''}`}
              >
                PROPERTY
              </p>
              <p
                onClick={() => handleRoute('landlord')}
                className={`${styles.navItem} ${activePage === 'landlord' ? styles.active : ''}`}
              >
                LANDLORD
              </p>
              <p
                onClick={() => handleRoute('invitebroker')}
                className={`${styles.navItem} ${activePage === 'invitebroker' ? styles.active : ''}`}
              >
                BROKERDETAILS
              </p>
            </>
          )}
        </div>
        <div className={styles.rightheadersection}>
          {userdetails.isAdmin && (
            <div className={styles.createdeal} onClick={handleCreateDealClick}>
              <p>CREATE DEAL</p>
            </div>
          )}
          <div
            className={styles.userdropdown}
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <div className={styles.username}>
              <p>
                {userdetails
                  ? `${userdetails.user?.firstName} ${userdetails.user?.lastName}`
                  : 'Guest'}
              </p>
              {userdetails && (
                <div className={styles.roleType}>
                  {' '}
                  {userdetails.isAdmin ? '(Admin)' : '(Broker)'}{' '}
                </div>
              )}
            </div>
            <div className={styles.circle}>
              <p>
                {userdetails
                  ? userdetails.user?.firstName[0] +
                  '' +
                  userdetails.user?.lastName[0]
                  : 'G'}
              </p>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleOpenPopup('Profile')}>
                  <CgProfile className={styles.icons} />
                  Profile
                </button>
                {userdetails.isAdmin && (
                  <button onClick={() => handleOpenPopup('SendInvite')}>
                    <RiSendPlaneLine className={styles.icons} />
                    Send Invite
                  </button>
                )}
                <button onClick={() => handleOpenPopup('Reset')}>
                  <RiLockPasswordLine className={styles.icons} />
                  Reset password
                </button>
                <button onClick={() => handleOpenPopup('Support')}>
                  <BiSupport className={styles.icons} />
                  {userdetails.isAdmin && <span>Email Campaign</span>}
                  {(!userdetails.isAdmin) && <span>Contact us</span>}
                </button>
                <button onClick={handleLogoutClick}>
                  <IoLogOutOutline className={styles.icons} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {openPopup && selectedComponent && (
        <Dialog
          open={openPopup}
          sx={{ padding: 0, margin: 0 }}
          maxWidth="lg"
          onClose={handleClosePopup}
        >
          <DialogTitle sx={{ padding: 0 }}>
            <Icon
              aria-label="close"
              onClick={handleClosePopup}
              sx={{
                position: 'absolute',
                right: 18,
                top: 1,
                zIndex: 999,
                fontSize: 30,
                cursor: 'pointer',
              }}
            >
              <CloseIcon />
            </Icon>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            {inviteOpen && selectedComponent === 'SendInvite' && (
              <SendInvite onCloseDialog={handleClosePopup} />
            )}
            {profileOpen && selectedComponent === 'Profile' && (
              <Profile onCloseDialog={handleClosePopup} />
            )}
            {resetOpen && selectedComponent === 'Reset' && (
              <Reset onCloseDialog={handleClosePopup} />
            )}
            {supportOpen && selectedComponent === 'Support' && (
              <Support onCloseDialog={handleClosePopup} />
            )}
            {selectedComponent === 'Landlord' && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: '100%',
                  width: '100%',
                  maxHeight: 'calc(100vh - 64px)',
                  overflow: 'auto',
                }}
              >
                <br></br>
                <h1>Landlord Details</h1>
                <br></br>
                <LandlordGrid />
              </Box>
            )}

            {selectedComponent === 'property' && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: '100%',
                  width: '100%',
                  maxHeight: 'calc(100vh - 64px)',
                  overflow: 'auto',
                }}
              >
                <br></br>
                <h1>Site Details</h1>
                <br></br>
                <SiteGrid />
              </Box>
            )}

            {selectedComponent === 'Invitebroker' && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: '100%',
                  width: '100%',
                  maxHeight: 'calc(100vh - 64px)',
                  overflow: 'auto',
                }}
              >
                <br></br>
                <h1>InviteBroker</h1>
                <br></br>
                <InviteBroker />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      )}
      {dealFormOpen && <DealForm />}

      <ConfirmationModal
        show={showLogoutConfirmation}
        onHide={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout!"
        cancelText="Cancel"
        confirmText="Logout"
        cancelVariant="secondary"
        confirmVariant="primary"
      />

      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={'error'}
        style={{ backgroundColor: '#DE5242', color: '#FEF9FD' }}
      />
    </>
  );
};

export default Navbar;
