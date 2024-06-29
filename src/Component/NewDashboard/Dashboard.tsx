import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
// import Main from '../Main/Main'; // Make sure to import Main component
import Cards from '../Cards/Cards';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.mainContent}>
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          
          <Route path="/cards" element={<Cards />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
