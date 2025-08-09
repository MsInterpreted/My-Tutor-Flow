import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Pets as BonkIcon,
  School as EducationIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import BonkPaymentShowcase from '../components/wallet/BonkPaymentShowcase';
import CryptoPaymentModal from '../components/wallet/CryptoPaymentModal';
import { BonkLogo, FloatingBonkLogo, AnimatedBonkLogo } from '../components/branding/BonkLogo';
import { TOKENS } from '../config/solanaTokens';

/**
 * BONK Showcase Page
 * Demonstrates BONK token integration for Solana Mobile Hackathon
 */
const BonkShowcasePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudent] = useState({
    id: 'demo-student',
    name: 'Alex Johnson',
    grade: 'Grade 10',
    subjects: ['Mathematics', 'Physics']
  });

  const handlePayWithBonk = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('BONK Payment successful:', paymentData);
    setPaymentModalOpen(false);
  };

  const bonkStats = [
    {
      label: 'Transaction Speed',
      value: '< 1 second',
      icon: <SpeedIcon sx={{ color: TOKENS.BONK.color }} />,
    },
    {
      label: 'Network Fees',
      value: '~$0.001',
      icon: <BonkIcon sx={{ color: TOKENS.BONK.color }} />,
    },
    {
      label: 'Education Focus',
      value: 'Community Driven',
      icon: <EducationIcon sx={{ color: TOKENS.BONK.color }} />,
    },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.background.primary}, ${theme.colors.background.secondary})`,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate(-1)}
            sx={{ 
              mb: 3,
              color: theme.colors.text.secondary,
              '&:hover': {
                backgroundColor: theme.colors.background.secondary,
              }
            }}
          >
            Back to App
          </Button>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
              <BonkLogo size="large" variant="logoOnly" />
              <Typography variant="h2" sx={{
                fontWeight: 800,
                background: TOKENS.BONK.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                BONK Payments
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ 
              color: theme.colors.text.secondary,
              fontWeight: 500,
              mb: 3
            }}>
              The First Solana Dog Coin for Education
            </Typography>
            
            <Chip
              label="🏆 Solana Mobile Hackathon Feature"
              sx={{
                background: TOKENS.BONK.gradient,
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                py: 3,
                px: 2,
              }}
            />
          </Box>
        </Box>

        {/* Hero Section */}
        <Card sx={{ 
          background: TOKENS.BONK.gradient,
          color: 'white',
          mb: 4,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <CardContent sx={{ py: 6, position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  mb: 3,
                  lineHeight: 1.2
                }}>
                  Education Payments Made Fun with BONK
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.9, 
                  mb: 4,
                  lineHeight: 1.6
                }}>
                  My Tutor Flow integrates BONK token to make education payments accessible, 
                  fast, and community-driven. Perfect for the Solana Mobile ecosystem.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<BonkIcon />}
                  onClick={handlePayWithBonk}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Try BONK Payment Demo
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <FloatingBonkLogo size="hero" variant="linear" />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {bonkStats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ 
                backgroundColor: theme.colors.background.secondary,
                border: `2px solid ${TOKENS.BONK.color}20`,
                height: '100%',
                '&:hover': {
                  borderColor: TOKENS.BONK.color,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease',
                }
              }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800,
                    color: TOKENS.BONK.color,
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.colors.text.secondary,
                    fontWeight: 600
                  }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* BONK Payment Showcase */}
        <BonkPaymentShowcase onPayWithBonk={handlePayWithBonk} />

        {/* Why BONK for Education */}
        <Card sx={{ backgroundColor: theme.colors.background.secondary, mt: 4 }}>
          <CardContent sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 800,
              color: theme.colors.text.primary,
              mb: 3,
              textAlign: 'center'
            }}>
              Why BONK for Education? 🎓
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: TOKENS.BONK.color,
                    mb: 2
                  }}>
                    🌍 Community-Driven
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.colors.text.secondary,
                    lineHeight: 1.6
                  }}>
                    BONK represents the community spirit of Solana. By integrating BONK payments, 
                    My Tutor Flow makes education accessible to the entire Solana ecosystem, 
                    not just traditional finance users.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: TOKENS.BONK.color,
                    mb: 2
                  }}>
                    ⚡ Lightning Fast
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.colors.text.secondary,
                    lineHeight: 1.6
                  }}>
                    Built on Solana's high-performance blockchain, BONK payments settle in 
                    under a second with minimal fees, perfect for mobile education payments.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: TOKENS.BONK.color,
                    mb: 2
                  }}>
                    📱 Mobile-First
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.colors.text.secondary,
                    lineHeight: 1.6
                  }}>
                    BONK's integration with Solana Mobile Wallet Adapter makes it perfect for 
                    mobile-first education platforms, enabling seamless payments on the go.
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: TOKENS.BONK.color,
                    mb: 2
                  }}>
                    🎯 Innovation Showcase
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.colors.text.secondary,
                    lineHeight: 1.6
                  }}>
                    This integration demonstrates My Tutor Flow's ability to support any SPL token, 
                    showcasing the platform's flexibility and innovation for the hackathon judges.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ my: 4 }} />

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 800,
            color: theme.colors.text.primary,
            mb: 2
          }}>
            Ready to Transform Education with BONK?
          </Typography>
          <Typography variant="h6" sx={{ 
            color: theme.colors.text.secondary,
            mb: 4
          }}>
            Experience the future of mobile education payments
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<BonkIcon />}
            onClick={handlePayWithBonk}
            sx={{
              background: TOKENS.BONK.gradient,
              color: 'white',
              fontWeight: 700,
              px: 6,
              py: 3,
              fontSize: '1.2rem',
              '&:hover': {
                background: TOKENS.BONK.gradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${TOKENS.BONK.color}40`,
              }
            }}
          >
            Launch BONK Payment Demo 🐕
          </Button>
        </Box>
      </Container>

      {/* Payment Modal */}
      <CryptoPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        student={selectedStudent}
        amount={350}
        currency="ZAR"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Box>
  );
};

export default BonkShowcasePage;
