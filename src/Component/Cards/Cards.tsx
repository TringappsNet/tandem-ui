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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(event.target.value);
    };

    const filteredDeals = dealsData.filter(deal => {
        const matchesSearch = deal.brokerName?.toLowerCase().includes(searchTerm.toLowerCase()) || deal.propertyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus ? deal.status === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <>
            <Navbar />
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    placeholder="Search by broker or property name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <select value={filterStatus} onChange={handleFilterChange} className={styles.filterSelect}>
                    <option value="">All Statuses</option>
                    <option value="Started">Started</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className={styles.cardList}>
                {filteredDeals.map((deal, index) => (
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
