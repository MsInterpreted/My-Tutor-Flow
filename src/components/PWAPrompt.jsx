import React, { useState, useEffect } from 'react';
import { Snackbar, Button, Box, Typography } from '@mui/material';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTheme } from '../theme/ThemeContext';

export default function PWAPrompt() {
  const theme = useTheme();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      // Check for updates every hour
      if (r) {
        setInterval(() => r.update(), 60 * 60 * 1000);
      }
    },
    onRegSWUpdFound() {
      console.log('SW update found');
    },
  });

  // Listen for install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Only show install prompt if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstall(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstall(false);
        setInstallPrompt(null);
      }
    }
  };

  return (
    <>
      {/* Update available prompt */}
      <Snackbar
        open={needRefresh}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message="A new version is available"
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setNeedRefresh(false)}
              sx={{ color: theme.colors.text.secondary }}
            >
              Later
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => updateServiceWorker(true)}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000',
                fontWeight: 600,
              }}
            >
              Update
            </Button>
          </Box>
        }
      />

      {/* Install app prompt */}
      <Snackbar
        open={showInstall}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={
          <Typography variant="body2">
            Install TD Learning Academy for a better experience
          </Typography>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setShowInstall(false)}
              sx={{ color: theme.colors.text.secondary }}
            >
              Not Now
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleInstall}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000',
                fontWeight: 600,
              }}
            >
              Install
            </Button>
          </Box>
        }
      />
    </>
  );
}
