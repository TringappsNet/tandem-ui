import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './DashboardComp.module.css';
// import 'bootstrap/dist/css/bootstrap.css';


const SendInvite: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('admin');
    const [showCards, setShowCards] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const resetFormRef = useRef<HTMLDivElement>(null);
    const inviteFormRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (resetFormRef.current && !resetFormRef.current.contains(event.target as Node)) {
                setShowResetForm(false);
            }
            if (inviteFormRef.current && !inviteFormRef.current.contains(event.target as Node)) {
                setShowInviteForm(true);
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
                setConfirmPassword('');
                setEmail('');
                setRoleId('admin');
                setResponseType('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [responseType]);


    const handleInviteClick = () => {
        setShowInviteForm(true);
        setShowResetForm(false);
        setShowCards(false);
        setShowGrid(false);
        setDropdownOpen(false);
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3008/api/auth/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    roleId,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResponseMessage('Invite sent successfully.');
                setResponseType('success');
            } else {
                setResponseMessage(data.message || 'Failed to send invite.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={classNames(styles.dropdownContent, { [styles.show]: dropdownOpen })}>
                {dropdownOpen && (
                    <>
                        <div className={styles.dropdownItem}>
                            <button onClick={handleInviteClick} className={styles.linkButton}>Send Invite</button>
                        </div>
                    </>
                )}
            </div>

            <div className={styles.mainContent}>
                {showInviteForm && (
                    <div className={styles.formContainer} ref={inviteFormRef}>
                        <h2>Send Invite</h2>
                        <form onSubmit={handleSendInvite}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="roleId">Role:</label>
                                <select
                                    id="roleId"
                                    name="roleId"
                                    value={roleId}
                                    onChange={(e) => setRoleId(e.target.value)}
                                    required >
                                    <option value="admin">Admin</option>
                                    <option value="broker">Broker</option>
                                </select>
                            </div>
                            <button type="submit">Send Invite</button>
                        </form>
                    </div>
                )}
            </div>
        </div >
    );
};


export default SendInvite;
