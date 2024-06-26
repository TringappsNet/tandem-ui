import React from 'react';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const SidePanel: React.FC = () => {

    return (
        <div className={styles.pageContainer}>

            <div className={styles.sidePanel}>
                <div className={styles.sidePanelButtons}>
                    <button
                        className={`${styles.sidePanelButton} `}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`${styles.sidePanelButton}`}                    >
                        Cards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
