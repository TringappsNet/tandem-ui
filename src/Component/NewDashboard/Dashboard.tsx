import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <Navbar />
            <div className={styles.mainContent}>
                <h1>Welcome to the Dashboard</h1>
                {/* Main content will be added here */}
            </div>
        </div>
    );
};

export default Dashboard;
