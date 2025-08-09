import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

// Main TDLA Logo Component - Uses your chosen Option 2 design
export const TDLALogo = ({
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
        transition: 'transform 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
        ...sx,
      }}
      onClick={onClick}
      {...props}
    >
      <TDLALogo2 size={size} showText={false} />
      {showText && variant === 'full' && (
        <Typography
          variant="h6"
          sx={{
            ml: 2,
            fontSize: size > 80 ? '1.5rem' : '1.25rem',
            fontWeight: 700,
            color: '#2E8B57', // Emerald color
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          }}
        >
          TD Learning Academy
        </Typography>
      )}
    </Box>
  );
};

// Logo Option 1: Classic Academic Blue & Gold
export const TDLALogo1 = ({ size = 120, showText = true }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none">
      <defs>
        <linearGradient id="capGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="50%" stopColor="#1976D2" />
          <stop offset="100%" stopColor="#1565C0" />
        </linearGradient>
        <linearGradient id="tasselGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#FFC107" />
        </linearGradient>
        <filter id="shadow1">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Modern Graduation Cap */}
      <g filter="url(#shadow1)">
        {/* Cap Base - 3D Effect */}
        <ellipse cx="60" cy="45" rx="42" ry="6" fill="#0D47A1" opacity="0.8" />
        <ellipse cx="60" cy="43" rx="42" ry="6" fill="url(#capGrad1)" />

        {/* Cap Top - Modern Flat Design */}
        <rect x="18" y="30" width="84" height="8" rx="4" fill="url(#capGrad1)" />
        <rect x="15" y="27" width="90" height="8" rx="4" fill="#42A5F5" opacity="0.9" />

        {/* Modern Tassel - More Prominent */}
        <circle cx="88" cy="27" r="4" fill="url(#tasselGrad1)" />
        <rect x="86" y="31" width="4" height="2" rx="2" fill="url(#tasselGrad1)" />

        {/* Tassel Strings - Multiple strands */}
        <g stroke="url(#tasselGrad1)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="86" y1="33" x2="94" y2="48" />
          <line x1="88" y1="33" x2="96" y2="48" />
          <line x1="90" y1="33" x2="98" y2="48" />
          <line x1="92" y1="33" x2="100" y2="48" />
        </g>

        {/* Tassel End */}
        <ellipse cx="97" cy="48" rx="3" ry="2" fill="url(#tasselGrad1)" />
      </g>

      {/* Fun TDLA Letters - Dynamic and Modern */}
      <g transform="translate(0, 55)">
        {/* T - Bold with flair */}
        <rect x="6" y="5" width="24" height="6" rx="3" fill="#1565C0" />
        <rect x="16" y="5" width="6" height="26" rx="3" fill="#1565C0" />
        <circle cx="19" cy="8" r="2" fill="#42A5F5" />

        {/* D - Curved modern style */}
        <path d="M32 5 Q32 5 32 5 L32 31 Q32 31 44 31 Q56 31 56 18 Q56 5 44 5 Z" fill="#1976D2" />
        <rect x="32" y="5" width="6" height="26" rx="3" fill="#1976D2" />
        <circle cx="48" cy="18" r="3" fill="#64B5F6" opacity="0.7" />

        {/* L - Angular modern design */}
        <rect x="62" y="5" width="6" height="26" rx="3" fill="#2196F3" />
        <rect x="62" y="25" width="20" height="6" rx="3" fill="#2196F3" />
        <polygon points="82,25 88,25 85,31 79,31" fill="#42A5F5" />

        {/* A - Dynamic triangle with modern touch */}
        <path
          d="M90 31 L94 5 Q94 5 96 5 Q96 5 96 5 L100 31 L96 31 L95.5 24 L94.5 24 L94 31 Z"
          fill="#42A5F5"
        />
        <rect x="94.5" y="19" width="1" height="4" fill="#90CAF9" />
        <circle cx="95" cy="8" r="1.5" fill="#E3F2FD" />

        {/* Decorative elements */}
        <circle cx="12" cy="35" r="1" fill="#FFD700" opacity="0.6" />
        <circle cx="45" cy="35" r="1" fill="#FFD700" opacity="0.6" />
        <circle cx="78" cy="35" r="1" fill="#FFD700" opacity="0.6" />
        <circle cx="102" cy="35" r="1" fill="#FFD700" opacity="0.6" />
      </g>
    </svg>
    {showText && (
      <Box mt={1} textAlign="center">
        <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#1565C0' }}>TD Learning Academy</Box>
      </Box>
    )}
  </Box>
);

// Logo Option 2: Geometric Faceted + Braided Tassels (Emerald & Gold) - CHOSEN DESIGN
export const TDLALogo2 = ({ size = 120, showText = true }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none">
      <defs>
        <linearGradient id="capGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#50C878" />
          <stop offset="50%" stopColor="#2E8B57" />
          <stop offset="100%" stopColor="#228B22" />
        </linearGradient>
        <linearGradient id="tasselGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
        <filter id="shadow2">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Geometric Faceted Graduation Cap */}
      <g filter="url(#shadow2)">
        {/* Faceted Cap Base - Geometric 3D */}
        <polygon points="18,45 60,39 102,45 60,51" fill="#1B5E20" opacity="0.8" />
        <polygon points="18,43 60,37 102,43 60,49" fill="url(#capGrad2)" />

        {/* Geometric Faceted Top - Diamond Pattern */}
        <polygon points="15,27 60,21 105,27 60,33" fill="url(#capGrad2)" />
        <polygon points="15,27 37.5,24 60,21 37.5,30" fill="#66BB6A" opacity="0.9" />
        <polygon points="60,21 82.5,24 105,27 82.5,30" fill="#4CAF50" opacity="0.9" />
        <polygon points="37.5,24 60,21 60,33 37.5,30" fill="#2E7D32" opacity="0.7" />
        <polygon points="60,21 82.5,24 82.5,30 60,33" fill="#388E3C" opacity="0.7" />

        {/* Braided Tassel - Complex Weave Pattern */}
        <circle cx="88" cy="27" r="4" fill="url(#tasselGrad2)" />
        <rect x="86" y="31" width="4" height="3" rx="2" fill="url(#tasselGrad2)" />

        {/* Braided Strands - Interwoven Pattern */}
        <g stroke="url(#tasselGrad2)" strokeWidth="2" strokeLinecap="round" fill="none">
          {/* Left braid strand */}
          <path d="M86 34 Q88 36 86 38 Q84 40 86 42 Q88 44 86 46 Q84 48 86 50" />
          {/* Center braid strand */}
          <path d="M88 34 Q90 36 88 38 Q86 40 88 42 Q90 44 88 46 Q86 48 88 50" />
          {/* Right braid strand */}
          <path d="M90 34 Q92 36 90 38 Q88 40 90 42 Q92 44 90 46 Q88 48 90 50" />
          {/* Outer braid strand */}
          <path d="M92 34 Q94 36 92 38 Q90 40 92 42 Q94 44 92 46 Q90 48 92 50" />
        </g>

        {/* Braided Tassel End - Geometric */}
        <polygon points="84,50 88,52 92,50 88,54" fill="url(#tasselGrad2)" />
      </g>

      {/* Fun TDLA Letters - Growth Theme */}
      <g transform="translate(0, 55)">
        {/* T - Growing upward design */}
        <rect x="6" y="5" width="24" height="6" rx="3" fill="#00695C" />
        <rect x="16" y="5" width="6" height="26" rx="3" fill="#00695C" />
        <polygon points="16,5 22,5 19,2" fill="#4CAF50" />

        {/* D - Organic curved style */}
        <path
          d="M32 5 Q32 3 34 3 L44 3 Q58 3 58 18 Q58 33 44 33 L34 33 Q32 33 32 31 Z"
          fill="#00897B"
        />
        <rect x="32" y="5" width="6" height="26" rx="3" fill="#00897B" />
        <circle cx="48" cy="18" r="2" fill="#A5D6A7" opacity="0.8" />

        {/* L - Dynamic angular design */}
        <rect x="62" y="5" width="6" height="26" rx="3" fill="#26A69A" />
        <rect x="62" y="25" width="20" height="6" rx="3" fill="#26A69A" />
        <path d="M82 25 L88 25 L85 31 L79 31 Z" fill="#4CAF50" />
        <circle cx="85" cy="28" r="1" fill="#C8E6C9" />

        {/* A - Mountain peak style */}
        <path
          d="M90 31 L94 3 Q95 1 96 1 Q97 1 98 3 L102 31 L98 31 L97.5 24 L96.5 24 L96 31 Z"
          fill="#4CAF50"
        />
        <rect x="96.5" y="19" width="1" height="4" fill="#A5D6A7" />
        <polygon points="95,3 97,3 96,1" fill="#E8F5E8" />

        {/* Growth elements - leaves/sprouts */}
        <ellipse
          cx="12"
          cy="35"
          rx="2"
          ry="1"
          fill="#4CAF50"
          opacity="0.6"
          transform="rotate(45 12 35)"
        />
        <ellipse
          cx="45"
          cy="35"
          rx="2"
          ry="1"
          fill="#4CAF50"
          opacity="0.6"
          transform="rotate(-30 45 35)"
        />
        <ellipse
          cx="78"
          cy="35"
          rx="2"
          ry="1"
          fill="#4CAF50"
          opacity="0.6"
          transform="rotate(60 78 35)"
        />
        <ellipse
          cx="102"
          cy="35"
          rx="2"
          ry="1"
          fill="#4CAF50"
          opacity="0.6"
          transform="rotate(-45 102 35)"
        />
      </g>
    </svg>
    {showText && (
      <Box mt={1} textAlign="center">
        <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#00695C' }}>TD Learning Academy</Box>
      </Box>
    )}
  </Box>
);

// Logo Option 3: Purple & Orange (Creative & Energetic)
export const TDLALogo3 = ({ size = 120, showText = true }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none">
      <defs>
        <linearGradient id="capGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AB47BC" />
          <stop offset="50%" stopColor="#8E24AA" />
          <stop offset="100%" stopColor="#6A1B9A" />
        </linearGradient>
        <linearGradient id="tasselGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8F00" />
          <stop offset="100%" stopColor="#FF6F00" />
        </linearGradient>
        <filter id="shadow3">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Creative Graduation Cap */}
      <g filter="url(#shadow3)">
        {/* Cap Base - Dynamic 3D */}
        <ellipse cx="60" cy="45" rx="42" ry="6" fill="#4A148C" opacity="0.8" />
        <ellipse cx="60" cy="43" rx="42" ry="6" fill="url(#capGrad3)" />

        {/* Cap Top - Creative angles */}
        <rect x="18" y="30" width="84" height="8" rx="4" fill="url(#capGrad3)" />
        <rect x="15" y="27" width="90" height="8" rx="4" fill="#CE93D8" opacity="0.9" />

        {/* Prominent Creative Tassel */}
        <circle cx="88" cy="27" r="5" fill="url(#tasselGrad3)" />
        <rect x="85" y="32" width="6" height="2" rx="1" fill="url(#tasselGrad3)" />

        {/* Dynamic Tassel Strands - Wavy */}
        <g stroke="url(#tasselGrad3)" strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M85 34 Q90 40 94 48" />
          <path d="M87 34 Q92 40 96 48" />
          <path d="M89 34 Q94 40 98 48" />
          <path d="M91 34 Q96 40 100 48" />
        </g>

        {/* Tassel End - Creative burst */}
        <circle cx="97" cy="48" r="3" fill="url(#tasselGrad3)" />
        <polygon points="94,48 100,48 97,52" fill="#FF8F00" opacity="0.7" />
      </g>

      {/* Fun TDLA Letters - Creative & Energetic */}
      <g transform="translate(0, 55)">
        {/* T - Tilted creative style */}
        <rect x="6" y="5" width="24" height="6" rx="3" fill="#6A1B9A" transform="rotate(-2 18 8)" />
        <rect x="16" y="5" width="6" height="26" rx="3" fill="#6A1B9A" />
        <circle cx="19" cy="8" r="2" fill="#CE93D8" />
        <polygon points="16,5 22,5 19,2" fill="#FF6F00" />

        {/* D - Bouncy curved style */}
        <path
          d="M32 5 Q30 3 34 3 L44 3 Q58 3 58 18 Q58 33 44 33 L34 33 Q30 33 32 31 Z"
          fill="#8E24AA"
        />
        <rect x="32" y="5" width="6" height="26" rx="3" fill="#8E24AA" />
        <circle cx="48" cy="18" r="3" fill="#E1BEE7" opacity="0.8" />
        <circle cx="50" cy="15" r="1" fill="#FF6F00" />

        {/* L - Lightning bolt style */}
        <rect x="62" y="5" width="6" height="26" rx="3" fill="#AB47BC" />
        <path d="M62 25 L82 25 L85 31 L68 31 Z" fill="#AB47BC" />
        <polygon points="82,25 88,25 85,31 79,31" fill="#FF6F00" />
        <circle cx="85" cy="28" r="1.5" fill="#FFE0B2" />

        {/* A - Explosive triangle */}
        <path
          d="M90 31 L94 3 Q95 1 96 1 Q97 1 98 3 L102 31 L98 31 L97.5 24 L96.5 24 L96 31 Z"
          fill="#FF6F00"
        />
        <rect x="96.5" y="19" width="1" height="4" fill="#FFB74D" />
        <polygon points="95,3 97,3 96,1" fill="#FFF3E0" />
        <circle cx="96" cy="8" r="1" fill="#FFCC02" />

        {/* Creative energy bursts */}
        <polygon points="12,35 14,33 16,35 14,37" fill="#FF6F00" opacity="0.7" />
        <polygon points="45,35 47,33 49,35 47,37" fill="#AB47BC" opacity="0.7" />
        <polygon points="78,35 80,33 82,35 80,37" fill="#FF6F00" opacity="0.7" />
        <polygon points="102,35 104,33 106,35 104,37" fill="#8E24AA" opacity="0.7" />
      </g>
    </svg>
    {showText && (
      <Box mt={1} textAlign="center">
        <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#6A1B9A' }}>TD Learning Academy</Box>
      </Box>
    )}
  </Box>
);

// Logo Option 4: Navy & Coral (Professional & Approachable)
export const TDLALogo4 = ({ size = 120, showText = true }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none">
      <defs>
        <linearGradient id="capGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3F51B5" />
          <stop offset="50%" stopColor="#303F9F" />
          <stop offset="100%" stopColor="#1A237E" />
        </linearGradient>
        <linearGradient id="tasselGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="100%" stopColor="#FF5722" />
        </linearGradient>
        <filter id="shadow4">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Professional Graduation Cap */}
      <g filter="url(#shadow4)">
        {/* Cap Base - Professional 3D */}
        <ellipse cx="60" cy="45" rx="42" ry="6" fill="#0D47A1" opacity="0.8" />
        <ellipse cx="60" cy="43" rx="42" ry="6" fill="url(#capGrad4)" />

        {/* Cap Top - Clean lines */}
        <rect x="18" y="30" width="84" height="8" rx="4" fill="url(#capGrad4)" />
        <rect x="15" y="27" width="90" height="8" rx="4" fill="#7986CB" opacity="0.9" />

        {/* Prominent Professional Tassel */}
        <circle cx="88" cy="27" r="4" fill="url(#tasselGrad4)" />
        <rect x="86" y="31" width="4" height="2" rx="2" fill="url(#tasselGrad4)" />

        {/* Clean Tassel Strands */}
        <g stroke="url(#tasselGrad4)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="86" y1="33" x2="94" y2="48" />
          <line x1="88" y1="33" x2="96" y2="48" />
          <line x1="90" y1="33" x2="98" y2="48" />
          <line x1="92" y1="33" x2="100" y2="48" />
        </g>

        {/* Tassel End */}
        <ellipse cx="97" cy="48" rx="3" ry="2" fill="url(#tasselGrad4)" />
      </g>

      {/* Fun TDLA Letters - Professional yet Approachable */}
      <g transform="translate(0, 55)">
        {/* T - Stable with friendly touch */}
        <rect x="6" y="5" width="24" height="6" rx="3" fill="#1A237E" />
        <rect x="16" y="5" width="6" height="26" rx="3" fill="#1A237E" />
        <circle cx="19" cy="8" r="2" fill="#7986CB" />
        <rect x="17" y="31" width="4" height="2" rx="1" fill="#FF5722" />

        {/* D - Rounded professional */}
        <path
          d="M32 5 Q32 3 34 3 L44 3 Q58 3 58 18 Q58 33 44 33 L34 33 Q32 33 32 31 Z"
          fill="#303F9F"
        />
        <rect x="32" y="5" width="6" height="26" rx="3" fill="#303F9F" />
        <circle cx="48" cy="18" r="2" fill="#9FA8DA" opacity="0.8" />
        <circle cx="50" cy="16" r="1" fill="#FF7043" />

        {/* L - Strong foundation */}
        <rect x="62" y="5" width="6" height="26" rx="3" fill="#3F51B5" />
        <rect x="62" y="25" width="20" height="6" rx="3" fill="#3F51B5" />
        <polygon points="82,25 88,25 85,31 79,31" fill="#FF5722" />
        <circle cx="85" cy="28" r="1" fill="#FFAB91" />

        {/* A - Achievement peak */}
        <path
          d="M90 31 L94 3 Q95 1 96 1 Q97 1 98 3 L102 31 L98 31 L97.5 24 L96.5 24 L96 31 Z"
          fill="#FF5722"
        />
        <rect x="96.5" y="19" width="1" height="4" fill="#FF8A65" />
        <polygon points="95,3 97,3 96,1" fill="#FFF3E0" />
        <circle cx="96" cy="8" r="1" fill="#FFCC02" />

        {/* Professional accents */}
        <rect x="12" y="34" width="2" height="2" rx="1" fill="#FF5722" opacity="0.6" />
        <rect x="45" y="34" width="2" height="2" rx="1" fill="#3F51B5" opacity="0.6" />
        <rect x="78" y="34" width="2" height="2" rx="1" fill="#FF5722" opacity="0.6" />
        <rect x="102" y="34" width="2" height="2" rx="1" fill="#1A237E" opacity="0.6" />
      </g>
    </svg>
    {showText && (
      <Box mt={1} textAlign="center">
        <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#1A237E' }}>TD Learning Academy</Box>
      </Box>
    )}
  </Box>
);

// Logo Option 5: Emerald & Gold (Premium & Trustworthy)
export const TDLALogo5 = ({ size = 120, showText = true }) => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96" fill="none">
      <defs>
        <linearGradient id="capGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00796B" />
          <stop offset="50%" stopColor="#00695C" />
          <stop offset="100%" stopColor="#004D40" />
        </linearGradient>
        <linearGradient id="tasselGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <filter id="shadow5">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Premium Graduation Cap */}
      <g filter="url(#shadow5)">
        {/* Cap Base - Luxurious 3D */}
        <ellipse cx="60" cy="45" rx="42" ry="6" fill="#00251A" opacity="0.8" />
        <ellipse cx="60" cy="43" rx="42" ry="6" fill="url(#capGrad5)" />

        {/* Cap Top - Premium finish */}
        <rect x="18" y="30" width="84" height="8" rx="4" fill="url(#capGrad5)" />
        <rect x="15" y="27" width="90" height="8" rx="4" fill="#4DB6AC" opacity="0.9" />

        {/* Luxurious Tassel */}
        <circle cx="88" cy="27" r="5" fill="url(#tasselGrad5)" />
        <rect x="85" y="32" width="6" height="2" rx="1" fill="url(#tasselGrad5)" />

        {/* Premium Tassel Strands */}
        <g stroke="url(#tasselGrad5)" strokeWidth="2" strokeLinecap="round">
          <line x1="85" y1="34" x2="93" y2="48" />
          <line x1="87" y1="34" x2="95" y2="48" />
          <line x1="89" y1="34" x2="97" y2="48" />
          <line x1="91" y1="34" x2="99" y2="48" />
        </g>

        {/* Tassel End - Premium finish */}
        <ellipse cx="96" cy="48" rx="4" ry="2" fill="url(#tasselGrad5)" />
        <circle cx="96" cy="48" r="1" fill="#FFF8E1" />
      </g>

      {/* Fun TDLA Letters - Premium & Trustworthy */}
      <g transform="translate(0, 55)">
        {/* T - Elegant with gold accent */}
        <rect x="6" y="5" width="24" height="6" rx="3" fill="#004D40" />
        <rect x="16" y="5" width="6" height="26" rx="3" fill="#004D40" />
        <rect x="17" y="6" width="4" height="2" rx="1" fill="#FFB300" />
        <circle cx="19" cy="31" r="1" fill="#FFC107" />

        {/* D - Curved elegance */}
        <path
          d="M32 5 Q32 3 34 3 L44 3 Q58 3 58 18 Q58 33 44 33 L34 33 Q32 33 32 31 Z"
          fill="#00695C"
        />
        <rect x="32" y="5" width="6" height="26" rx="3" fill="#00695C" />
        <circle cx="48" cy="18" r="2" fill="#80CBC4" opacity="0.8" />
        <circle cx="50" cy="16" r="1" fill="#FFB300" />

        {/* L - Strong foundation with gold */}
        <rect x="62" y="5" width="6" height="26" rx="3" fill="#00796B" />
        <rect x="62" y="25" width="20" height="6" rx="3" fill="#00796B" />
        <rect x="78" y="26" width="4" height="4" rx="2" fill="#FFB300" />
        <circle cx="85" cy="28" r="1" fill="#FFF8E1" />

        {/* A - Achievement crown */}
        <path
          d="M90 31 L94 3 Q95 1 96 1 Q97 1 98 3 L102 31 L98 31 L97.5 24 L96.5 24 L96 31 Z"
          fill="#FFB300"
        />
        <rect x="96.5" y="19" width="1" height="4" fill="#FFCA28" />
        <polygon points="95,3 97,3 96,1" fill="#FFF8E1" />
        <circle cx="96" cy="8" r="1.5" fill="#FFFDE7" />
        <polygon points="94,3 98,3 96,0" fill="#FFD54F" opacity="0.7" />

        {/* Premium accents - gemstones */}
        <circle cx="12" cy="35" r="1.5" fill="#FFB300" opacity="0.8" />
        <circle cx="45" cy="35" r="1.5" fill="#00796B" opacity="0.8" />
        <circle cx="78" cy="35" r="1.5" fill="#FFB300" opacity="0.8" />
        <circle cx="102" cy="35" r="1.5" fill="#004D40" opacity="0.8" />
      </g>
    </svg>
    {showText && (
      <Box mt={1} textAlign="center">
        <Box sx={{ fontSize: '12px', fontWeight: 600, color: '#004D40' }}>TD Learning Academy</Box>
      </Box>
    )}
  </Box>
);

// Logo Showcase Component
export const TDLALogoShowcase = () => (
  <Box p={3}>
    <Box mb={4} textAlign="center">
      <h2>TD Learning Academy Logo Options</h2>
      <p>Choose your preferred logo design for the tutoring academy</p>
    </Box>

    <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
      <Box textAlign="center" p={3} border="1px solid #e0e0e0" borderRadius="12px">
        <TDLALogo1 size={100} />
        <Box mt={2}>
          <strong>Option 1: Classic Academic</strong>
          <br />
          <small>Blue & Gold - Traditional, trustworthy, professional</small>
        </Box>
      </Box>

      <Box textAlign="center" p={3} border="1px solid #e0e0e0" borderRadius="12px">
        <TDLALogo2 size={100} />
        <Box mt={2}>
          <strong>Option 2: Growth & Nature</strong>
          <br />
          <small>Green & Teal - Growth, learning, fresh approach</small>
        </Box>
      </Box>

      <Box textAlign="center" p={3} border="1px solid #e0e0e0" borderRadius="12px">
        <TDLALogo3 size={100} />
        <Box mt={2}>
          <strong>Option 3: Creative Energy</strong>
          <br />
          <small>Purple & Orange - Creative, energetic, innovative</small>
        </Box>
      </Box>

      <Box textAlign="center" p={3} border="1px solid #e0e0e0" borderRadius="12px">
        <TDLALogo4 size={100} />
        <Box mt={2}>
          <strong>Option 4: Professional Warmth</strong>
          <br />
          <small>Navy & Coral - Professional yet approachable</small>
        </Box>
      </Box>

      <Box textAlign="center" p={3} border="1px solid #e0e0e0" borderRadius="12px">
        <TDLALogo5 size={100} />
        <Box mt={2}>
          <strong>Option 5: Premium Trust</strong>
          <br />
          <small>Emerald & Gold - Premium, trustworthy, established</small>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default TDLALogo1;
