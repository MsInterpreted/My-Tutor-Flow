import React from 'react';
import { Box } from '@mui/material';
import { TOKENS } from '../../config/solanaTokens';

/**
 * BONK Logo Component
 * Uses the official BONK logo files for professional presentation
 */
export const BonkLogo = ({ 
  variant = 'linear', // 'linear' or 'logoOnly'
  size = 'medium',
  sx = {},
  onClick,
  alt = "BONK Logo",
  ...props 
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      width: 60,
      height: 'auto',
    },
    medium: {
      width: 100,
      height: 'auto',
    },
    large: {
      width: 150,
      height: 'auto',
    },
    xlarge: {
      width: 200,
      height: 'auto',
    },
    hero: {
      width: 300,
      height: 'auto',
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;
  
  // Select the appropriate logo based on variant
  const logoSrc = variant === 'logoOnly' 
    ? TOKENS.BONK.logoOnly 
    : TOKENS.BONK.logoLinear;

  return (
    <Box
      component="img"
      src={logoSrc}
      alt={alt}
      sx={{
        width: config.width,
        height: config.height,
        objectFit: 'contain',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
          filter: 'brightness(1.1)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    />
  );
};

// Preset components for different use cases
export const BonkLogoSmall = (props) => (
  <BonkLogo size="small" {...props} />
);

export const BonkLogoMedium = (props) => (
  <BonkLogo size="medium" {...props} />
);

export const BonkLogoLarge = (props) => (
  <BonkLogo size="large" {...props} />
);

export const BonkLogoHero = (props) => (
  <BonkLogo size="hero" {...props} />
);

// Animated version with hover effects
export const AnimatedBonkLogo = ({ size = 'medium', variant = 'linear', ...props }) => {
  return (
    <Box
      sx={{
        '& img': {
          transition: 'all 0.3s ease-in-out',
        },
        '&:hover img': {
          filter: 'brightness(1.1) saturate(1.1)',
          transform: 'scale(1.05) rotate(2deg)',
        },
        '&:active img': {
          transform: 'scale(0.98)',
        },
      }}
    >
      <BonkLogo size={size} variant={variant} {...props} />
    </Box>
  );
};

// Floating animation version for hero sections
export const FloatingBonkLogo = ({ size = 'large', variant = 'linear', ...props }) => {
  return (
    <Box
      sx={{
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(5deg)',
          },
        },
      }}
    >
      <BonkLogo size={size} variant={variant} {...props} />
    </Box>
  );
};

// Spinning animation for loading states
export const SpinningBonkLogo = ({ size = 'medium', variant = 'logoOnly', ...props }) => {
  return (
    <Box
      sx={{
        animation: 'spin 2s linear infinite',
        '@keyframes spin': {
          '0%': { 
            transform: 'rotate(0deg)',
          },
          '100%': { 
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      <BonkLogo size={size} variant={variant} {...props} />
    </Box>
  );
};

export default BonkLogo;
