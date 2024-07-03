import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle, IconButton } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import CreateDeal from '../Milestone/Milestone';
import { useNavigate } from 'react-router-dom';
import LandlordGrid from '../Grids/landlordGrid/landlord-grid';
import { useDispatch, useSelector } from 'react-redux';
import DealForm from '../Milestone/Milestone';
import { createNewDeal, updateDealDetails } from '../Redux/slice/dealSlice';
import { AppDispatch } from '../Redux/store/index';
import { RootState } from '../Redux/reducers';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { useSelector } from 'react-redux';
import Profile from '../Profile/profile';
import Support from '../Support/Support';


interface RootState {
    auth: {
        user: {
            firstName: string;
            lastName: string;
        } | null;
    };
}

const Navbar: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const auth: any = localStorage.getItem('auth');
    const userdetails = JSON.parse(auth);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [openStepper, setOpenStepper] = useState(false);
    const [isFirstSave, setIsFirstSave] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);



    // interface Deal {
    //     activeStep: number;
    //     status: string;
    //     propertyName: string | null;
    //     brokerName: string | null;
    //     dealStartDate: string | null;
    //     proposalDate: string | null;
    //     loiExecuteDate: string | null;
    //     leaseSignedDate: string | null;
    //     noticeToProceedDate: string | null;
    //     commercialOperationDate: string | null;
    //     potentialcommissiondate: string | null;
    //     potentialCommission: string | null;
    //     createdBy: number;
    //     updatedBy: number;
    //     isNew: boolean;
    //     id: number | null;
    // }

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
                return
            }

            await dispatch(updateDealDetails(dealtemp));
            console.log('Form data saved for put:', dealtemp);
            setIsFirstSave(true);

        } catch (error) {
            console.error('Error saving form data:', error);
            return
        }
    };
    const createDealForm = () => {
        setOpenStepper(true);
    }

    useEffect(() => {
        if (!openStepper) {
            saveFormData();
        }
    });


    return (
        <>
            <nav className={styles.navbarcontainer}>
                <div className={styles.header}>
                    <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
                    <h3>TANDEM INFRASTRUCTURE</h3>
                    <p onClick={handleCards} style={{ cursor: 'pointer' }}>DEALS</p>
                </div>

                <div className={styles.rightheadersection}>
                    <div className={styles.createdeal}>
                        <p onClick={() => createDealForm()}>CREATE</p>
                    </div>
                    <div className={styles.userdropdown} onClick={toggleDropdown} ref={dropdownRef}>
                        <p>{user ? `${user.firstName} ${user.lastName}` : 'Guest'}</p>
                        <div className={styles.circle}>
                            <p>{user ? user.firstName[0] : 'G'}</p>
                        </div>
                        {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={() => handleOpenPopup('Profile')}>Profile</button>
                                <button onClick={() => handleOpenPopup('SendInvite')}>Send Invite</button>
                                <button onClick={() => handleOpenPopup('Reset')}>Reset</button>
                                <button onClick={() => handleOpenPopup('Site')}>Site</button>
                                <button onClick={() => handleOpenPopup('Landlord')}>Landlord</button>
                                <button onClick={() => handleOpenPopup('Support')}>Support</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}

                    </div>
                </div>
            </nav>

            <Dialog open={openPopup} sx={{ padding: 0, margin: 0 }}>
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
                    {selectedComponent === 'Profile' && <Profile />}
                    {selectedComponent === 'Support' && <Support />}


                    {/* {selectedComponent === 'CreateDeal' && <CreateDeal />} */}
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
                    <CreateDeal />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;