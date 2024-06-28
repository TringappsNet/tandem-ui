import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { IoIosClose } from 'react-icons/io';
import styles from './Navbar.module.css';

// import Profile from './Profile';
import SendInvite from '../SendInvite/SendInvite';
// import Reset from './Reset';
// import Site from './Site';
// import Landlord from './Landlord';

const Navbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // const handleClickOutside = (event: MouseEvent) => {
    //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //         setIsDropdownOpen(false);

    //     }
    // };

    const handleOpenPopup = (componentName: string) => {
        setSelectedComponent(componentName);
        setOpenPopup(true);
        setIsDropdownOpen(false);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedComponent(null);
    };

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    return (
        <>
            <nav className={styles.navbarcontainer}>
                <div className={styles.header}>
                    <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
                    <h3>TANDEM INFRASTRUCTURE</h3>
                    <a href="#">SITE</a>
                </div>
                <div className={styles.userdropdown} ref={dropdownRef} onClick={toggleDropdown}>
                    <p>dineshkumar@gmail.com</p>
                    <div className={styles.circle}><p>A</p></div>
                    {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <a href="" onClick={() => handleOpenPopup('Profile')}>Profile</a>
                            <a href="#sendInvite" onClick={() => handleOpenPopup('SendInvite')}>Send Invite</a>
                            <a href="#" onClick={() => handleOpenPopup('Reset')}>Reset</a>
                            <a href="#" onClick={() => handleOpenPopup('Site')}>Site</a>
                            <a href="#" onClick={() => handleOpenPopup('Landlord')}>Landlord</a>
                            <a href="#">Logout</a>
                        </div>
                    )}
                </div>
            </nav>
            {openPopup &&
                <Dialog open={openPopup} onClose={handleClosePopup}>
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', margin: 0, padding: 1 }}>
                        <IconButton onClick={handleClosePopup} aria-label="close" sx={{ width: "50px" }}>
                            <IoIosClose size={35} />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {/* {selectedComponent === 'Profile' && <Profile />} */}
                        {selectedComponent === 'SendInvite' && <SendInvite />}
                        {/* {selectedComponent === 'Reset' && <Reset />}
                    {selectedComponent === 'Site' && <Site />}
                    {selectedComponent === 'Landlord' && <Landlord />} */}
                    </DialogContent>
                </Dialog>}
        </>
    );
};

export default Navbar;
