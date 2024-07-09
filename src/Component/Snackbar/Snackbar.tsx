import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity="error" sx={{width:'700px',textAlign:'center'}}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
