import React, { createContext, useContext, useState, useEffect } from 'react';
import { designTokens } from './designTokens';
import { getTheme, generateCSSCustomProperties } from './businessTheme';
import { businessConfig } from '../config/businessConfig';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light for TD Learning Academy
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('tdla-theme');
    return saved ? JSON.parse(saved) : false; // Default to light mode for business
  });

  // Get current TDLA theme
  const currentTheme = getTheme(isDarkMode);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('tdla-theme', JSON.stringify(isDarkMode));

    // Update CSS custom properties for TDLA styling
    const root = document.documentElement;
    const cssProperties = generateCSSCustomProperties(currentTheme);

    // Apply all CSS custom properties
    Object.entries(cssProperties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Legacy properties for backward compatibility
    root.style.setProperty('--bg-primary', currentTheme.colors.background.primary);
    root.style.setProperty('--bg-secondary', currentTheme.colors.background.secondary);
    root.style.setProperty('--bg-tertiary', currentTheme.colors.background.tertiary);
    root.style.setProperty('--text-primary', currentTheme.colors.text.primary);
    root.style.setProperty('--text-secondary', currentTheme.colors.text.secondary);
    root.style.setProperty('--brand-primary', currentTheme.colors.brand.primary);
    root.style.setProperty('--brand-secondary', currentTheme.colors.brand.secondary);
    root.style.setProperty('--interactive-hover', currentTheme.colors.interactive.hover);

    // Update document title and meta tags for TD Learning Academy
    document.title = `${businessConfig.company.name} - ${businessConfig.company.tagline}`;

    // Update body class for theme-specific styling
    document.body.className = `tdla-theme ${isDarkMode ? 'dark' : 'light'}`;
  }, [isDarkMode, currentTheme]);

  const getThemeColor = (path, theme = isDarkMode ? 'dark' : 'light') => {
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

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    // Theme state
    isDarkMode,
    toggleTheme,

    // TDLA Theme colors and properties
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    shadows: currentTheme.shadows,
    borderRadius: currentTheme.borderRadius,
    spacing: currentTheme.spacing,
    animation: currentTheme.animation,

    // Business configuration access
    businessConfig,
    companyName: businessConfig.company.name,
    companyShortName: businessConfig.company.shortName,

    // Legacy compatibility (keep for existing components)
    breakpoints: designTokens.breakpoints,
    zIndex: designTokens.zIndex,
    getColor: getThemeColor,
    animations: designTokens.animations, // Keep for backward compatibility

    // TDLA specific utilities
    getBrandColor: (colorName) => currentTheme.colors.brand[colorName] || currentTheme.colors.brand.primary,
    getStatusColor: (status) => currentTheme.colors.status[status] || currentTheme.colors.status.info,
    getChartColor: (index) => currentTheme.colors.chart.gradient[index % currentTheme.colors.chart.gradient.length],
  };

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

// Styled component helper for theme-aware styling
export const styled = component => styles => {
  return React.forwardRef((props, ref) => {
    const theme = useTheme();
    const computedStyles = typeof styles === 'function' ? styles(theme) : styles;

    return React.createElement(component, {
      ...props,
      ref,
      style: { ...computedStyles, ...props.style },
    });
  });
};

// CSS-in-JS helper for inline styles
export const css = styles => theme => {
  return typeof styles === 'function' ? styles(theme) : styles;
};
