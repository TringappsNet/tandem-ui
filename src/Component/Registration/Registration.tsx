import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Registration.module.css';
import logo from './logo.jpeg';


const Registration: React.FC = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [password, setPassword] = useState('');
    const [disableState, setDisableState] = useState(false);
    const [confirmpassword, setConfirmpassword] = useState('');
    const [validationErrorMessage, setValidationErrorMessage] = useState('');
    const [validationSucessMessage, setValidationSucessMessage] = useState('');

    const [role] = useState(2);


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteToken = urlParams.get('token');
        if (inviteToken) {
            validateInviteToken(inviteToken);
        }
    }, []);

    const validateInviteToken = async (token: string) => {
        try {
            await axios.post('http://192.168.1.223:3008/api/auth/invite-validate', { token });
        } catch (error) {
            console.error('Invite validation failed:', error);

        }
    };

    const validateName = (name: string): string => {
        const namePattern = /^[a-zA-Z\s]+$/;
        if (name.trim() === '') {
            return 'Name is required.';
        } else if (name.length > 30) {
            return 'Name should not exceed 30 characters.';
        } else if (!namePattern.test(name)) {
            return 'Name should contain only alphabets and spaces.';
        } else {
            return '';
        }
    };

    const validatePassword = (password: string): string => {
        const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
        const numberPattern = /\d/g;
        if (password.trim() === '') {
            setDisableState(false);
            return 'Password is required.';
        } else if (password.length < 8) {
            setDisableState(false);
            return 'Password should be at least 8 characters long.';
        } else if (!specialCharPattern.test(password)) {
            setDisableState(false);
            return 'Password should contain at least one special character.';
        } else if ((password.match(numberPattern) || []).length < 2) {
            setDisableState(false);
            return 'Password should contain at least two numerical digits.';
        } else {
            setDisableState(true);
            return '';
        }
    };

    const validateConfirmpassword = (password: string, confirmpassword: string): string => {
        if (confirmpassword.trim() === '') {
            return 'Please confirm your password.';
        } else if (password !== confirmpassword) {
            return 'Passwords do not match.';
        } else {
            return '';
        }
    };

    const validateMobileNo = (mobileno: string): string => {
        const mobilenoPattern = /^\d{10}$/;
        if (mobileno.trim() === '') {
            return 'Mobile number is required.';
        } else if (!mobilenoPattern.test(mobileno)) {
            return 'Mobile number should be exactly 10 digits and contain only numbers.';
        } else {
            return '';
        }
    };

    const handleValidation = () => {
        const firstnameError = validateName(firstname);
        const lastnameError = validateName(lastname);
        const passwordError = validatePassword(password);
        const confirmpasswordError = validateConfirmpassword(password, confirmpassword);
        const mobilenoError = validateMobileNo(mobileno);

        const errors = [
            firstnameError,
            lastnameError,
            passwordError,
            confirmpasswordError,
            mobilenoError
        ].filter(error => error);

        setValidationErrorMessage(errors.length > 0 ? errors[0] : '');

        return errors.length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (firstname === '' || lastname === '' || mobileno === '' || password === '' || confirmpassword === '') {
            setValidationErrorMessage("Pleaser Enter the values in the All Field.")
            return
        }

        if (!handleValidation()) {
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.223:3008/api/register', {
                firstname,
                lastname,
                mobileno,
                password,
                role,
            });
            console.log('Registration successful:', response.data);
            setValidationSucessMessage('Registration successful!');

            setFirstname('');
            setLastname('');
            setMobileno('');
            setPassword('');
            setConfirmpassword('');
        }
        catch (error) {
            console.error('Registration failed:', error);
            setValidationErrorMessage('Registration failed. Please try again.');
        }
    };

    return (
        <div className='app'>
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
                                {validationErrorMessage && (
                                    <div className={styles.errorshow}>
                                        {validationErrorMessage}
                                    </div>
                                )}
                                {validationSucessMessage && (
                                    <div className={styles.successshow}>
                                        {validationSucessMessage}
                                    </div>
                                )}
                                <div className={styles.formGroup}>
                                    <label htmlFor="firstName">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="Enter your first name"
                                        value={firstname}
                                        onChange={(e) => {
                                            setFirstname(e.target.value);
                                            setValidationErrorMessage(validateName(e.target.value));
                                        }}
                                    />
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
                                            setValidationErrorMessage(validateName(e.target.value));
                                        }}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="mobileno">Mobile No</label>
                                    <input
                                        type="tel"
                                        id="mobileno"
                                        placeholder="Enter your mobile number"
                                        value={mobileno}
                                        onChange={(e) => {
                                            setMobileno(e.target.value);
                                            setValidationErrorMessage(validateMobileNo(e.target.value));
                                        }}
                                    />
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
                                            setValidationErrorMessage(validatePassword(e.target.value));
                                        }}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        disabled={!disableState}
                                        value={confirmpassword}
                                        onChange={(e) => {
                                            setConfirmpassword(e.target.value);
                                            setValidationErrorMessage(validateConfirmpassword(password, e.target.value));
                                        }}
                                    />
                                </div>
                                <div className={styles.buttonContainer}>
                                    <button type="submit" className={styles.buttoncls}>Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
