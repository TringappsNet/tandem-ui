import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
// import Main from '../Main/Main'; // Import your Main component
// import Cards from '../Cards/Cards'; // Import your Cards component
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
    return (
        <Router>
            <div className={styles.dashboardContainer}>
                <Navbar />
                <div className={styles.mainContent}>
                    <Routes>
                        <Route path="/dashboard">
                            {/* <Main /> */}
                        </Route>
                        <Route path="/cards">
                            {/* <Cards /> */}
                        </Route>
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default Dashboard;
