import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import styles from './DashboardComp.module.css';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
=======
import styles from './Dashboard.module.css';
import Navbar from './Navbar';
import { Deal } from '../Interface/DealFormObject';
>>>>>>> Stashed changes
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'bootstrap/dist/css/bootstrap.css';
import DealForm from '../Milestone/Milestone';
import SidePanel from './SidePanel';
import Navbar from './Navbar';

interface DashboardProps {
    accessToken: string;
    onLogout: () => void;
}

interface BrokerData {
    id: number;
    firstname: string;
    status: string;
    comments: string;
}

interface Deal {
    activeStep: number;
    status: string;
    propertyName: string | null;
    brokerName: string | null;
    dealStartDate: string | null;
    proposalDate: string | null;
    loiExecuteDate: string | null;
    leaseSignedDate: string | null;
    noticeToProceedDate: string | null;
    commercialOperationDate: string | null;
    potentialcommissiondate: string | null;
    potentialCommission: string | null;
    createdBy: number;
    updatedBy: number;
    isNew: boolean;
    id: number | null;
}

const Dashboard: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {
    const [showGrid, setShowGrid] = useState(false);
    const [gridData, setGridData] = useState<BrokerData[]>([]);
    const [dealsData, setDealsData] = useState<Deal[]>([]);
    const [isFirstSave, setIsFirstSave] = useState(true);
    const [dealFormData, setDealFormData] = useState<Deal>();
    const [showCards, setShowCards] = useState(false);
    const [openStepper, setOpenStepper] = useState(false);



    const fetchBrokerData = async () => {
        try {
            const response = await fetch('http://192.168.1.223:3008/api/brokers');
            const data = await response.json();
            const formattedData = data.map(({ id, firstname }: any) => ({
                id,
                firstname,
                status: "In Progress",
                comments: ""
            }));
            setGridData(formattedData);
            setShowGrid(true);
        } catch (error) {
            console.error(`Error fetching broker data:`, error);
        }
    };

    useEffect(() => {
        fetchBrokerData();
    }, []);

    const fetchDeals = async () => {
        try {
            const response = await axiosInstance.get('/deals');
            const fetchedDeals: Deal[] = response.data.deals;
            setDealsData(fetchedDeals);
            console.log('Deals Fetched value:', response.data);
        } catch (error) {
            console.error('Error fetching broker names:', error);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const saveFormData = async () => {
        try {
            const deal: any = localStorage.getItem('dealdetails')
            const dealtemp: any = JSON.parse(deal)
            if (dealtemp.isNew && isFirstSave) {
                const response = await axiosInstance.post('/deals/deal', dealtemp);
                console.log('Form data saved:', response.data);
                localStorage.removeItem('dealdetails');
                setIsFirstSave(false);
                fetchDeals();
                return
            }

            const response = await axiosInstance.put(`/deals/deal/${dealtemp.id}`, dealtemp);
            console.log('Form data saved for put:', response.data);
            localStorage.removeItem('dealdetails');
            setIsFirstSave(true);
            fetchDeals();

        } catch (error) {
            console.error('Error saving form data:', error);
            return
        }
    };

    const editDealForm = (deal: Deal) => {
        setOpenStepper(true);
        setDealFormData(deal);
        console.log("card Deal respected value ", deal);
    }

    const createDealForm = () => {
        setOpenStepper(true);
        setDealFormData(undefined);
    }

    return (
        <div className={styles.pageContainer}>
            <Navbar onLogout={onLogout} />
            <div className={styles.contentWrapper}>
<<<<<<< Updated upstream
                <SidePanel />
                <div className={styles.mainContent}>
                    {showGrid && (
                        <div className={styles.gridContainer}>
                            <table className={styles.grid}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Broker</th>
                                        <th>Status</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gridData.map((data) => (
                                        <tr key={data.id}>
                                            <td>{data.id}</td>
                                            <td>{data.firstname}</td>
                                            <td>{data.status}</td>
                                            <td>{data.comments}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showCards && (
                        <div className={styles.cardsContainer}>
                            <h2>Deals</h2>
                            <button onClick={createDealForm}>Create New Deal</button>
                            {dealsData.map((deal) => (
                                <div key={deal.id} className={styles.card} onClick={() => editDealForm(deal)}>
                                    <h3>{deal.propertyName}</h3>
                                    <p>Broker: {deal.brokerName}</p>
                                    <p>Status: {deal.status}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* {selectedButton && (
                        <div className={styles.selectedButtonInfo}>
                            <p>Selected Button: {selectedButton}</p>
                        </div>
                    )} */}
                </div>
=======
                <div className={styles.metro}>
                    <div className={styles.cardHeader}>Completed Deals</div>
                    <div className={styles.cardContent}></div>
                </div>
                <div className={styles.metro}>
                    <div className={styles.cardHeader}>In progress Deals</div>
                    <div className={styles.cardContent}></div>
                </div>
                <div className={styles.metro}>
                    <div className={styles.cardHeader}>Commission</div>
                    <div className={styles.cardContent}></div>
                </div>
                <div className={styles.mainContent}>
                    
                </div>
            </div>
            <>
>>>>>>> Stashed changes
                <Dialog
                    fullScreen
                    sx={{ margin: '30px 190px' }}
                    open={openStepper}
                    onClose={() => {
                        setOpenStepper(false);
                        saveFormData();
                        setShowCards(true);
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
                                setShowCards(true);
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
            </div>
        </div>
    );
};

export default Dashboard;