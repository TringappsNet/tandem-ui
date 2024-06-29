import React, { useState } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import CreateDeal from '../Milestone/Milestone';


const Navbar: React.FC = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

    const handleOpenPopup = (componentName: string) => {
        setSelectedComponent(componentName);
        setOpenPopup(true);
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
                    <p>CARDS</p>
                </div>

                <div className={styles.rightheadersection}>
                    <div className={styles.createdeal}>
                        <p onClick={() => handleOpenPopup('CreateDeal')}>CREATE</p>
                    </div>
                    <div className={styles.userdropdown}>
                        <p>dineshkumar@gmail.com</p>
                        <div className={styles.circle}><p>A</p></div>
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => handleOpenPopup('Profile')}>Profile</button>
                            <button onClick={() => handleOpenPopup('SendInvite')}>Send Invite</button>
                            <button onClick={() => handleOpenPopup('Reset')}>Reset</button>
                            <button onClick={() => handleOpenPopup('Site')}>Site</button>
                            <button onClick={() => handleOpenPopup('Landlord')}>Landlord</button>
                            <button>Logout</button>
                        </div>
                    </div>

                </div>
            </nav>

            <Dialog open={openPopup} onClose={handleClosePopup} sx={{ padding: 0, margin: 0 }}>
                <DialogTitle sx={{ padding: 0 }}>
                    <Icon
                        aria-label="close"
                        onClick={handleClosePopup}
                        sx={{
                            position: 'absolute',
                            right: 18,
                            top: 8,
                            zIndex: 999,
                            fontSize: 30
                        }}
                    >
                        <CloseIcon />
                    </Icon>
                </DialogTitle>

                <DialogContent sx={{ padding: 0 }}>
                    {selectedComponent === 'SendInvite' && <SendInvite />}
                    {selectedComponent === 'Reset' && <Reset />}
                    {selectedComponent === 'CreateDeal' && <CreateDeal />}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;
