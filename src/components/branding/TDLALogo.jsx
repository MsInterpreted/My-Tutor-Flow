import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';
import { businessConfig } from '../../config/businessConfig';
import { TDLALogo as MainTDLALogo } from '../TDLALogo';

/**
 * TD Learning Academy Logo Component
 * Displays the TDLA logo with proper sizing and theme support
 */
const TDLALogo = ({ 
  size = 'medium', 
  variant = 'main', 
  showText = true, 
  clickable = false,
  onClick,
  sx = {} 
}) => {
  const theme = useTheme();
  
  // Size configurations
  const sizeConfig = {
    small: { width: 120, height: 40, iconSize: 32, fontSize: '1rem' },
    medium: { width: 200, height: 67, iconSize: 48, fontSize: '1.5rem' },
    large: { width: 300, height: 100, iconSize: 64, fontSize: '2rem' },
    icon: { width: 40, height: 40, iconSize: 40, fontSize: '0.8rem' }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Logo path selection based on variant and theme
  const getLogoPath = () => {
    const logos = businessConfig.branding.logo;
    
    switch (variant) {
      case 'icon':
        return logos.icon;
      case 'login':
        return logos.loginLogo;
      case 'dark':
        return logos.darkMode;
      case 'light':
        return logos.lightMode;
      default:
        return theme.isDarkMode ? logos.darkMode : logos.lightMode;
    }
  };

  // Fallback logo component if image fails to load
  const FallbackLogo = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ...sx
      }}
    >
      {/* Graduation Cap Icon */}
      <Box
        sx={{
          width: config.iconSize,
          height: config.iconSize,
          background: `linear-gradient(135deg, ${businessConfig.branding.colors.primary}, ${businessConfig.branding.colors.secondary})`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '20%',
            right: '20%',
            bottom: '20%',
            background: 'white',
            borderRadius: '4px',
            opacity: 0.9
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '10%',
            right: '10%',
            width: '8px',
            height: '8px',
            background: businessConfig.branding.colors.secondary,
            borderRadius: '50%'
          }
        }}
      />
      
      {/* Company Text */}
      {showText && size !== 'icon' && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: businessConfig.branding.fonts.heading,
              fontWeight: 700,
              fontSize: config.fontSize,
              color: theme.colors.text.primary,
              lineHeight: 1,
              letterSpacing: '0.5px'
            }}
          >
            {businessConfig.company.shortName}
          </Typography>
          {size === 'large' && (
            <Typography
              variant="caption"
              sx={{
                fontFamily: businessConfig.branding.fonts.primary,
                fontSize: '0.7rem',
                color: theme.colors.text.secondary,
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              {businessConfig.company.tagline}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );

  // Main logo component
  const LogoImage = () => {
    const logoPath = getLogoPath();
    
    return (
      <Box
        component="img"
        src={logoPath}
        alt={`${businessConfig.company.name} Logo`}
        sx={{
          width: size === 'icon' ? config.iconSize : config.width,
          height: size === 'icon' ? config.iconSize : 'auto',
          maxHeight: config.height,
          objectFit: 'contain',
          cursor: clickable ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': clickable ? {
            transform: 'scale(1.05)',
            filter: 'brightness(1.1)'
          } : {},
          ...sx
        }}
        onClick={clickable ? onClick : undefined}
        onError={(e) => {
          // Replace with fallback logo on error
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: clickable ? 'pointer' : 'default',
        ...sx
      }}
      onClick={clickable ? onClick : undefined}
    >
      <LogoImage />
      <Box sx={{ display: 'none' }}>
        <FallbackLogo />
      </Box>
    </Box>
  );
};

// Preset logo components for common use cases - Using your chosen Option 2 design
export const NavigationLogo = (props) => (
  <MainTDLALogo size={props.size === "small" ? 80 : 120} showText={props.showText !== false} {...props} />
);

export const LoginLogo = (props) => (
  <MainTDLALogo size={150} showText={true} {...props} />
);

export const IconLogo = (props) => (
  <MainTDLALogo size={40} showText={false} {...props} />
);

export const DocumentLogo = (props) => (
  <MainTDLALogo size={120} showText={true} {...props} />
);

export const MobileLogo = (props) => (
  <TDLALogo size="small" variant="main" showText={false} {...props} />
);

export default TDLALogo;
