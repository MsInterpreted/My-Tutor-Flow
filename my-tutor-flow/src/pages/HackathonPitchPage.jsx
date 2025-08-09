import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Fab,
  Zoom,
  Avatar,
  Chip,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Phone as PhoneIcon,
  TouchApp as TouchIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  AccountBalance as CryptoIcon,
  School as EducationIcon,
  TrendingUp as GrowthIcon,
  PhoneAndroid as MobileIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import MobileScreenshots from '../components/MobileScreenshots';
import { HackathonLogo } from '../components/branding/CustomMyTutorFlowLogo';
import { BonkLogo, AnimatedBonkLogo, FloatingBonkLogo } from '../components/branding/BonkLogo';
import SolanaWalletButton from '../components/wallet/SolanaWalletButton';
import PresentationExporter from '../components/presentation/PresentationExporter';

/**
 * Solana Mobile Hackathon Pitch Presentation
 * 4-minute pitch focusing on mobile-first education platform
 */
const HackathonPitchPage = () => {
  const theme = useTheme();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(240); // 4 minutes

  // Auto-advance slides for 4-minute presentation
  useEffect(() => {
    let interval;
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        // Auto-advance slides every 30 seconds
        if (timeRemaining % 30 === 0 && activeSlide < slides.length - 1) {
          setActiveSlide(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, activeSlide]);

  const slides = [
    {
      id: 'intro',
      title: '🎓 My Tutor Flow',
      subtitle: 'Mobile-First Education Platform for the Solana Ecosystem',
      duration: 30,
      content: (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <HackathonLogo />
            </Box>

            <Typography variant="h5" sx={{ color: theme.colors.text.secondary, mb: 4 }}>
              Revolutionizing Education Through Mobile-First Design
            </Typography>
          </Box>
          
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <MobileIcon sx={{ fontSize: 48, color: theme.colors.brand.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    Mobile-First
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Built for Solana Mobile ecosystem
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.status.success + '10', border: `2px solid ${theme.colors.status.success}` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EducationIcon sx={{ fontSize: 48, color: theme.colors.status.success, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    Education Focus
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Transforming tutoring businesses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.status.warning + '10', border: `2px solid ${theme.colors.status.warning}` }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CryptoIcon sx={{ fontSize: 48, color: theme.colors.status.warning, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    Crypto-Ready
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Future Solana integration
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'problem',
      title: '🔍 The Problem',
      subtitle: 'Education Technology is Broken for Mobile Users',
      duration: 45,
      content: (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.status.error + '10', border: `2px solid ${theme.colors.status.error}`, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: theme.colors.status.error, mb: 3, fontWeight: 600 }}>
                  📱 Mobile Education Crisis
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Current Pain Points:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.colors.status.error, mr: 2 }} />
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      Desktop-only education platforms
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.colors.status.error, mr: 2 }} />
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      Complex payment systems
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.colors.status.error, mr: 2 }} />
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      No real-time mobile analytics
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.colors.status.error, mr: 2 }} />
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      Scattered administrative tools
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: theme.colors.status.info + '10', border: `2px solid ${theme.colors.status.info}`, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: theme.colors.status.info, mb: 3, fontWeight: 600 }}>
                  📊 Market Opportunity
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: theme.colors.background.primary, borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                        170K+
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                        Solana Mobile Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: theme.colors.background.primary, borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                        $7.8B
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                        EdTech Market
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: theme.colors.background.primary, borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ color: theme.colors.status.warning, fontWeight: 700 }}>
                        85%
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                        Mobile Usage
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: theme.colors.background.primary, borderRadius: '12px' }}>
                      <Typography variant="h4" sx={{ color: theme.colors.status.error, fontWeight: 700 }}>
                        0
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                        Mobile-First Solutions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      id: 'solution',
      title: '💡 Our Solution',
      subtitle: 'Mobile-First Education Platform Built for Solana Ecosystem',
      duration: 60,
      content: (
        <Box>
          <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}`, mb: 4 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h4" sx={{ color: theme.colors.brand.primary, mb: 3, fontWeight: 700 }}>
                "From Scattered Spreadsheets to Streamlined Success"
              </Typography>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
                The first mobile-native education management platform designed for the Solana ecosystem
              </Typography>
            </CardContent>
          </Card>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: theme.colors.background.primary, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TouchIcon sx={{ fontSize: 48, color: theme.colors.brand.primary, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Touch-First UI
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Optimized for mobile interactions with 48px touch targets
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: theme.colors.background.primary, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SpeedIcon sx={{ fontSize: 48, color: theme.colors.status.success, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Lightning Fast
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Sub-second load times with offline-first architecture
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: theme.colors.background.primary, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SecurityIcon sx={{ fontSize: 48, color: theme.colors.status.warning, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Crypto-Ready
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Built for future Solana wallet integration
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: theme.colors.background.primary, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <GrowthIcon sx={{ fontSize: 48, color: theme.colors.status.info, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    Scalable
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    From individual tutors to education enterprises
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'mobile-features',
      title: '📱 Mobile-First Features',
      subtitle: 'Built for the Solana Mobile Experience',
      duration: 75,
      content: (
        <Box>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <MobileScreenshots />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
                borderRadius: '20px',
                p: 3,
                color: 'white'
              }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  🐕 BONK Integration
                </Typography>
                <FloatingBonkLogo size="large" variant="linear" />
                <Typography variant="body1" sx={{ mt: 2, opacity: 0.9 }}>
                  First education platform to support BONK payments
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  Community-driven crypto for accessible education
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'demo',
      title: '🎬 Live Demo',
      subtitle: 'See My Tutor Flow in Action',
      duration: 45,
      content: (
        <Box sx={{ textAlign: 'center' }}>
          <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}`, mb: 4 }}>
            <CardContent sx={{ py: 6 }}>
              <MobileIcon sx={{ fontSize: 80, color: theme.colors.brand.primary, mb: 3 }} />
              <Typography variant="h4" sx={{ color: theme.colors.brand.primary, mb: 3, fontWeight: 700 }}>
                Mobile Demo
              </Typography>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 4 }}>
                Experience the mobile-first education platform
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayIcon />}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                  onClick={() => window.open('http://localhost:3000', '_blank')}
                >
                  Launch Live Demo
                </Button>

                <SolanaWalletButton
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                />

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderColor: theme.colors.status.error,
                    color: theme.colors.status.error,
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: theme.colors.status.error + '10',
                    }
                  }}
                  onClick={() => window.open('/presentations/My_Tutor_Flow_Hackathon_Slides.html', '_blank')}
                >
                  📄 View Slides
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#FF6B35',
                    color: '#FF6B35',
                    px: 4,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    border: '2px solid #FF6B35',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      backgroundColor: '#FF6B3510',
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => window.open('/bonk-showcase', '_blank')}
                >
                  <BonkLogo size="small" variant="logoOnly" sx={{ width: 24, height: 24 }} />
                  BONK Demo
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.background.primary }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    📱 Mobile Dashboard
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Real-time analytics optimized for mobile screens
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.background.primary }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    💰 Quick Billing
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    One-tap invoice generation and payment tracking
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ backgroundColor: theme.colors.background.primary }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                    📊 Touch Analytics
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Swipe through student progress and insights
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ),
    },
    {
      id: 'ask',
      title: '🏆 The Ask',
      subtitle: 'Join Us in Revolutionizing Mobile Education',
      duration: 15,
      content: (
        <Box sx={{ textAlign: 'center' }}>
          <Card sx={{ backgroundColor: theme.colors.brand.primary + '10', border: `2px solid ${theme.colors.brand.primary}`, mb: 4 }}>
            <CardContent sx={{ py: 6 }}>
              <Typography variant="h3" sx={{ color: theme.colors.brand.primary, mb: 3, fontWeight: 700 }}>
                🎯 Ready to Win
              </Typography>
              <Typography variant="h5" sx={{ color: theme.colors.text.primary, mb: 4 }}>
                My Tutor Flow is the mobile-first education platform the Solana ecosystem needs
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, backgroundColor: theme.colors.status.success + '10', borderRadius: '12px' }}>
                    <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      ✅
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, mt: 2 }}>
                      Mobile-Native
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Built for Solana Mobile from day one
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, backgroundColor: theme.colors.status.success + '10', borderRadius: '12px' }}>
                    <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      ✅
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, mt: 2 }}>
                      Market Ready
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Addressing real pain points today
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, backgroundColor: theme.colors.status.success + '10', borderRadius: '12px' }}>
                    <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                      ✅
                    </Typography>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, mt: 2 }}>
                      Crypto Future
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Ready for Solana integration
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h4" sx={{ color: theme.colors.brand.primary, mb: 2, fontWeight: 700 }}>
                Let's Transform Education Together
              </Typography>
              <Typography variant="body1" sx={{ color: theme.colors.text.secondary, mb: 4 }}>
                Contact: hello@mytutorflow.com | Demo: mytutorflow.com
              </Typography>
            </CardContent>
          </Card>
        </Box>
      ),
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    }
  };

  const handlePrev = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const togglePresentation = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
          🎓 My Tutor Flow - Solana Mobile Hackathon
        </Typography>
        <Typography variant="h5" sx={{ mb: 2, opacity: 0.9 }}>
          4-Minute Pitch Presentation
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={`${formatTime(timeRemaining)} remaining`}
            sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
          />
          <Button
            variant="contained"
            onClick={togglePresentation}
            startIcon={<PlayIcon />}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            {isPlaying ? 'Pause' : 'Start'} Presentation
          </Button>
        </Box>
      </Paper>

      {/* Slide Content */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: '16px', mb: 4, minHeight: '600px' }}>
        <Typography variant="h4" sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 700 }}>
          {slides[activeSlide].title}
        </Typography>
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary, mb: 4 }}>
          {slides[activeSlide].subtitle}
        </Typography>
        
        {slides[activeSlide].content}
      </Paper>

      {/* Navigation */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Button
          onClick={handlePrev}
          disabled={activeSlide === 0}
          startIcon={<PrevIcon />}
          variant="outlined"
          size="large"
        >
          Previous
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
            {activeSlide + 1} of {slides.length}
          </Typography>
          <Chip 
            label={`${slides[activeSlide].duration}s`}
            size="small"
            sx={{ backgroundColor: theme.colors.brand.primary + '20' }}
          />
        </Box>
        
        <Button
          onClick={handleNext}
          disabled={activeSlide === slides.length - 1}
          endIcon={<NextIcon />}
          variant="contained"
          size="large"
          sx={{ backgroundColor: theme.colors.brand.primary }}
        >
          Next
        </Button>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={(activeSlide + 1) / slides.length * 100}
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

      {/* Slide Thumbnails */}
      <Grid container spacing={2}>
        {slides.map((slide, index) => (
          <Grid item xs={12} sm={6} md={2} key={slide.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: activeSlide === index ? `2px solid ${theme.colors.brand.primary}` : '1px solid transparent',
                backgroundColor: activeSlide === index ? theme.colors.brand.primary + '10' : theme.colors.background.primary,
              }}
              onClick={() => setActiveSlide(index)}
            >
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  {slide.title}
                </Typography>
                <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                  {slide.duration}s
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Presentation Export */}
      <Box sx={{ mt: 4 }}>
        <PresentationExporter slides={slides} title="My Tutor Flow - Solana Mobile Hackathon" />
      </Box>
    </Container>
  );
};

export default HackathonPitchPage;
