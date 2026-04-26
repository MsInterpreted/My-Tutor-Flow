import React from 'react';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const ResponsiveContainer = ({
  children,
  maxWidth = 'lg',
  padding = true,
  mobileFullWidth = true, // Default to full width on mobile
  ...props
}) => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('md', 'lg'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isMobile && mobileFullWidth ? '100vw' : maxWidth,
        mx: 'auto',
        overflowX: 'hidden', // Prevent horizontal scroll
        px: padding
          ? {
              xs: 1, // Reduced mobile padding
              sm: 2,
              md: 4,
              lg: 6,
            }
          : 0,
        py: padding
          ? {
              xs: 1, // Reduced mobile padding
              sm: 2,
              md: 4,
            }
          : 0,
        backgroundColor: theme.colors.background.primary, // Ensure consistent background
        transition: 'all 0.3s ease',
        // Mobile-specific optimizations
        ...(isMobile && {
          '& > *': {
            maxWidth: '100%',
            overflowX: 'hidden',
          },
          '& .MuiPaper-root': {
            backgroundColor: theme.colors.background.secondary,
            borderRadius: '12px',
            margin: '8px 0',
          },
          '& .MuiCard-root': {
            backgroundColor: theme.colors.background.secondary,
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Mobile-first responsive grid
export const ResponsiveGrid = ({
  children,
  spacing = { xs: 2, sm: 3, md: 4 },
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  ...props
}) => {
  const muiTheme = useMuiTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: `repeat(${columns.xs}, 1fr)`,
          sm: `repeat(${columns.sm}, 1fr)`,
          md: `repeat(${columns.md}, 1fr)`,
          lg: `repeat(${columns.lg}, 1fr)`,
        },
        gap: spacing,
        width: '100%',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Responsive card component
export const ResponsiveCard = ({
  children,
  elevation = 0,
  padding = true,
  hover = true,
  ...props
}) => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: {
          xs: '12px',
          sm: '16px',
        },
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: elevation > 0 ? theme.shadows.card : 'none',
        p: padding
          ? {
              xs: 1.5, // Reduced mobile padding
              sm: 2,
              md: 3,
            }
          : 0,
        m: {
          xs: '8px 0', // Mobile margin
          sm: '12px 0',
          md: '16px 0',
        },
        transition: 'all 0.3s ease',
        ...(hover && !isMobile && {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.lg,
          },
        }),
        // Mobile-specific optimizations
        ...(isMobile && {
          '& > *': {
            maxWidth: '100%',
          },
          '& .MuiTableContainer-root': {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            margin: '0 -12px', // Extend table to card edges
            borderRadius: 0,
          },
          '& .MuiTable-root': {
            minWidth: 'auto',
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Mobile navigation drawer
export const MobileDrawer = ({ open, onClose, children, anchor = 'left', ...props }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: anchor === 'left' ? (open ? 0 : '-100%') : 'auto',
        right: anchor === 'right' ? (open ? 0 : '-100%') : 'auto',
        width: '280px',
        height: '100vh',
        backgroundColor: theme.colors.background.secondary,
        borderRight: anchor === 'left' ? `1px solid ${theme.colors.background.tertiary}` : 'none',
        borderLeft: anchor === 'right' ? `1px solid ${theme.colors.background.tertiary}` : 'none',
        zIndex: 1300,
        transition: 'all 0.3s ease',
        boxShadow: open ? theme.shadows.xl : 'none',
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Responsive text component
export const ResponsiveText = ({ variant = 'body1', children, responsive = true, ...props }) => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();

  const responsiveSizes = {
    h1: { xs: '24px', sm: '32px', md: '40px', lg: '48px' },
    h2: { xs: '20px', sm: '24px', md: '32px', lg: '40px' },
    h3: { xs: '18px', sm: '20px', md: '24px', lg: '32px' },
    h4: { xs: '16px', sm: '18px', md: '20px', lg: '24px' },
    h5: { xs: '14px', sm: '16px', md: '18px', lg: '20px' },
    h6: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
    body1: { xs: '14px', sm: '16px' },
    body2: { xs: '12px', sm: '14px' },
  };

  return (
    <Box
      component="span"
      sx={{
        fontSize: responsive ? responsiveSizes[variant] : undefined,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.primary,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Touch-friendly button for mobile
export const TouchButton = ({ children, size = 'medium', fullWidth = false, ...props }) => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const sizeMap = {
    small: { minHeight: isMobile ? 44 : 36, px: 2 },
    medium: { minHeight: isMobile ? 48 : 40, px: 3 },
    large: { minHeight: isMobile ? 52 : 44, px: 4 },
  };

  return (
    <Box
      component="button"
      sx={{
        minHeight: sizeMap[size].minHeight,
        px: sizeMap[size].px,
        py: 1,
        borderRadius: '12px',
        border: 'none',
        backgroundColor: theme.colors.brand.primary,
        color: 'white',
        fontWeight: 600,
        fontSize: isMobile ? '16px' : '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        width: fullWidth ? '100%' : 'auto',
        '&:hover': {
          backgroundColor: theme.colors.brand.secondary,
          transform: isMobile ? 'none' : 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;
