import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle, Box } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
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
import { openDealForm } from '../Redux/slice/deal/dealCompSlice';
import {
  closeSendInvite,
  openSendInvite,
} from "../Redux/slice/auth/sendInviteSlice";
import { closeReset, openReset } from "../Redux/slice/auth/resetSlice";
import { closeSupport, openSupport } from "../Redux/slice/support/supportSlice";
import { closeProfile, openProfile } from "../Redux/slice/profile/profileSlice";
import { PiUserCirclePlusFill } from "react-icons/pi";
import { IoIosSend, IoIosContacts  } from "react-icons/io";
import { MdOutlineLockReset } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import SnackbarComponent from '../Snackbar/Snackbar';


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
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dealFormOpen = useSelector((state: RootState) => state.dealForm.open);
  const profileOpen = useSelector((state: RootState) => state.profile.open);
  const inviteOpen = useSelector((state: RootState) => state.sendInvite.open);
  const resetOpen = useSelector((state: RootState) => state.reset.open);
  const supportOpen = useSelector((state: RootState) => state.contact.open);

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

  const handleLogoutConfirm = () => {
    localStorage.clear();
    navigate('/login');
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleCards = () => {
    navigate('/cards');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRoute = (route: string) => {
    if (route === 'site') {
      navigate('/site');
    } else if (route === 'landlord') {
      navigate('/landlord');
    } else if (route === 'invitebroker') {
      navigate('/invitebroker');
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

  const handlelogoclick = () => {
    navigate('/dashboard');
  };

  const handleCreateDealClick = () => {
    const availableSites = sites.filter(
      (site) =>
        !deals.some(
          (deal) =>
            deal.propertyName === `${site.addressline1}, ${site.addressline2}`
        )
    );

    if (availableSites.length === 0) {
      setSnackbarMessage('No sites available to create a deal.');
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
              src="https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0"
              alt="Tandem Logo"
            />
            <h3>TANDEM INFRASTRUCTURE</h3>
          </div>
          {userdetails.isAdmin && (
            <>
              <p onClick={handleCards} style={{ cursor: 'pointer' }}>
                DEALS
              </p>
              <p
                onClick={() => handleRoute('site')}
                style={{ cursor: 'pointer' }}
              >
                PROPERTY
              </p>
              <p
                onClick={() => handleRoute('landlord')}
                style={{ cursor: 'pointer' }}
              >
                LANDLORD
              </p>
              <p
                onClick={() => handleRoute('invitebroker')}
                style={{ cursor: 'pointer' }}
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
                Welcome,{' '}
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
              <p>{userdetails ? userdetails.user?.firstName[0] : 'G'}</p>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleOpenPopup("Profile")}>
                <PiUserCirclePlusFill className={styles.icons} />Profile
                </button>
                {userdetails.isAdmin && (
                  <button onClick={() => handleOpenPopup("SendInvite")}>
                    <IoIosSend className={styles.icons} />Send Invite
                  </button>
                )}
                <button onClick={() => handleOpenPopup("Reset")}><MdOutlineLockReset className={styles.icons} />Reset</button>
                <button onClick={() => handleOpenPopup("Support")}>
                <IoIosContacts className={styles.icons} /> Contact us
                </button>
                <button onClick={handleLogoutClick}><IoLogOutOutline className={styles.icons} />Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {openPopup && selectedComponent && (
        <Dialog open={openPopup} sx={{ padding: 0, margin: 0 }} maxWidth="lg">
          <DialogTitle sx={{ padding: 0 }}>
            <Icon
              aria-label="close"
              onClick={handleClosePopup}
              sx={{
                position: 'absolute',
                right: 18,
                top: 8,
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

            {selectedComponent === 'Site' && (
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
      />
    </>
  );
};

export default Navbar;
