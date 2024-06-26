import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const SidePanel: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className={styles.pageContainer}>

            <div className={styles.sidePanel}>
                <div className={styles.sidePanelButtons}>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'dashboard' ? styles.sidePanelButtonSelected : ''}`}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'cards' ? styles.sidePanelButtonSelected : ''}`}                    >
                        Cards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
