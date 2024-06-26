import React, { useEffect } from 'react';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import SidePanel from './SidePanel';
import Navbar from './Navbar';

interface DashboardProps {
    accessToken: string;
    onLogout: () => void;
}

const DashboardComp: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {

    const fetchBrokerData = async () => {
        try {
            const response = await fetch('http://192.168.1.223:3008/api/brokers');
            console.log(response);
        } catch (error) {
            console.error(`Error fetching broker data:`, error);
        }
    };

    useEffect(() => {
        fetchBrokerData();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Navbar onLogout={onLogout} />
            <div className={styles.contentWrapper}>
                <SidePanel />
                <div className={styles.mainContent}>
                </div>
            </div>
        </div>
    );
};

export default DashboardComp;