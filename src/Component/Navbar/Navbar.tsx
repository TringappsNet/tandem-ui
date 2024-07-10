import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, Icon, DialogTitle, Box } from "@mui/material";
import styles from "./Navbar.module.css";
import SendInvite from "../SendInvite/SendInvite";
import Reset from "../ResetPassword/ResetPassword";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import LandlordGrid from "../Grids/landlordGrid/Landlord";
import SiteGrid from "../Grids/SiteGrid/SiteGrid";
import InviteBroker from "../Grids/inviteBroker-grid/InviteBroker-grid";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../Redux/store/index";
import { RootState } from "../Redux/reducers";
import Profile from "../Profile/profile";
import Support from "../Support/Support";
import DealForm from "../DealForm/dealForm";
import ConfirmationModal from "../AlertDialog/AlertDialog";
import { openDealForm } from "../Redux/slice/deal/componentsSlice";
import {
  openProfile,
  closeProfile,
  openSendInvite,
  closeSendInvite,
  openReset,
  closeReset,
  openSupport,
  closeSupport,
} from "../Redux/slice/deal/componentsSlice";

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
  const userdetails = useSelector((state: RootState) => state.auth.user);
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const dealFormOpen = useSelector((state: RootState) => state.dealForm.open);
  const profileOpen = useSelector(
    (state: RootState) => state.profile.open
  );
  const inviteOpen = useSelector(
    (state: RootState) => state.sendInvite.open
  );
  const resetOpen = useSelector((state: RootState) => state.resetPassword.open);
  const supportOpen = useSelector(
    (state: RootState) => state.support.open
  );

  const handleOpenPopup = (componentName: string) => {
    setSelectedComponent(componentName);
    setOpenPopup(true);

    if (componentName === "SendInvite") {
      dispatch(openSendInvite());
    } else if (componentName === "Profile") {
      dispatch(openProfile());
    } else if (componentName === "Reset") {
      dispatch(openReset());
    } else if (componentName === "Support") {
      dispatch(openSupport());
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setSelectedComponent(null);

    if (selectedComponent === "SendInvite") {
      dispatch(closeSendInvite());
    } else if (selectedComponent === "Profile") {
      dispatch(closeProfile());
    } else if (selectedComponent === "Reset") {
      dispatch(closeReset());
    } else if (selectedComponent === "Support") {
      dispatch(closeSupport());
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    navigate("/login");
    setShowLogoutConfirmation(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirmation(false);
  };

  const handleCards = () => {
    navigate("/cards");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRoute = (route: string) => {
    if (route === "site") {
      navigate("/site");
    } else if (route === "landlord") {
      navigate("/landlord");
    } else if (route === "invitebroker") {
      navigate("/invitebroker");
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlelogoclick = () => {
    navigate("/dashboard");
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
          <p onClick={handleCards} style={{ cursor: "pointer" }}>
            DEALS
          </p>
          <p onClick={() => handleRoute("site")} style={{ cursor: "pointer" }}>
            PROPERTY
          </p>
          <p
            onClick={() => handleRoute("landlord")}
            style={{ cursor: "pointer" }}
          >
            LANDLORD
          </p>
          <p
            onClick={() => handleRoute("invitebroker")}
            style={{ cursor: "pointer" }}
          >
            INVITEBROKER
          </p>
        </div>
        <div className={styles.rightheadersection}>
          <div
            className={styles.createdeal}
            onClick={() => dispatch(openDealForm())}
          >
            <p>CREATE</p>
          </div>
          <div
            className={styles.userdropdown}
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <div className={styles.username}>
              <p>
                Welcome,{" "}
                {userdetails
                  ? `${userdetails.firstName} ${userdetails.lastName}`
                  : "Guest"}
              </p>
            </div>
            <div className={styles.circle}>
              <p>{userdetails ? userdetails.firstName[0] : "G"}</p>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={() => handleOpenPopup("Profile")}>
                  Profile
                </button>
                <button onClick={() => handleOpenPopup("SendInvite")}>
                  Send Invite
                </button>
                <button onClick={() => handleOpenPopup("Reset")}>Reset</button>
                <button onClick={() => handleOpenPopup("Support")}>
                  Contact us
                </button>
                <button onClick={handleLogoutClick}>Logout</button>
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
                position: "absolute",
                right: 18,
                top: 8,
                zIndex: 999,
                fontSize: 30,
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </Icon>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            {inviteOpen && selectedComponent === "SendInvite" && (
              <SendInvite onCloseDialog={handleClosePopup} />
            )}
            {profileOpen && selectedComponent === "Profile" && (
              <Profile onCloseDialog={handleClosePopup} />
            )}
            {resetOpen && selectedComponent === "Reset" && (
              <Reset onCloseDialog={handleClosePopup} />
            )}
            {supportOpen && selectedComponent === "Support" && (
              <Support onCloseDialog={handleClosePopup} />
            )}
            {selectedComponent === "Landlord" && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: "100%",
                  width: "100%",
                  maxHeight: "calc(100vh - 64px)",
                  overflow: "auto",
                }}
              >
                <br></br>
                <h1>Landlord Details</h1>
                <br></br>
                <LandlordGrid />
              </Box>
            )}

            {selectedComponent === "Site" && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: "100%",
                  width: "100%",
                  maxHeight: "calc(100vh - 64px)",
                  overflow: "auto",
                }}
              >
                <br></br>
                <h1>Site Details</h1>
                <br></br>
                <SiteGrid />
              </Box>
            )}

            {selectedComponent === "Invitebroker" && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  height: "100%",
                  width: "100%",
                  maxHeight: "calc(100vh - 64px)",
                  overflow: "auto",
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
    </>
  );
};

export default Navbar;
