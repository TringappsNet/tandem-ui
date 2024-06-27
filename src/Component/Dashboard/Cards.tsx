import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';
// import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Navbar';
import SidePanel from './SidePanel';
import { FiEdit } from "react-icons/fi";
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

interface CardsProps {
    onLogout: () => void;
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

const Cards: React.FC<CardsProps> = ({ onLogout }) => {
    const [showCards, setShowCards] = useState(true);
    const [dealsData, setDealsData] = useState<Deal[]>([]);
    // const [dealFormData, setDealFormData] = useState<Deal>();
    // const [openStepper, setOpenStepper] = useState(false);
    const location = useLocation();

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
        if (location.pathname === '/cards') {
            setShowCards(true);
            fetchDeals();
        }
    }, [location.pathname]);

    const getStatusButtonClass = (status: string) => {
        switch (status) {
            case "Finished":
                return styles.statusButtonFinished;
            case "InProgress":
                return styles.statusButtonInProgress;
            case "Started":
                return styles.statusButtonStarted;
            default:
                return '';
        }
    };

    const editDealForm = (deal: Deal) => {
        // setOpenStepper(true);
        // setDealFormData(deal);
        console.log("card Deal respected value ", deal);
    };

    const handleCreateDeal = () => {
        // setOpenStepper(true);
        // setDealFormData(undefined);
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar onLogout={onLogout} onCreateDeal={handleCreateDeal} />
            <div className={styles.contentWrapper}>
                <SidePanel />
                <div className={styles.mainContent}>
                    {showCards && (
                        <div className={styles.cardContainer}>
                            <div className={styles.cardTags}>
                                <span className={styles.tag}>Deals: </span>
                                <span className={styles.tag}>In Progress: </span>
                                <span className={styles.tag}>Received Commission: </span>
                            </div>
                            <div className={styles.cardList}>
                                {dealsData.map((deal, index) => (
                                    <div key={index} className={styles.card}>
                                        <div className={styles.cardTitle}>
                                            Deal #{deal.id}
                                            <div className={styles.hide}>
                                                <FiEdit onClick={() => editDealForm(deal)} />
                                            </div>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <p className={styles.brokerName}>
                                                <span>Broker Name:</span> {deal.brokerName}
                                            </p>
                                            <div className={styles.statusLine}>
                                                <span className={styles.statusLabel}>Status:</span>
                                                <span className={`${styles.statusButton} ${getStatusButtonClass(deal.status)}`}>
                                                    {deal.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cards;
