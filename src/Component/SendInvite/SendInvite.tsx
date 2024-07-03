import React, { useState, useRef, useEffect } from 'react';
import styles from './SendInvite.module.css';
import classNames from 'classnames';
import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';

interface Role {
    id: number;
    roleName: string;
}

const SendInvite: React.FC = () => {
    const [showInviteForm, setShowInviteForm] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [email, setEmail] = useState('');
    const [rolesDetails, setRolesDetails] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [roleId, setRoleId] = useState<number | null>(null);
    const selectRef = useRef<HTMLSelectElement>(null);

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        if (roleId === null) {
            setResponseMessage('Please select a role.');
            setResponseType('error');
            return;
        }


        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/auth/invite', { email, roleId });
            const data = response.data;

            if (data) {
                setResponseMessage(data.message);
                setResponseType('success');
                setTimeout(() => {
                    setShowInviteForm(false);
                    setEmail('');
                    setResponseType('');
                }, 1000);
            } else {
                setResponseMessage(data.message || 'Failed to send invite.');
                setResponseType('error');
            }
        } catch (error: any) {
            setResponseMessage(error.response.data.message || 'An error occurred. Please try again.');
            setResponseType('error');
        }
        finally {
            setIsLoading(false);
        }
    };

    const getRoles = async () => {
        try {
            const response = await axiosInstance.get('/roles');
            const roles: Role[] = response.data.map((role: any) => ({
                id: role.id,
                roleName: role.roleName
            }));
            setRolesDetails(roles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        getRoles();
    }, []);

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
                                placeholder='Enter your email'
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
                                    value={roleId ?? ''}
                                    onChange={(e) => setRoleId(Number(e.target.value))}
                                    required
                                >
                                    <option value="" disabled>Select a role</option>
                                    {rolesDetails.map((role) => (
                                        <option key={role.id} value={role.id}>{role.roleName}</option>
                                    ))}
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
