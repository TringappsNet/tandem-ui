import React, { useState } from 'react';
import { Dialog, DialogContent, Icon, DialogTitle, IconButton, Box } from '@mui/material';
import styles from './Navbar.module.css';
import SendInvite from '../SendInvite/SendInvite';
import Reset from '../ResetPassword/ResetPassword';
import CloseIcon from '@mui/icons-material/Close';
import CreateDeal from '../Milestone/Milestone';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import LandlordGrid from '../Grids/landlordGrid/landlord-grid';
// import { useSelector } from 'react-redux';
// import { RootState } from '../Redux/reducers/index';
import SiteGrid from '../Grids/Site-grid/site-grid';

const Navbar: React.FC = () => {
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [openStepper, setOpenStepper] = useState(false);
    const [isFirstSave, setIsFirstSave] = useState(true); // Track if it's the first save
    // const [dealFormData, setDealFormData] = useState<Deal>();

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
    // const dealDetails: any = useSelector((state: RootState) => state.deal.dealDetails);

    const saveFormData = async () => {

        try {
          const deal: any = localStorage.getItem('dealdetails')
          const dealtemp: any = JSON.parse(deal)
          if (dealtemp.isNew && isFirstSave) {
            const response = await axiosInstance.post('/deals/deal', dealtemp);
            console.log('Form data saved:', response.data);
            localStorage.removeItem('dealdetails');
            setIsFirstSave(false);
            return
          }
          const response = await axiosInstance.put(`/deals/deal/${dealtemp.id}`, dealtemp);
          console.log('Form data saved for put:', response.data);
          localStorage.removeItem('dealdetails');
          setIsFirstSave(true);
    
        } catch (error) {
          console.error('Error saving form data:', error);
          return
        }
      };


    const createDealForm = () => {
        setOpenStepper(true);
        // setDealFormData(undefined);
        // console.log("card Deal respected value ", deal);
    }


    return (
        <>
            <nav className={styles.navbarcontainer}>
                <div className={styles.header}>
                    <img src='https://static.wixstatic.com/media/de20d1_c11a5e3e27554cde9ed8e2312c36095b~mv2.webp/v1/fill/w_90,h_90,al_c,lg_1,q_80,enc_auto/Logo%20Transparency%20-%20Icon.webp0' alt="Tandem Logo" />
                    <h3>TANDEM INFRASTRUCTURE</h3>
                    <p onClick={handleCards} style={{ cursor: 'pointer' }}>DEALS</p>
                    <p onClick={() => handleOpenPopup('Site')} style={{ cursor: 'pointer' }} >SITE</p>
                    <p onClick={() => handleOpenPopup('Landlord')} style={{ cursor: 'pointer' }}>LANDLORD</p>
                </div>

                <div className={styles.rightheadersection}>
                    <div className={styles.createdeal}>
                        <p onClick={() => createDealForm()}>CREATE</p>
                    </div>
                    <div className={styles.userdropdown}>
                        <p>dineshkumar@gmail.com</p>
                        <div className={styles.circle}><p>A</p></div>
                        <div className={styles.dropdownMenu}>
                            <button onClick={() => handleOpenPopup('Profile')}>Profile</button>
                            <button onClick={() => handleOpenPopup('SendInvite')}>Send Invite</button>
                            <button onClick={() => handleOpenPopup('Reset')}>Reset</button>
                           
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <Dialog
                open={openPopup}
                onClose={handleClosePopup}
                maxWidth={{selectedComponent} ? 'xl' : 'sm'}
                // fullWidth={{selectedComponent} }
                PaperProps={{
                    sx: {
                        height: {selectedComponent}  ? '100vh' : 'auto', 
                        width: {selectedComponent} ? '100vw' : 'auto', 

                        
                    }

                   
                }}
                sx={{ padding: 0, margin: 0 }}
            >
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

                <DialogContent sx={{ padding: selectedComponent === 'Landlord' ? 2 : 0 }}> {/* Conditionally adjust padding */}
                    {selectedComponent === 'SendInvite' && <SendInvite />}
                    {selectedComponent === 'Reset' && <Reset />}
                    {/* {selectedComponent === 'CreateDeal' && <CreateDeal />} */}
                    {selectedComponent === 'Landlord' && (
                    <Box sx={{ padding: 1, borderRadius: 1, height: '100%', width: '100%', maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                        <br></br>
                        <h1>Landlord Details</h1>
                        <br></br>
                        <LandlordGrid />

                    </Box>


                    )}


                   {selectedComponent === 'Site' && ( 
                    <Box sx={{ padding: 1, borderRadius: 1, height: '100%', width: '100%', maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
                        <br></br>
                        <h1>Site Details</h1>
                        <br></br>
                        < SiteGrid/>

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
                    <CreateDeal />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Navbar;