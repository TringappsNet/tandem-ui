import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './DashboardComp.module.css';
//import 'bootstrap/dist/css/bootstrap.css';
import Navbar from './Navbar';
import SidePanel from './SidePanel';

interface Cardsprops {
    onLogout: () => void;
}

const deals = [
    {
        "id": 1,
        "activestep": 1,
        "Status": "InProgress",
        "brokername": "Joe",
        "propertyId": 1,
        "dealstartdate": "01-06-2024",
        "proposaldate": null,
        "loiexceutedate": null,
        "leasesigneddate": null,
        "Noticetoprocceddate": null,
        "commercialoperationdate": null,
        "potentialcommissiondate": null,
        "potentialcommission": null
    },
    {
        "id": 2,
        "activestep": 4,
        "Status": "Started",
        "brokername": "Joe",
        "propertyId": 1,
        "dealstartdate": "01-06-2024",
        "proposaldate": "02-06-2024",
        "loiexceutedate": "05-06-2024",
        "leasesigneddate": "06-06-2024",
        "Noticetoprocceddate": null,
        "commercialoperationdate": null,
        "potentialcommissiondate": null,
        "potentialcommission": null
    },
    {
        "id": 3,
        "activestep": 5,
        "Status": "InProgress",
        "brokername": "Joe",
        "propertyId": 1,
        "dealstartdate": "01-06-2024",
        "proposaldate": "02-06-2024",
        "loiexceutedate": "05-06-2024",
        "leasesigneddate": "06-06-2024",
        "Noticetoprocceddate": "07-06-2024",
        "commercialoperationdate": null,
        "potentialcommissiondate": null,
        "potentialcommission": null
    },
    {
        "id": 4,
        "activestep": 7,
        "Status": "Completed",
        "brokername": "Joe",
        "propertyId": 1,
        "dealstartdate": "01-06-2024",
        "proposaldate": "02-06-2024",
        "loiexceutedate": "05-06-2024",
        "leasesigneddate": "06-06-2024",
        "Noticetoprocceddate": "07-06-2024",
        "commercialoperationdate": "08-06-2024",
        "potentialcommissiondate": "10-06-2024",
        "potentialcommission": "$5"
    }

];


const Cards: React.FC<Cardsprops> = ({ onLogout }) => {
    const [showCards, setShowCards] = useState(false);
    const location = useLocation();


    useEffect(() => {
        if (location.pathname === '/cards') {
            setShowCards(true);
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


    return (
        <div className={styles.pageContainer}>
            <Navbar onLogout={onLogout} />
            <div className={styles.contentWrapper}>
                <SidePanel />
                <div className={styles.mainContent}>
                    {showCards && (
                        <div className={styles.cardContainer}>
                            <div className={styles.cardTags}>
                                <span className={styles.tag}>Deals: </span>
                                <span className={styles.tag}>In Progress:   </span>
                                <span className={styles.tag}>Received Commission:  </span>
                            </div>
                            <div className={styles.cardList} >
                                {deals.map((deal, index) => (
                                    <div key={index} className={styles.card}>
                                        <div className={styles.cardTitle}><span>Deal ID:</span> {deal.id}</div>
                                        <div className={styles.cardContent}>
                                            <p className={styles.brokerName}><span>Broker Name:</span> {deal.brokername}</p>
                                            <div className={styles.statusLine}>
                                                <span className={styles.statusLabel}>Status:</span>
                                                <span className={`${styles.statusButton} ${getStatusButtonClass(deal.Status)}`}>
                                                    {deal.Status}
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
