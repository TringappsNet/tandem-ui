import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Main from '../Main/Main';
import Cards from "../Cards/Cards";
import styles from "./Dashboard.module.css";
<<<<<<< HEAD

=======
import axiosInstance from "../AxiosInterceptor/AxiosInterceptor";
import BrokerGrid from "../Grids/broker-grid/broker-grid";
>>>>>>> e74f2f886fd3aadb4f64e69c75044267eeb48dfb

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
          <Route path="/cards" element={<Cards />} />
        </Routes>
        <div className={styles.tagsContainer}>
          {deal && (
            <React.Fragment>
              <span className={styles.tag}>Total Deals: {deal.totalDeals}</span>
              <span className={styles.tag}>
                Deals Opened: {deal.dealsOpened}
              </span>
              <span className={styles.tag}>
                Deals In Progress: {deal.dealsInProgress}
              </span>
              <span className={styles.tag}>
                Deals Closed: {deal.dealsClosed}
              </span>
              <span className={styles.tag}>
                Total Commission: {deal.totalCommission}
              </span>
            </React.Fragment>
          )}
        </div>
        <br></br>
        <h1 className={styles.b_title}>
          Brokers
        </h1>
        <br></br>
        <div>
          <BrokerGrid />
        </div>
      </div>
  );
};

export default Dashboard;