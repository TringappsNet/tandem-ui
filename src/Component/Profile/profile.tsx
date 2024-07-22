
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../Redux/store';
import {
  fetchRoles,
  selectRolesLoading,
  selectRolesError,
} from '../Redux/slice/role/rolesSlice';
import styles from './profile.module.css';
import { RootState } from '../Redux/reducers';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaFlag, FaMapPin, FaRobot } from 'react-icons/fa';

interface ProfileItem {
  label: string;
  value: string | number;
  icon: React.ReactElement;
}

interface ProfileProps {
  onCloseDialog: () => void;
}

const Profile: React.FC<ProfileProps> = () => {
  const [profileData, setProfileData] = useState<ProfileItem[] | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  // const [isLoading, setIsLoading] = useState(true);
  const roles = useSelector((state: RootState) => state.roles.roles);
  const dispatch = useDispatch<AppDispatch>();
  const rolesLoading = useSelector(selectRolesLoading);
  const rolesError = useSelector(selectRolesError);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchRoles());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!rolesLoading && !rolesError && user) {
      const userRole = roles.find((role) => role.id === user.roleId);
      const userProfileData = [
        { label: 'Name', value: `${user.firstName} ${user.lastName}`, icon: <FaUser /> },
        { label: 'Role', value: userRole ? userRole.roleName : 'N/A', icon: <FaRobot /> },
        { label: 'Email', value: user.email, icon: <FaEnvelope /> },
        { label: 'Mobile', value: user.mobile, icon: <FaPhone /> },
        { label: 'Address', value: user.address, icon: <FaMapMarkerAlt /> },
        { label: 'Country', value: user.country, icon: <FaGlobe /> },
        { label: 'State', value: user.state, icon: <FaFlag /> },
        { label: 'Zipcode', value: user.zipcode, icon: <FaMapPin /> },
      ];
      setProfileData(userProfileData);
      // setIsLoading(false);
    }
  }, [roles, rolesLoading, rolesError, user]);


  if (rolesError) {
    return (
      <div className={styles.error}>Error fetching roles: {rolesError}</div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.header} style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1>Profile</h1>
      </div> */}
      <div className={styles.profileContainer}>
        <div className={styles.sidebar}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              <p>{profileData[0].value.toString().charAt(0)}</p>
            </div>
          </div>
          <h2 className={styles.userName}>{profileData[0].value}</h2>
          <div className={styles.progressContainer}>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'personal' ? styles.active : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
          </div>
          <div className={styles.tabContent}>
            {activeTab === 'personal' && (
              <div className={styles.profileBlock}>
                {profileData.map((item: ProfileItem, index: number) => (
                  <div key={index} className={styles.profileItem}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}:</span>
                    <span className={styles.value}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;