// Modern Design System - Based on the template design
export const designTokens = {
  // Color Palette - Dark Theme Primary
  colors: {
    // Background colors
    background: {
      primary: '#0A0A0A', // Main dark background
      secondary: '#1A1A1A', // Card backgrounds
      tertiary: '#2A2A2A', // Elevated surfaces
      modal: 'rgba(0, 0, 0, 0.8)',
    },

    // Text colors
    text: {
      primary: '#FFFFFF', // Main text
      secondary: '#B0B0B0', // Secondary text
      tertiary: '#808080', // Muted text
      inverse: '#000000', // Text on light backgrounds
    },

    // Brand colors from template
    brand: {
      primary: '#00D4AA', // Teal/cyan from template
      secondary: '#4A90E2', // Blue accent
      tertiary: '#7B68EE', // Purple accent
    },

    // Activity card colors (from template)
    cards: {
      pink: '#FF6B9D', // Pink card
      cyan: '#00D4AA', // Cyan card
      blue: '#4A90E2', // Blue card
      yellow: '#FFD93D', // Yellow card
      purple: '#7B68EE', // Purple card
      green: '#00C896', // Green accent
    },

    // Status colors
    status: {
      success: '#00C896',
      warning: '#FFD93D',
      error: '#FF6B6B',
      info: '#4A90E2',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(255, 255, 255, 0.1)',
      active: 'rgba(255, 255, 255, 0.2)',
      focus: '#00D4AA',
      disabled: '#404040',
    },

    // Light theme colors
    light: {
      background: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        tertiary: '#E9ECEF',
        modal: 'rgba(255, 255, 255, 0.95)',
      },
      text: {
        primary: '#212529',
        secondary: '#6C757D',
        tertiary: '#ADB5BD',
        inverse: '#FFFFFF',
      },
      interactive: {
        hover: 'rgba(0, 0, 0, 0.05)',
        active: 'rgba(0, 0, 0, 0.1)',
        focus: '#00D4AA',
        disabled: '#E9ECEF',
      },
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary:
        '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      secondary: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
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
    },
  },

  // Spacing
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
    '4xl': '6rem', // 96px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.375rem', // 6px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    glow: '0 0 20px rgba(0, 212, 170, 0.3)',
    card: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },

  // Animations
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

// Helper functions for theme
export const getColor = (path, theme = 'dark') => {
  const keys = path.split('.');
  let value =
    theme === 'light' && keys[0] !== 'cards' && keys[0] !== 'brand' && keys[0] !== 'status'
      ? designTokens.colors.light
      : designTokens.colors;

  for (const key of keys) {
    value = value?.[key];
  }
  return value || path;
};

export const getSpacing = size => designTokens.spacing[size] || size;
export const getBorderRadius = size => designTokens.borderRadius[size] || size;
export const getShadow = size => designTokens.shadows[size] || size;
