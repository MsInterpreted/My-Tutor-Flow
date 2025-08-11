import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { MyTutorFlowLogo } from '../components/branding/MyTutorFlowLogo';

/**
 * Logo Showcase Page
 * Displays the official My Tutor Flow logo
 * Shows the consistent branding across the application
 */
const LogoShowcasePage = () => {
  const theme = useTheme();

  const logoInfo = {
    name: "My Tutor Flow Official Logo",
    colors: "Emerald Green & Gold",
    psychology: "Growth, Success, Premium Quality",
    appeal: "Educational professionals, Business owners",
    description: "Official My Tutor Flow branding with emerald green and gold theme",
    hackathonScore: 10,
    recommendation: "🏆 OFFICIAL LOGO - Perfect for all presentations and demos!"
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2, color: theme.colors.text.primary }}>
          My Tutor Flow Logo
        </Typography>
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary, maxWidth: '600px', mx: 'auto' }}>
          Official branding for the My Tutor Flow education management platform
        </Typography>
      </Box>

      {/* Logo Display */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 4 }}>
              <MyTutorFlowLogo size={200} />
            </Box>
            
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                {logoInfo.name}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Chip 
                  label={`Colors: ${logoInfo.colors}`} 
                  sx={{ mr: 1, mb: 1 }} 
                  color="primary" 
                />
                <Chip 
                  label={`Score: ${logoInfo.hackathonScore}/10`} 
                  sx={{ mr: 1, mb: 1 }} 
                  color="success" 
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2, color: theme.colors.text.secondary }}>
                {logoInfo.description}
              </Typography>
              
              <Paper sx={{ p: 2, backgroundColor: theme.colors.background.secondary, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Psychology: {logoInfo.psychology}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Appeal: {logoInfo.appeal}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.success, fontWeight: 600 }}>
                  {logoInfo.recommendation}
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LogoShowcasePage;
