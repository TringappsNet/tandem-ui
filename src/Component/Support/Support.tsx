import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
// import background from './mailbox.jpg'
import styles from './Support.module.css';

interface RootState {
    auth: {
        user: {
            id: number;
        } | null;
    };
}

const Support: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setErrorMessage('User not logged in. Please log in to raise a ticket.');
            return;
        }
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const response = await axios.post('http://192.168.1.223:3008/api/support/raise-ticket', {
                ticketSubject: subject,
                ticketDescription: description,
                senderId: user.id
            });
            if (response.status === 200) {
                setSuccessMessage('Ticket raised successfully!');
                setSubject('');
                setDescription('');
            } else {
                setErrorMessage('Failed to raise ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error raising ticket:', error);
            setErrorMessage('An error occurred while raising the ticket. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.contactsContainer}>
            <form className={styles.contactForm} onSubmit={handleSubmit}>
                <h2 className={styles.supportName}>Support</h2>
                {successMessage && (
                    <div className={styles.messageBox + ' ' + styles.successBox}>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className={styles.messageBox + ' ' + styles.errorBox}>
                        {errorMessage}
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        placeholder='Enter the subject of concern'
                        id="subject"
                        autoFocus
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder='Enter the description'
                        rows={7}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading} className={styles.sendButton}>
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </form>
            {isLoading && (
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                </div>
            )}
        </div>
    );
};

export default Support;