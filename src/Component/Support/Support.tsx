import React, { useState } from 'react';
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

interface FormValues {
    subject: string;
    description: string;
}

interface FormErrors {
    subject: string;
    description: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.223:3008';

const useForm = (initialState: FormValues) => {
    const [values, setValues] = useState<FormValues>(initialState);
    const [errors, setErrors] = useState<FormErrors>({ subject: '', description: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        if (value.trim()) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = { subject: '', description: '' };
        let isValid = true;

        if (!values.subject.trim()) {
            newErrors.subject = 'Please fill in the subject';
            isValid = false;
        }

        if (!values.description.trim()) {
            newErrors.description = 'Please fill in the description';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return { values, handleChange, errors, validateForm };
};

const Support: React.FC = () => {
    const { values, handleChange, errors, validateForm } = useForm({ subject: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);

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
            const response = await axios.post(`${API_URL}/api/support/raise-ticket`, {
                ticketSubject: values.subject,
                ticketDescription: values.description,
                senderId: user.id
            });

            if (response.status === 200) {
                setSuccessMessage('Ticket raised successfully!');
                // Reset form values
                handleChange({ target: { name: 'subject', value: '' } } as React.ChangeEvent<HTMLInputElement>);
                handleChange({ target: { name: 'description', value: '' } } as React.ChangeEvent<HTMLTextAreaElement>);
            } else {
                setErrorMessage('Failed to raise ticket. Please try again.');
            }
        } catch (error) {
            console.error('Error raising ticket:', error);
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(`Error: ${error.response.data.message || 'An unknown error occurred'}`);
            } else {
                setErrorMessage('An error occurred. Please check your network connection and try again.');
            }
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
                    <div className={`${styles.messageBox} ${styles.successBox}`}>
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className={`${styles.messageBox} ${styles.errorBox}`}>
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
                        value={values.subject}
                        onChange={handleChange}
                    />
                    {errors.subject && <div className={styles.errorMessage}>{errors.subject}</div>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        rows={7}
                        value={values.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className={styles.errorMessage}>{errors.description}</div>}
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