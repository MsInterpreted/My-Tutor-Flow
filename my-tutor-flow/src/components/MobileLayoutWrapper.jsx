import React from 'react';
import { Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

// Mobile-first layout wrapper that ensures no horizontal scrolling
export default function MobileLayoutWrapper({ children, ...props }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        backgroundColor: theme.colors.background.primary,
        minHeight: '100vh',
        // Mobile-specific optimizations
        ...(isMobile && {
          '& *': {
            maxWidth: '100% !important',
          },
          '& .MuiContainer-root': {
            paddingLeft: '8px !important',
            paddingRight: '8px !important',
            maxWidth: '100% !important',
            width: '100% !important',
          },
          '& .MuiPaper-root': {
            backgroundColor: theme.colors.background.secondary,
            margin: '8px 0',
            borderRadius: '12px',
          },
          '& .MuiCard-root': {
            backgroundColor: theme.colors.background.secondary,
            margin: '8px 0',
            borderRadius: '12px',
          },
          '& .MuiTableContainer-root': {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%',
          },
          '& .MuiTable-root': {
            minWidth: 'auto',
          },
          '& .recharts-wrapper': {
            maxWidth: '100% !important',
            overflow: 'hidden',
          },
          '& .recharts-responsive-container': {
            maxWidth: '100% !important',
            overflow: 'hidden',
          },
          // Ensure forms are mobile-friendly
          '& .MuiTextField-root': {
            width: '100%',
            marginBottom: '16px',
          },
          '& .MuiFormControl-root': {
            width: '100%',
            marginBottom: '16px',
          },
          // Mobile button improvements
          '& .MuiButton-root': {
            minHeight: '44px',
            fontSize: '16px', // Prevent zoom on iOS
          },
          '& .MuiInputBase-input': {
            fontSize: '16px', // Prevent zoom on iOS
          },
          // Mobile dialog improvements
          '& .MuiDialog-paper': {
            margin: '16px',
            maxHeight: 'calc(100vh - 32px)',
            width: 'calc(100vw - 32px)',
            maxWidth: 'calc(100vw - 32px)',
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// Mobile-optimized page wrapper
export function MobilePageWrapper({ children, title, ...props }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
    <MobileLayoutWrapper>
      <Box
        sx={{
          padding: {
            xs: '8px',
            sm: '16px',
            md: '24px',
          },
          maxWidth: '100%',
          width: '100%',
          overflowX: 'hidden',
          // Mobile-specific page styling
          ...(isMobile && {
            padding: '8px',
            '& > *': {
              marginBottom: '16px',
              '&:last-child': {
                marginBottom: 0,
              },
            },
          }),
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </MobileLayoutWrapper>
  );
}

// Mobile-optimized section wrapper
export function MobileSectionWrapper({ children, spacing = true, ...props }) {
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
          md: '16px',
        },
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        padding: spacing
          ? {
              xs: '12px',
              sm: '16px',
              md: '24px',
            }
          : 0,
        margin: {
          xs: '8px 0',
          md: '16px 0',
        },
        // Mobile-specific section styling
        ...(isMobile && {
          '& .MuiTableContainer-root': {
            margin: '0 -12px',
            borderRadius: 0,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          },
        }),
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
