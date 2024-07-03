import React from 'react';
import styles from './Support.module.css';

const Support: React.FC = () => {
    return (
        <div className={styles.contactsContainer}>
            <div className={styles.contactForm}>
                <h2 className={styles.supportName}>Support</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        placeholder='Enter the subject of concern'
                        id="subject"
                        name="subject"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description"
                        name="description"
                        placeholder='Enter the description'
                        rows={7}
                    >
                    </textarea>
                </div>
                <button className={styles.sendButton}>Send</button>
            </div>
        </div>
    );
};

export default Support;