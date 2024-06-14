import React, { useState } from 'react';
import styles from './Registration.module.css';
import { useSnackbar } from 'notistack';
import logo from './logo.jpeg';

const Registration: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [photo, setPhoto] = useState<File | null>(null);
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [referenceBroker, setReferenceBroker] = useState('');
    const [ssn, setSsn] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhoto(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name && age && address && ssn) {
            setName('');
            setAge(0);
            setPhoto(null);
            setAddress('');
            setDateOfBirth('');
            setReferenceBroker('');
            setSsn('');
            enqueueSnackbar('Registration successful!', { variant: 'success' });
        } else {
            enqueueSnackbar('All fields required!', { variant: 'error' });
        }
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.container}>
                {showSuccess && <div className={styles.successMessage}></div>}
                {showError && <div className={styles.errorMessage}>Please fill out all required fields.</div>}
                <div className={styles.registrationContainer}>
                    <div className={styles.logoHeader}>
                        <img src={logo} alt="Tandem Infrastructure Logo" className={styles.logo} />
                        <h1 className={styles.companyName}>Tandem Infrastructure</h1>
                    </div>
                    <h2 className={styles.formTitle}>REGISTER HERE !</h2>
                    <div className={styles.formContainer}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="age">Age</label>
                                <input
                                    type="number"
                                    id="age"
                                    placeholder="Enter your age"
                                    value={age}
                                    onChange={(e) => setAge(parseInt(e.target.value, 10))}
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
                            <div className="buttonContainer">
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

