import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';

interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity: 'success' | 'error' | 'warning' | 'info';
  style?: React.CSSProperties; 
  icon?: React.ReactNode;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  open,
  message,
  onClose,
  severity,
  style,
  icon,
}) => {
  const defaultIcon = severity === 'error' ? <ErrorIcon fontSize="inherit" /> : null;
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        icon={icon || defaultIcon}
        severity={severity}
        sx={{ width: '700px', textAlign: 'center',...style,padding: '2px 20px 2px'}}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;