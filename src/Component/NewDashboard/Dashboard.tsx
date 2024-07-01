import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Cards from "../Cards/Cards";
import styles from "./Dashboard.module.css";
import Main from '../Main/Main';

const Dashboard: React.FC = () => {

  return (
    <>
      <div className={styles.dashboardContainer}>
        <Navbar />
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/cards" element={<Cards />} />
          </Routes>
        </div>
        </div>
      </>

      );
};

export default Dashboard;