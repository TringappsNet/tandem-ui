import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import styles from './Dashboard.module.css';
// import 'bootstrap/dist/css/bootstrap.css';

const SidePanel: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleCardsClick = () => {
        setSelectedButton('dashboard');
        navigate('/dashboard');
    };
    const handleStatusClick = () => {
        setSelectedButton('cards');
        navigate('/cards');

    };

    return (
        <div className={styles.pageContainer}>

            <div className={styles.sidePanel}>
                <div className={styles.sidePanelButtons}>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'dashboard' ? styles.sidePanelButtonSelected : ''}`}
                        onClick={handleCardsClick}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'cards' ? styles.sidePanelButtonSelected : ''}`}
                        onClick={handleStatusClick}
                    >
                        Cards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;