import React from 'react';
import styles from './profile.module.css';

const profileData = [
    { label: "Id", value: "ID01" },
    { label: "Name", value: "Admin User" },
    { label: "Email", value: "tandeminfrastructure@gmail.com" },
    { label: "Mobile", value: "789456123" },
    { label: "Address", value: "2nd road" },
    { label: "Country", value: "United States" },
    { label: "State", value: "California" },
    { label: "Zipcode", value: "12345" },
];

const Profile: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <div className={styles.headerSection}>
                    <div className={styles.circle}>
                        <p>A</p>
                    </div>
                    <h2 className={styles.userName}>Admin User</h2>
                </div>
                <div className={styles.profileBlock}>
                    {profileData.map((item, index) => (
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