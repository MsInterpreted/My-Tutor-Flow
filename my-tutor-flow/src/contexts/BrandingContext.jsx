import React, { createContext, useContext, useState, useEffect } from 'react';
import { businessConfig } from '../config/businessConfig';

/**
 * Branding Context for TD Learning Academy
 * Provides centralized access to branding configuration and utilities
 */
const BrandingContext = createContext();

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider = ({ children }) => {
  const [brandingConfig, setBrandingConfig] = useState(businessConfig.branding);
  const [companyInfo, setCompanyInfo] = useState(businessConfig.company);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize branding configuration
    initializeBranding();
  }, []);

  const initializeBranding = async () => {
    try {
      // Set document title
      document.title = `${companyInfo.name} - ${companyInfo.tagline}`;
      
      // Set favicon
      const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = brandingConfig.logo.favicon;
      document.head.appendChild(favicon);

      // Set theme color for mobile browsers
      const themeColor = document.querySelector('meta[name="theme-color"]') || document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = brandingConfig.colors.primary;
      document.head.appendChild(themeColor);

      // Set CSS custom properties for brand colors
      const root = document.documentElement;
      root.style.setProperty('--brand-primary', brandingConfig.colors.primary);
      root.style.setProperty('--brand-secondary', brandingConfig.colors.secondary);
      root.style.setProperty('--brand-tertiary', brandingConfig.colors.tertiary);
      root.style.setProperty('--brand-accent', brandingConfig.colors.accent);
      root.style.setProperty('--brand-success', brandingConfig.colors.success);
      root.style.setProperty('--brand-warning', brandingConfig.colors.warning);
      root.style.setProperty('--brand-error', brandingConfig.colors.error);
      root.style.setProperty('--brand-info', brandingConfig.colors.info);

      setIsLoaded(true);
    } catch (error) {
      console.error('Error initializing branding:', error);
      setIsLoaded(true); // Still set to loaded to prevent infinite loading
    }
  };

  // Utility functions
  const getLogoPath = (variant = 'main', theme = 'light') => {
    const logos = brandingConfig.logo;
    
    switch (variant) {
      case 'icon':
        return logos.icon;
      case 'login':
        return logos.loginLogo;
      case 'dark':
        return logos.darkMode;
      case 'light':
        return logos.lightMode;
      case 'favicon':
        return logos.favicon;
      default:
        return theme === 'dark' ? logos.darkMode : logos.lightMode;
    }
  };

  const getBrandColor = (colorName) => {
    return brandingConfig.colors[colorName] || brandingConfig.colors.primary;
  };

  const getCompanyName = (short = false) => {
    return short ? companyInfo.shortName : companyInfo.name;
  };

  const formatCompanyInfo = () => {
    return {
      name: companyInfo.name,
      shortName: companyInfo.shortName,
      tagline: companyInfo.tagline,
      website: companyInfo.website,
      domain: companyInfo.domain
    };
  };

  const getBrandingCSS = () => {
    return {
      primaryColor: brandingConfig.colors.primary,
      secondaryColor: brandingConfig.colors.secondary,
      tertiaryColor: brandingConfig.colors.tertiary,
      accentColor: brandingConfig.colors.accent,
      primaryFont: brandingConfig.fonts.primary,
      headingFont: brandingConfig.fonts.heading,
      secondaryFont: brandingConfig.fonts.secondary
    };
  };

  // Generate CSS variables for dynamic styling
  const generateCSSVariables = () => {
    const colors = brandingConfig.colors;
    const fonts = brandingConfig.fonts;
    
    return {
      '--tdla-primary': colors.primary,
      '--tdla-secondary': colors.secondary,
      '--tdla-tertiary': colors.tertiary,
      '--tdla-accent': colors.accent,
      '--tdla-success': colors.success,
      '--tdla-warning': colors.warning,
      '--tdla-error': colors.error,
      '--tdla-info': colors.info,
      '--tdla-font-primary': fonts.primary,
      '--tdla-font-heading': fonts.heading,
      '--tdla-font-secondary': fonts.secondary
    };
  };

  // Update branding configuration (for future admin panel)
  const updateBrandingConfig = (newConfig) => {
    setBrandingConfig(prev => ({ ...prev, ...newConfig }));
    initializeBranding(); // Re-initialize with new config
  };

  // Check if logo exists
  const checkLogoExists = async (logoPath) => {
    try {
      const response = await fetch(logoPath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Get appropriate logo based on context
  const getContextualLogo = (context, theme = 'light') => {
    const contextMap = {
      navigation: 'main',
      login: 'login',
      document: 'main',
      icon: 'icon',
      favicon: 'favicon'
    };
    
    const variant = contextMap[context] || 'main';
    return getLogoPath(variant, theme);
  };

  const value = {
    // Configuration
    brandingConfig,
    companyInfo,
    isLoaded,
    
    // Utility functions
    getLogoPath,
    getBrandColor,
    getCompanyName,
    formatCompanyInfo,
    getBrandingCSS,
    generateCSSVariables,
    getContextualLogo,
    checkLogoExists,
    
    // Update functions
    updateBrandingConfig,
    
    // Business configuration access
    businessConfig: businessConfig,
    isPrivateBusiness: businessConfig.businessType.mode === 'private',
    
    // Quick access to common values
    primaryColor: brandingConfig.colors.primary,
    secondaryColor: brandingConfig.colors.secondary,
    companyName: companyInfo.name,
    companyShortName: companyInfo.shortName,
    companyTagline: companyInfo.tagline,
    
    // Logo shortcuts
    mainLogo: brandingConfig.logo.main,
    iconLogo: brandingConfig.logo.icon,
    loginLogo: brandingConfig.logo.loginLogo
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export default BrandingContext;
