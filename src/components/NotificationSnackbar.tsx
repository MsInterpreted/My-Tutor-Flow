import React from 'react';
import { Snackbar, Alert, AlertTitle } from '@mui/material';
import type { NotificationState } from '../types';

interface NotificationSnackbarProps {
  notification: NotificationState;
  onClose: () => void;
  autoHideDuration?: number;
  title?: string;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({
  notification,
  onClose,
  autoHideDuration = 6000,
  title,
}) => {
  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
