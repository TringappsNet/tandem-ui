import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './Support.module.css';
import mailImage from './mail.png';

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

    useEffect(() => {
        if (subject.trim() && errorMessage === 'Please fill in the subject') {
            setErrorMessage('');
        }
    }, [subject]);

    useEffect(() => {
        if (description.trim() && errorMessage === 'Please fill in the description') {
            setErrorMessage('');
        }
    }, [description]);

    const validateForm = (): boolean => {
        if (!subject.trim()) {
            setErrorMessage('Please fill in the subject');
            return false;
        }

        if (!description.trim()) {
            setErrorMessage('Please fill in the description');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user) {
            setErrorMessage('Please log in to raise a ticket.');
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
            setErrorMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.contactsContainer}>
            <div className={styles.imageContainer}>
                <img src={mailImage} alt="Mail" className={styles.mailImage} />
            </div>
            <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.support}>Contact Us!</h2>
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
                        placeholder="Subject"
                        id="subject"
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        rows={7}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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