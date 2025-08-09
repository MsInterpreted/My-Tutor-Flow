import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useTheme } from '../../theme/ThemeContext';

/**
 * My Tutor Flow Logo Variants
 * 10 different designs featuring graduation cap on mobile phone
 * Each with strategic color psychology for maximum impact
 */

// Logo Variant 1: Tech Innovation (Blue-Purple Gradient)
export const LogoVariant1 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="techGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      
      {/* Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#techGrad1)" filter="url(#glow1)" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#ffffff" />
      
      {/* Screen Content */}
      <rect x="42" y="32" width="36" height="2" rx="1" fill="#3B82F6" opacity="0.8" />
      <rect x="42" y="36" width="28" height="2" rx="1" fill="#8B5CF6" opacity="0.6" />
      <rect x="42" y="40" width="32" height="2" rx="1" fill="#06B6D4" opacity="0.7" />
      
      {/* Graduation Cap on Phone */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#FFD700" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#FFA500" opacity="0.8" />
        <circle cx="22" cy="10" r="1.5" fill="#FF6B6B" />
        <rect x="21" y="12" width="2" height="6" fill="#FF6B6B" opacity="0.8" />
      </g>
      
      {/* Tech Elements */}
      <circle cx="25" cy="30" r="3" fill="#3B82F6" opacity="0.6" />
      <circle cx="95" cy="40" r="3" fill="#8B5CF6" opacity="0.6" />
      <circle cx="20" cy="90" r="3" fill="#06B6D4" opacity="0.6" />
    </svg>
  </Box>
);

// Logo Variant 2: Success & Growth (Green-Emerald)
export const LogoVariant2 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
      
      {/* Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#successGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#ffffff" />
      
      {/* Success Indicators */}
      <g transform="translate(42, 35)">
        <rect x="0" y="0" width="8" height="3" fill="#10B981" rx="1" />
        <rect x="10" y="0" width="12" height="3" fill="#059669" rx="1" />
        <rect x="24" y="0" width="16" height="3" fill="#047857" rx="1" />
        
        {/* Growth Chart */}
        <rect x="0" y="8" width="3" height="12" fill="#10B981" rx="1" />
        <rect x="5" y="6" width="3" height="14" fill="#059669" rx="1" />
        <rect x="10" y="4" width="3" height="16" fill="#047857" rx="1" />
        <rect x="15" y="2" width="3" height="18" fill="#10B981" rx="1" />
      </g>
      
      {/* Premium Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="url(#goldGrad)" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#F59E0B" opacity="0.9" />
        <circle cx="22" cy="10" r="1.5" fill="#DC2626" />
        <rect x="21" y="12" width="2" height="6" fill="#DC2626" opacity="0.8" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 3: Trust & Reliability (Navy-Blue)
export const LogoVariant3 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      
      {/* Mobile Phone with Professional Look */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#trustGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#F8FAFC" />
      
      {/* Professional Interface */}
      <g transform="translate(42, 32)">
        <rect x="0" y="0" width="36" height="3" fill="#1E3A8A" rx="1" />
        <rect x="0" y="6" width="24" height="2" fill="#3B82F6" rx="1" />
        <rect x="0" y="10" width="30" height="2" fill="#1D4ED8" rx="1" />
        
        {/* Data Visualization */}
        <circle cx="6" cy="18" r="2" fill="#1E3A8A" />
        <circle cx="18" cy="18" r="2" fill="#3B82F6" />
        <circle cx="30" cy="18" r="2" fill="#1D4ED8" />
      </g>
      
      {/* Academic Excellence Cap */}
      <g transform="translate(45, 52)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#1F2937" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#374151" />
        <circle cx="22" cy="10" r="1.5" fill="#EF4444" />
        <rect x="21" y="12" width="2" height="6" fill="#EF4444" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 4: Energy & Innovation (Orange-Red)
export const LogoVariant4 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <filter id="energyGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      
      {/* Dynamic Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#energyGrad)" filter="url(#energyGlow)" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#FFF7ED" />
      
      {/* Dynamic Elements */}
      <g transform="translate(42, 32)">
        <path d="M0 8 Q18 4 36 8" stroke="#F97316" strokeWidth="2" fill="none" />
        <path d="M0 12 Q18 8 36 12" stroke="#EF4444" strokeWidth="2" fill="none" />
        <path d="M0 16 Q18 12 36 16" stroke="#DC2626" strokeWidth="2" fill="none" />
        
        {/* Energy Bars */}
        <rect x="2" y="20" width="4" height="8" fill="#F97316" rx="2" />
        <rect x="8" y="18" width="4" height="10" fill="#EF4444" rx="2" />
        <rect x="14" y="16" width="4" height="12" fill="#DC2626" rx="2" />
        <rect x="20" y="14" width="4" height="14" fill="#F97316" rx="2" />
      </g>
      
      {/* Energetic Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#FBBF24" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#F59E0B" />
        <circle cx="22" cy="10" r="1.5" fill="#DC2626" />
        <rect x="21" y="12" width="2" height="6" fill="#DC2626" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 5: Premium & Luxury (Purple-Gold)
export const LogoVariant5 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FF8C00" />
        </linearGradient>
      </defs>
      
      {/* Luxury Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#luxuryGrad)" />
      <rect x="37" y="22" width="46" height="76" rx="6" fill="url(#premiumGold)" opacity="0.1" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#FAF5FF" />
      
      {/* Premium Interface */}
      <g transform="translate(42, 32)">
        <rect x="0" y="0" width="36" height="3" fill="url(#luxuryGrad)" rx="1" />
        <rect x="0" y="6" width="28" height="2" fill="#A855F7" rx="1" />
        <rect x="0" y="10" width="32" height="2" fill="#C084FC" rx="1" />
        
        {/* Luxury Elements */}
        <polygon points="6,16 12,16 9,22" fill="url(#premiumGold)" />
        <polygon points="18,16 24,16 21,22" fill="url(#luxuryGrad)" />
        <polygon points="30,16 36,16 33,22" fill="url(#premiumGold)" />
      </g>
      
      {/* Premium Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="url(#premiumGold)" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#FFD700" />
        <circle cx="22" cy="10" r="1.5" fill="#7C3AED" />
        <rect x="21" y="12" width="2" height="6" fill="#7C3AED" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 6: Fresh & Modern (Cyan-Teal)
export const LogoVariant6 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="freshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
      </defs>
      
      {/* Modern Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="12" fill="url(#freshGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="8" fill="#F0FDFF" />
      
      {/* Modern Interface */}
      <g transform="translate(42, 32)">
        <circle cx="6" cy="6" r="3" fill="#06B6D4" opacity="0.8" />
        <circle cx="18" cy="6" r="3" fill="#0891B2" opacity="0.8" />
        <circle cx="30" cy="6" r="3" fill="#0E7490" opacity="0.8" />
        
        {/* Modern Data */}
        <rect x="0" y="14" width="36" height="1" fill="#06B6D4" rx="0.5" />
        <rect x="0" y="17" width="24" height="1" fill="#0891B2" rx="0.5" />
        <rect x="0" y="20" width="30" height="1" fill="#0E7490" rx="0.5" />
        
        {/* Wave Pattern */}
        <path d="M0 26 Q9 24 18 26 T36 26" stroke="#06B6D4" strokeWidth="2" fill="none" />
      </g>
      
      {/* Modern Graduation Cap */}
      <g transform="translate(45, 52)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#1F2937" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#374151" />
        <circle cx="22" cy="10" r="1.5" fill="#06B6D4" />
        <rect x="21" y="12" width="2" height="6" fill="#06B6D4" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 7: Creativity & Inspiration (Pink-Purple)
export const LogoVariant7 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="creativeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Creative Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="10" fill="url(#creativeGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="6" fill="#FDF2F8" />

      {/* Creative Elements */}
      <g transform="translate(42, 32)">
        <circle cx="8" cy="8" r="4" fill="#EC4899" opacity="0.7" />
        <circle cx="20" cy="6" r="3" fill="#A855F7" opacity="0.7" />
        <circle cx="28" cy="10" r="2" fill="#8B5CF6" opacity="0.7" />

        {/* Creative Patterns */}
        <path d="M4 16 Q12 14 20 16 Q28 18 36 16" stroke="#EC4899" strokeWidth="1.5" fill="none" />
        <path d="M0 20 Q8 18 16 20 Q24 22 32 20" stroke="#A855F7" strokeWidth="1.5" fill="none" />
      </g>

      {/* Creative Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#FBBF24" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#F59E0B" />
        <circle cx="22" cy="10" r="1.5" fill="#EC4899" />
        <rect x="21" y="12" width="2" height="6" fill="#EC4899" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 8: Stability & Excellence (Dark Gray-Silver)
export const LogoVariant8 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="stableGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="50%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#9CA3AF" />
        </linearGradient>
        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5E7EB" />
          <stop offset="100%" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>

      {/* Professional Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="8" fill="url(#stableGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="4" fill="#F9FAFB" />

      {/* Professional Interface */}
      <g transform="translate(42, 32)">
        <rect x="0" y="0" width="36" height="4" fill="url(#stableGrad)" rx="2" />
        <rect x="0" y="8" width="28" height="2" fill="#6B7280" rx="1" />
        <rect x="0" y="12" width="32" height="2" fill="#9CA3AF" rx="1" />

        {/* Excellence Indicators */}
        <rect x="2" y="18" width="6" height="8" fill="#374151" rx="1" />
        <rect x="10" y="16" width="6" height="10" fill="#6B7280" rx="1" />
        <rect x="18" y="14" width="6" height="12" fill="#9CA3AF" rx="1" />
        <rect x="26" y="12" width="6" height="14" fill="#374151" rx="1" />
      </g>

      {/* Excellence Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="url(#silverGrad)" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#E5E7EB" />
        <circle cx="22" cy="10" r="1.5" fill="#DC2626" />
        <rect x="21" y="12" width="2" height="6" fill="#DC2626" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 9: Warmth & Approachability (Warm Orange-Yellow)
export const LogoVariant9 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="warmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Warm Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="12" fill="url(#warmGrad)" />
      <rect x="38" y="28" width="44" height="64" rx="8" fill="#FFFBEB" />

      {/* Warm Interface */}
      <g transform="translate(42, 32)">
        <circle cx="6" cy="6" r="3" fill="#F59E0B" />
        <circle cx="18" cy="6" r="3" fill="#F97316" />
        <circle cx="30" cy="6" r="3" fill="#EA580C" />

        {/* Friendly Elements */}
        <path d="M6 14 Q18 12 30 14" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M6 18 Q18 16 30 18" stroke="#F97316" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M6 22 Q18 20 30 22" stroke="#EA580C" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Friendly Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="#FBBF24" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="#F59E0B" />
        <circle cx="22" cy="10" r="1.5" fill="#DC2626" />
        <rect x="21" y="12" width="2" height="6" fill="#DC2626" />
      </g>
    </svg>
  </Box>
);

// Logo Variant 10: Future & Innovation (Holographic Multi-color)
export const LogoVariant10 = ({ size = 120 }) => (
  <Box sx={{ position: 'relative' }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="25%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <filter id="holoGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Futuristic Mobile Phone */}
      <rect x="35" y="20" width="50" height="80" rx="15" fill="url(#holoGrad)" filter="url(#holoGlow)" />
      <rect x="37" y="22" width="46" height="76" rx="13" fill="rgba(255,255,255,0.1)" />
      <rect x="38" y="28" width="44" height="64" rx="10" fill="#000011" />

      {/* Futuristic Interface */}
      <g transform="translate(42, 32)">
        <rect x="0" y="0" width="36" height="2" fill="#06B6D4" rx="1" opacity="0.8" />
        <rect x="0" y="4" width="28" height="2" fill="#8B5CF6" rx="1" opacity="0.8" />
        <rect x="0" y="8" width="32" height="2" fill="#EC4899" rx="1" opacity="0.8" />

        {/* Holographic Elements */}
        <circle cx="8" cy="16" r="2" fill="#06B6D4" opacity="0.7" />
        <circle cx="18" cy="16" r="2" fill="#8B5CF6" opacity="0.7" />
        <circle cx="28" cy="16" r="2" fill="#EC4899" opacity="0.7" />

        {/* Future Grid */}
        <path d="M0 22 L36 22 M0 26 L36 26" stroke="url(#holoGrad)" strokeWidth="0.5" opacity="0.5" />
        <path d="M6 20 L6 28 M18 20 L18 28 M30 20 L30 28" stroke="url(#holoGrad)" strokeWidth="0.5" opacity="0.5" />
      </g>

      {/* Futuristic Graduation Cap */}
      <g transform="translate(45, 50)">
        <path d="M5 10 L15 7 L25 10 L15 13 Z" fill="url(#holoGrad)" />
        <ellipse cx="15" cy="10" rx="10" ry="3" fill="rgba(255,255,255,0.2)" />
        <circle cx="22" cy="10" r="1.5" fill="#FF0080" />
        <rect x="21" y="12" width="2" height="6" fill="#FF0080" />
      </g>
    </svg>
  </Box>
);

export const LogoShowcase = () => {
  const theme = useTheme();
  
  const logoVariants = [
    {
      component: LogoVariant1,
      name: "Tech Innovation",
      colors: "Blue-Purple Gradient",
      psychology: "Trust, Innovation, Technology",
      appeal: "Tech-savvy users, Investors",
      description: "Conveys cutting-edge technology and innovation"
    },
    {
      component: LogoVariant2,
      name: "Success & Growth",
      colors: "Green-Emerald",
      psychology: "Growth, Success, Prosperity",
      appeal: "Business owners, Entrepreneurs",
      description: "Emphasizes business growth and educational success"
    },
    {
      component: LogoVariant3,
      name: "Trust & Reliability",
      colors: "Navy-Blue",
      psychology: "Trust, Professionalism, Stability",
      appeal: "Educational institutions, Parents",
      description: "Projects reliability and professional competence"
    },
    {
      component: LogoVariant4,
      name: "Energy & Innovation",
      colors: "Orange-Red",
      psychology: "Energy, Enthusiasm, Action",
      appeal: "Young entrepreneurs, Startups",
      description: "Dynamic and energetic, perfect for disruption"
    },
    {
      component: LogoVariant5,
      name: "Premium & Luxury",
      colors: "Purple-Gold",
      psychology: "Luxury, Premium, Excellence",
      appeal: "High-end market, Premium services",
      description: "Positions as premium educational technology"
    },
    {
      component: LogoVariant6,
      name: "Fresh & Modern",
      colors: "Cyan-Teal",
      psychology: "Freshness, Clarity, Modern",
      appeal: "Modern educators, Digital natives",
      description: "Clean, modern approach to education technology"
    },
    {
      component: LogoVariant7,
      name: "Creativity & Inspiration",
      colors: "Pink-Purple",
      psychology: "Creativity, Inspiration, Innovation",
      appeal: "Creative educators, Art schools",
      description: "Inspires creativity and innovative thinking"
    },
    {
      component: LogoVariant8,
      name: "Stability & Excellence",
      colors: "Dark Gray-Silver",
      psychology: "Stability, Excellence, Authority",
      appeal: "Traditional institutions, Corporate",
      description: "Projects authority and institutional excellence"
    },
    {
      component: LogoVariant9,
      name: "Warmth & Approachability",
      colors: "Warm Orange-Yellow",
      psychology: "Warmth, Friendliness, Accessibility",
      appeal: "Community tutors, Family-oriented",
      description: "Welcoming and approachable for all users"
    },
    {
      component: LogoVariant10,
      name: "Future & Innovation",
      colors: "Holographic Multi-color",
      psychology: "Future, Innovation, Cutting-edge",
      appeal: "Tech enthusiasts, Early adopters",
      description: "Represents the future of education technology"
    }
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 700 }}>
        My Tutor Flow Logo Variants
      </Typography>
      <Typography variant="h6" sx={{ mb: 6, textAlign: 'center', color: theme.colors.text.secondary }}>
        Choose the design that best represents your vision for the hackathon
      </Typography>
      
      <Grid container spacing={4}>
        {logoVariants.map((variant, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              backgroundColor: theme.colors.background.primary,
              border: `2px solid ${theme.colors.background.secondary}`,
              '&:hover': {
                border: `2px solid ${theme.colors.brand.primary}`,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                  <variant.component size={100} />
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {variant.name}
                </Typography>
                
                <Chip 
                  label={variant.colors} 
                  size="small" 
                  sx={{ mb: 2, backgroundColor: theme.colors.brand.primary + '20' }}
                />
                
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                  Psychology: {variant.psychology}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                  Appeals to: {variant.appeal}
                </Typography>
                
                <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                  {variant.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LogoShowcase;
