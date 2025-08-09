import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, Container } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import GraduationCapStyles from './GraduationCapStyles';

export default function GraduationCapOptions({ onSelectCap }) {
  const theme = useTheme();
  const [selectedCap, setSelectedCap] = useState(null);

  const capOptions = [
    {
      id: 1,
      name: 'Continuous Line Art',
      component: GraduationCapStyles.CapStyle1,
      description: 'Single flowing line creating the entire cap',
      style: 'Minimalist and elegant',
    },
    {
      id: 2,
      name: '3D Isometric',
      component: GraduationCapStyles.CapStyle2,
      description: 'Professional depth with realistic shadows',
      style: 'Sophisticated and modern',
    },
    {
      id: 3,
      name: 'Geometric Faceted',
      component: GraduationCapStyles.CapStyle3,
      description: 'Angular geometric shapes and facets',
      style: 'Bold and innovative',
    },
    {
      id: 4,
      name: 'Soft Rounded Organic',
      component: GraduationCapStyles.CapStyle4,
      description: 'Smooth curves with organic flowing shapes',
      style: 'Friendly and approachable',
    },
    {
      id: 5,
      name: 'Flat Bold Outlines',
      component: GraduationCapStyles.CapStyle5,
      description: 'Clean flat colors with thick borders',
      style: 'Modern app-style design',
    },
    {
      id: 6,
      name: 'Gradient Mesh 3D',
      component: GraduationCapStyles.CapStyle6,
      description: 'Smooth gradients creating realistic 3D',
      style: 'Premium and polished',
    },
    {
      id: 7,
      name: 'Paper Cut-Out Layered',
      component: GraduationCapStyles.CapStyle7,
      description: 'Layered paper with subtle shadows',
      style: 'Tactile and crafted',
    },
    {
      id: 8,
      name: 'Neon Outline Glow',
      component: GraduationCapStyles.CapStyle8,
      description: 'Thin outlines with glowing effects',
      style: 'Tech-inspired and modern',
    },
    {
      id: 9,
      name: 'Watercolor Artistic',
      component: GraduationCapStyles.CapStyle9,
      description: 'Soft watercolor textures and brush strokes',
      style: 'Creative and artistic',
    },
    {
      id: 10,
      name: 'Low-Poly Crystalline',
      component: GraduationCapStyles.CapStyle10,
      description: 'Triangular polygons creating faceted surfaces',
      style: 'Gaming aesthetic and geometric',
    },
    {
      id: 11,
      name: 'Vintage Badge',
      component: GraduationCapStyles.CapStyle11,
      description: 'Classic academic with ornate details',
      style: 'Traditional and prestigious',
    },
    {
      id: 12,
      name: 'Duotone High Contrast',
      component: GraduationCapStyles.CapStyle12,
      description: 'Two-color design with bold shapes',
      style: 'Strong visual impact',
    },
    {
      id: 13,
      name: 'Sketch Hand-Drawn',
      component: GraduationCapStyles.CapStyle13,
      description: 'Hand-sketched with natural line variations',
      style: 'Personal and approachable',
    },
    {
      id: 14,
      name: 'Metallic Embossed',
      component: GraduationCapStyles.CapStyle14,
      description: 'Raised appearance with metallic shine',
      style: 'Premium and sophisticated',
    },
    {
      id: 15,
      name: 'Particle Dot Matrix',
      component: GraduationCapStyles.CapStyle15,
      description: 'Small dots forming the shape',
      style: 'Digital and tech-inspired',
    },
  ];

  const handleSelect = capId => {
    setSelectedCap(capId);
    if (onSelectCap) {
      onSelectCap(capId);
    }
  };

  const CapCard = ({ option, isSelected, onSelect }) => {
    const CapComponent = option.component;

    return (
      <Card
        sx={{
          backgroundColor: theme.colors.background.secondary,
          border: isSelected
            ? `3px solid ${theme.colors.brand.primary}`
            : `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: isSelected ? theme.shadows.elevated : theme.shadows.card,
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows.elevated,
          },
        }}
        onClick={() => onSelect(option.id)}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          {/* Cap Display */}
          <Box
            mb={3}
            p={3}
            sx={{
              backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '80px',
            }}
          >
            <CapComponent size={100} />
          </Box>

          {/* Cap Info */}
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {option.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.secondary,
              mb: 1,
            }}
          >
            {option.description}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              fontStyle: 'italic',
            }}
          >
            {option.style}
          </Typography>

          {isSelected && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary,
                  opacity: 0.8,
                },
              }}
            >
              Selected ✓
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl">
      <Box py={4}>
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
            borderRadius: '16px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
              mb: 2,
            }}
          >
            🎓 15 Modern Graduation Cap Styles
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.brand.primary,
              fontWeight: 600,
              mb: 3,
            }}
          >
            Choose Your Perfect Cap Design for TDLA
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.colors.text.secondary,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            Based on web research of modern graduation cap designs, here are 15 distinct styles with
            prominent tassels. Select your favorites and I'll apply them to all 5 TDLA logo color
            schemes with the fun letter designs you love!
          </Typography>
        </Paper>

        {/* Cap Options Grid */}
        <Grid container spacing={3}>
          {capOptions.map(option => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={option.id}>
              <CapCard
                option={option}
                isSelected={selectedCap === option.id}
                onSelect={handleSelect}
              />
            </Grid>
          ))}
        </Grid>

        {selectedCap && (
          <Paper
            sx={{
              p: 3,
              mt: 4,
              backgroundColor: theme.colors.brand.primary + '10',
              border: `1px solid ${theme.colors.brand.primary}20`,
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
              }}
            >
              Perfect Choice! 🎉
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.colors.text.secondary,
                mb: 3,
              }}
            >
              I'll now apply the{' '}
              <strong>{capOptions.find(opt => opt.id === selectedCap)?.name}</strong> style to all 5
              TDLA logo options with their beautiful color schemes and fun letter designs!
            </Typography>

            {/* Special comparison for your two favorites */}
            {(selectedCap === 2 || selectedCap === 3) && (
              <Box mb={4}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  🎯 Your Two Favorites: Side-by-Side Comparison
                </Typography>

                <Grid container spacing={4}>
                  {/* 3D Isometric Option */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: theme.colors.background.secondary,
                        border:
                          selectedCap === 2
                            ? `3px solid ${theme.colors.brand.primary}`
                            : `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => setSelectedCap(2)}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 600 }}
                      >
                        Option 1: 3D Isometric + Crystal Tassels
                      </Typography>

                      <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
                        <defs>
                          <linearGradient id="emeraldCap1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00796B" />
                            <stop offset="50%" stopColor="#00695C" />
                            <stop offset="100%" stopColor="#004D40" />
                          </linearGradient>
                          <linearGradient id="goldTassel1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFC107" />
                            <stop offset="100%" stopColor="#FFB300" />
                          </linearGradient>
                          <filter id="shadow1">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
                          </filter>
                        </defs>

                        {/* 3D Isometric Cap */}
                        <g filter="url(#shadow1)">
                          <ellipse cx="100" cy="55" rx="70" ry="8" fill="#00251A" opacity="0.8" />
                          <path d="M40 35 L160 35 L150 25 L50 25 Z" fill="url(#emeraldCap1)" />
                          <path d="M40 35 L160 35 L160 45 L40 45 Z" fill="#00695C" />
                          <path d="M160 35 L160 45 L150 38 L150 25 Z" fill="#004D40" />

                          {/* Enhanced Crystal Shard Tassels */}
                          <circle cx="145" cy="30" r="6" fill="url(#goldTassel1)" />
                          <rect x="142" y="36" width="6" height="3" rx="1" fill="#FFB300" />

                          {/* First tier of crystal shards */}
                          <polygon
                            points="142,39 144,43 146,47 144,51 142,47 140,43"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="144,39 146,43 148,47 146,51 144,47 142,43"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="146,39 148,43 150,47 148,51 146,47 144,43"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="148,39 150,43 152,47 150,51 148,47 146,43"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="150,39 152,43 154,47 152,51 150,47 148,43"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />

                          {/* Second tier - longer shards */}
                          <polygon
                            points="143,51 145,55 147,59 145,63 143,59 141,55"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="145,51 147,55 149,59 147,63 145,59 143,55"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="147,51 149,55 151,59 149,63 147,59 145,55"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="149,51 151,55 153,59 151,63 149,59 147,55"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />

                          {/* Third tier - longest crystal points */}
                          <polygon
                            points="144,63 146,67 148,71 146,75 144,71 142,67"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="146,63 148,67 150,71 148,75 146,71 144,67"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="148,63 150,67 152,71 150,75 148,71 146,67"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />

                          {/* Final crystal tips */}
                          <polygon
                            points="145,75 147,79 149,75"
                            fill="#FFC107"
                            stroke="#FFE082"
                            strokeWidth="0.5"
                          />
                          <polygon
                            points="147,75 149,79 151,75"
                            fill="#FFB300"
                            stroke="#FFD54F"
                            strokeWidth="0.5"
                          />
                        </g>

                        {/* TDLA Letters */}
                        <g transform="translate(30, 85)">
                          <rect x="6" y="5" width="30" height="8" rx="4" fill="#004D40" />
                          <rect x="18" y="5" width="8" height="32" rx="4" fill="#004D40" />
                          <rect x="20" y="7" width="5" height="3" rx="1" fill="#FFB300" />
                          <circle cx="22" cy="37" r="1.5" fill="#FFC107" />

                          <path
                            d="M40 5 Q40 3 42 3 L54 3 Q70 3 70 22 Q70 41 54 41 L42 41 Q40 41 40 39 Z"
                            fill="#00695C"
                          />
                          <rect x="40" y="5" width="8" height="32" rx="4" fill="#00695C" />
                          <circle cx="58" cy="22" r="3" fill="#80CBC4" opacity="0.8" />
                          <circle cx="61" cy="19" r="1.5" fill="#FFB300" />

                          <rect x="78" y="5" width="8" height="32" rx="4" fill="#00796B" />
                          <rect x="78" y="31" width="25" height="8" rx="4" fill="#00796B" />
                          <rect x="98" y="32" width="5" height="5" rx="2" fill="#FFB300" />
                          <circle cx="107" cy="35" r="1.5" fill="#FFF8E1" />

                          <path
                            d="M112 41 L118 3 Q119 1 120 1 Q121 1 122 3 L128 41 L123 41 L122.5 30 L119.5 30 L119 41 Z"
                            fill="#FFB300"
                          />
                          <rect x="119.5" y="24" width="1.5" height="5" fill="#FFCA28" />
                          <polygon points="118,3 122,3 120,1" fill="#FFF8E1" />
                          <circle cx="120" cy="10" r="2" fill="#FFFDE7" />
                          <polygon points="117,3 123,3 120,0" fill="#FFD54F" opacity="0.7" />
                        </g>
                      </svg>

                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary, mt: 2 }}
                      >
                        Professional 3D depth with innovative crystal shard tassels
                      </Typography>
                      {selectedCap === 2 && (
                        <Typography
                          variant="body2"
                          sx={{ color: theme.colors.brand.primary, mt: 1, fontWeight: 600 }}
                        >
                          ✓ Currently Selected
                        </Typography>
                      )}
                    </Paper>
                  </Grid>

                  {/* Geometric Faceted Option */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: theme.colors.background.secondary,
                        border:
                          selectedCap === 3
                            ? `3px solid ${theme.colors.brand.primary}`
                            : `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: '16px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                      }}
                      onClick={() => setSelectedCap(3)}
                    >
                      <Typography
                        variant="h6"
                        sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 600 }}
                      >
                        Option 2: Geometric Faceted + Braided Tassels
                      </Typography>

                      <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
                        <defs>
                          <linearGradient id="emeraldCap2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00796B" />
                            <stop offset="50%" stopColor="#00695C" />
                            <stop offset="100%" stopColor="#004D40" />
                          </linearGradient>
                          <linearGradient id="goldTassel2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFC107" />
                            <stop offset="100%" stopColor="#FFB300" />
                          </linearGradient>
                          <filter id="shadow2">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
                          </filter>
                        </defs>

                        {/* Geometric Faceted Cap */}
                        <g filter="url(#shadow2)">
                          <ellipse cx="100" cy="55" rx="65" ry="6" fill="#00251A" opacity="0.8" />
                          <polygon
                            points="30,40 100,32 170,40 160,28 110,22 40,28"
                            fill="url(#emeraldCap2)"
                          />
                          <polygon points="30,40 100,32 100,45 30,50" fill="#00695C" />
                          <polygon points="100,32 170,40 170,50 100,45" fill="#004D40" />
                          <polygon points="160,28 170,40 170,50 160,38" fill="#00251A" />

                          {/* Braided Tassels with Bigger Button */}
                          <polygon points="145,25 155,32 165,38" fill="url(#goldTassel2)" />
                          <circle cx="155" cy="32" r="6" fill="url(#goldTassel2)" />
                          <rect x="152" y="38" width="6" height="3" rx="1" fill="#FFB300" />

                          {/* Braided pattern */}
                          <path
                            d="M152 41 Q154 45 156 49 Q158 53 154 57 Q150 61 154 65"
                            stroke="#FFC107"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M154 41 Q156 45 158 49 Q160 53 156 57 Q152 61 156 65"
                            stroke="#FFB300"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M156 41 Q158 45 160 49 Q162 53 158 57 Q154 61 158 65"
                            stroke="#FFC107"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M158 41 Q160 45 162 49 Q164 53 160 57 Q156 61 160 65"
                            stroke="#FFB300"
                            strokeWidth="3"
                            fill="none"
                          />

                          {/* Extended braided strands */}
                          <path
                            d="M154 65 Q156 69 158 73 Q160 77 156 81"
                            stroke="#FFC107"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M156 65 Q158 69 160 73 Q162 77 158 81"
                            stroke="#FFB300"
                            strokeWidth="3"
                            fill="none"
                          />
                          <path
                            d="M158 65 Q160 69 162 73 Q164 77 160 81"
                            stroke="#FFC107"
                            strokeWidth="3"
                            fill="none"
                          />

                          {/* Tassel ends with decorative knots */}
                          <circle cx="156" cy="81" r="2.5" fill="#FFC107" />
                          <circle cx="158" cy="81" r="2.5" fill="#FFB300" />
                          <circle cx="160" cy="81" r="2.5" fill="#FFC107" />
                        </g>

                        {/* TDLA Letters */}
                        <g transform="translate(30, 85)">
                          <rect x="6" y="5" width="30" height="8" rx="4" fill="#004D40" />
                          <rect x="18" y="5" width="8" height="32" rx="4" fill="#004D40" />
                          <rect x="20" y="7" width="5" height="3" rx="1" fill="#FFB300" />
                          <circle cx="22" cy="37" r="1.5" fill="#FFC107" />

                          <path
                            d="M40 5 Q40 3 42 3 L54 3 Q70 3 70 22 Q70 41 54 41 L42 41 Q40 41 40 39 Z"
                            fill="#00695C"
                          />
                          <rect x="40" y="5" width="8" height="32" rx="4" fill="#00695C" />
                          <circle cx="58" cy="22" r="3" fill="#80CBC4" opacity="0.8" />
                          <circle cx="61" cy="19" r="1.5" fill="#FFB300" />

                          <rect x="78" y="5" width="8" height="32" rx="4" fill="#00796B" />
                          <rect x="78" y="31" width="25" height="8" rx="4" fill="#00796B" />
                          <rect x="98" y="32" width="5" height="5" rx="2" fill="#FFB300" />
                          <circle cx="107" cy="35" r="1.5" fill="#FFF8E1" />

                          <path
                            d="M112 41 L118 3 Q119 1 120 1 Q121 1 122 3 L128 41 L123 41 L122.5 30 L119.5 30 L119 41 Z"
                            fill="#FFB300"
                          />
                          <rect x="119.5" y="24" width="1.5" height="5" fill="#FFCA28" />
                          <polygon points="118,3 122,3 120,1" fill="#FFF8E1" />
                          <circle cx="120" cy="10" r="2" fill="#FFFDE7" />
                          <polygon points="117,3 123,3 120,0" fill="#FFD54F" opacity="0.7" />
                        </g>
                      </svg>

                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary, mt: 2 }}
                      >
                        Bold geometric design with sophisticated braided tassels
                      </Typography>
                      {selectedCap === 3 && (
                        <Typography
                          variant="body2"
                          sx={{ color: theme.colors.brand.primary, mt: 1, fontWeight: 600 }}
                        >
                          ✓ Currently Selected
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>

                <Box mt={3} textAlign="center">
                  <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                    Click on either option above to select it, then use the button below to apply to
                    all color schemes!
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Regular preview for other selections */}
            {selectedCap && selectedCap !== 2 && selectedCap !== 3 && (
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Preview: {capOptions.find(opt => opt.id === selectedCap)?.name} + TDLA Letters
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
                    <defs>
                      <linearGradient id="emeraldCap" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00796B" />
                        <stop offset="50%" stopColor="#00695C" />
                        <stop offset="100%" stopColor="#004D40" />
                      </linearGradient>
                      <linearGradient id="goldTassel" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFC107" />
                        <stop offset="100%" stopColor="#FFB300" />
                      </linearGradient>
                      <filter id="previewShadow">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
                      </filter>
                    </defs>

                    {/* Cap based on selected style */}
                    <g filter="url(#previewShadow)">
                      <ellipse cx="80" cy="50" rx="60" ry="8" fill="#00251A" opacity="0.8" />
                      <ellipse cx="80" cy="48" rx="60" ry="8" fill="url(#emeraldCap)" />
                      <rect x="30" y="35" width="100" height="10" rx="5" fill="url(#emeraldCap)" />
                      <rect
                        x="25"
                        y="30"
                        width="110"
                        height="10"
                        rx="5"
                        fill="#4DB6AC"
                        opacity="0.9"
                      />

                      {/* Default flowing tassel */}
                      <circle cx="110" cy="30" r="6" fill="url(#goldTassel)" />
                      <rect x="107" y="36" width="6" height="2" rx="1" fill="url(#goldTassel)" />
                      <path
                        d="M107 38 Q111 45 114 55 Q116 60 115 65"
                        stroke="url(#goldTassel)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M109 38 Q113 45 116 55 Q118 60 117 65"
                        stroke="url(#goldTassel)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <path
                        d="M111 38 Q115 45 118 55 Q120 60 119 65"
                        stroke="url(#goldTassel)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="117" cy="65" r="3" fill="url(#goldTassel)" />
                    </g>

                    {/* TDLA Letters - Emerald & Gold */}
                    <g transform="translate(20, 75)">
                      <rect x="6" y="5" width="24" height="6" rx="3" fill="#004D40" />
                      <rect x="16" y="5" width="6" height="26" rx="3" fill="#004D40" />
                      <rect x="17" y="6" width="4" height="2" rx="1" fill="#FFB300" />
                      <circle cx="19" cy="31" r="1" fill="#FFC107" />

                      <path
                        d="M32 5 Q32 3 34 3 L44 3 Q58 3 58 18 Q58 33 44 33 L34 33 Q32 33 32 31 Z"
                        fill="#00695C"
                      />
                      <rect x="32" y="5" width="6" height="26" rx="3" fill="#00695C" />
                      <circle cx="48" cy="18" r="2" fill="#80CBC4" opacity="0.8" />
                      <circle cx="50" cy="16" r="1" fill="#FFB300" />

                      <rect x="62" y="5" width="6" height="26" rx="3" fill="#00796B" />
                      <rect x="62" y="25" width="20" height="6" rx="3" fill="#00796B" />
                      <rect x="78" y="26" width="4" height="4" rx="2" fill="#FFB300" />
                      <circle cx="85" cy="28" r="1" fill="#FFF8E1" />

                      <path
                        d="M90 31 L94 3 Q95 1 96 1 Q97 1 98 3 L102 31 L98 31 L97.5 24 L96.5 24 L96 31 Z"
                        fill="#FFB300"
                      />
                      <rect x="96.5" y="19" width="1" height="4" fill="#FFCA28" />
                      <polygon points="95,3 97,3 96,1" fill="#FFF8E1" />
                      <circle cx="96" cy="8" r="1.5" fill="#FFFDE7" />
                      <polygon points="94,3 98,3 96,0" fill="#FFD54F" opacity="0.7" />
                    </g>
                  </svg>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    mt: 2,
                  }}
                >
                  Emerald & Gold Color Scheme with Fun Letter Designs
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
}
