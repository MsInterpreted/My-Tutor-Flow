import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CheckCircle as SelectIcon,
  Psychology as PsychologyIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { MyTutorFlowLogo } from '../components/branding/MyTutorFlowLogo';

/**
 * Text Logo Showcase Page
 * Displays the custom "My Tutor Flow" text logo with graduation cap
 * Features emerald green and gold color psychology
 */
const TextLogoShowcasePage = () => {
  const theme = useTheme();
  const [selectedVariant, setSelectedVariant] = useState('hackathon');

  const logoVariants = [
    {
      id: 'official',
      name: 'Official Logo',
      component: MyTutorFlowLogo,
      description: 'Official My Tutor Flow logo with emerald green and gold theme',
      useCase: 'All presentations, marketing materials, and branding',
      size: 'Scalable (80px - 200px)',
      recommended: true,
    },
  ];

  const colorPsychology = [
    {
      color: 'Emerald Green',
      hex: '#10B981',
      psychology: 'Growth, Success, Prosperity',
      impact: 'Conveys business growth and educational success',
      emotion: 'Trust, Stability, Natural progression',
    },
    {
      color: 'Deep Emerald',
      hex: '#047857',
      psychology: 'Reliability, Professionalism, Depth',
      impact: 'Projects authority and institutional credibility',
      emotion: 'Confidence, Security, Expertise',
    },
    {
      color: 'Gold',
      hex: '#FFD700',
      psychology: 'Excellence, Achievement, Premium Quality',
      impact: 'Represents academic achievement and premium service',
      emotion: 'Success, Prestige, Accomplishment',
    },
  ];

  const designFeatures = [
    {
      feature: 'Modern Typography',
      description: 'Clean, professional Inter font family with optimized letter spacing',
      benefit: 'Excellent readability across all devices and sizes',
    },
    {
      feature: 'Gradient Text Effect',
      description: 'Emerald green gradient creates depth and visual interest',
      benefit: 'Memorable and distinctive brand appearance',
    },
    {
      feature: 'Detailed Graduation Cap',
      description: 'Hand-crafted SVG with realistic proportions and gold tassel',
      benefit: 'Clear education focus with premium positioning',
    },
    {
      feature: 'Scalable Design',
      description: 'Vector-based logo maintains quality at any size',
      benefit: 'Perfect for everything from business cards to billboards',
    },
    {
      feature: 'Subtle Animations',
      description: 'Optional floating and bounce effects for digital use',
      benefit: 'Engaging and modern for presentations and web use',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, #10B981, #047857)`,
          color: 'white',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          🎓 My Tutor Flow Text Logo
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          Modern & Memorable Design with Strategic Color Psychology
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Emerald Green for Growth & Success • Gold for Excellence & Achievement
        </Typography>
      </Paper>

      {/* Main Logo Display */}
      <Paper elevation={2} sx={{ p: 4, mb: 4, textAlign: 'center', backgroundColor: '#F8FAFC' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: theme.colors.text.primary }}>
          🏆 Recommended for Hackathon
        </Typography>
        <Box sx={{ mb: 3 }}>
          <MyTutorFlowLogo size={200} />
        </Box>
        <Alert severity="success" sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            Perfect for Solana Mobile Hackathon presentations!
          </Typography>
          <Typography variant="body2">
            The emerald green conveys growth and innovation, while gold represents excellence and achievement - 
            ideal psychology for impressing judges and investors.
          </Typography>
        </Alert>
      </Paper>

      {/* Color Psychology Analysis */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PsychologyIcon sx={{ mr: 2, color: theme.colors.brand.primary, fontSize: 32 }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: theme.colors.text.primary }}>
            Color Psychology Strategy
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {colorPsychology.map((color, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', backgroundColor: theme.colors.background.primary }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        mr: 2,
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {color.color}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, color: theme.colors.text.primary }}>
                    Psychology: {color.psychology}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                    {color.impact}
                  </Typography>
                  
                  <Chip 
                    label={color.emotion}
                    size="small"
                    sx={{ backgroundColor: color.hex + '20', color: color.hex, fontWeight: 600 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Logo Variants */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: theme.colors.text.primary }}>
          📐 Available Sizes & Variants
        </Typography>
        
        <Grid container spacing={3}>
          {logoVariants.map((variant) => (
            <Grid item xs={12} sm={6} md={4} key={variant.id}>
              <Card sx={{ 
                height: '100%', 
                backgroundColor: theme.colors.background.primary,
                border: variant.recommended ? `3px solid #10B981` : `2px solid ${theme.colors.background.secondary}`,
                position: 'relative',
              }}>
                {variant.recommended && (
                  <Chip
                    label="🏆 RECOMMENDED"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: '#10B981',
                      color: 'white',
                      fontWeight: 700,
                      zIndex: 1,
                    }}
                  />
                )}
                
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 3, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <variant.component />
                  </Box>
                  
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {variant.name}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                    {variant.description}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mb: 2, 
                    fontWeight: 600,
                    color: theme.colors.text.primary 
                  }}>
                    {variant.size}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ 
                    display: 'block', 
                    mb: 3, 
                    color: theme.colors.text.secondary,
                    fontStyle: 'italic',
                  }}>
                    Use for: {variant.useCase}
                  </Typography>
                  
                  <Button
                    variant={selectedVariant === variant.id ? "contained" : "outlined"}
                    size="small"
                    startIcon={<SelectIcon />}
                    onClick={() => setSelectedVariant(variant.id)}
                    sx={{
                      backgroundColor: selectedVariant === variant.id ? '#10B981' : 'transparent',
                      borderColor: '#10B981',
                      color: selectedVariant === variant.id ? 'white' : '#10B981',
                      '&:hover': {
                        backgroundColor: selectedVariant === variant.id ? '#059669' : '#10B981' + '10',
                      }
                    }}
                  >
                    {selectedVariant === variant.id ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Design Features */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: theme.colors.text.primary }}>
          ✨ Design Features & Benefits
        </Typography>
        
        <Grid container spacing={3}>
          {designFeatures.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ p: 3, backgroundColor: theme.colors.background.secondary, borderRadius: '12px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#10B981' }}>
                  {feature.feature}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: theme.colors.text.primary }}>
                  {feature.description}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, fontStyle: 'italic' }}>
                  ✓ {feature.benefit}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Usage Guidelines */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: theme.colors.text.primary }}>
          📋 Usage Guidelines
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#10B981' }}>
              ✅ Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Use on light backgrounds for optimal contrast
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Maintain minimum size of 60px height for readability
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Keep adequate white space around the logo
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Use Hackathon variant for presentations and pitches
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Animated version works great for digital presentations
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#DC2626' }}>
              ❌ Avoid These Mistakes
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't use on dark backgrounds without adjustment
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't stretch or distort the proportions
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't change the colors or gradients
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't use below 60px height (text becomes unreadable)
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Don't add additional effects or filters
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Implementation Ready */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          background: `linear-gradient(135deg, #10B981, #047857)`,
          color: 'white',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          🚀 Ready for Implementation!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Your modern, memorable My Tutor Flow logo is ready to impress hackathon judges
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<VisibilityIcon />}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
            onClick={() => window.open('/hackathon-pitch', '_blank')}
          >
            View in Hackathon Pitch
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            sx={{
              backgroundColor: '#FFD700',
              color: '#047857',
              fontWeight: 700,
              '&:hover': { backgroundColor: '#FFA500' }
            }}
          >
            Use This Logo
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TextLogoShowcasePage;
