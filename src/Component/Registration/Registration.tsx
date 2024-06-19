import React, { useState } from 'react';
import axios from 'axios';
import styles from './Registration.module.css';
import { useSnackbar } from 'notistack';
import logo from './logo.jpeg';

const Registration: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [age, setAge] = useState<number | undefined>();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [referenceBrokerId, setReferenceBrokerId] = useState('');
    const [ssn, setSsn] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ssnError, setSsnError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [role] = useState(1);

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

    const validateAge = (age: number | undefined) => {
        if (age === undefined) {
            setAgeError('Age is required.');
        } else if (age <= 20 || age > 30) {
            setAgeError('Age should be between 20 and 30.');
        } else {
            setAgeError('');
        }
    };

    const validatePassword = (password: string) => {
        if (password.trim() === '') {
            setPasswordError('Password is required.');
        } else if (password.length < 8) {
            setPasswordError('Password should be at least 8 characters long.');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const errors: string[] = [];

        if (firstname.trim() === '' || firstname.length > 20 || firstnameError) {
            errors.push('First name should not exceed 20 characters and should contain only alphabets.');
        }

        if (lastname.trim() === '' || lastname.length > 10 || lastnameError) {
            errors.push('Last name should not exceed 10 characters and should contain only alphabets.');
        }

        if (age === undefined || age <= 20 || age > 30 || ageError) {
            errors.push('Age should be between 20 and 30.');
        }

        if (ssn.trim() === '' || ssn.length !== 9 || ssnError) {
            errors.push('SSN should be exactly 9 digits and contain only numbers.');
        }

        if (email.trim() === '' || emailError) {
            errors.push('Email should contain "@" and "." and no other special characters.');
        }

        if (password.trim() === '' || passwordError) {
            errors.push('Password should be at least 8 characters long.');
        }

        if (errors.length > 0) {
            errors.forEach((error) => enqueueSnackbar(error, { variant: 'error' }));
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.223:3008/register', {
                firstname,
                lastname,
                age,
                address,
                city,
                state,
                country,
                pincode,
                referenceBrokerId,
                ssn,
                email,
                password,
                role,
            });
            console.log('Registration successful:', response.data);
            enqueueSnackbar('Registration successful!', { variant: 'success' });

            setFirstname('');
            setLastname('');
            setAge(undefined);
            setEmail('');
            setAddress('');
            setCity('');
            setState('');
            setCountry('');
            setPincode('');
            setReferenceBrokerId('');
            setSsn('');
            setPassword('');
        } catch (error) {
            console.error('Registration failed:', error);
            enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
        }
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
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    required
                                />
                                {passwordError && <div className={styles.error}>{passwordError}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    placeholder="Enter your first name"
                                    value={firstname}
                                    onChange={(e) => {
                                        setFirstname(e.target.value);
                                        validateName(e.target.value, setFirstnameError);
                                    }}
                                    required
                                />
                                {firstnameError && <div className={styles.error}>{firstnameError}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    value={lastname}
                                    onChange={(e) => {
                                        setLastname(e.target.value);
                                        validateName(e.target.value, setLastnameError);
                                    }}
                                    required
                                />
                                {lastnameError && <div className={styles.error}>{lastnameError}</div>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor='age'>Age</label>
                                <input
                                    type='number'
                                    id="age"
                                    placeholder="Enter the age"
                                    value={age || ''}
                                    onChange={(e) => {
                                        setAge(parseInt(e.target.value));
                                        validateAge(parseInt(e.target.value));
                                    }}
                                    required
                                />
                                {ageError && <div className={styles.error}>{ageError}</div>}
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
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    placeholder="Enter your city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="state">State</label>
                                <input
                                    type="text"
                                    id="state"
                                    placeholder="Enter your state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="country">Country</label>
                                <input
                                    type="text"
                                    id="country"
                                    placeholder="Enter your country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="pincode">Pincode</label>
                                <input
                                    type="number"
                                    id="pincode"
                                    placeholder="Enter your pincode"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="referenceBroker">Reference Broker ID</label>
                                <input
                                    type="number"
                                    id="referenceBroker"
                                    placeholder="Enter reference broker"
                                    value={referenceBrokerId}
                                    onChange={(e) => setReferenceBrokerId(e.target.value)}
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
