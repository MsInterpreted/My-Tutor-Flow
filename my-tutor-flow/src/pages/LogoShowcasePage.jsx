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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as PreviewIcon,
  CheckCircle as SelectIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { 
  LogoShowcase,
  LogoVariant1,
  LogoVariant2,
  LogoVariant3,
  LogoVariant4,
  LogoVariant5,
  LogoVariant6,
  LogoVariant7,
  LogoVariant8,
  LogoVariant9,
  LogoVariant10,
} from '../components/branding/MyTutorFlowLogoVariants';

/**
 * Logo Showcase Page
 * Displays all 10 My Tutor Flow logo variants for selection
 * Includes color psychology analysis and hackathon recommendations
 */
const LogoShowcasePage = () => {
  const theme = useTheme();
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(null);

  const logoVariants = [
    {
      id: 1,
      component: LogoVariant1,
      name: "Tech Innovation",
      colors: "Blue-Purple Gradient",
      psychology: "Trust, Innovation, Technology",
      appeal: "Tech-savvy users, Investors",
      description: "Conveys cutting-edge technology and innovation",
      hackathonScore: 9,
      recommendation: "Excellent for Solana Mobile Hackathon - shows tech innovation"
    },
    {
      id: 2,
      component: LogoVariant2,
      name: "Success & Growth",
      colors: "Green-Emerald",
      psychology: "Growth, Success, Prosperity",
      appeal: "Business owners, Entrepreneurs",
      description: "Emphasizes business growth and educational success",
      hackathonScore: 8,
      recommendation: "Great for business-focused pitch, shows growth potential"
    },
    {
      id: 3,
      component: LogoVariant3,
      name: "Trust & Reliability",
      colors: "Navy-Blue",
      psychology: "Trust, Professionalism, Stability",
      appeal: "Educational institutions, Parents",
      description: "Projects reliability and professional competence",
      hackathonScore: 7,
      recommendation: "Solid choice for institutional credibility"
    },
    {
      id: 4,
      component: LogoVariant4,
      name: "Energy & Innovation",
      colors: "Orange-Red",
      psychology: "Energy, Enthusiasm, Action",
      appeal: "Young entrepreneurs, Startups",
      description: "Dynamic and energetic, perfect for disruption",
      hackathonScore: 8,
      recommendation: "High energy, perfect for startup competition"
    },
    {
      id: 5,
      component: LogoVariant5,
      name: "Premium & Luxury",
      colors: "Purple-Gold",
      psychology: "Luxury, Premium, Excellence",
      appeal: "High-end market, Premium services",
      description: "Positions as premium educational technology",
      hackathonScore: 9,
      recommendation: "Premium positioning, impressive for judges"
    },
    {
      id: 6,
      component: LogoVariant6,
      name: "Fresh & Modern",
      colors: "Cyan-Teal",
      psychology: "Freshness, Clarity, Modern",
      appeal: "Modern educators, Digital natives",
      description: "Clean, modern approach to education technology",
      hackathonScore: 8,
      recommendation: "Modern and clean, appeals to digital natives"
    },
    {
      id: 7,
      component: LogoVariant7,
      name: "Creativity & Inspiration",
      colors: "Pink-Purple",
      psychology: "Creativity, Inspiration, Innovation",
      appeal: "Creative educators, Art schools",
      description: "Inspires creativity and innovative thinking",
      hackathonScore: 7,
      recommendation: "Creative approach, good for innovation focus"
    },
    {
      id: 8,
      component: LogoVariant8,
      name: "Stability & Excellence",
      colors: "Dark Gray-Silver",
      psychology: "Stability, Excellence, Authority",
      appeal: "Traditional institutions, Corporate",
      description: "Projects authority and institutional excellence",
      hackathonScore: 6,
      recommendation: "Conservative but authoritative"
    },
    {
      id: 9,
      component: LogoVariant9,
      name: "Warmth & Approachability",
      colors: "Warm Orange-Yellow",
      psychology: "Warmth, Friendliness, Accessibility",
      appeal: "Community tutors, Family-oriented",
      description: "Welcoming and approachable for all users",
      hackathonScore: 7,
      recommendation: "Friendly and approachable, good for community focus"
    },
    {
      id: 10,
      component: LogoVariant10,
      name: "Future & Innovation",
      colors: "Holographic Multi-color",
      psychology: "Future, Innovation, Cutting-edge",
      appeal: "Tech enthusiasts, Early adopters",
      description: "Represents the future of education technology",
      hackathonScore: 10,
      recommendation: "🏆 TOP CHOICE: Futuristic, perfect for Solana Mobile!"
    }
  ];

  const handlePreview = (logo) => {
    setPreviewLogo(logo);
    setPreviewOpen(true);
  };

  const handleSelect = (logo) => {
    setSelectedLogo(logo);
  };

  const getScoreColor = (score) => {
    if (score >= 9) return theme.colors.status.success;
    if (score >= 7) return theme.colors.status.warning;
    return theme.colors.status.info;
  };

  const topRecommendations = logoVariants
    .filter(logo => logo.hackathonScore >= 9)
    .sort((a, b) => b.hackathonScore - a.hackathonScore);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.colors.brand.primary}, #50C878)`,
          color: 'white',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          🎨 My Tutor Flow Logo Variants
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          10 Professional Designs with Strategic Color Psychology
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Choose the perfect logo for your Solana Mobile Hackathon presentation
        </Typography>
      </Paper>

      {/* Top Recommendations */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: theme.colors.status.success + '10' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: theme.colors.status.success }}>
          🏆 Top Hackathon Recommendations
        </Typography>
        <Grid container spacing={2}>
          {topRecommendations.map((logo) => (
            <Grid item xs={12} sm={6} key={logo.id}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.primary,
                border: `2px solid ${theme.colors.status.success}`,
              }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    <logo.component size={60} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {logo.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                      {logo.recommendation}
                    </Typography>
                    <Chip 
                      label={`Score: ${logo.hackathonScore}/10`}
                      size="small"
                      sx={{ backgroundColor: getScoreColor(logo.hackathonScore) + '20' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* All Logo Variants */}
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
        All Logo Variants
      </Typography>

      <Grid container spacing={3}>
        {logoVariants.map((logo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={logo.id}>
            <Card sx={{ 
              height: '100%', 
              backgroundColor: theme.colors.background.primary,
              border: selectedLogo?.id === logo.id 
                ? `3px solid ${theme.colors.brand.primary}` 
                : `2px solid ${theme.colors.background.secondary}`,
              '&:hover': {
                border: `2px solid ${theme.colors.brand.primary}`,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                {/* Logo Display */}
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                  <logo.component size={80} />
                </Box>
                
                {/* Logo Info */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem' }}>
                  {logo.name}
                </Typography>
                
                <Chip 
                  label={logo.colors} 
                  size="small" 
                  sx={{ mb: 2, backgroundColor: theme.colors.brand.primary + '20', fontSize: '0.7rem' }}
                />
                
                {/* Hackathon Score */}
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Hackathon Score: ${logo.hackathonScore}/10`}
                    size="small"
                    sx={{ 
                      backgroundColor: getScoreColor(logo.hackathonScore) + '20',
                      color: getScoreColor(logo.hackathonScore),
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                {/* Psychology */}
                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  mb: 1, 
                  fontWeight: 600,
                  color: theme.colors.text.primary 
                }}>
                  Psychology: {logo.psychology}
                </Typography>
                
                {/* Appeal */}
                <Typography variant="caption" sx={{ 
                  display: 'block', 
                  mb: 2, 
                  color: theme.colors.text.secondary 
                }}>
                  Appeals to: {logo.appeal}
                </Typography>
                
                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={() => handlePreview(logo)}
                    sx={{ fontSize: '0.7rem' }}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    variant={selectedLogo?.id === logo.id ? "contained" : "outlined"}
                    startIcon={<SelectIcon />}
                    onClick={() => handleSelect(logo)}
                    sx={{ 
                      fontSize: '0.7rem',
                      backgroundColor: selectedLogo?.id === logo.id ? theme.colors.brand.primary : 'transparent'
                    }}
                  >
                    {selectedLogo?.id === logo.id ? "Selected" : "Select"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Selection Summary */}
      {selectedLogo && (
        <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: theme.colors.brand.primary + '10' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.colors.brand.primary }}>
            🎯 Your Selection: {selectedLogo.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {selectedLogo.description}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
            <strong>Hackathon Recommendation:</strong> {selectedLogo.recommendation}
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ backgroundColor: theme.colors.brand.primary }}
          >
            Use This Logo in Hackathon Pitch
          </Button>
        </Paper>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          {previewLogo?.name} - Large Preview
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          {previewLogo && (
            <Box>
              <previewLogo.component size={200} />
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                {previewLogo.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {previewLogo.description}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Hackathon Recommendation:</strong> {previewLogo.recommendation}
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              handleSelect(previewLogo);
              setPreviewOpen(false);
            }}
            sx={{ backgroundColor: theme.colors.brand.primary }}
          >
            Select This Logo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LogoShowcasePage;
