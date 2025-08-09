import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';

/**
 * My Tutor Flow Logo Component
 * Eye-catching logo designed for Solana Mobile Hackathon judges
 * Features: Modern gradient design, mobile-first iconography, tech-forward aesthetics
 */
export const MyTutorFlowLogo = ({ 
  size = 120, 
  showText = true, 
  variant = 'full',
  sx = {},
  onClick,
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      <ModernTutorFlowIcon size={size} />
      {showText && (
        <Box sx={{ ml: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: size > 80 ? '1.8rem' : '1.4rem',
              fontWeight: 800,
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            My Tutor Flow
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontSize: size > 80 ? '0.9rem' : '0.7rem',
              fontWeight: 600,
              color: '#8B5CF6',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Mobile Education Platform
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Modern, Tech-Forward Icon Design
export const ModernTutorFlowIcon = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        {/* Modern Gradient Definitions */}
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="50%" stopColor="#764ba2" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Modern Shadow Effects */}
        <filter id="modernShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#8B5CF6" floodOpacity="0.3" />
        </filter>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background Circle with Gradient */}
      <circle 
        cx="60" 
        cy="60" 
        r="55" 
        fill="url(#primaryGrad)" 
        filter="url(#modernShadow)"
        opacity="0.1"
      />

      {/* Main Icon Container */}
      <g transform="translate(20, 20)">
        
        {/* Mobile Device Frame */}
        <rect 
          x="25" 
          y="10" 
          width="30" 
          height="50" 
          rx="6" 
          ry="6" 
          fill="url(#primaryGrad)" 
          filter="url(#glow)"
        />
        
        {/* Mobile Screen */}
        <rect 
          x="28" 
          y="15" 
          width="24" 
          height="40" 
          rx="2" 
          ry="2" 
          fill="#ffffff"
        />
        
        {/* Screen Content - Dashboard Lines */}
        <rect x="30" y="18" width="20" height="2" rx="1" fill="url(#accentGrad)" opacity="0.8" />
        <rect x="30" y="22" width="15" height="2" rx="1" fill="url(#accentGrad)" opacity="0.6" />
        <rect x="30" y="26" width="18" height="2" rx="1" fill="url(#accentGrad)" opacity="0.7" />
        
        {/* Analytics Chart Representation */}
        <g transform="translate(30, 30)">
          <rect x="0" y="15" width="3" height="8" fill="url(#flowGrad)" rx="1" />
          <rect x="4" y="12" width="3" height="11" fill="url(#flowGrad)" rx="1" />
          <rect x="8" y="8" width="3" height="15" fill="url(#flowGrad)" rx="1" />
          <rect x="12" y="10" width="3" height="13" fill="url(#flowGrad)" rx="1" />
          <rect x="16" y="6" width="3" height="17" fill="url(#flowGrad)" rx="1" />
        </g>
        
        {/* Education/Graduation Cap Icon */}
        <g transform="translate(5, 35)">
          {/* Cap Base */}
          <path 
            d="M5 15 L25 10 L45 15 L25 20 Z" 
            fill="url(#accentGrad)" 
            filter="url(#glow)"
          />
          {/* Cap Top */}
          <ellipse cx="25" cy="15" rx="20" ry="5" fill="url(#primaryGrad)" opacity="0.8" />
          {/* Tassel */}
          <circle cx="40" cy="15" r="2" fill="url(#flowGrad)" />
          <rect x="39" y="17" width="2" height="8" fill="url(#flowGrad)" opacity="0.8" />
        </g>
        
        {/* Flow/Connection Lines */}
        <g stroke="url(#flowGrad)" strokeWidth="2" fill="none" opacity="0.6">
          <path d="M15 25 Q20 20 25 25" strokeLinecap="round" />
          <path d="M55 25 Q60 20 65 25" strokeLinecap="round" />
          <path d="M15 35 Q20 30 25 35" strokeLinecap="round" />
          <path d="M55 35 Q60 30 65 35" strokeLinecap="round" />
        </g>
        
        {/* Tech Accent Dots */}
        <circle cx="10" cy="15" r="2" fill="url(#accentGrad)" opacity="0.7" />
        <circle cx="70" cy="15" r="2" fill="url(#accentGrad)" opacity="0.7" />
        <circle cx="10" cy="45" r="2" fill="url(#flowGrad)" opacity="0.7" />
        <circle cx="70" cy="45" r="2" fill="url(#flowGrad)" opacity="0.7" />
        
        {/* Modern Geometric Accents */}
        <polygon 
          points="5,5 15,5 10,15" 
          fill="url(#primaryGrad)" 
          opacity="0.3"
        />
        <polygon 
          points="65,5 75,5 70,15" 
          fill="url(#accentGrad)" 
          opacity="0.3"
        />
        
      </g>
    </svg>
  </Box>
);

// Preset logo components for different use cases
export const NavigationLogo = (props) => (
  <MyTutorFlowLogo size={props.size === "small" ? 80 : 120} showText={props.showText !== false} {...props} />
);

export const LoginLogo = (props) => (
  <MyTutorFlowLogo size={150} showText={true} {...props} />
);

export const IconLogo = (props) => (
  <MyTutorFlowLogo size={40} showText={false} {...props} />
);

export const HackathonLogo = (props) => (
  <MyTutorFlowLogo size={200} showText={true} variant="full" {...props} />
);

export default MyTutorFlowLogo;
