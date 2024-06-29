import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, IconButton, DialogActions, Icon } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';


const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOpenPopup = (componentName: string) => {
        setSelectedComponent(componentName);
        if (componentName !== null) {
            setOpenPopup(true);
            setIsDropdownOpen(false);
        }
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedComponent(null);
    };

    return (
        <>
            <nav className={styles.navbarcontainer}>
                <div className={styles.header}>
                    <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
                    <h3>TANDEM INFRASTRUCTURE</h3>
                    <a href="/#">CARDS</a>
                </div>
                <div className={styles.userdropdown} ref={dropdownRef}>
                    <p>dineshkumar@gmail.com</p>
                    <div className={styles.circle}><p>A</p></div>
                    <div className={styles.dropdownMenu}>
                        <a href="#" onClick={() => handleOpenPopup('Profile')}>Profile</a>
                        <a href="#sendInvite" onClick={() => handleOpenPopup('SendInvite')}>Send Invite</a>
                        <a href="#" onClick={() => handleOpenPopup('Reset')}>Reset</a>
                        <a href="#" onClick={() => handleOpenPopup('Site')}>Site</a>
                        <a href="#" onClick={() => handleOpenPopup('Landlord')}>Landlord</a>
                        <a href="#">Logout</a>
                    </div>
                </div>
            </nav>

            <Dialog open={openPopup} onClose={handleClosePopup}>
                <Icon
                    aria-label="close"
                    onClick={handleClosePopup}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </Icon>

                <DialogContent>
                    {selectedComponent === 'SendInvite'  && <SendInvite />}
                    {selectedComponent === 'Reset' && <Reset />}
                    {/* Add other components here */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;
