import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle, IconButton, Box } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import LandlordGrid from '../Grids/landlordGrid/landlord-grid';
import { useDispatch, useSelector } from 'react-redux';
import DealForm from '../Milestone/Milestone';
import { createNewDeal, updateDealDetails } from '../Redux/slice/dealSlice';
import { AppDispatch } from '../Redux/store/index';
import { RootState } from '../Redux/reducers';

const Navbar: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const auth: any = localStorage.getItem('auth');
    const userdetails = JSON.parse(auth);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [openStepper, setOpenStepper] = useState(false);
    const [isFirstSave, setIsFirstSave] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const dealDetails = useSelector((state: RootState) => state.deal.dealDetails);
    // const dealsData = useSelector((state: RootState) => state.deal.dealDetails as unknown as DealsData);


    const handleOpenPopup = (componentName: string) => {
        setSelectedComponent(componentName);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedComponent(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleCards = () => {
        navigate('/cards');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const saveFormData = async () => {
        try {
            const dealtemp = dealDetails[0];
            if (dealtemp.isNew && isFirstSave) {
                await dispatch(createNewDeal(dealtemp));
                console.log('Form data saved:', dealtemp);
                setIsFirstSave(false);
                return;
            }
            await dispatch(updateDealDetails(dealtemp));
            console.log('Form data saved for put:', dealtemp);
            setIsFirstSave(true);
        } catch (error) {
            console.error('Error saving form data:', error);
            return;
        }
    };

    const createDealForm = () => {
        setOpenStepper(true);
    };

    const handlelogoclick = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <nav className={styles.navbarcontainer}>
                <div className={styles.headersection}>
                    <div className={styles.header} onClick={handlelogoclick}>
                        <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
                        <h3>TANDEM INFRASTRUCTURE</h3>
                    </div>
                    <p onClick={handleCards}>DEALS</p>
                </div>

                <div className={styles.rightheadersection}>
                    <div className={styles.createdeal}>
                        <p onClick={() => createDealForm()}>CREATE</p>
                    </div>
                    <div className={styles.userdropdown} onClick={toggleDropdown} ref={dropdownRef}>
                        <p>{userdetails ? `${userdetails.user.firstName} ${userdetails.user.lastName}` : 'Guest'}</p>
                        <div className={styles.circle}>
                            <p>{userdetails ? userdetails.user.firstName[0] : 'G'}</p>
                        </div>
                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={() => handleOpenPopup('Profile')}>Profile</button>
                                <button onClick={() => handleOpenPopup('SendInvite')}>Send Invite</button>
                                <button onClick={() => handleOpenPopup('Reset')}>Reset</button>
                                <button onClick={() => handleOpenPopup('Site')}>Site</button>
                                <button onClick={() => handleOpenPopup('Landlord')}>Landlord</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
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
                            fontSize: 30,
                            cursor: 'pointer'
                        }}
                    >
                        <CloseIcon />
                    </Icon>
                </DialogTitle>

                <DialogContent sx={{ padding: 0 }}>
                    {selectedComponent === 'SendInvite' && <SendInvite />}
                    {selectedComponent === 'Reset' && <Reset />}
                    {selectedComponent === 'Landlord' && (
                        <Box sx={{ padding: 1, borderRadius: 1, height: '100%', width: '100%', maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                            <br></br>
                            <h1>Landlord Details</h1>
                            <br></br>
                            <LandlordGrid />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                fullScreen
                sx={{ margin: '30px 190px' }}
                open={openStepper}
                onClose={() => {
                    setOpenStepper(false);
                    saveFormData();
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
                    <DealForm />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;