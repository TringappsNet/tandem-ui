import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';

interface ProfileItem {
    label: string;
    value: number;
}

const Profile: React.FC = () => {
    const [profileData, setProfileData] = useState<ProfileItem[] | null>(null);

    useEffect(() => {
        const storedUserData = localStorage.getItem('auth');

        console.log(storedUserData);
        if (storedUserData) {
            const { user } = JSON.parse(storedUserData);
            setProfileData([
                { label: "Id", value: user.id },
                { label: "Name", value: `${user.firstName} ${user.lastName}` },
                { label: "Email", value: user.email },
                { label: "Mobile", value: user.mobile },
                { label: "Address", value: user.address },
                { label: "Country", value: user.country },
                { label: "State", value: user.state },
                { label: "Zipcode", value: user.zipcode },
            ]);
        }
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
