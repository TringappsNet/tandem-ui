import React, { useState } from 'react';
import styles from './Registration.module.css';
import { useSnackbar } from 'notistack';
import logo from './logo.jpeg';

const Registration: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [address, setAddress] = useState('');
    const [referenceBroker, setReferenceBroker] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhoto(event.target.files[0]);
        }
    };

    const validateName = (name: string) => {
        const namePattern = /^[a-zA-Z\s]+$/;
        if (name.trim() === '') {
            setNameError('');
        } else if (name.length > 30) {
            setNameError('Name should not exceed 30 characters.');
        } else if (!namePattern.test(name)) {
            setNameError('Name should contain only alphabets and spaces.');
        } else {
            setNameError('');
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors: string[] = [];

        if (name.trim() === '' || name.length > 30 || nameError) {
            errors.push('Name should not exceed 30 characters and should contain only alphabets.');
        }

        if (age === '' || age <= 20 || age > 30) {
            errors.push('Age should be between 20 and 30.');
        }

        if (!photo) {
            errors.push('You must upload a photo.');
        }

        if (ssn.trim() === '' || ssn.length !== 9 || !/^\d{9}$/.test(ssn)) {
            errors.push('SSN should be exactly 9 digits.');
        }

        if (email.trim() === '' || emailError) {
            errors.push('Email should contain "@" and "." and no other special characters.');
        }

        if (errors.length > 0) {
            errors.forEach((error) => enqueueSnackbar(error, { variant: 'error' }));
            return;
        }

        setName('');
        setAge('');
        setEmail('');
        setPhoto(null);
        setAddress('');
        setReferenceBroker('');
        setSsn('');
        enqueueSnackbar('Registration successful!', { variant: 'success' });
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.container}>
                <div className={styles.registrationContainer}>
                    <div className={styles.logoHeader}>
                        <img src={logo} alt="Tandem Infrastructure Logo" className={styles.logo} />
                        <h1 className={styles.companyName}>Tandem Infrastructure</h1>
                    </div>
                    <h2 className={styles.formTitle}>REGISTER HERE!</h2>
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        validateName(e.target.value);
                                    }}
                                    required
                                />
                                {nameError && <div className={styles.error}>{nameError}</div>}
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
                                <label htmlFor="photo">Photo Upload</label>
                                <input
                                    type="file"
                                    id="photo"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
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
                                <label htmlFor="referenceBroker">Reference Broker</label>
                                <input
                                    type="text"
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
                                    onChange={(e) => setSsn(e.target.value)}
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
