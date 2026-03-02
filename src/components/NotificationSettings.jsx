import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import pushNotificationService from '../services/pushNotificationService';

export default function NotificationSettings() {
  const theme = useTheme();
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [prefs, setPrefs] = useState(pushNotificationService.getPreferences());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setPermissionStatus(pushNotificationService.getPermissionStatus());
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    setMessage(null);
    const result = await pushNotificationService.requestPermission();
    setLoading(false);

    if (result.granted) {
      setPermissionStatus('granted');
      setMessage({ type: 'success', text: 'Push notifications enabled!' });
    } else if (result.reason === 'denied') {
      setPermissionStatus('denied');
      setMessage({ type: 'error', text: 'Notifications blocked. Please enable them in your browser settings.' });
    } else if (result.reason === 'unsupported') {
      setMessage({ type: 'warning', text: 'Push notifications are not supported in this browser.' });
    } else {
      setMessage({ type: 'error', text: `Failed to enable notifications: ${result.reason}` });
    }
  };

  const updatePref = (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    pushNotificationService.savePreferences(newPrefs);
  };

  const cardSx = {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '16px',
  };

  const isSupported = pushNotificationService.isSupported();

  return (
    <Box>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      {/* Permission Status Card */}
      <Card sx={{ ...cardSx, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              {permissionStatus === 'granted' ? (
                <NotificationsActiveIcon sx={{ color: '#4CAF50' }} />
              ) : permissionStatus === 'denied' ? (
                <NotificationsOffIcon sx={{ color: '#F44336' }} />
              ) : (
                <NotificationsIcon sx={{ color: theme.colors.text.secondary }} />
              )}
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                Push Notifications
              </Typography>
            </Box>
            <Chip
              label={
                permissionStatus === 'granted' ? 'Enabled' :
                permissionStatus === 'denied' ? 'Blocked' :
                !isSupported ? 'Unsupported' : 'Not Set Up'
              }
              size="small"
              sx={{
                backgroundColor: permissionStatus === 'granted' ? '#4CAF5020' :
                                 permissionStatus === 'denied' ? '#F4433620' : `${theme.colors.text.secondary}20`,
                color: permissionStatus === 'granted' ? '#4CAF50' :
                       permissionStatus === 'denied' ? '#F44336' : theme.colors.text.secondary,
                fontWeight: 600,
              }}
            />
          </Box>

          {permissionStatus !== 'granted' && isSupported && (
            <Button
              variant="contained"
              onClick={handleEnableNotifications}
              disabled={loading || permissionStatus === 'denied'}
              startIcon={<NotificationsActiveIcon />}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000',
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {loading ? 'Enabling...' : 'Enable Push Notifications'}
            </Button>
          )}

          {permissionStatus === 'denied' && (
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mt: 1 }}>
              Notifications are blocked. To enable them, go to your browser settings and allow notifications for this site.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      {permissionStatus === 'granted' && (
        <Card sx={cardSx}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 2 }}>
              Notification Preferences
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={prefs.sessionReminders}
                  onChange={(e) => updatePref('sessionReminders', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
                    Session Reminders
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Get notified before upcoming tutoring sessions
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={prefs.overdueInvoices}
                  onChange={(e) => updatePref('overdueInvoices', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
                    Overdue Invoice Alerts
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Get notified about overdue payments
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, display: 'flex', alignItems: 'flex-start' }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={prefs.attendanceUpdates}
                  onChange={(e) => updatePref('attendanceUpdates', e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: 500 }}>
                    Attendance Updates
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Get notified when attendance is recorded
                  </Typography>
                </Box>
              }
              sx={{ display: 'flex', alignItems: 'flex-start' }}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
