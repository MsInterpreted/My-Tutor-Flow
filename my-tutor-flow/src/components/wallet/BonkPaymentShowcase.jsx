import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Pets as BonkIcon,
  TrendingUp as TrendingIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { BonkLogo, AnimatedBonkLogo } from '../branding/BonkLogo';
import { TOKENS } from '../../config/solanaTokens';

/**
 * BONK Payment Showcase Component
 * Highlights BONK integration for Solana Mobile Hackathon
 */
const BonkPaymentShowcase = ({ onPayWithBonk }) => {
  const theme = useTheme();
  const [bonkPrice, setBonkPrice] = useState(0.000025);
  const [priceChange, setPriceChange] = useState(12.5);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time BONK price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 0.000002;
      setBonkPrice(prev => Math.max(0.000001, prev + change));
      setPriceChange((Math.random() - 0.5) * 20);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const bonkFeatures = [
    {
      icon: <SpeedIcon sx={{ color: TOKENS.BONK.color }} />,
      title: 'Lightning Fast',
      description: 'Sub-second transactions on Solana',
    },
    {
      icon: <SecurityIcon sx={{ color: TOKENS.BONK.color }} />,
      title: 'Secure & Decentralized',
      description: 'Built on Solana blockchain',
    },
    {
      icon: <TrendingIcon sx={{ color: TOKENS.BONK.color }} />,
      title: 'Community Driven',
      description: 'The people\'s crypto for education',
    },
  ];

  const handlePayWithBonk = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onPayWithBonk) {
        onPayWithBonk();
      }
    }, 2000);
  };

  return (
    <Box>
      {/* BONK Header */}
      <Card sx={{ 
        background: TOKENS.BONK.gradient,
        color: 'white',
        mb: 3,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              mr: 2,
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1
            }}>
              <BonkLogo size="small" variant="logoOnly" sx={{ width: 40, height: 40 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Pay with BONK
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                The first Solana dog coin for education payments
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Current Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                ${bonkPrice.toFixed(8)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                24h Change
              </Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: priceChange >= 0 ? '#4ADE80' : '#F87171'
              }}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        
        {/* Animated background */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          opacity: 0.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          }
        }}>
          <BonkLogo size="hero" variant="logoOnly" sx={{ width: 180, height: 180 }} />
        </Box>
      </Card>

      {/* BONK Features */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {bonkFeatures.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%',
              backgroundColor: theme.colors.background.secondary,
              border: `2px solid ${TOKENS.BONK.color}20`,
              '&:hover': {
                borderColor: TOKENS.BONK.color,
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  color: theme.colors.text.primary 
                }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.colors.text.secondary 
                }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Example */}
      <Card sx={{ backgroundColor: theme.colors.background.secondary, mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 3,
            color: theme.colors.text.primary 
          }}>
            💡 BONK Payment Example
          </Typography>
          
          <Box sx={{ 
            background: `linear-gradient(135deg, ${TOKENS.BONK.color}10, ${TOKENS.BONK.color}05)`,
            borderRadius: '12px',
            p: 3,
            mb: 3
          }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ 
                  color: theme.colors.text.secondary,
                  mb: 1 
                }}>
                  Tuition Fee
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  color: theme.colors.text.primary 
                }}>
                  R350.00 ZAR
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ 
                  color: theme.colors.text.secondary,
                  mb: 1 
                }}>
                  BONK Amount
                </Typography>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  color: TOKENS.BONK.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  🐕 {(350 * 18.5 / bonkPrice).toLocaleString()} BONK
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={isLoading ? null : <BonkIcon />}
            onClick={handlePayWithBonk}
            disabled={isLoading}
            sx={{
              background: TOKENS.BONK.gradient,
              color: 'white',
              fontWeight: 700,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                background: TOKENS.BONK.gradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${TOKENS.BONK.color}40`,
              },
              '&:disabled': {
                background: theme.colors.text.secondary,
              }
            }}
          >
            {isLoading ? (
              <>
                <LinearProgress 
                  sx={{ 
                    width: '100px', 
                    mr: 2,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                    }
                  }} 
                />
                Processing BONK Payment...
              </>
            ) : (
              'Pay with BONK 🐕'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Hackathon Note */}
      <Alert 
        severity="info" 
        sx={{ 
          backgroundColor: `${TOKENS.BONK.color}10`,
          border: `1px solid ${TOKENS.BONK.color}30`,
          '& .MuiAlert-icon': {
            color: TOKENS.BONK.color,
          }
        }}
      >
        <Typography variant="body2">
          <strong>🏆 Solana Mobile Hackathon Feature:</strong> BONK payments showcase the 
          potential for meme coins in education. This integration demonstrates how My Tutor Flow 
          can support any SPL token, making education payments accessible to the entire Solana ecosystem.
        </Typography>
      </Alert>

      <Divider sx={{ my: 3 }} />

      {/* Technical Details */}
      <Card sx={{ backgroundColor: theme.colors.background.primary }}>
        <CardContent>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: theme.colors.text.primary 
          }}>
            🔧 Technical Implementation
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ 
                color: theme.colors.text.secondary,
                mb: 1 
              }}>
                Token Mint Address:
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: 'monospace',
                backgroundColor: theme.colors.background.secondary,
                p: 1,
                borderRadius: '4px',
                fontSize: '0.8rem',
                wordBreak: 'break-all'
              }}>
                {TOKENS.BONK.mint}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ 
                color: theme.colors.text.secondary,
                mb: 1 
              }}>
                Decimals:
              </Typography>
              <Chip 
                label={`${TOKENS.BONK.decimals} decimals`}
                sx={{ 
                  backgroundColor: TOKENS.BONK.color,
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BonkPaymentShowcase;
