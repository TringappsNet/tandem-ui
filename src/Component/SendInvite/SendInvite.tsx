import React, { useState, useRef, useEffect } from 'react';
import styles from './SendInvite.module.css';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../Redux/reducers';
import {
  closeSendInvite,
  sendInvite,
  resetResponse,
  clearResponse,
} from '../Redux/slice/auth/sendInviteSlice';
import { AppDispatch } from '../Redux/store';
import {
  fetchRoles,
  selectRolesLoading,
} from '../Redux/slice/role/rolesSlice';

interface SendInviteProps {
  onCloseDialog: () => void;
}

const SendInvite: React.FC<SendInviteProps> = ({ onCloseDialog }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const open = useSelector((state: RootState) => state.sendInvite.open);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const rolesLoading = useSelector(selectRolesLoading);
  const isLoading = useSelector(
    (state: RootState) => state.sendInvite.isLoading
  );
  const responseMessage = useSelector(
    (state: RootState) => state.sendInvite.responseMessage
  );
  const responseType = useSelector(
    (state: RootState) => state.sendInvite.responseType
  );
  const [showInviteForm, setShowInviteForm] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [roleId, setRoleId] = useState<number | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    console.log('Roles in send invite:', roles);
  }, [roles]);

  useEffect(() => {
    if (open) {
      setEmail('');
      setEmailError('');
      setRoleId(null);
      dispatch(resetResponse());
    }
  }, [open, dispatch]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError || validateEmail(e.target.value)) {
      setEmailError('');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    if (roleId === null) {
      dispatch(resetResponse());
      dispatch({
        type: 'sendInvite/sendInvite/rejected',
        payload: 'Please select the role.',
      });
      return;
    }

    dispatch(sendInvite({ email: email.trim(), roleId })).then((action) => {
      if (action.type === 'sendInvite/sendInvite/fulfilled') {
        setTimeout(() => {
          dispatch(closeSendInvite());
          setShowInviteForm(false);
          setEmail('');
          dispatch(clearResponse());
          navigate('/dashboard');
          onCloseDialog();
        }, 3000);
      }
    });
  };

  return (
    <>
      {open && showInviteForm && (
        <div className={styles.formContainer}>
          <div className={styles.headerLine}>
            <h2>Send Invite</h2>
          </div>
          <div className={styles.body}>
            {responseMessage && (
              <div
                className={classNames(styles.responseMessage, {
                  [styles.success]: responseType === 'success',
                  [styles.error]: responseType === 'error',
                })}
              >
                {responseMessage}
              </div>
            )}
            {emailError && (
              <div className={styles.emailerror}>
                {emailError}
              </div>
            )}
            <form onSubmit={handleSendInvite} autoComplete="off" noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  role="presentation"
                  autoComplete='off'
                  placeholder="Enter your email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="roleId">Role:</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="roleId"
                    name="roleId"
                    ref={selectRef}
                    className={styles.customSelect}
                    value={roleId ?? ''}
                    onChange={(e) => setRoleId(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isLoading || rolesLoading}>
                {isLoading ? 'Sending Invite' : 'Send Invite'}
              </button>
            </form>
            {(isLoading || rolesLoading) && (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SendInvite;
