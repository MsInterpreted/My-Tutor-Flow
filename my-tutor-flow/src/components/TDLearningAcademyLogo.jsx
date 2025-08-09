import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

const TDLearningAcademyLogo = ({
  size = 'medium',
  showText = true,
  variant = 'full',
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  const sizeMap = {
    small: { logoSize: 40, fontSize: '16px', spacing: 8 },
    medium: { logoSize: 60, fontSize: '20px', spacing: 12 },
    large: { logoSize: 80, fontSize: '24px', spacing: 16 },
    xlarge: { logoSize: 120, fontSize: '32px', spacing: 20 },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  // TD Learning Academy Official Colors - Emerald & Gold
  const logoColors = {
    emeraldPrimary: '#00796B',
    emeraldMedium: '#00695C',
    emeraldDark: '#004D40',
    emeraldShadow: '#00251A',
    goldPrimary: '#FFC107',
    goldRich: '#FFB300',
    goldBright: '#FFCA28',
    goldLight: '#FFD54F',
    tealHighlight: '#80CBC4',
    creamWhite: '#FFF8E1',
  };

  const textColor = theme.colors.text.primary;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: currentSize.spacing / 8,
        ...sx,
      }}
      {...props}
    >
      {/* Logo Icon - Complete TDLA Logo with Graduation Cap */}
      <Box
        sx={{
          position: 'relative',
          width: currentSize.logoSize * 1.6,
          height: currentSize.logoSize,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width={currentSize.logoSize * 1.6}
          height={currentSize.logoSize}
          viewBox="0 0 220 90"
          fill="none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}
        >
          <defs>
            {/* Premium Emerald Gradient - User's Final Choice */}
            <linearGradient id="emeraldPremium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E676" />
              <stop offset="25%" stopColor="#00C853" />
              <stop offset="50%" stopColor="#00A843" />
              <stop offset="75%" stopColor="#00796B" />
              <stop offset="100%" stopColor="#004D40" />
            </linearGradient>

            {/* Premium Gold Gradient - User's Final Choice */}
            <linearGradient id="goldPremium" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="30%" stopColor="#FFC107" />
              <stop offset="60%" stopColor="#FF8F00" />
              <stop offset="100%" stopColor="#E65100" />
            </linearGradient>

            {/* Sophisticated Shadow Filter */}
            <filter id="premiumShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.25"/>
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#004D40" floodOpacity="0.15"/>
            </filter>

            {/* Metallic Effect for Gold */}
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFECB3" />
              <stop offset="20%" stopColor="#FFD700" />
              <stop offset="40%" stopColor="#FFC107" />
              <stop offset="60%" stopColor="#FF8F00" />
              <stop offset="80%" stopColor="#E65100" />
              <stop offset="100%" stopColor="#BF360C" />
            </linearGradient>
          </defs>

          {/* OPTION 2: Geometric Faceted Graduation Cap - Bold Angular Surfaces */}
          <g filter="url(#premiumShadow)">
            {/* Main Cap Base - Bold Geometric Structure */}
            <polygon
              points="20,35 80,35 90,40 85,48 15,48 10,40"
              fill="url(#emeraldPremium)"
              stroke="#004D40"
              strokeWidth="2"
            />

            {/* Angular Faceted Surfaces - Left Side */}
            <polygon points="10,40 20,35 30,45 15,48" fill="#00A843" opacity="0.95"/>
            <polygon points="20,35 40,32 45,42 30,45" fill="#00C853" opacity="0.9"/>

            {/* Angular Faceted Surfaces - Center */}
            <polygon points="40,32 60,32 65,42 45,42" fill="url(#emeraldPremium)" opacity="0.85"/>
            <polygon points="30,45 45,42 65,42 70,45" fill="#00796B" opacity="0.8"/>

            {/* Angular Faceted Surfaces - Right Side */}
            <polygon points="60,32 80,35 85,48 70,45" fill="#00A843" opacity="0.9"/>
            <polygon points="80,35 90,40 85,48 75,42" fill="#004D40" opacity="0.95"/>

            {/* Top Geometric Facets - Bold Angular Design */}
            <polygon points="20,35 50,25 80,35 50,40" fill="url(#emeraldPremium)"/>
            <polygon points="20,35 35,28 50,25 40,32" fill="#00E676" opacity="0.7"/>
            <polygon points="50,25 65,28 80,35 60,32" fill="#00C853" opacity="0.8"/>
            <polygon points="35,28 50,20 65,28 50,25" fill="#00E676" opacity="0.6"/>

            {/* Additional Geometric Details */}
            <polygon points="45,22 50,20 55,22 50,24" fill="#FFECB3" opacity="0.3"/>
          </g>

          {/* SOPHISTICATED BRAIDED TASSELS - Extended Length with Decorative Knots */}
          <g filter="url(#premiumShadow)">
            {/* Large Tassel Connection Point */}
            <circle cx="90" cy="38" r="8" fill="url(#goldMetallic)" stroke="#BF360C" strokeWidth="2.5"/>
            <circle cx="90" cy="38" r="5" fill="url(#goldPremium)"/>
            <circle cx="90" cy="38" r="2.5" fill="#FFECB3"/>
            <circle cx="90" cy="38" r="1" fill="#FFF8E1"/>

            {/* Interwoven Braided Strands - Extended Length */}
            {/* Main Central Braid */}
            <path
              d="M90,46 Q95,54 90,62 Q85,70 90,78 Q95,86 90,94 Q85,102 90,110"
              stroke="url(#goldMetallic)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Left Interwoven Strand */}
            <path
              d="M87,47 Q82,55 87,63 Q92,71 87,79 Q82,87 87,95 Q92,103 87,111"
              stroke="url(#goldPremium)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Right Interwoven Strand */}
            <path
              d="M93,47 Q98,55 93,63 Q88,71 93,79 Q98,87 93,95 Q88,103 93,111"
              stroke="#FFD700"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Additional Braided Details */}
            <path
              d="M90,48 Q92,56 90,64 Q88,72 90,80 Q92,88 90,96 Q88,104 90,112"
              stroke="#FFECB3"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Decorative Knots at Intervals */}
            <ellipse cx="90" cy="62" rx="3" ry="2" fill="url(#goldMetallic)" opacity="0.8"/>
            <ellipse cx="90" cy="78" rx="3.5" ry="2.5" fill="url(#goldPremium)" opacity="0.9"/>
            <ellipse cx="90" cy="94" rx="4" ry="3" fill="#FFD700" opacity="0.7"/>

            {/* Tassel End Flourishes */}
            <circle cx="87" cy="111" r="2" fill="url(#goldMetallic)"/>
            <circle cx="90" cy="112" r="2.5" fill="url(#goldPremium)"/>
            <circle cx="93" cy="111" r="2" fill="#FFD700"/>
          </g>
          {/* PREMIUM TDLA LETTERS - Innovation and Tradition Feeling */}
          <g filter="url(#premiumShadow)">
            {/* TD in Premium Emerald */}
            <text
              x="110"
              y="45"
              fontFamily="Arial Black, sans-serif"
              fontSize="32"
              fontWeight="900"
              fill="url(#emeraldPremium)"
              letterSpacing="3px"
              stroke="#004D40"
              strokeWidth="0.5"
            >
              TD
            </text>

            {/* LA in Premium Gold */}
            <text
              x="110"
              y="80"
              fontFamily="Arial Black, sans-serif"
              fontSize="32"
              fontWeight="900"
              fill="url(#goldMetallic)"
              letterSpacing="3px"
              stroke="#BF360C"
              strokeWidth="0.5"
            >
              LA
            </text>

            {/* Subtle Highlight Effects */}
            <text
              x="111"
              y="44"
              fontFamily="Arial Black, sans-serif"
              fontSize="32"
              fontWeight="900"
              fill="#00E676"
              letterSpacing="3px"
              opacity="0.3"
            >
              TD
            </text>

            <text
              x="111"
              y="79"
              fontFamily="Arial Black, sans-serif"
              fontSize="32"
              fontWeight="900"
              fill="#FFECB3"
              letterSpacing="3px"
              opacity="0.4"
            >
              LA
            </text>
          </g>

          {/* Premium Base Shadow */}
          <ellipse cx="60" cy="120" rx="45" ry="5" fill="#000000" opacity="0.2"/>
          <ellipse cx="60" cy="118" rx="40" ry="3" fill="#004D40" opacity="0.1"/>
        </svg>
      </Box>

      {/* Company Text */}
      {showText && variant === 'full' && (
        <Box sx={{ ml: 1 }}>
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontWeight: 700,
              fontSize: currentSize.fontSize,
              fontFamily: '"Inter", "Roboto", sans-serif',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
            }}
          >
            TD Learning
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              fontWeight: 500,
              fontSize: `${parseInt(currentSize.fontSize) * 0.7}px`,
              fontFamily: '"Inter", "Roboto", sans-serif',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Academy
          </Typography>
        </Box>
      )}

      {/* Compact Text */}
      {showText && variant === 'compact' && (
        <Typography
          variant="h6"
          sx={{
            color: textColor,
            fontWeight: 700,
            fontSize: currentSize.fontSize,
            fontFamily: '"Inter", "Roboto", sans-serif',
            letterSpacing: '-0.01em',
            ml: 1,
          }}
        >
          TD Learning Academy
        </Typography>
      )}
    </Box>
  );
};

export default TDLearningAcademyLogo;
