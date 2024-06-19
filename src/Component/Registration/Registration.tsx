import React, { useState, useRef } from 'react';
import styles from './Registration.module.css';
import { useSnackbar } from 'notistack';
import logo from './logo.jpeg';

const Registration: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [address, setAddress] = useState('');
    const [referenceBroker, setReferenceBroker] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ssnError, setSsnError] = useState('');
    const photoInputRef = useRef<HTMLInputElement | null>(null);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhoto(event.target.files[0]);
        }
    };

    const validateName = (name: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
        const namePattern = /^[a-zA-Z\s]+$/;
        if (name.trim() === '') {
            setError('');
        } else if (name.length > 30) {
            setError('Name should not exceed 30 characters.');
        } else if (!namePattern.test(name)) {
            setError('Name should contain only alphabets and spaces.');
        } else {
            setError('');
        }
    };

    const validateEmail = (email: string) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (email.trim() === '') {
            setEmailError('');
        } else if (!emailPattern.test(email)) {
            setEmailError('Email should contain "@" and "." and no other special characters.');
        } else {
            setEmailError('');
        }
    };

    const validateSsn = (ssn: string) => {
        if (ssn.trim() === '') {
            setSsnError('');
        } else if (!/^\d{9}$/.test(ssn)) {
            setSsnError('SSN should be exactly 9 digits and contain only numbers.');
        } else {
            setSsnError('');
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors: string[] = [];

        if (firstName.trim() === '' || firstName.length > 20 || firstNameError) {
            errors.push('First name should not exceed 20 characters and should contain only alphabets.');
        }

        if (lastName.trim() === '' || lastName.length > 10 || lastNameError) {
            errors.push('Last name should not exceed 10 characters and should contain only alphabets.');
        }

        if (age === '' || age <= 20 || age > 30) {
            errors.push('Age should be between 20 and 30.');
        }

        if (!photo) {
            errors.push('You must upload a photo.');
        }

        if (ssn.trim() === '' || ssn.length !== 9 || ssnError) {
            errors.push('SSN should be exactly 9 digits and contain only numbers.');
        }

        if (email.trim() === '' || emailError) {
            errors.push('Email should contain "@" and "." and no other special characters.');
        }

        if (errors.length > 0) {
            errors.forEach((error) => enqueueSnackbar(error, { variant: 'error' }));
            return;
        }

        setFirstName('');
        setLastName('');
        setAge('');
        setEmail('');
        setPhoto(null);
        setAddress('');
        setReferenceBroker('');
        setSsn('');
        if (photoInputRef.current) {
            photoInputRef.current.value = '';
        }
        enqueueSnackbar('Registration successful!', { variant: 'success' });
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.container}>
                <div className={styles.registrationContainer}>
                    <div className={styles.logoHeader}>
                        <img src={logo} alt="Tandem Infrastructure Logo" className={styles.logo} />
                        <h1 className={styles.companyName}>TANDEM INFRASTRUCTURE</h1>
                    </div>
                    <h4 className={styles.formTitle}>REGISTER HERE</h4>
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                        validateName(e.target.value, setFirstNameError);
                                    }}
                                    required
                                />
                                {firstNameError && <div className={styles.error}>{firstNameError}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                        validateName(e.target.value, setLastNameError);
                                    }}
                                    required
                                />
                                {lastNameError && <div className={styles.error}>{lastNameError}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    placeholder="Enter your age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        validateEmail(e.target.value);
                                    }}
                                    required
                                />
                                {emailError && <div className={styles.error}>{emailError}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="photo">Photo Upload</label>
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    ref={photoInputRef}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Address</label>
                                <textarea
                                    id="address"
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="referenceBroker">Reference Broker ID</label>
                                <input
                                    type="number"
                                    id="referenceBroker"
                                    placeholder="Enter reference broker"
                                    value={referenceBroker}
                                    onChange={(e) => setReferenceBroker(e.target.value)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="ssn">SSN</label>
                                <input
                                    type="text"
                                    id="ssn"
                                    placeholder="Enter your SSN"
                                    value={ssn}
                                    onChange={(e) => {
                                        setSsn(e.target.value);
                                        validateSsn(e.target.value);
                                    }}
                                    required
                                />
                                {ssnError && <div className={styles.error}>{ssnError}</div>}
                            </div>
                            <div className={styles.buttonContainer}>
                                <button type="submit">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
