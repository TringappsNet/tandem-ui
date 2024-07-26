import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './snackbar.module.css';

interface SnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity: 'success' | 'error' | 'warning' | 'info';
  style?: React.CSSProperties;
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  open,
  message,
  onClose,
  severity,
  style,
}) => {
  const iconStyle: React.CSSProperties = {
    backgroundColor: '#ffffff3b',
    borderRadius: '50%',
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    textAlign:'center',
    fontSize: '18px',
    height: '30px',
    width: '30px',
    color:'white',
  };

  const IconComponent = severity === 'error' ? ErrorIcon : CheckCircleIcon;

  const alertProps: AlertProps = {
    onClose: onClose,
    severity: severity,
    sx: { width: '700px', textAlign: 'center', ...style, padding: '0 10px',backgroundColor: severity === 'error' ? '#DE5242' : '#54B471'},
    action: (<IconButton  onClick={onClose}><CloseIcon className={styles.cross}/></IconButton>
    ),
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert {...alertProps} icon={<div style={iconStyle}><IconComponent className={styles.icon}/></div>} >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
