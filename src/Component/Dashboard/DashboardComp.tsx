import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';
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

const DashboardComp: React.FC<DashboardProps> = ({ accessToken, onLogout }) => {
    const [showGrid, setShowGrid] = useState(false);
    const [gridData, setGridData] = useState<BrokerData[]>([]);
    const navigate = useNavigate();
    const location = useLocation();


    const fetchBrokerData = async () => {
        try {
            const response = await fetch('http://192.168.1.223:3008/api/brokers');
            console.log(response);
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