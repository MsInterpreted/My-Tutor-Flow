import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  LinearProgress,
  useTheme as useMuiTheme,
  useMediaQuery,
  Fab,
  Badge,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  ContactPhone as ContactPhoneIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { mobileDemoService } from '../services/mobileDemoService';
import { isMobile } from '../config/mobileConfig';
import { BonkLogo } from './branding/BonkLogo';

const MobileDashboard = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobileView = useMediaQuery(muiTheme.breakpoints.down('md')) || isMobile();
  const navigate = useNavigate();

  const [demoData, setDemoData] = useState(null);
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);

  useEffect(() => {
    // Load demo data for mobile
    if (isMobileView) {
      const data = mobileDemoService.getAllDemoData();
      setDemoData(data);
    }
  }, [isMobileView]);

  if (!isMobileView || !demoData) {
    return null; // Only show on mobile with demo data
  }

  const { dashboardMetrics, quickActions, studentCards, todaySessions, notifications } = demoData;

  // Format currency for display
  const formatCurrency = (amount, currency = 'ZAR') => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format time for mobile
  const formatTime = (timeString) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle quick action clicks
  const handleQuickAction = (action) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.action === 'contact') {
      // Handle contact action (could open WhatsApp or phone)
      window.open('https://wa.me/27824567890', '_blank');
    } else if (action.action === 'schedule') {
      // Handle schedule action
      navigate('/attendance');
    }
  };

  // Render action icon
  const renderActionIcon = (iconName) => {
    const iconProps = { sx: { fontSize: '2rem' } };

    switch (iconName) {
      case 'Assessment':
        return <AssessmentIcon {...iconProps} />;
      case 'School':
        return <SchoolIcon {...iconProps} />;
      case 'BonkLogo':
        return <BonkLogo size="small" variant="logoOnly" sx={{ width: 32, height: 32 }} />;
      case 'ContactPhone':
        return <ContactPhoneIcon {...iconProps} />;
      case 'Description':
        return <DescriptionIcon {...iconProps} />;
      case 'AccountBalance':
        return <AccountBalanceIcon {...iconProps} />;
      case 'Event':
        return <EventIcon {...iconProps} />;
      default:
        return <AddIcon {...iconProps} />;
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      pb: 10, // Extra padding for mobile navigation
      background: theme.colors.background.primary,
      minHeight: '100vh'
    }}>
      {/* Header with notifications */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        mt: 1
      }}>
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            color: theme.colors.text.primary,
            fontSize: '1.8rem'
          }}>
            Good afternoon! 👋
          </Typography>
          <Typography variant="body2" sx={{ 
            color: theme.colors.text.secondary,
            mt: 0.5
          }}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>
        <Badge badgeContent={notifications.length} color="error">
          <IconButton sx={{ 
            backgroundColor: theme.colors.background.secondary,
            '&:hover': { backgroundColor: theme.colors.background.tertiary }
          }}>
            <NotificationsIcon />
          </IconButton>
        </Badge>
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
            color: 'white',
            height: '100px'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Students
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {dashboardMetrics.activeStudents}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                All active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
            color: 'white',
            height: '100px'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Revenue
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {formatCurrency(dashboardMetrics.monthlyRevenue)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #45B7D1, #2196F3)',
            color: 'white',
            height: '100px'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Attendance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {dashboardMetrics.attendanceRate}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #96CEB4, #85C1A3)',
            color: 'white',
            height: '100px'
          }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon sx={{ fontSize: 20, mr: 1 }} />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Today
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                {todaySessions.length}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Sessions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 3, backgroundColor: theme.colors.background.secondary }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: theme.colors.text.primary
          }}>
            Quick Actions
          </Typography>
          <Grid container spacing={1}>
            {quickActions.slice(0, 6).map((action) => (
              <Grid item xs={4} key={action.id}>
                <Card
                  sx={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: action.color + '15',
                    border: `1px solid ${action.color}30`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${action.color}40`,
                    }
                  }}
                  onClick={() => handleQuickAction(action)}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ mb: 0.5, color: action.color }}>
                      {renderActionIcon(action.icon)}
                    </Box>
                    <Typography variant="caption" sx={{
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                      fontSize: '0.7rem',
                      lineHeight: 1.2
                    }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Today's Sessions */}
      <Card sx={{ mb: 3, backgroundColor: theme.colors.background.secondary }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: theme.colors.text.primary
          }}>
            Today's Sessions
          </Typography>
          {todaySessions.map((session, index) => (
            <Box key={session.id}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                py: 1.5,
                px: 1,
                borderRadius: 2,
                backgroundColor: theme.colors.background.primary,
                mb: index < todaySessions.length - 1 ? 1 : 0
              }}>
                <Box sx={{ 
                  minWidth: 60,
                  textAlign: 'center',
                  mr: 2
                }}>
                  <Typography variant="body2" sx={{
                    fontWeight: 700,
                    color: theme.colors.brand.primary
                  }}>
                    {formatTime(session.time)}
                  </Typography>
                  <Chip
                    label={`${session.duration}min`}
                    size="small"
                    sx={{
                      fontSize: '0.6rem',
                      height: 18,
                      backgroundColor: theme.colors.brand.primary + '20',
                      color: theme.colors.brand.primary
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: theme.colors.text.primary
                  }}>
                    {session.student}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: theme.colors.text.secondary
                  }}>
                    {session.subject} • {session.type}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" sx={{ 
                    backgroundColor: '#4ECDC4',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': { backgroundColor: '#44A08D' }
                  }}>
                    <PhoneIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" sx={{ 
                    backgroundColor: '#25D366',
                    color: 'white',
                    width: 32,
                    height: 32,
                    '&:hover': { backgroundColor: '#128C7E' }
                  }}>
                    <MessageIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          background: 'linear-gradient(135deg, #FF6B35, #F7931E)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55A2B, #E8851A)',
          }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MobileDashboard;
