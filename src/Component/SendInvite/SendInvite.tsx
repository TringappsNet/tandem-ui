import React, { useState, useEffect, useRef } from 'react';
import styles from './SendInvite.module.css';
import classNames from 'classnames';

const SendInvite: React.FC = () => {
    const [showInviteForm, setShowInviteForm] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('admin');
    const inviteFormRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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
                setShowInviteForm(false);
                setEmail('');
                setRoleId('admin');
                setResponseType('');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [responseType]);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3008/api/auth/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, roleId }),
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
        <div className={styles.app}>
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
                                required>
                                <option value="admin">Admin</option>
                                <option value="broker">Broker</option>
                            </select>
                        </div>
                        <button type="submit">Send Invite</button>
                    </form>
                    {responseMessage && (
                        <div className={classNames(styles.responseMessage, {
                            [styles.success]: responseType === 'success',
                            [styles.error]: responseType === 'error',
                        })}>
                            {responseMessage}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SendInvite;
