import React from 'react';
import { Box } from '@mui/material';

/**
 * My Tutor Flow Logo Component
 * Uses the official My_Tutor_Flow_Logo.png file
 * Features: Consistent branding across the entire application
 */
export const MyTutorFlowLogo = ({
  size = 120,
  showText = true,
  variant = 'full',
  sx = {},
  onClick,
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      <img
        src="/assets/logos/My_Tutor_Flow_Logo.png"
        alt="My Tutor Flow"
        style={{
          width: size,
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
        }}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          // Fallback to a simple text logo if image fails
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <Box
        sx={{
          display: 'none',
          fontSize: size > 80 ? '1.8rem' : '1.4rem',
          fontWeight: 800,
          background: `linear-gradient(135deg, #10b981 0%, #fbbf24 100%)`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        My Tutor Flow
      </Box>
    </Box>
  );
};

// Preset logo components for different use cases
export const NavigationLogo = (props) => (
  <MyTutorFlowLogo size={props.size === "small" ? 80 : 120} {...props} />
);

export const LoginLogo = (props) => (
  <MyTutorFlowLogo size={150} {...props} />
);

export const IconLogo = (props) => (
  <MyTutorFlowLogo size={40} {...props} />
);

export const HackathonLogo = (props) => (
  <MyTutorFlowLogo size={200} {...props} />
);

export default MyTutorFlowLogo;
