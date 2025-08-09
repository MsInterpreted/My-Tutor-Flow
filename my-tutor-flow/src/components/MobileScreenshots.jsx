import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  TouchApp as TouchIcon,
  AccountBalance as CryptoIcon,
  TrendingUp as AnalyticsIcon,
  People as StudentsIcon,
  AttachMoney as BillingIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

/**
 * Mobile Screenshots Component for Hackathon Pitch
 * Shows key mobile features with mockup interfaces
 */
const MobileScreenshots = () => {
  const theme = useTheme();

  const mobileFeatures = [
    {
      title: 'Mobile Dashboard',
      description: 'Real-time analytics optimized for mobile screens',
      icon: <AnalyticsIcon />,
      color: theme.colors.brand.primary,
      mockup: (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '20px', minHeight: '400px' }}>
          {/* Mobile Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontSize: '12px' }}>
            <span>9:41</span>
            <span>📶 📶 📶 🔋</span>
          </Box>
          
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
              📊 Dashboard
            </Typography>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={1} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Card sx={{ backgroundColor: theme.colors.brand.primary + '20', textAlign: 'center', py: 1 }}>
                <Typography variant="h6" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>45</Typography>
                <Typography variant="caption">Students</Typography>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ backgroundColor: theme.colors.status.success + '20', textAlign: 'center', py: 1 }}>
                <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>R47K</Typography>
                <Typography variant="caption">Revenue</Typography>
              </Card>
            </Grid>
          </Grid>
          
          {/* Quick Actions */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Quick Actions</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="small"
                  sx={{ backgroundColor: theme.colors.brand.primary, fontSize: '0.7rem' }}
                >
                  ⚡ Mark Attendance
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="small"
                  sx={{ backgroundColor: theme.colors.status.success, fontSize: '0.7rem' }}
                >
                  💰 Quick Bill
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* Recent Activity */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Recent Activity</Typography>
            <Box sx={{ backgroundColor: 'white', borderRadius: '8px', p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, backgroundColor: theme.colors.brand.primary, fontSize: '0.7rem' }}>S</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Sarah completed Math</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>2 hours ago</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, backgroundColor: theme.colors.status.success, fontSize: '0.7rem' }}>M</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>Payment received</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'gray' }}>4 hours ago</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      title: 'Contact Integration',
      description: 'Import students directly from mobile contacts',
      icon: <StudentsIcon />,
      color: theme.colors.status.success,
      mockup: (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '20px', minHeight: '400px' }}>
          {/* Mobile Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontSize: '12px' }}>
            <span>9:41</span>
            <span>📶 📶 📶 🔋</span>
          </Box>
          
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
              👥 Add Student
            </Typography>
          </Box>
          
          {/* Contact Import Button */}
          <Card sx={{ mb: 2, backgroundColor: theme.colors.status.success + '10', border: `2px solid ${theme.colors.status.success}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <PhoneIcon sx={{ fontSize: 40, color: theme.colors.status.success, mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Import from Contacts</Typography>
              <Button 
                variant="contained" 
                size="small"
                sx={{ backgroundColor: theme.colors.status.success }}
              >
                📞 Select Contact
              </Button>
            </CardContent>
          </Card>
          
          {/* Form Fields */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ mb: 1, p: 1, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
              <Typography variant="caption" sx={{ color: 'gray' }}>Student Name</Typography>
              <Typography variant="body2">Sarah Johnson</Typography>
            </Box>
            <Box sx={{ mb: 1, p: 1, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
              <Typography variant="caption" sx={{ color: 'gray' }}>Phone Number</Typography>
              <Typography variant="body2">+27 123 456 789</Typography>
            </Box>
            <Box sx={{ mb: 1, p: 1, backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
              <Typography variant="caption" sx={{ color: 'gray' }}>Grade</Typography>
              <Typography variant="body2">Grade 10</Typography>
            </Box>
          </Box>
          
          {/* Save Button */}
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ backgroundColor: theme.colors.status.success, py: 1.5 }}
          >
            💾 Save Student
          </Button>
        </Box>
      ),
    },
    {
      title: 'One-Tap Billing',
      description: 'Quick invoice generation and payment tracking',
      icon: <BillingIcon />,
      color: theme.colors.status.warning,
      mockup: (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '20px', minHeight: '400px' }}>
          {/* Mobile Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontSize: '12px' }}>
            <span>9:41</span>
            <span>📶 📶 📶 🔋</span>
          </Box>
          
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.colors.status.warning, fontWeight: 700 }}>
              💰 Quick Billing
            </Typography>
          </Box>
          
          {/* Student Selection */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: '12px' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Select Student</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, backgroundColor: theme.colors.brand.primary + '10', borderRadius: '8px' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 2, backgroundColor: theme.colors.brand.primary }}>S</Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Sarah Johnson</Typography>
                <Typography variant="caption" sx={{ color: 'gray' }}>Grade 10 • Math, Physics</Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Quick Amount Buttons */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Quick Amounts</Typography>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" size="small" sx={{ borderColor: theme.colors.status.warning }}>
                  R350
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" size="small" sx={{ borderColor: theme.colors.status.warning }}>
                  R700
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="outlined" size="small" sx={{ borderColor: theme.colors.status.warning }}>
                  R1400
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* Currency Selection */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: '12px' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Currency</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label="ZAR" size="small" sx={{ backgroundColor: theme.colors.status.warning + '20' }} />
              <Chip label="USD" size="small" variant="outlined" />
              <Chip label="GBP" size="small" variant="outlined" />
            </Box>
          </Box>
          
          {/* Generate Invoice Button */}
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ backgroundColor: theme.colors.status.warning, py: 1.5 }}
          >
            📄 Generate Invoice
          </Button>
        </Box>
      ),
    },
    {
      title: 'Crypto Integration',
      description: 'Future Solana wallet and payment integration',
      icon: <CryptoIcon />,
      color: theme.colors.status.info,
      mockup: (
        <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '20px', minHeight: '400px' }}>
          {/* Mobile Status Bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontSize: '12px' }}>
            <span>9:41</span>
            <span>📶 📶 📶 🔋</span>
          </Box>
          
          {/* Header */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: theme.colors.status.info, fontWeight: 700 }}>
              🔗 Solana Integration
            </Typography>
          </Box>
          
          {/* Wallet Connection */}
          <Card sx={{ mb: 2, backgroundColor: theme.colors.status.info + '10', border: `2px solid ${theme.colors.status.info}` }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CryptoIcon sx={{ fontSize: 40, color: theme.colors.status.info, mb: 1 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Connect Solana Wallet</Typography>
              <Button 
                variant="contained" 
                size="small"
                sx={{ backgroundColor: theme.colors.status.info }}
              >
                🔗 Connect Wallet
              </Button>
            </CardContent>
          </Card>
          
          {/* Payment Options */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Payment Methods</Typography>
            <Box sx={{ backgroundColor: 'white', borderRadius: '8px', p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, backgroundColor: theme.colors.status.info + '10', borderRadius: '6px' }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: theme.colors.status.info, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                  ◎
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>SOL</Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>Solana</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, p: 1, borderRadius: '6px' }}>
                <Box sx={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: theme.colors.status.success, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                  $
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>USDC</Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>USD Coin</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          
          {/* NFT Certificates */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: 'white', borderRadius: '12px' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>🏆 NFT Certificates</Typography>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              Issue achievement NFTs on Solana blockchain
            </Typography>
          </Box>
          
          {/* Coming Soon Badge */}
          <Box sx={{ textAlign: 'center' }}>
            <Chip 
              label="🚀 Coming Soon" 
              sx={{ 
                backgroundColor: theme.colors.status.info + '20',
                color: theme.colors.status.info,
                fontWeight: 600
              }} 
            />
          </Box>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ color: theme.colors.text.primary, mb: 4, fontWeight: 700, textAlign: 'center' }}>
        📱 Mobile-First Features
      </Typography>
      
      <Grid container spacing={4}>
        {mobileFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', backgroundColor: theme.colors.background.primary }}>
              <CardContent>
                {/* Feature Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ backgroundColor: feature.color, mr: 2 }}>
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Mobile Mockup */}
                <Box sx={{ 
                  border: '3px solid #333', 
                  borderRadius: '25px', 
                  overflow: 'hidden',
                  backgroundColor: '#333',
                  p: '4px'
                }}>
                  {feature.mockup}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MobileScreenshots;
