import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Cards from '../Cards/Cards';
import styles from './Dashboard.module.css';
import Main from '../DashboardTiles/dashboardTile';
import SiteGrid from '../Grids/SiteGrid/SiteGrid';
import LandlordGrid from '../Grids/landlordGrid/Landlord';
import InviteBrokerGrid from '../Grids/inviteBroker-grid/InviteBroker-grid';
import { useSelector } from 'react-redux';
import { RootState } from '../Redux/reducers';

const Dashboard: React.FC = () => {
  const accessToken = localStorage.getItem('accessToken');
  const user = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  const links = [
    { name: 'Property', href: '/dashboard/property', disabled: true },
    { name: 'Landlord', href: '/dashboard/landlord', disabled: true },
    { name: 'Cards', href: '/dashboard/cards', disabled: true },
    { name: 'InviteBroker', href: '/dashboard/invitebroker', disabled: true },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Navbar links={links} />
      <div className={styles.mainContent}>
        <Routes>
          {user && !user.isAdmin ? (
            <Route path="/" element={<Navigate to="/deals" />} />
          ) : (
            <Route path="/" element={<Main />} />
          )}
          <Route path="/deals" element={<Cards />} />
          {user && user.isAdmin && (
            <>
              <Route path="/property" element={<SiteGrid />} />
              <Route path="/landlord" element={<LandlordGrid />} />
              <Route path="/invitebroker" element={<InviteBrokerGrid />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
