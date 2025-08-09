import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Fab,
  Zoom,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  GetApp as DownloadIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import {
  DashboardMockup,
  StudentManagementMockup,
  BillingMockup,
  AnalyticsMockup,
} from '../components/PitchVisuals';

/**
 * My Tutor Flow Pitch Presentation Page
 * Interactive presentation showcasing platform features and benefits
 */
const PitchPresentationPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const presentationSteps = [
    {
      title: '🎯 The Problem We Solve',
      subtitle: 'Tutoring businesses face critical challenges',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.status.error + '10', border: `1px solid ${theme.colors.status.error}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: theme.colors.status.error, mb: 2 }}>
                  😰 Administrative Chaos
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Scattered student data across spreadsheets
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Hours spent on manual billing processes
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Lost revenue from missed sessions
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  • No business insights for growth
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.status.warning + '10', border: `1px solid ${theme.colors.status.warning}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: theme.colors.status.warning, mb: 2 }}>
                  💰 Financial Challenges
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Complex multi-currency billing
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Difficulty tracking payments
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Revenue leakage from unbilled sessions
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  • No profitability insights
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: '💡 Our Solution: My Tutor Flow',
      subtitle: 'Comprehensive SaaS platform for modern tutoring businesses',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}` }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h4" sx={{ color: theme.colors.brand.primary, mb: 3, fontWeight: 700 }}>
                  "From scattered spreadsheets to streamlined success"
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
                  My Tutor Flow turns tutoring chaos into organized growth
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h5" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      ⏱️ 10+ Hours
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                      Saved Weekly
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h5" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      💰 25% More
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                      Revenue
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h5" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      📱 Mobile-First
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                      Design
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h5" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      🌍 Global Ready
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                      Multi-Currency
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: '📊 Dashboard & Analytics',
      subtitle: 'Real-time insights and business intelligence',
      content: <DashboardMockup />,
    },
    {
      title: '👥 Student Management',
      subtitle: 'Comprehensive student profiles and tracking',
      content: <StudentManagementMockup />,
    },
    {
      title: '💰 Intelligent Billing',
      subtitle: 'Multi-currency billing with automated invoicing',
      content: <BillingMockup />,
    },
    {
      title: '📈 Business Intelligence',
      subtitle: 'Data-driven insights for growth',
      content: <AnalyticsMockup />,
    },
    {
      title: '🎯 Market Opportunity',
      subtitle: 'Massive market with clear growth potential',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.status.success + '10' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, mb: 2 }}>
                  📊 Market Size
                </Typography>
                <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700, mb: 1 }}>
                  R2.5 Billion
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
                  South African tutoring market annually
                </Typography>
                <Typography variant="h5" sx={{ color: theme.colors.brand.primary, fontWeight: 700, mb: 1 }}>
                  $7.8 Billion
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                  Global online tutoring market (15% annual growth)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.brand.primary + '10' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: theme.colors.brand.primary, mb: 2 }}>
                  🎯 Target Market
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • 50,000+ active tutors in South Africa
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • 5,000+ tutoring centers
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Growing international online market
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.status.warning, fontWeight: 700 }}>
                  R25M Revenue Target
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  5% market share in 3 years
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: '💳 Pricing & Business Model',
      subtitle: 'Scalable subscription tiers for every business size',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.colors.background.primary, border: `1px solid ${theme.colors.text.secondary}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  🌱 STARTER
                </Typography>
                <Typography variant="h3" sx={{ color: theme.colors.status.success, fontWeight: 700, mb: 1 }}>
                  R299
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                  per month
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • 1-15 students
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Basic billing
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Mobile app access
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  • Email support
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: theme.colors.brand.primary, mb: 2 }}>
                  🚀 PROFESSIONAL
                </Typography>
                <Typography variant="h3" sx={{ color: theme.colors.brand.primary, fontWeight: 700, mb: 1 }}>
                  R599
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                  per month
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • 16-50 students
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Multi-currency support
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Advanced analytics
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  • Priority support
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: theme.colors.background.primary, border: `1px solid ${theme.colors.text.secondary}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  🏢 ENTERPRISE
                </Typography>
                <Typography variant="h3" sx={{ color: theme.colors.status.warning, fontWeight: 700, mb: 1 }}>
                  R1,299
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
                  per month
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • 50+ students
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Multi-tutor management
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                  • Custom branding
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  • Dedicated support
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: '🚀 Call to Action',
      subtitle: 'Ready to transform your tutoring business?',
      content: (
        <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}` }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" sx={{ color: theme.colors.brand.primary, mb: 3, fontWeight: 700 }}>
              Join the Future of Tutoring
            </Typography>
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 4 }}>
              Don't let administrative chaos hold back your teaching passion
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                  🎁 50% Off
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                  First 6 Months
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                  🔄 Free Migration
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                  From Existing Systems
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                  👨‍💼 Dedicated Support
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                  Personal Success Manager
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                  💯 30-Day Guarantee
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
                  Risk-Free Trial
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: theme.colors.brand.primary,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                📞 Book Free Demo
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: theme.colors.brand.primary,
                  color: theme.colors.brand.primary,
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                📧 Get Started Today
              </Button>
            </Box>

            <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mt: 3 }}>
              📞 +27 87 470 0000 | 📧 hello@mytutorflow.com | 🌐 www.mytutorflow.com
            </Typography>
          </CardContent>
        </Card>
      ),
    },
  ];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDownloadPitch = () => {
    // Create a link to download the pitch document
    const link = document.createElement('a');
    link.href = '/MY_TUTOR_FLOW_PITCH_DOCUMENT.md';
    link.download = 'My_Tutor_Flow_Pitch_Document.md';
    link.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          backgroundColor: theme.colors.brand.primary,
          color: 'white',
          textAlign: 'center',
          borderRadius: '16px',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          🎓 MY TUTOR FLOW
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          Comprehensive Pitch Presentation
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          Transforming Tutoring Businesses Through Technology
        </Typography>
      </Paper>

      {/* Presentation Content */}
      <Box sx={{ mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
          <Typography variant="h4" sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 700 }}>
            {presentationSteps[activeStep].title}
          </Typography>
          <Typography variant="h6" sx={{ color: theme.colors.text.secondary, mb: 4 }}>
            {presentationSteps[activeStep].subtitle}
          </Typography>
          
          {presentationSteps[activeStep].content}
        </Paper>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
          startIcon={<PrevIcon />}
          variant="outlined"
          size="large"
        >
          Previous
        </Button>
        
        <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
          {activeStep + 1} of {presentationSteps.length}
        </Typography>
        
        <Button
          onClick={handleNext}
          disabled={activeStep === presentationSteps.length - 1}
          endIcon={<NextIcon />}
          variant="contained"
          size="large"
          sx={{ backgroundColor: theme.colors.brand.primary }}
        >
          Next
        </Button>
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={(activeStep + 1) / presentationSteps.length * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.background.secondary,
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.colors.brand.primary,
            },
          }}
        />
      </Box>

      {/* Download Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            backgroundColor: theme.colors.brand.primary,
          }}
          onClick={handleDownloadPitch}
        >
          <DownloadIcon />
        </Fab>
      </Zoom>
    </Container>
  );
};

export default PitchPresentationPage;
