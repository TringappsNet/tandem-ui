import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Main from '../Main/Main';
import Cards from "../Cards/Cards";
import styles from "./Dashboard.module.css";


type Deal = {
  totalDeals: number;
  dealsOpened: number;
  dealsInProgress: number;
  dealsClosed: number;
  totalCommission: number;
};

const Dashboard: React.FC = () => {

  return (
      <div className={styles.dashboardContainer}>
        <Navbar />
        <div className={styles.mainContent}>
          <Routes>
            {/* <Route path="/" element={<Main />} /> */}
            <Route path="/" element={<Cards />} />
          </Routes>
        </div>
      </div>
  );
};

export default Dashboard;
