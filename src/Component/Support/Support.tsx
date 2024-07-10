import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Support.module.css';
import { AppDispatch } from "../Redux/store";
import mailImage from './mail.png';
import { RootState } from '../Redux/reducers';
import { raiseTicket, clearMessages } from '../Redux/slice/support/supportSlice';

interface SupportProps {
    onCloseDialog: () => void;
}

const Support: React.FC<SupportProps> = ({ onCloseDialog }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [formError, setFormError] = useState('');
    const { isLoading, error, successMessage } = useSelector((state: RootState) => state.contact);
    const user = useSelector((state: RootState) => state.auth.user);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (subject.trim()) {
            setFormError('');
        }
    }, [subject]);

    useEffect(() => {
        if (description.trim() && !subject.trim()) {
            setFormError('Please fill in the subject');
        } else if (description.trim()) {
            setFormError('');
        }
    }, [description, subject]);

    const validateForm = (): boolean => {
        if (!subject.trim()) {
            setFormError('Please fill in the subject');
            return false;
        }
        if (!description.trim()) {
            setFormError('Please fill in the description');
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
            dispatch(clearMessages());
            return;
        }

        const ticketData = {
            ticketSubject: subject,
            ticketDescription: description,
            senderId: user.id,
        };

        dispatch(raiseTicket(ticketData));
    };

    useEffect(() => {
        if (successMessage) {
            setSubject('');
            setDescription('');
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);

            setTimeout(() => {
                navigate('/dashboard');
            }, 2500);
        }
    }, [successMessage, navigate]);

    if (!isVisible) {
        return null;
    }

    return (
        <div className={styles.contactsContainer}>
            <div className={styles.imageContainer}>
                <img src={mailImage} alt="Mail" className={styles.mailImage} />
            </div>
            <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                <h2 className={styles.support}>Contact Us!</h2>
                {successMessage && (
                    <div className={`${styles.messageBox} ${styles.successBox}`}>
                        {successMessage}
                    </div>
                )}
                {error && (
                    <div className={`${styles.messageBox} ${styles.errorBox}`}>
                        {error}
                    </div>
                )}
                {formError && (
                    <div className={`${styles.messageBox} ${styles.errorBox}`}>
                        {formError}
                    </div>
                )}
                <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        placeholder="Enter your subject"
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
                        placeholder="Add your Comments"
                        rows={8}
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