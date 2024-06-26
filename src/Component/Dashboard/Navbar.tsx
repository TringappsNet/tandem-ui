import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './DashboardComp.module.css';
import 'bootstrap/dist/css/bootstrap.css';

interface NavbarProps {
    onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('admin');
    const [openStepper, setOpenStepper] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resetFormRef = useRef<HTMLDivElement>(null);
    const inviteFormRef = useRef<HTMLDivElement>(null);
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
            if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
                setShowResetForm(false);
            }
            if (inviteFormRef.current && !inviteFormRef.current.contains(event.target as Node)) {
                setShowInviteForm(false);
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
                setShowResetForm(false);
                setShowInviteForm(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setEmail('');
                setRoleId('admin');
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

    return (
        <div>
            <nav className={styles.navbar}>
                <h1 className={styles.navbarTitle}>TANDEM INFRASTRUCTURE</h1>
                <div className={styles.buttonContainer}>
                    <button className={styles.createButton} onClick={() => setOpenStepper(true)}>Create</button>
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
