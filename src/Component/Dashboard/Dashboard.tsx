import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import SidePanel from './SidePanel';
import Navbar from './Navbar';
import { Deal } from '../Interface/DealFormObject';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DealForm from '../Milestone/Milestone';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { useLocation } from 'react-router-dom';

interface DashboardProps {
    accessToken: string;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {
    const [dealFormData, setDealFormData] = useState<Deal>();
    const [openStepper, setOpenStepper] = useState(false);
    const [isFirstSave, setIsFirstSave] = useState(true);
    const location = useLocation();

    const fetchBrokerData = async () => {
        try {
            const response = await fetch('http://localhost:3008/api/brokers');
            console.log(response);
        } catch (error) {
            console.error(`Error fetching broker data:`, error);
        }
    };

    useEffect(() => {
        fetchBrokerData();
    }, []);

    useEffect(() => {
        if (location.pathname === '/formdata') {
            setOpenStepper(true);
        }
    }, [location.pathname]);

    const saveFormData = async () => {
        try {
            const deal: any = localStorage.getItem('dealdetails');
            const dealtemp: any = JSON.parse(deal);
            if (dealtemp.isNew && isFirstSave) {
                const response = await axiosInstance.post('/deals/deal', dealtemp);
                console.log('Form data saved:', response.data);
                localStorage.removeItem('dealdetails');
                setIsFirstSave(false);
                return;
            }

            const response = await axiosInstance.put(`/deals/deal/${dealtemp.id}`, dealtemp);
            console.log('Form data saved for put:', response.data);
            localStorage.removeItem('dealdetails');
            setIsFirstSave(true);
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    };

    const handleCreateDeal = () => {
        setOpenStepper(true);
        setDealFormData(undefined);
    };

    // const editDealForm = (deal: Deal) => {
    //     setOpenStepper(true);
    //     setDealFormData(deal);
    // };

    return (
        <div className={styles.pageContainer}>
            <Navbar onLogout={onLogout} onCreateDeal={handleCreateDeal} />
            <div className={styles.contentWrapper}>
                <SidePanel />
                <div className={styles.mainContent}></div>
            </div>
            <>
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
                        <DealForm selectedDeal={dealFormData} />
                    </DialogContent>
                </Dialog>
            </>
        </div>
    );
};

export default Dashboard;
