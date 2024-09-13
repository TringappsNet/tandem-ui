import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, Chip, Checkbox, FormControlLabel } from '@mui/material';
import styles from './Support.module.css';
import { AppDispatch } from '../Redux/store';
import mailImage from './mail.png';
import backgroundImage from './bg-login.png';
import { RootState } from '../Redux/reducers';
import {
  raiseTicket,
  sendPromotionalEmails,
  clearMessages,
  supportState,
} from '../Redux/slice/support/supportSlice';
import { fetchBrokers } from '../Redux/slice/user/userSlice';

interface SupportProps {
  onCloseDialog: () => void;
}

const Support: React.FC<SupportProps> = ({ onCloseDialog }) => {
  const userdetails = useSelector((state: RootState) => state.auth);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [formError, setFormError] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const { isLoading, error, successMessage } = useSelector(
    (state: RootState) => state.contact
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const allUsers = useSelector((state: RootState) => state.inviteBroker.brokers);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userdetails.isAdmin) {
      dispatch(fetchBrokers());
    }
  }, [dispatch, userdetails]);

  useEffect(() => {
    if (subject.trim()) {
      setFormError('');
    }
  }, [subject]);

  useEffect(() => {
    if (description.trim() && !subject.trim()) {
      setFormError('Subject is required');
    } else if (description.trim()) {
      setFormError('');
    }
  }, [description, subject]);

  const validateForm = (): boolean => {
    if (!subject.trim()) {
      setFormError('Subject is required');
      return false;
    }
    if (!description.trim()) {
      setFormError('Description is required');
      return false;
    }
    if ((selectedEmails.length === 0)) {
      setFormError('Emails are required');
      return false;
    }
    setFormError('');
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
      ticketSubject: subject.trim(),
      ticketDescription: description.trim(),
      senderId: user.id,
    };

    const ticketDatas = {
      ticketSubject: subject.trim(),
      ticketDescription: description.trim(),
      emails: selectedEmails,
      isDefault,
    };

    if (userdetails.isAdmin) {
      dispatch(sendPromotionalEmails(ticketDatas));
    } else {
      dispatch(raiseTicket(ticketData));
    }
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setSelectAll(checked);
    if (checked) {
      const allEmails = allUsers.map(user => user.email);
      setSelectedEmails(allEmails);
    } else {
      setSelectedEmails([]);
    }
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
        onCloseDialog();
        dispatch(supportState());
      }, 2000);
    }
  }, [successMessage, navigate, onCloseDialog, dispatch]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.supportContainer}>
      <div className={styles.headerLine}>
        {userdetails.isAdmin && <h2 className={styles.support}>Email Campaign</h2>}
        {(!userdetails.isAdmin) && <h2 className={styles.support}>Contact Us!</h2>}
      </div>
      <div className={styles.contactsContainer} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={styles.imageContainer}>
          <img src={mailImage} alt="Mail" className={styles.mailImage} />
        </div>
        <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
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
            {userdetails.isAdmin && (
              <>
                <div style={{ textTransform: 'none' }}>
                  <label htmlFor="emails">Select Email Users:</label>
                  <Autocomplete
                    multiple
                    className={styles.multipleemails}
                    id="emails"
                    options={allUsers.map(user => user.email)}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" placeholder="Select users to send email" />
                    )}
                    value={selectedEmails}
                    onChange={(event, newValue) => setSelectedEmails(newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderTags={(values, getTagProps) =>
                      values.map((value: string, index: number) => (
                        <Chip
                          label={value}
                          {...getTagProps({ index })}
                          key={index}
                          sx={{ fontSize: '.6rem', textTransform: 'none' }}
                          color="info"
                          size="small"
                        />
                      ))
                    }
                  />
                </div>
                <FormControlLabel
                  sx={{
                    textTransform: 'none !important'
                  }}
                  control={
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                      color="primary"
                    />
                  }
                  label="Check this to send email to all"
                  className={styles.selectAllCheckbox}
                />
                <FormControlLabel
                  sx={{
                    textTransform: 'none !important'
                  }}
                  control={
                    <Checkbox
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label="Check this to send additional templates"
                  className={styles.selectAllCheckbox}
                />
              </>
            )}
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              autoComplete='off'
              autoFocus
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
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.sendButton}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        {isLoading && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
