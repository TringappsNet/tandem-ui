import React from 'react';
import RegistrationForm from './Component/Registration/Registration';
import styles from './Component/Registration/Registration.module.css';
import { SnackbarProvider } from 'notistack';

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <div className={styles.backgroundPattern}>
        <RegistrationForm />
      </div>
    </SnackbarProvider>
  );
};

export default App;