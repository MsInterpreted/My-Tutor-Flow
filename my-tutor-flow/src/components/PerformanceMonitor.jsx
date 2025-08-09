import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const PerformanceMonitor = ({ componentName, loadingTime, isVisible = false }) => {
  const theme = useTheme();
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    status: 'loading',
    cacheHit: false,
  });

  useEffect(() => {
    if (loadingTime !== undefined) {
      const status = loadingTime < 1000 ? 'excellent' : 
                   loadingTime < 3000 ? 'good' : 
                   loadingTime < 5000 ? 'fair' : 'poor';
      
      setPerformanceData({
        loadTime: loadingTime,
        status,
        cacheHit: loadingTime < 500, // Assume cache hit if very fast
      });
    }
  }, [loadingTime]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return theme.colors.status.success;
      case 'good': return theme.colors.brand.primary;
      case 'fair': return theme.colors.status.warning;
      case 'poor': return theme.colors.status.error;
      default: return theme.colors.text.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckIcon />;
      case 'good': return <CheckIcon />;
      case 'fair': return <WarningIcon />;
      case 'poor': return <ErrorIcon />;
      default: return <SpeedIcon />;
    }
  };

  if (!isVisible) return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        p: 2,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '12px',
        boxShadow: theme.shadows.card,
        minWidth: 250,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <SpeedIcon sx={{ color: theme.colors.brand.primary, fontSize: 20 }} />
        <Typography
          variant="subtitle2"
          sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
        >
          Performance Monitor
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: theme.colors.text.secondary, mb: 1 }}
      >
        {componentName}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography
          variant="body2"
          sx={{ color: theme.colors.text.secondary }}
        >
          Load Time:
        </Typography>
        <Chip
          icon={getStatusIcon(performanceData.status)}
          label={`${performanceData.loadTime}ms`}
          size="small"
          sx={{
            backgroundColor: getStatusColor(performanceData.status) + '20',
            color: getStatusColor(performanceData.status),
            fontWeight: 600,
          }}
        />
      </Box>

      {performanceData.cacheHit && (
        <Chip
          label="Cache Hit"
          size="small"
          sx={{
            backgroundColor: theme.colors.status.success + '20',
            color: theme.colors.status.success,
            fontWeight: 600,
          }}
        />
      )}

      <LinearProgress
        variant="determinate"
        value={Math.min((5000 - performanceData.loadTime) / 50, 100)}
        sx={{
          mt: 1,
          height: 4,
          borderRadius: 2,
          backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getStatusColor(performanceData.status),
            borderRadius: 2,
          },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          color: theme.colors.text.secondary,
          display: 'block',
          textAlign: 'center',
          mt: 0.5,
        }}
      >
        {performanceData.status.charAt(0).toUpperCase() + performanceData.status.slice(1)} Performance
      </Typography>
    </Paper>
  );
};

export default PerformanceMonitor;
