import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';

/**
 * My Tutor Flow Text Logo with Graduation Cap
 * Modern, memorable design with emerald green and gold color psychology
 * Features graduation cap positioned above the text
 */
export const MyTutorFlowTextLogo = ({ 
  size = 'large', 
  showTagline = false,
  sx = {},
  onClick,
  ...props 
}) => {
  const theme = useTheme();
  
  // Size configurations
  const sizeConfig = {
    small: {
      logoHeight: 80,
      fontSize: '1.2rem',
      capSize: 60,
      taglineSize: '0.7rem',
    },
    medium: {
      logoHeight: 120,
      fontSize: '1.8rem',
      capSize: 80,
      taglineSize: '0.9rem',
    },
    large: {
      logoHeight: 160,
      fontSize: '2.4rem',
      capSize: 100,
      taglineSize: '1.1rem',
    },
    xlarge: {
      logoHeight: 200,
      fontSize: '3rem',
      capSize: 120,
      taglineSize: '1.3rem',
    }
  };

  const config = sizeConfig[size] || sizeConfig.large;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
      {/* Graduation Cap SVG */}
      <Box sx={{ mb: 1 }}>
        <svg 
          width={config.capSize} 
          height={config.capSize * 0.6} 
          viewBox="0 0 120 72" 
          fill="none"
        >
          <defs>
            {/* Emerald Green Gradients */}
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            
            <linearGradient id="emeraldDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
            
            {/* Gold Gradients */}
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFF99" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#DAA520" />
            </linearGradient>

            {/* Shadow and Glow Effects */}
            <filter id="capShadow">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#047857" floodOpacity="0.3" />
            </filter>
            
            <filter id="goldGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Main Graduation Cap */}
          <g transform="translate(10, 10)">
            
            {/* Cap Base (Mortarboard) */}
            <path 
              d="M10 25 L50 15 L90 25 L50 35 Z" 
              fill="url(#emeraldGrad)" 
              filter="url(#capShadow)"
            />
            
            {/* Cap Top Surface */}
            <ellipse 
              cx="50" 
              cy="25" 
              rx="40" 
              ry="10" 
              fill="url(#emeraldDark)" 
              opacity="0.9"
            />
            
            {/* Cap Highlight */}
            <ellipse 
              cx="50" 
              cy="23" 
              rx="35" 
              ry="7" 
              fill="url(#emeraldGrad)" 
              opacity="0.6"
            />
            
            {/* Modern Accent Lines */}
            <path 
              d="M20 25 L80 25" 
              stroke="#10B981" 
              strokeWidth="1" 
              opacity="0.8"
            />
            <path 
              d="M25 22 L75 22" 
              stroke="#059669" 
              strokeWidth="0.5" 
              opacity="0.6"
            />

            {/* Golden Tassel Base */}
            <circle 
              cx="75" 
              cy="25" 
              r="3" 
              fill="url(#goldGrad)" 
              filter="url(#goldGlow)"
            />
            
            {/* Golden Tassel Cord */}
            <path 
              d="M75 28 Q77 35 75 42 Q73 35 75 28" 
              stroke="url(#goldShine)" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Golden Tassel Strands */}
            <g transform="translate(75, 42)">
              <path d="M-3 0 L-3 8" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-1 0 L-1 10" stroke="url(#goldShine)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M1 0 L1 9" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 0 L3 7" stroke="url(#goldShine)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-2 0 L-2 6" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" />
              <path d="M0 0 L0 8" stroke="url(#goldShine)" strokeWidth="1" strokeLinecap="round" />
              <path d="M2 0 L2 5" stroke="url(#goldGrad)" strokeWidth="1" strokeLinecap="round" />
            </g>

            {/* Modern Tech Elements */}
            <circle cx="30" cy="15" r="1.5" fill="#10B981" opacity="0.7" />
            <circle cx="70" cy="15" r="1.5" fill="#059669" opacity="0.7" />
            <circle cx="50" cy="12" r="1" fill="#047857" opacity="0.8" />
            
            {/* Subtle Flow Lines */}
            <path 
              d="M15 30 Q25 28 35 30" 
              stroke="#10B981" 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.5"
            />
            <path 
              d="M65 30 Q75 28 85 30" 
              stroke="#059669" 
              strokeWidth="0.8" 
              fill="none" 
              opacity="0.5"
            />
          </g>
        </svg>
      </Box>

      {/* Main Text Logo */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: config.fontSize,
            fontWeight: 800,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            background: `linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 2px 4px rgba(4, 120, 87, 0.1)',
            mb: showTagline ? 0.5 : 0,
          }}
        >
          My Tutor Flow
        </Typography>

        {/* Optional Tagline */}
        {showTagline && (
          <Typography
            variant="subtitle1"
            sx={{
              fontSize: config.taglineSize,
              fontWeight: 600,
              color: '#047857',
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.8,
            }}
          >
            Mobile Education Platform
          </Typography>
        )}
      </Box>

      {/* Subtle Underline Accent */}
      <Box
        sx={{
          width: '80%',
          height: '2px',
          background: `linear-gradient(90deg, transparent 0%, #10B981 50%, transparent 100%)`,
          mt: 1,
          borderRadius: '1px',
          opacity: 0.6,
        }}
      />
    </Box>
  );
};

// Preset variants for different use cases
export const CompactTextLogo = (props) => (
  <MyTutorFlowTextLogo size="small" showTagline={false} {...props} />
);

export const StandardTextLogo = (props) => (
  <MyTutorFlowTextLogo size="medium" showTagline={false} {...props} />
);

export const HeroTextLogo = (props) => (
  <MyTutorFlowTextLogo size="large" showTagline={true} {...props} />
);

export const HackathonTextLogo = (props) => (
  <MyTutorFlowTextLogo size="xlarge" showTagline={true} {...props} />
);

// Logo with modern animation effects
export const AnimatedTextLogo = ({ size = 'large', showTagline = false, ...props }) => {
  return (
    <Box
      sx={{
        '& svg': {
          animation: 'float 3s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        '&:hover': {
          '& svg': {
            animation: 'bounce 0.6s ease-in-out',
          },
        },
        '@keyframes bounce': {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
      }}
    >
      <MyTutorFlowTextLogo size={size} showTagline={showTagline} {...props} />
    </Box>
  );
};

export default MyTutorFlowTextLogo;
