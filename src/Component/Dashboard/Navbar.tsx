import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import SendInvite from './SendInvite';
import Reset from './Reset';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (responseMessage) {
            const timer = setTimeout(() => {
                setResponseMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [responseMessage]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (responseType === 'success') {
            const timer = setTimeout(() => {
                setResponseType('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [responseType]);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('sessiontoken');
        localStorage.removeItem('userid');
        localStorage.removeItem('email');
        localStorage.removeItem('expireAt');
        onLogout();
        navigate('/', { replace: true });
    };


    const handleResetClick = () => {
        setShowResetForm(true);
    };

    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
                <div className={styles.buttonContainer}>
                    <div className={styles.dropdown} ref={dropdownRef}>
                        <span onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </span>
                        <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
                            {dropdownOpen && (
                                <>
                                    <div className={styles.dropdownItem}>
                                        <button onClick={handleResetClick} className={styles.linkButton}>Reset</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <button className={styles.linkButton}>Support</button>
                                    </div>
                                    <div className={styles.dropdownItem}>
                                        <button onClick={handleLogout} className={styles.linkButton}>Log out</button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
