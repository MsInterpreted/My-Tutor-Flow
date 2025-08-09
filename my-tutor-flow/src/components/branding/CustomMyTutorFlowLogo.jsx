import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Custom My Tutor Flow Logo Component
 * Uses the user's custom PNG logo file
 * Provides multiple size variants and usage options
 */
export const CustomMyTutorFlowLogo = ({ 
  size = 'medium', 
  showText = false,
  variant = 'logo-only',
  sx = {},
  onClick,
  alt = "My Tutor Flow Logo",
  ...props 
}) => {
  const theme = useTheme();
  
  // Size configurations
  const sizeConfig = {
    small: {
      width: 80,
      height: 'auto',
      fontSize: '1rem',
    },
    medium: {
      width: 120,
      height: 'auto',
      fontSize: '1.4rem',
    },
    large: {
      width: 160,
      height: 'auto',
      fontSize: '1.8rem',
    },
    xlarge: {
      width: 200,
      height: 'auto',
      fontSize: '2.2rem',
    },
    hero: {
      width: 300,
      height: 'auto',
      fontSize: '2.8rem',
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Logo variants
  const renderLogoOnly = () => (
    <Box
      component="img"
      src="/assets/logos/My_Tutor_Flow_Logo.png"
      alt={alt}
      sx={{
        width: config.width,
        height: config.height,
        objectFit: 'contain',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    />
  );

  const renderLogoWithText = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.02)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      <Box
        component="img"
        src="/assets/logos/My_Tutor_Flow_Logo.png"
        alt={alt}
        sx={{
          width: config.width * 0.8, // Slightly smaller when with text
          height: 'auto',
          objectFit: 'contain',
          mr: 2,
        }}
      />
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: config.fontSize,
            fontWeight: 700,
            color: theme.colors.text.primary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            lineHeight: 1.2,
          }}
        >
          My Tutor Flow
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: config.fontSize * 0.6,
            fontWeight: 500,
            color: theme.colors.text.secondary,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          Education Platform
        </Typography>
      </Box>
    </Box>
  );

  const renderLogoAboveText = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.02)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      <Box
        component="img"
        src="/assets/logos/My_Tutor_Flow_Logo.png"
        alt={alt}
        sx={{
          width: config.width,
          height: 'auto',
          objectFit: 'contain',
          mb: 1,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontSize: config.fontSize,
          fontWeight: 700,
          color: theme.colors.text.primary,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        My Tutor Flow
      </Typography>
      <Typography
        variant="caption"
        sx={{
          fontSize: config.fontSize * 0.6,
          fontWeight: 500,
          color: theme.colors.text.secondary,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        Education Platform
      </Typography>
    </Box>
  );

  // Render based on variant
  switch (variant) {
    case 'logo-only':
      return renderLogoOnly();
    case 'logo-with-text':
      return renderLogoWithText();
    case 'logo-above-text':
      return renderLogoAboveText();
    default:
      return showText ? renderLogoWithText() : renderLogoOnly();
  }
};

// Preset components for different use cases
export const NavigationLogo = (props) => (
  <CustomMyTutorFlowLogo size="small" variant="logo-only" {...props} />
);

export const HeaderLogo = (props) => (
  <CustomMyTutorFlowLogo size="medium" variant="logo-with-text" {...props} />
);

export const HeroLogo = (props) => (
  <CustomMyTutorFlowLogo size="large" variant="logo-above-text" {...props} />
);

export const HackathonLogo = (props) => (
  <CustomMyTutorFlowLogo size="xlarge" variant="logo-above-text" {...props} />
);

export const PresentationLogo = (props) => (
  <CustomMyTutorFlowLogo size="hero" variant="logo-above-text" {...props} />
);

// Responsive logo that adapts to screen size
export const ResponsiveLogo = ({ showText = true, ...props }) => {
  return (
    <Box
      sx={{
        '& .logo-small': {
          display: { xs: 'block', sm: 'none' },
        },
        '& .logo-medium': {
          display: { xs: 'none', sm: 'block', md: 'none' },
        },
        '& .logo-large': {
          display: { xs: 'none', md: 'block' },
        },
      }}
    >
      <Box className="logo-small">
        <CustomMyTutorFlowLogo 
          size="small" 
          variant={showText ? "logo-with-text" : "logo-only"} 
          {...props} 
        />
      </Box>
      <Box className="logo-medium">
        <CustomMyTutorFlowLogo 
          size="medium" 
          variant={showText ? "logo-with-text" : "logo-only"} 
          {...props} 
        />
      </Box>
      <Box className="logo-large">
        <CustomMyTutorFlowLogo 
          size="large" 
          variant={showText ? "logo-above-text" : "logo-only"} 
          {...props} 
        />
      </Box>
    </Box>
  );
};

// Animated version with hover effects
export const AnimatedLogo = ({ size = 'medium', variant = 'logo-only', ...props }) => {
  return (
    <Box
      sx={{
        '& img': {
          transition: 'all 0.3s ease-in-out',
        },
        '&:hover img': {
          filter: 'brightness(1.1) saturate(1.1)',
          transform: 'scale(1.05)',
        },
        '&:active img': {
          transform: 'scale(0.98)',
        },
      }}
    >
      <CustomMyTutorFlowLogo size={size} variant={variant} {...props} />
    </Box>
  );
};

export default CustomMyTutorFlowLogo;
