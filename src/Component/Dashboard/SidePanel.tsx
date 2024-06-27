import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const SidePanel: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const [showCards, setShowCards] = useState(false);
    const [showGrid, setShowGrid] = useState(false);

    const navigate = useNavigate();

    const handleCardsClick = () => {
        setShowCards(true);
        setSelectedButton('dashboard');
        navigate('/dashboard');
    };
    const handleStatusClick = () => {
        setShowGrid(true);
        setShowCards(false);
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
