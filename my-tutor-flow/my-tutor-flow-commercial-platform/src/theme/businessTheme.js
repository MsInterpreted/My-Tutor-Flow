// TD Learning Academy Custom Theme
// Business-specific theme configuration with TDLA branding

import { businessConfig } from '../config/businessConfig';

/**
 * TD Learning Academy Theme Configuration
 * Emerald Green (#00D4AA) & Gold (#FFD93D) Color Scheme
 */

// Base color palette for TD Learning Academy
const tdlaColors = {
  // Primary Brand Colors
  emeraldGreen: '#00D4AA',
  gold: '#FFD93D',
  darkCharcoal: '#1a1a1a',
  
  // Extended Palette
  emeraldLight: '#33E0BB',
  emeraldDark: '#00B899',
  goldLight: '#FFE066',
  goldDark: '#E6C300',
  
  // Neutral Colors
  white: '#FFFFFF',
  lightGray: '#F8F9FA',
  mediumGray: '#6C757D',
  darkGray: '#343A40',
  
  // Semantic Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // South African Inspired Accents
  springbok: '#4A90E2', // Blue accent
  protea: '#E91E63', // Pink accent
  jacaranda: '#9C27B0', // Purple accent
};

// Light theme configuration
export const tdlaLightTheme = {
  name: 'TD Learning Academy Light',
  isDarkMode: false,
  
  colors: {
    // Brand Colors
    brand: {
      primary: tdlaColors.emeraldGreen,
      secondary: tdlaColors.gold,
      tertiary: tdlaColors.darkCharcoal,
      accent: tdlaColors.springbok,
    },
    
    // Background Colors
    background: {
      primary: tdlaColors.white,
      secondary: tdlaColors.lightGray,
      tertiary: '#F1F3F4',
      paper: tdlaColors.white,
      elevated: '#FAFBFC',
    },
    
    // Text Colors
    text: {
      primary: tdlaColors.darkCharcoal,
      secondary: tdlaColors.mediumGray,
      tertiary: '#8E9297',
      inverse: tdlaColors.white,
      brand: tdlaColors.emeraldGreen,
    },
    
    // Interactive Elements
    interactive: {
      hover: 'rgba(0, 212, 170, 0.08)',
      pressed: 'rgba(0, 212, 170, 0.12)',
      focus: 'rgba(0, 212, 170, 0.16)',
      disabled: '#E9ECEF',
    },
    
    // Status Colors
    status: {
      success: tdlaColors.success,
      warning: tdlaColors.warning,
      error: tdlaColors.error,
      info: tdlaColors.info,
    },
    
    // Border Colors
    border: {
      light: '#E9ECEF',
      medium: '#DEE2E6',
      dark: '#CED4DA',
      brand: tdlaColors.emeraldGreen,
    },
    
    // Chart Colors (for analytics)
    chart: {
      primary: tdlaColors.emeraldGreen,
      secondary: tdlaColors.gold,
      tertiary: tdlaColors.springbok,
      quaternary: tdlaColors.protea,
      gradient: [
        tdlaColors.emeraldGreen,
        tdlaColors.emeraldLight,
        tdlaColors.gold,
        tdlaColors.springbok,
        tdlaColors.protea
      ]
    }
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: businessConfig.branding.fonts.primary,
      heading: businessConfig.branding.fonts.heading,
      secondary: businessConfig.branding.fonts.secondary,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 2px 8px rgba(0, 212, 170, 0.1)',
    brand: '0 4px 12px rgba(0, 212, 170, 0.15)',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    base: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
};

// Dark theme configuration
export const tdlaDarkTheme = {
  ...tdlaLightTheme,
  name: 'TD Learning Academy Dark',
  isDarkMode: true,
  
  colors: {
    ...tdlaLightTheme.colors,
    
    // Background Colors (Dark)
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D',
      paper: '#1E1E1E',
      elevated: '#242424',
    },
    
    // Text Colors (Dark)
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
      tertiary: '#8C8C8C',
      inverse: tdlaColors.darkCharcoal,
      brand: tdlaColors.emeraldLight,
    },
    
    // Interactive Elements (Dark)
    interactive: {
      hover: 'rgba(0, 212, 170, 0.12)',
      pressed: 'rgba(0, 212, 170, 0.16)',
      focus: 'rgba(0, 212, 170, 0.20)',
      disabled: '#3C3C3C',
    },
    
    // Border Colors (Dark)
    border: {
      light: '#3C3C3C',
      medium: '#4A4A4A',
      dark: '#5A5A5A',
      brand: tdlaColors.emeraldLight,
    },
  },
  
  // Dark theme shadows
  shadows: {
    ...tdlaLightTheme.shadows,
    card: '0 2px 8px rgba(0, 0, 0, 0.3)',
    brand: '0 4px 12px rgba(0, 212, 170, 0.2)',
  }
};

// Theme utilities
export const getTheme = (isDarkMode = false) => {
  return isDarkMode ? tdlaDarkTheme : tdlaLightTheme;
};

// CSS custom properties generator
export const generateCSSCustomProperties = (theme) => {
  const properties = {};
  
  // Brand colors
  properties['--tdla-primary'] = theme.colors.brand.primary;
  properties['--tdla-secondary'] = theme.colors.brand.secondary;
  properties['--tdla-tertiary'] = theme.colors.brand.tertiary;
  properties['--tdla-accent'] = theme.colors.brand.accent;
  
  // Background colors
  properties['--tdla-bg-primary'] = theme.colors.background.primary;
  properties['--tdla-bg-secondary'] = theme.colors.background.secondary;
  properties['--tdla-bg-tertiary'] = theme.colors.background.tertiary;
  
  // Text colors
  properties['--tdla-text-primary'] = theme.colors.text.primary;
  properties['--tdla-text-secondary'] = theme.colors.text.secondary;
  properties['--tdla-text-brand'] = theme.colors.text.brand;
  
  // Fonts
  properties['--tdla-font-primary'] = theme.typography.fontFamily.primary;
  properties['--tdla-font-heading'] = theme.typography.fontFamily.heading;
  
  return properties;
};

// Material-UI theme integration
export const createMuiTheme = (tdlaTheme) => {
  return {
    palette: {
      mode: tdlaTheme.isDarkMode ? 'dark' : 'light',
      primary: {
        main: tdlaTheme.colors.brand.primary,
        light: tdlaColors.emeraldLight,
        dark: tdlaColors.emeraldDark,
      },
      secondary: {
        main: tdlaTheme.colors.brand.secondary,
        light: tdlaColors.goldLight,
        dark: tdlaColors.goldDark,
      },
      background: {
        default: tdlaTheme.colors.background.primary,
        paper: tdlaTheme.colors.background.paper,
      },
      text: {
        primary: tdlaTheme.colors.text.primary,
        secondary: tdlaTheme.colors.text.secondary,
      },
    },
    typography: {
      fontFamily: tdlaTheme.typography.fontFamily.primary,
      h1: { fontFamily: tdlaTheme.typography.fontFamily.heading },
      h2: { fontFamily: tdlaTheme.typography.fontFamily.heading },
      h3: { fontFamily: tdlaTheme.typography.fontFamily.heading },
      h4: { fontFamily: tdlaTheme.typography.fontFamily.heading },
      h5: { fontFamily: tdlaTheme.typography.fontFamily.heading },
      h6: { fontFamily: tdlaTheme.typography.fontFamily.heading },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: tdlaTheme.borderRadius.lg,
            fontWeight: tdlaTheme.typography.fontWeight.medium,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: tdlaTheme.borderRadius.xl,
            boxShadow: tdlaTheme.shadows.card,
          },
        },
      },
    },
  };
};

export default {
  light: tdlaLightTheme,
  dark: tdlaDarkTheme,
  getTheme,
  generateCSSCustomProperties,
  createMuiTheme,
};
