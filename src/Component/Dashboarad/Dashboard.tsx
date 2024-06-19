import React from 'react';
import styles from './Dashboard.module.css'

interface DashboardProps {
  accessToken: string;
}

const Dashboard: React.FC<DashboardProps> = ({ accessToken }) => {
  return (
    <div className={styles.main}>
      <h1>Welcome!</h1>
      <p>This is your access token:</p>
      <code>{accessToken}</code>
    </div>
  );
};

export default Dashboard;
