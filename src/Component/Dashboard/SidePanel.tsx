import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

const SidePanel: React.FC = () => {
    const [showResetForm, setShowResetForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [showCards, setShowCards] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();


    const handleCardsClick = () => {
        setShowCards(true);
        setShowResetForm(false);
        setShowInviteForm(false);
        setShowGrid(false);
        setSelectedButton('cards');
        navigate('/cards');

    };

    const handleStatusClick = () => {
        setShowGrid(true);
        setShowCards(false);
        setShowResetForm(false);
        setShowInviteForm(false);
        setSelectedButton('dashboard');
        navigate('/dashboard');

    };

    return (
        <div className={styles.pageContainer}>

            <div className={styles.sidePanel}>
                <div className={styles.sidePanelButtons}>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'dashboard' ? styles.sidePanelButtonSelected : ''}`}
                        onClick={handleStatusClick}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`${styles.sidePanelButton} ${selectedButton === 'cards' ? styles.sidePanelButtonSelected : ''}`}
                        onClick={handleCardsClick}
                    >
                        Cards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidePanel;
