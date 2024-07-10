import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Cards from "../Cards/Cards";
import styles from "./Dashboard.module.css";
import Main from "../Main/Main";
import SiteGrid from "../Grids/SiteGrid/SiteGrid";
import LandlordGrid from "../Grids/landlordGrid/Landlord";
import InviteBrokerGrid from "../Grids/inviteBroker-grid/InviteBroker-grid";

const Dashboard: React.FC = () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }


  const links = [
    { name: "Site", href: "/dashboard/site", disabled: true },
    { name: "Landlord", href: "/dashboard/landlord", disabled: true },
    { name: "Cards", href: "/dashboard/cards", disabled: true },
    { name: "InviteBroker", href: "/dashboard/Invitebroker", disabled: true },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Navbar links={links} />
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/site" element={<SiteGrid />} />
          <Route path="/landlord" element={<LandlordGrid />} />
          <Route path="/invitebroker" element={<InviteBrokerGrid />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
