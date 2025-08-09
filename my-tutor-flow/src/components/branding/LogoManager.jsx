import React from 'react';
import { 
  CustomMyTutorFlowLogo,
  NavigationLogo,
  HeaderLogo,
  HeroLogo,
  HackathonLogo,
  PresentationLogo,
  ResponsiveLogo,
  AnimatedLogo,
} from './CustomMyTutorFlowLogo';

/**
 * Logo Manager Component
 * Central management for all My Tutor Flow logo implementations
 * Ensures consistent branding across the entire application
 */

// Main logo exports for easy replacement throughout the app
export const MyTutorFlowLogo = CustomMyTutorFlowLogo;

// Context-specific logo components
export const AppLogo = {
  // Navigation and header usage
  Navigation: NavigationLogo,
  Header: HeaderLogo,
  
  // Page and section usage
  Hero: HeroLogo,
  Presentation: PresentationLogo,
  Hackathon: HackathonLogo,
  
  // Responsive and interactive
  Responsive: ResponsiveLogo,
  Animated: AnimatedLogo,
  
  // Size variants
  Small: (props) => <CustomMyTutorFlowLogo size="small" {...props} />,
  Medium: (props) => <CustomMyTutorFlowLogo size="medium" {...props} />,
  Large: (props) => <CustomMyTutorFlowLogo size="large" {...props} />,
  XLarge: (props) => <CustomMyTutorFlowLogo size="xlarge" {...props} />,
  Hero: (props) => <CustomMyTutorFlowLogo size="hero" {...props} />,
  
  // Variant styles
  LogoOnly: (props) => <CustomMyTutorFlowLogo variant="logo-only" {...props} />,
  WithText: (props) => <CustomMyTutorFlowLogo variant="logo-with-text" {...props} />,
  AboveText: (props) => <CustomMyTutorFlowLogo variant="logo-above-text" {...props} />,
};

// Logo configuration for different app sections
export const LogoConfig = {
  // Main navigation
  mainNav: {
    component: NavigationLogo,
    props: { size: 'small' }
  },
  
  // Page headers
  pageHeader: {
    component: HeaderLogo,
    props: { size: 'medium' }
  },
  
  // Landing/hero sections
  heroSection: {
    component: HeroLogo,
    props: { size: 'large' }
  },
  
  // Hackathon presentations
  hackathonPitch: {
    component: HackathonLogo,
    props: { size: 'xlarge' }
  },
  
  // Login/auth pages
  authPages: {
    component: HeroLogo,
    props: { size: 'large', variant: 'logo-above-text' }
  },
  
  // Mobile responsive
  responsive: {
    component: ResponsiveLogo,
    props: { showText: true }
  },
  
  // Footer
  footer: {
    component: CustomMyTutorFlowLogo,
    props: { size: 'small', variant: 'logo-with-text' }
  },
  
  // Email signatures
  emailSignature: {
    component: CustomMyTutorFlowLogo,
    props: { size: 'small', variant: 'logo-only' }
  },
  
  // Business cards
  businessCard: {
    component: CustomMyTutorFlowLogo,
    props: { size: 'medium', variant: 'logo-above-text' }
  },
  
  // Social media
  socialMedia: {
    component: CustomMyTutorFlowLogo,
    props: { size: 'large', variant: 'logo-only' }
  }
};

// Usage guidelines and best practices
export const LogoGuidelines = {
  sizing: {
    minimum: '40px width',
    maximum: '400px width',
    recommended: {
      mobile: '80px',
      tablet: '120px',
      desktop: '160px',
      presentation: '200px+'
    }
  },
  
  spacing: {
    clearSpace: 'Minimum 20px on all sides',
    textDistance: '10px between logo and text',
    elementSpacing: '15px from other UI elements'
  },
  
  backgrounds: {
    preferred: ['White', 'Light gray', 'Light backgrounds'],
    acceptable: ['Medium gray with sufficient contrast'],
    avoid: ['Dark backgrounds', 'Busy patterns', 'Low contrast']
  },
  
  formats: {
    web: 'PNG with transparent background',
    print: 'High-resolution PNG or SVG',
    social: 'Square crop of logo only',
    favicon: '32x32px PNG'
  },
  
  doNots: [
    'Do not stretch or distort proportions',
    'Do not change colors or apply filters',
    'Do not add drop shadows or effects',
    'Do not use on insufficient contrast backgrounds',
    'Do not place too close to other elements',
    'Do not use below minimum size requirements'
  ]
};

// Helper function to get the right logo for a context
export const getLogoForContext = (context, customProps = {}) => {
  const config = LogoConfig[context];
  if (!config) {
    console.warn(`Logo context "${context}" not found. Using default.`);
    return <CustomMyTutorFlowLogo {...customProps} />;
  }
  
  const LogoComponent = config.component;
  const props = { ...config.props, ...customProps };
  
  return <LogoComponent {...props} />;
};

// Bulk logo replacement utility
export const replaceLegacyLogos = () => {
  // This function can be used to systematically replace old logos
  // throughout the application during migration
  console.log('🔄 Logo replacement utility ready');
  console.log('📁 Place your logo file at: /public/assets/logos/My_Tutor_Flow_Logo.png');
  console.log('🎯 All logo instances will automatically use the new file');
};

export default {
  MyTutorFlowLogo,
  AppLogo,
  LogoConfig,
  LogoGuidelines,
  getLogoForContext,
  replaceLegacyLogos,
};
