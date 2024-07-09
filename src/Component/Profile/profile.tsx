import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import axiosInstance from '../AxiosInterceptor/AxiosInterceptor';
import { AppDispatch } from "../Redux/store";
import {
  fetchRoles,
  selectRolesLoading,
  selectRolesError,
} from "../Redux/slice/role/rolesSlice";
import styles from "./profile.module.css";
import { RootState } from "../Redux/reducers";

interface ProfileItem {
  label: string;
  value: string | number;
}

// interface Role {
//     id: number;
//     roleName: string;
// }

interface ProfileProps {
  onCloseDialog: () => void;
}

const Profile: React.FC<ProfileProps> = () => {
  const [profileData, setProfileData] = useState<ProfileItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        { label: "Id", value: user.id },
        { label: "Name", value: `${user.firstName} ${user.lastName}` },
        { label: "Role", value: userRole ? userRole.roleName : "N/A" },
        { label: "Email", value: user.email },
        { label: "Mobile", value: user.mobile },
        { label: "Address", value: user.address },
        { label: "Country", value: user.country },
        { label: "State", value: user.state },
        { label: "Zipcode", value: user.zipcode },
      ];
      setProfileData(userProfileData);
      setIsLoading(false);
    }
  }, [roles, rolesLoading, rolesError, user]);

  if (rolesLoading || isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

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
      <div className={styles.profileContainer}>
        <div className={styles.headerSection}>
          <div className={styles.circle}>
            <p>{profileData[1].value.toString().charAt(0)}</p>
          </div>
          <h2 className={styles.userName}>{profileData[1].value}</h2>
        </div>
        <div className={styles.profileBlock}>
          {profileData.map((item: ProfileItem, index: number) => (
            <div key={index} className={styles.profileItem}>
              <span className={styles.label}>{item.label}:</span>
              <span className={styles.value}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
