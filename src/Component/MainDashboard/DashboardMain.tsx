import React, { useEffect, useState } from 'react';
import styles from './DashboardMain.module.css';

interface DealData {
    dealsClosed: number;
    dealsInProgress: number;
    totalCommission: number;
}

const DashboardMain: React.FC = () => {
    const [data, setData] = useState<DealData | null>(null);

    useEffect(() => {
        fetch('http://localhost:3008/api/deals', {
            headers: {
                'accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setData({
            dealsClosed: data.dealsClosed,
            dealsInProgress: data.dealsInProgress,
            totalCommission: data.totalCommission
        }))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    if (!data) {
        return <div>Data Not Found</div>;
    }
    return (
        <div className={styles.contentWrapper}>
            <div className={styles.card1}>
                <div className={styles.cardHeader1}>Completed Deals</div>
                <div className={styles.cardContent}>{data.dealsClosed}</div>
            </div>
            <div className={styles.card2}>
                <div className={styles.cardHeader2}>Pending Deals</div>
                <div className={styles.cardContent}>{data.dealsInProgress}</div>
            </div>
            <div className={styles.card3}>
                <div className={styles.cardHeader3}>Commission</div>
                <div className={styles.cardContent}>{data.totalCommission}</div>
            </div>
        </div>
    );
};

export default DashboardMain;
