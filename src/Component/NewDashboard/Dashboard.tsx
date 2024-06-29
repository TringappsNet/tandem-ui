import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './Dashboard.module.css';
import FullGrid from '../Grids/parent_grid/broker-grid';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

const [rows, setRows] = useState<[]>([]);
const fetchDeals= async () => {
    try {
      const response = await axiosInstance.get('/deals');
      const deals = response.data.map((deal: any) => ({
        totalDeals: deal.totalDeals,
        dealsOpened: deal.dealsOpened,
        dealsInProgress: deal.dealsInProgress,
        dealsClosed: deal.dealsClosed,
        totalCommission: deal.totalCommission,
      }));
      setRows(deals);

    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };
const Dashboard: React.FC = () => {
    return (
        <div className={styles.dashboardContainer}>
            <Navbar />
            <div className={styles.mainContent}>
                <div className={styles.tagsContainer}>
                    <span className={styles.tag}>{}</span>
                    <span className={styles.tag}>Tag 2</span>
                    <span className={styles.tag}>Tag 3</span>
                    <span className={styles.tag}>Tag 4</span>
                </div>
                <br></br>
                <FullGrid apiUrl={'/brokers'} />
            </div>
        </div>
    );
};





export default Dashboard;