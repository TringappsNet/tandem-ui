import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Dashboard.module.css';
import FullGrid from '../Grids/parent_grid/broker-grid';

const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <Navbar />
            <div className={styles.mainContent}>
                <div className={styles.tagsContainer}>
                    <span className={styles.tag}>Tag 1</span>
                    <span className={styles.tag}>Tag 2</span>
                    <span className={styles.tag}>Tag 3</span>
                    <span className={styles.tag}>Tag 4</span>
                </div>
                <FullGrid apiUrl={'/brokers'} />
            </div>
        </div>
    );
};

export default Dashboard;