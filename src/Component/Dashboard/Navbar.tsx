import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './Dashboard.module.css';

interface NavbarProps {
    onLogout: () => void;
    onCreateDeal: () => void; // Add this prop
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onCreateDeal }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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

    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
                <div className={styles.buttonContainer}>
                    <button className={styles.createButton} onClick={onCreateDeal}>Create</button>
                    <div className={styles.dropdown} ref={dropdownRef}>
                        <span onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faEllipsisV} />
                        </span>
                        <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
                            {dropdownOpen && (
                                <>
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
