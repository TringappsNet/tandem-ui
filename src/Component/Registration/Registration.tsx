import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Redux/slice/auth/registerSlice';
import styles from './Registration.module.css';
import logo from './logo.jpeg';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../Redux/store';
import { RootState } from '../Redux/reducers';
import SnackbarComponent from '../Snackbar/Snackbar';
import Input from 'react-phone-number-input/input'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { registering } = useSelector((state: RootState) => state.register);
  const [hasValidToken, setHasValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstname] = useState('');
  const [emailId, setEmailId] = useState('');
  const [lastName, setLastname] = useState('');
  const [mobileNo, setMobileno] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('error');
  const [strength, setStrength] = useState(0);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const zipcodeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('inviteToken');
    const emailId = urlParams.get('email');
    if (token && emailId) {
      setInviteToken(token);
      setEmailId(emailId);
      setHasValidToken(true);
    } else {
      navigate('/');
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return <div>Loading , Please wait</div>;
  }



  if (!hasValidToken) {
    return null;
  }

  const getColor = () => {
    switch (strength) {
      case 1: return '#ff4d4d !important'; // Weak
      case 2: return '#ff751a !important'; // Fair
      case 3: return '#ffd633 !important'; // Good
      case 4: return '#b3ff66 !important'; // Strong
      case 5: return '#00a100 !important'; // Very Strong
      default: return '#e0e0e0  !important'; // Default color for no password
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    evaluatePasswordStrength(newPassword);
  };
  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setStrength(strength);
  };



  const validatefirstName = (name: string): string => {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (name.trim() === '') {
      return 'First Name is required.';
    } else if (name.length > 20) {
      return 'Name should not exceed 20 characters.';
    } else if (!namePattern.test(name)) {
      return 'Name should contain only alphabets and spaces.';
    } else {
      return '';
    }
  };

  const validatelastName = (name: string): string => {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (firstName === '') {
      return 'First Name is required.';
    } else if (name.trim() === '') {
      return 'Last Name is required.';
    } else if (name.length > 20) {
      return 'Name should not exceed 20 characters.';
    } else if (!namePattern.test(name)) {
      return 'Name should contain only alphabets and spaces.';
    } else {
      return '';
    }
  };

  const validatePassword = (password: string): string => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address === '') {
      return 'Address is required.';
    } else if (mobileNo === '') {
      return 'Mobile number is required';
    } else if (city === '') {
      return 'City is required';
    } else if (state === '') {
      return 'State is required';
    } else if (zipcode === '') {
      return 'Zipcode is required';
    } else if (password.trim() === '') {
      return 'Password is required.';
    } else if (password.length < 8) {
      return 'Password should contain atleast 8 characters.';
    } else if (!specialCharPattern.test(password)) {
      return 'Password should contain at least one special character.';
    } else if ((password.match(numberPattern) || []).length < 2) {
      return 'Password should contain at least two numerical digits.';
    } else {
      return '';
    }
  };

  const validatePasswordStrength = (password: string) => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    const upperCharPattern = /[A-Z]/;
    if (password.trim() === '') {
      return 'Password is required.';
    } else if (password.length < 8) {
      return 'Password should contain at least 8 characters.';
    } else if (!specialCharPattern.test(password)) {
      return 'Password should contain at least one special character.';
    } else if ((password.match(numberPattern) || []).length < 2) {
      return 'Password should contain at least two numerical digits.';
    }  else if (!upperCharPattern.test(password)) {
      return 'Password should contain atleast one uppercase.';
    } else {
      return '';
    }
  }

  const validateConfirmpassword = (
    password: string,
    confirmpassword: string
  ): string => {
    if (password === '') {
      return 'Password is required';
    } else if (confirmpassword.trim() === '') {
      return 'Please confirm your password.';
    } else if (password !== confirmpassword) {
      return 'Passwords do not match.';
    } else {
      return '';
    }
  };

  const validateAddress = (address: string): string => {
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address.trim() === '') {
      return 'Address field should not be empty.';
    }
    return '';
  };

  const validateMobileNo = (mobileNo: string): string => {
    const mobileNoPattern = /\d/;
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address === '') {
      return 'Address is required.';
    } else if (mobileNo.trim() === '') {
      return 'Mobile number should not be empty.';
    } else if (mobileNo.length > 15) {
      return 'Mobile Number length should not exceed 15 digits';
    } else if (!mobileNoPattern.test(mobileNo)) {
      return 'Mobile number should contain only integer.';
    } else {
      return '';
    }
  };

  const validateCity = (city: string): string => {
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address === '') {
      return 'Address is required.';
    } else if (mobileNo === '') {
      return 'Mobile number is required';
    } else {
      return '';
    }
  };

  const validateState = (state: string): string => {
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address === '') {
      return 'Address is required.';
    } else if (mobileNo === '') {
      return 'Mobile number is required';
    } else if (city === '') {
      return 'City is required';
    } else {
      return '';
    }
  };

  // const validateCountry = (country: string): string => {
  //   if (firstName === '') {
  //     return 'First name is required.';
  //   } else if (lastName === '') {
  //     return 'Last name is required.';
  //   } else if (address === '') {
  //     return 'Address is required.';
  //   } else if (mobileNo === '') {
  //     return 'Mobile number is required';
  //   } else if (city === '') {
  //     return 'City is required';
  //   } else if (state === '') {
  //     return 'State is required';
  //   } else {
  //     return '';
  //   }
  // };

  const validateZipcode = (zipcode: string): string => {
    if (firstName === '') {
      return 'First name is required.';
    } else if (lastName === '') {
      return 'Last name is required.';
    } else if (address === '') {
      return 'Address is required.';
    } else if (mobileNo === '') {
      return 'Mobile number is required';
    } else if (city === '') {
      return 'City is required';
    } else if (state === '') {
      return 'State is required';
    } else if (zipcode.trim() === '') {
      return 'Zipcode is required.';
    } else {
      return '';
    }
  };

  const handleValidation = () => {
    const firstNameError = validatefirstName(firstName);
    const lastNameError = validatelastName(lastName);
    const mobileNoError = validateMobileNo(mobileNo);
    const addressError = validateAddress(address);
    const zipcodeError = validateZipcode(zipcode);
    const cityError = validateCity(city);
    const stateError = validateState(state);
    // const countryError = validateCountry(country);

    const passwordError = validatePassword(password);
    const confirmpasswordError = validateConfirmpassword(password, confirmpassword);

    const errors = [
      firstNameError,
      lastNameError,
      mobileNoError,
      addressError,
      zipcodeError,
      cityError,
      stateError,
    ].filter((error) => error);

    if (passwordError || confirmpasswordError) {
      // Set password errors inline
      setSnackbarMessage(passwordError || confirmpasswordError);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } else if (errors.length > 0) {
      // Set other errors to snackbar
      setSnackbarMessage(errors[0]);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }

    return errors.length === 0 && !passwordError && !confirmpasswordError;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!handleValidation()) {
      return;
    }

    const resultAction = await dispatch(
      registerUser({
        firstName,
        lastName,
        mobileNo: handleMobileChange(mobileNo),
        address,
        city,
        state,
        zipcode,
        password,
        inviteToken,
      })
    );

    if (registerUser.fulfilled.match(resultAction)) {
      setSnackbarMessage('Registration successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);


      setFirstname('');
      setLastname('');
      setMobileno('');
      setAddress('');
      setCity('');
      setState('');
      setZipcode('');
      setPassword('');
      setConfirmpassword('');
      setInviteToken('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      const errorMessage = resultAction.payload
        ? resultAction.payload as string
        : 'Registration failed. Please try again.';
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const stripCountryCode = (phoneNumber: any) => {
    return phoneNumber.startsWith("+1") ? phoneNumber.slice(2) : phoneNumber;
  };

  const handleMobileChange = (value: any) => {
    const strippedValue = stripCountryCode(value || '');
    return strippedValue;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className={styles.loginBackground}>
      <div className={styles.curveUpper}></div>
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <div className={styles.registrationContainer}>
            <div className={styles.logoHeader}>
              <img
                src={logo}
                alt="Tandem Infrastructure Logo"
                className={styles.logo}
              />
              <h1 className={styles.companyName}>TANDEM INFRASTRUCTURE REFERRAL PORTAL REGISTRATION</h1>
            </div>
            <h4 className={styles.formTitle}>REGISTER HERE</h4>
            <div className={styles.formContainer}>
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter your first name"
                      role="presentation"
                      autoComplete='off'
                      value={firstName}
                      ref={firstNameRef}
                      autoFocus
                      onChange={(e) => {
                        setFirstname(e.target.value);
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      role="presentation"
                      autoComplete='off'
                      placeholder="Enter your last name"
                      ref={lastNameRef}
                      value={lastName}
                      onChange={(e) => {
                        setLastname(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    <input
                      type="text"
                      id="address"
                      placeholder="Enter your address"
                      role="presentation"
                      autoComplete='off'
                      ref={addressRef}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="mobileNo">Mobile Number</label>
                    <Input
                      defaultCountry="US"
                      placeholder="Enter phone number"
                      value={mobileNo}
                      onChange={(value: any) => setMobileno(value || '')}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      role="presentation"
                      autoComplete='off'
                      placeholder="Enter your city"
                      ref={cityRef}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      role="presentation"
                      autoComplete='off'
                      placeholder="Enter your state"
                      ref={stateRef}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      title='You cannot edit this filed'
                      type="email"
                      id="email"
                      role="presentation"
                      autoComplete='off'
                      value={emailId}
                      disabled
                      style={{ cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipcode">Zip Code</label>
                    <input
                      type="number"
                      id="zipcode"
                      placeholder="Enter your zipcode"
                      role="presentation"
                      autoComplete='off'
                      ref={zipcodeRef}
                      value={zipcode}
                      onChange={(e) => {
                        setZipcode(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      ref={passwordRef}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {/* <p>Your password should contain m inimum length of 8 and includes toLowerCase uppercase and one special character</p> */}
                    {password &&
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress
                          variant="determinate"
                          value={(strength / 5) * 100}
                          sx={{
                            height: '5px',
                            marginTop: '8px',
                            borderRadius: '5px',
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getColor(),
                            },
                          }}
                        />
                      </Box>}
                    {password && <p className={styles.error}>{validatePasswordStrength(password)}</p>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      ref={confirmPasswordRef}
                      value={confirmpassword}
                      onChange={(e) => {
                        setConfirmpassword(e.target.value);
                      }}
                    />
                    {confirmpassword && <p className={styles.error}>{validateConfirmpassword(password, confirmpassword)}</p>}
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    type="submit"
                    className={styles.buttoncls}
                    disabled={registering}
                  >
                    {registering ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <SnackbarComponent
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        severity={snackbarSeverity}
        style={{ backgroundColor: snackbarSeverity === 'success' ? '#4caf50' : '#DE5242', color: '#FEF9FD' }}
      />
    </div>
  );
};

export default Registration;
