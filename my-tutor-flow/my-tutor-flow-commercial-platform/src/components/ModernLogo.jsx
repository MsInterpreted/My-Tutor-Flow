import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const ModernLogo = ({
  size = 'medium',
  showText = true,
  variant = 'full',
  animated = false,
  ...props
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: { icon: 24, text: '14px' },
    medium: { icon: 32, text: '16px' },
    large: { icon: 48, text: '20px' },
    xlarge: { icon: 64, text: '24px' },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  const LogoIcon = ({ size: iconSize }) => (
    <Box
      sx={{
        width: iconSize,
        height: iconSize,
        borderRadius: '12px',
        background: `linear-gradient(135deg, ${theme.colors.brand.primary}, #4A90E2, #6BCF7F)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: theme.shadows.md,
        animation: animated ? 'logoFloat 3s ease-in-out infinite' : 'none',
        '@keyframes logoFloat': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.2), transparent)',
          borderRadius: 'inherit',
        },
      }}
    >
      {/* Modern geometric design representing education flow */}
      <svg
        width={iconSize * 0.6}
        height={iconSize * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book/Education symbol */}
        <path
          d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
          fill="white"
          fillOpacity="0.9"
        />
        {/* Flow lines */}
        <path
          d="M8 8H16M8 12H14M8 16H12"
          stroke="rgba(0,212,170,0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Accent dot */}
        <circle cx="16" cy="16" r="2" fill={theme.colors.brand.primary} />
      </svg>
    </Box>
  );

  if (variant === 'icon') {
    return <LogoIcon size={currentSize.icon} {...props} />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: showText ? 1.5 : 0,
        ...props.sx,
      }}
      {...props}
    >
      <LogoIcon size={currentSize.icon} />

      {showText && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
              fontSize: currentSize.text,
              fontFamily: theme.typography.fontFamily.primary,
              letterSpacing: '-0.02em',
              background: `linear-gradient(135deg, ${theme.colors.brand.primary}, #4A90E2)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: animated ? 'textShimmer 2s ease-in-out infinite' : 'none',
              '@keyframes textShimmer': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.8 },
              },
            }}
          >
            My Tutor Flow
          </Typography>
          {size === 'large' || size === 'xlarge' ? (
            <Typography
              sx={{
                color: theme.colors.text.secondary,
                fontSize: `${parseInt(currentSize.text) * 0.6}px`,
                fontWeight: 400,
                mt: 0.5,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Education Platform
            </Typography>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

// Alternative logo variations
export const LogoMark = props => <ModernLogo variant="icon" {...props} />;

export const LogoWithTagline = props => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ...props.sx }}>
    <ModernLogo size="large" {...props} />
    <Typography
      sx={{
        color: 'text.secondary',
        fontSize: '12px',
        fontWeight: 500,
        mt: 1,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      Empowering Education
    </Typography>
  </Box>
);

// Animated version for splash screens
export const AnimatedLogo = props => <ModernLogo animated {...props} />;

export default ModernLogo;
