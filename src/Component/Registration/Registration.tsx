import React, { useState, useEffect, useRef } from "react";
import styles from "./Registration.module.css";
import { axiosInstance } from "../AxiosInterceptor/AxiosInterceptor";
import logo from "./logo.jpeg";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [mobileNo, setMobileno] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [disableState, setDisableState] = useState(false);
  const [validationErrorMessage, setValidationErrorMessage] = useState("");
  const [validationSucessMessage, setValidationSucessMessage] = useState("");
  const [inviteTokenError, setInviteTokenError] = useState("");
  const [inviteToken, setInviteToken] = useState("");

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const mobileNoRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const zipcodeRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("inviteToken");
    if (token) {
      setInviteToken(token);
    }
  }, []);

  const validatefirstName = (name: string): string => {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (name.trim() === "") {
      return "First Name is required.";
    } else if (name.length > 20) {
      return "Name should not exceed 20 characters.";
    } else if (!namePattern.test(name)) {
      return "Name should contain only alphabets and spaces.";
    } else {
      return "";
    }
  };

  const validatelastName = (name: string): string => {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (firstName === "") {
      return " First Name is required.";
    } else if (name.trim() === "") {
      return "Last Name is required.";
    } else if (name.length > 20) {
      return "Name should not exceed 20 characters.";
    } else if (!namePattern.test(name)) {
      return "Name should contain only alphabets and spaces.";
    } else {
      return "";
    }
  };

  const validatePassword = (password: string): string => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    const numberPattern = /\d/g;
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else if (city === "") {
      return "City is required";
    } else if (state === "") {
      return "State is required";
    } else if (country === "") {
      return "Country is required";
    } else if (zipcode === "") {
      return "Zipcode is required";
    } else if (password.trim() === "") {
      setDisableState(false);
      return "Password is required.";
    } else if (password.length < 8) {
      setDisableState(false);
      return "Password should be at least 8 characters long.";
    } else if (!specialCharPattern.test(password)) {
      setDisableState(false);
      return "Password should contain at least one special character.";
    } else if ((password.match(numberPattern) || []).length < 2) {
      setDisableState(false);
      return "Password should contain at least two numerical digits.";
    } else {
      setDisableState(true);
      return "";
    }
  };

  const validateConfirmpassword = (
    password: string,
    confirmpassword: string
  ): string => {
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else if (city === "") {
      return "City is required";
    } else if (state === "") {
      return "State is required";
    } else if (country === "") {
      return "Country is required";
    } else if (zipcode === "") {
      return "Zipcode is required";
    } else if (password === "") {
      return "Password is required";
    } else if (confirmpassword.trim() === "") {
      return "Please confirm your password.";
    } else if (password !== confirmpassword) {
      return "Passwords do not match.";
    } else {
      return "";
    }
  };

  const validateAddress = (address: string): string => {
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address.trim() === "") {
      return "Address field should not be empty.";
    }
    return "";
  };

  const validateMobileNo = (mobileNo: string): string => {
    const mobileNoPattern = /^\d{10}$/;
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo.trim() === "") {
      return "Mobile number should not be empty.";
    } else if (!mobileNoPattern.test(mobileNo)) {
      return "Mobile number should be exactly 10";
    } else {
      return "";
    }
  };

  const validateCity = () => {
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else {
      return "";
    }
  };

  const validateState = () => {
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else if (city === "") {
      return "City is required";
    } else {
      return "";
    }
  };

  const validateCountry = () => {
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else if (city === "") {
      return "City is required";
    } else if (state === "") {
      return "State is required";
    } else {
      return "";
    }
  };

  const validateZipcode = (zipcode: string): string => {
    const zipcodePattern = /^\d{5}$/;
    if (firstName === "") {
      return "first name is required.";
    } else if (lastName === "") {
      return "last name is required.";
    } else if (address === "") {
      return "address is required.";
    } else if (mobileNo === "") {
      return "mobile number is required";
    } else if (city === "") {
      return "City is required";
    } else if (state === "") {
      return "State is required";
    } else if (country === "") {
      return "Country is required";
    } else if (zipcode.trim() === "") {
      return "Zipcode is required.";
    } else if (!zipcodePattern.test(zipcode)) {
      return "Zipcode should be exactly 5 digits.";
    } else {
      return "";
    }
  };
  const handleValidation = () => {
    const firstNameError = validatefirstName(firstName);
    const lastNameError = validatelastName(lastName);
    const mobileNoError = validateMobileNo(mobileNo);
    const passwordError = validatePassword(password);
    const addressError = validateAddress(address);
    const confirmpasswordError = validateConfirmpassword(
      password,
      confirmpassword
    );
    const zipcodeError = validateZipcode(zipcode);

    const errors = [
      firstNameError,
      lastNameError,
      mobileNoError,
      passwordError,
      addressError,
      confirmpasswordError,
      zipcodeError,
    ].filter((error) => error);

    setValidationErrorMessage(errors.length > 0 ? errors[0] : "");

    return errors.length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!handleValidation()) {
      return;
    }

    try {
      await axiosInstance.post("/auth/register", {
        firstName,
        lastName,
        mobileNo,
        address,
        city,
        state,
        country,
        zipcode,
        password,
        inviteToken,
      });
      setValidationSucessMessage("Registration successful!");
      setInviteTokenError("");

      setFirstname("");
      setLastname("");
      setMobileno("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setZipcode("");
      setPassword("");
      setConfirmpassword("");
      setDisableState(false);
      setInviteToken("");
      setInviteTokenError("");
      navigate("/login");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.message) {
          setInviteTokenError(error.response.data.message);
        } else {
          setInviteTokenError(
            "Invalid invite token. Please check and try again."
          );
        }
      } else {
        setValidationErrorMessage("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="app">
      <div className={styles.backgroundContainer}>
        <div className={styles.container}>
          <div className={styles.registrationContainer}>
            <div className={styles.logoHeader}>
              <img
                src={logo}
                alt="Tandem Infrastructure Logo"
                className={styles.logo}
              />
              <h1 className={styles.companyName}>TANDEM INFRASTRUCTURE</h1>
            </div>
            <h4 className={styles.formTitle}>REGISTER HERE</h4>
            <div className={styles.formContainer}>
              <form onSubmit={(e) => handleSubmit(e)}>
                {validationErrorMessage && (
                  <div className={styles.errorshow}>
                    {validationErrorMessage}
                  </div>
                )}
                {inviteTokenError && (
                  <div className={styles.errorshow}>{inviteTokenError}</div>
                )}
                {validationSucessMessage && (
                  <div className={styles.successshow}>
                    {validationSucessMessage}
                  </div>
                )}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      placeholder="Enter your first name"
                      value={firstName}
                      ref={firstNameRef}
                      autoFocus
                      onChange={(e) => {
                        setFirstname(e.target.value);
                        setValidationErrorMessage(
                          validatefirstName(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      placeholder="Enter your last name"
                      ref={lastNameRef}
                      value={lastName}
                      onChange={(e) => {
                        setLastname(e.target.value);
                        setValidationErrorMessage(
                          validatelastName(e.target.value)
                        );
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
                      ref={addressRef}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setValidationErrorMessage(
                          validateAddress(e.target.value)
                        );
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="mobileNo">Mobile No</label>
                    <input
                      type="tel"
                      id="mobileNo"
                      placeholder="Enter your mobile number"
                      ref={mobileNoRef}
                      value={mobileNo}
                      onChange={(e) => {
                        setMobileno(e.target.value);
                        setValidationErrorMessage(
                          validateMobileNo(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      placeholder="Enter your city"
                      ref={cityRef}
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setValidationErrorMessage(validateCity());
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      placeholder="Enter your state"
                      ref={stateRef}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setValidationErrorMessage(validateState());
                      }}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      placeholder="Enter your country"
                      ref={countryRef}
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setValidationErrorMessage(validateCountry());
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="zipcode">Zipcode</label>
                    <input
                      type="text"
                      id="zipcode"
                      placeholder="Enter your zipcode"
                      ref={zipcodeRef}
                      value={zipcode}
                      onChange={(e) => {
                        setZipcode(e.target.value);
                        setValidationErrorMessage(
                          validateZipcode(e.target.value)
                        );
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
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setValidationErrorMessage(
                          validatePassword(e.target.value)
                        );
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
                      ref={confirmPasswordRef}
                      value={confirmpassword}
                      onChange={(e) => {
                        setConfirmpassword(e.target.value);
                        setValidationErrorMessage(
                          validateConfirmpassword(password, e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>
                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.buttoncls}>
                    Register
                  </button>
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
