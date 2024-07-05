import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Cards from "../Cards/Cards";
import styles from "./Dashboard.module.css";
import Main from '../Main/Main';
import SiteGrid from "../Grids/Site-grid/site-grid";
import LandlordGrid from "../Grids/landlordGrid/landlord-grid";


const Dashboard: React.FC = () => {

  // const navigate = useNavigate();

  const links = [
    // { name: 'HOME', href: '/dashboard', disabled: false },
    { name: 'Site', href: '/dashboard/site', disabled: true },
    { name: 'Landlord', href: '/dashboard/landlord', disabled: true },
    { name: 'Cards', href: '/dashboard/cards', disabled: true },
    // { name: 'FAQ', href: '/faq', disabled: false }, 
  ];


  return (
    <>
      <div className={styles.dashboardContainer}>
        <Navbar
          links={links}

        />
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/site" element={<SiteGrid />} />
            <Route path="/landlord" element={<LandlordGrid />} />
            <Route path="*" element={<Navigate to="/dashboard" />}
            />
          </Routes>
        </div>
      </div>
    </>

  );

};

export default Dashboard;