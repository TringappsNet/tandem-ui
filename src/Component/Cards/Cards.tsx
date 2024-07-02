import React, { useState, useEffect } from 'react';
import styles from './Cards.module.css';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { FiEdit } from "react-icons/fi";
import Navbar from '../Navbar/Navbar';

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

const Cards: React.FC = () => {
    const [dealsData, setDealsData] = useState<Deal[]>([]);

    useEffect(() => {
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

        fetchDeals();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    const editDealForm = (deal: Deal) => {
        // setOpenStepper(true);
        // setDealFormData(deal);
        console.log("card Deal respected value ", deal);
    }

    const getStatusButtonClass = (status: string) => {
        switch (status) {
            case "Completed":
                return styles.statusButtonFinished;
            case "In-Progress":
                return styles.statusButtonInProgress;
            case "Started":
                return styles.statusButtonStarted;
            default:
                return '';
        }
    };

    return (
        <>
        <Navbar />
        <div className={styles.cardList} >
            {dealsData.map((deal, index) => (
                <div key={index} className={styles.card}>
                    <div>
                        <div className={styles.cardTitle}>Deal #{deal.id} <div className={styles.hide}><FiEdit onClick={() => editDealForm(deal)} /></div></div>
                        <p className={styles.brokerName}><span>Broker Name:</span> {deal.brokerName}</p>
                    </div>
                    <div className={styles.statusLine}>
                        <div className={styles.statusLabel}>Status:</div>
                        <div className={`${styles.statusButton} ${getStatusButtonClass(deal.status)}`}>
                            {deal.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
        
    );
};

export default Cards;
