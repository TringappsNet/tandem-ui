import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './profile.module.css';
import { RootState } from "../Redux/reducers";

interface ProfileItem {
    label: string;
    value: string | number;
}

interface Role {
    id: number;
    roleName: string;
}

interface ProfileProps {
    onCloseDialog: () => void;
}

const Profile: React.FC<ProfileProps> = () => {
    const [profileData, setProfileData] = useState<ProfileItem[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (user) {
                try {
                    const response = await axios.get('http://192.168.1.223:3008/api/roles');
                    const roles: Role[] = response.data.map((role: any) => ({
                        id: role.id,
                        roleName: role.roleName
                    }));
                    const userRole = roles.find(role => role.id === user.roleId);
                    const userProfileData = [
                        { label: "Id", value: user.id },
                        { label: "Name", value: `${user.firstName} ${user.lastName}` },
                        { label: "Role", value: userRole ? userRole.roleName : 'N/A' },
                        { label: "Email", value: user.email },
                        { label: "Mobile", value: user.mobile },
                        { label: "Address", value: user.address },
                        { label: "Country", value: user.country },
                        { label: "State", value: user.state },
                        { label: "Zipcode", value: user.zipcode }
                    ];
                    setProfileData(userProfileData);
                } catch (error) {
                    console.error('Error fetching roles:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchProfileData();
    }, [user]);

    if (isLoading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>
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