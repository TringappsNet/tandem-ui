import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './profile.module.css';

interface ProfileItem {
    label: string;
    value: string | number;
}

interface Role {
    id: number;
    roleName: string;
}

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileItem[] | null>(null);
    const [rolesDetails, setRolesDetails] = useState<Role[]>([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const storedUserData = localStorage.getItem('auth');
            if (storedUserData) {
                const { user } = JSON.parse(storedUserData);
                try {
                    const response = await axios.get('http://192.168.1.223:3008/api/roles');
                    const roles: Role[] = response.data.map((role: any) => ({
                        id: role.id,
                        roleName: role.roleName
                    }));
                    setRolesDetails(roles);
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
                }
            }
        };
        fetchProfileData();
    }, []);

    if (!profileData) {
        return <div>No User found</div>;
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