import React, { memo } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useCountUp, usePulseAnimation } from '../hooks/useAnimatedValue';

const ActivityCard = ({
  title,
  subtitle,
  icon: Icon,
  color = 'cyan',
  onClick,
  to,
  stats,
  className = '',
  ...props
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Extract numeric value for animation
  const numericStats = typeof stats === 'string' ? parseFloat(stats) || 0 : stats || 0;
  const animatedStats = useCountUp(numericStats, 2000, 300);
  const pulseStyle = usePulseAnimation(true);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  // PERFORMANCE: Memoized color map with safe fallbacks
  const colorMap = React.useMemo(() => ({
    pink: theme.colors?.cards?.pink || '#FF6B9D',
    cyan: theme.colors?.cards?.cyan || '#00D4AA',
    blue: theme.colors?.cards?.blue || '#4A90E2',
    yellow: theme.colors?.cards?.yellow || '#FFD93D',
    purple: theme.colors?.cards?.purple || '#7B68EE',
    green: theme.colors?.cards?.green || '#00C853',
  }), [theme.colors]);

  return (
    <Box
      onClick={handleClick}
      className={`activity-card ${color} ${className}`}
      sx={{
        background: `linear-gradient(135deg, ${colorMap[color]}, ${colorMap[color]}CC)`,
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
        },
        '&:active': {
          transform: 'translateY(-4px) scale(1.01)',
        },
        // Add subtle pattern overlay
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
        ...props.sx,
      }}
      {...props}
    >
      {/* Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
          }}
        >
          {Icon && <Icon sx={{ fontSize: 24, color: 'white' }} />}
        </Box>

        {/* Optional stats in top right */}
        {stats && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '18px',
              opacity: 0.9,
              ...pulseStyle,
            }}
          >
            {typeof stats === 'string' && stats.includes('h')
              ? `${animatedStats.toFixed(1)}h`
              : Math.round(animatedStats)}
          </Typography>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ mt: 2, minHeight: '60px', display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: subtitle ? 0.9 : 0,
            fontSize: '14px',
            lineHeight: 1.4,
            fontWeight: 500,
            color: 'rgba(0, 0, 0, 0.8)',
            minHeight: '20px', // Reserve space even when empty
          }}
        >
          {subtitle || '\u00A0'} {/* Non-breaking space when empty */}
        </Typography>
      </Box>

      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          bottom: -10,
          right: -10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: -5,
          right: 20,
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.3,
        }}
      />
    </Box>
  );
};

// PERFORMANCE: Memoized export for better performance
export default memo(ActivityCard);
