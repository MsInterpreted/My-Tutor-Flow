import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const ProgressCircle = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  color = '#00D4AA',
  label,
  value,
  subtitle,
  animated = true,
}) => {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* SVG Circle */}
      <Box sx={{ position: 'relative' }}>
        <svg
          width={size}
          height={size}
          style={{
            transform: 'rotate(-90deg)',
          }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.background.tertiary}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: animated ? 'stroke-dashoffset 1s ease-in-out' : 'none',
              filter: 'drop-shadow(0 0 8px rgba(0, 212, 170, 0.3))',
            }}
          />
        </svg>

        {/* Center content */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          {value ? (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.colors.text.primary,
                fontSize: size > 100 ? '24px' : '18px',
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.colors.text.primary,
                fontSize: size > 100 ? '24px' : '18px',
                lineHeight: 1,
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          )}
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: theme.colors.text.secondary,
                fontSize: '12px',
                display: 'block',
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Label */}
      {label && (
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            mt: 2,
            textAlign: 'center',
            fontSize: '14px',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default ProgressCircle;
