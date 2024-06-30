import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
// import Main from '../Main/Main'; // Make sure to import Main component
import Cards from '../Cards/Cards';
import styles from './Dashboard.module.css';
import FullGrid from '../Grids/parent_grid/broker-grid';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';


const Dashboard: React.FC = () => {
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
    return (
        <div className={styles.dashboardContainer}>
            <Navbar />
            <div className={styles.mainContent}>
                <div className={styles.tagsContainer}>
                   <Routes>
                    {/* <Route path="/" element={<Main />} /> */}
                    <Route path="/cards" element={<Cards />} />
                    </Routes>
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