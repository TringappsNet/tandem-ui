import React, { useState, useRef } from 'react';
import styles from './SendInvite.module.css';
import classNames from 'classnames';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

const SendInvite: React.FC = () => {
    const [showInviteForm, setShowInviteForm] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [roleId, setRoleId] = useState('admin');
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();


        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/auth/invite', { email, roleId });
            const data = await response.data;

            if (response.data) {
                setResponseMessage(data.message);
                setResponseType('success');
                setTimeout(() => {
                    setShowInviteForm(false);
                    setEmail('');
                    setRoleId('admin');
                    setResponseType('');
                }, 1000);
            } else {
                setResponseMessage(data.message || 'Failed to send invite.');
                setResponseType('error');
            }
        } catch (error) {
            setResponseMessage('An error occurred. Please try again.');
            setResponseType('error');
        }
        finally {
            setIsLoading(false);
        }

    };


    return (
        <>
            {showInviteForm && (
                <div className={styles.formContainer}>
                    <h2>Send Invite</h2>
                    {responseMessage && (
                        <div className={classNames(styles.responseMessage, {
                            [styles.success]: responseType === 'success',
                            [styles.error]: responseType === 'error',
                        })}>
                            {responseMessage}
                        </div>
                    )}

                    <form onSubmit={handleSendInvite}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder='Enter your Email'
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="roleId">Role:</label>
                            <div className={styles.selectWrapper}>
                                <select
                                    id="roleId"
                                    name="roleId"
                                    ref={selectRef}
                                    className={styles.customSelect}
                                    value={roleId}
                                    onChange={(e) => setRoleId(e.target.value)}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="broker">Broker</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading}>Send Invite
                            {isLoading ? 'Sending Invite' : 'Send Invite'}
                        </button>
                    </form>
                    {isLoading && (
                        <div className={styles.loaderContainer}>
                            <div className={styles.loader}></div>
                        </div>
                    )}
                </div>

            )}
        </>
    );
};

export default SendInvite;