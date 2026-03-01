import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Computer as OnlineIcon,
  School as ClassIcon,
  Person as OneOnOneIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

const StudentBillingRatesDisplay = ({ billingRates, compact = false }) => {
  const theme = useTheme();

  // Default rates (fallback when student rates are empty)
  const defaultRates = {
    online: { amount: '45', currency: 'ZAR' },
    in_person_class: { amount: '55', currency: 'ZAR' },
    in_person_one_on_one: { amount: '75', currency: 'ZAR' },
  };

  const sessionTypes = [
    {
      key: 'online',
      label: 'Online Sessions',
      icon: <OnlineIcon />,
      color: '#2196F3',
    },
    {
      key: 'in_person_class',
      label: 'In-Person Class',
      icon: <ClassIcon />,
      color: '#4CAF50',
    },
    {
      key: 'in_person_one_on_one',
      label: 'One-on-One',
      icon: <OneOnOneIcon />,
      color: '#FF9800',
    },
  ];

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'ZAR': return 'R';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      default: return 'R';
    }
  };

  const getEffectiveRate = (sessionType) => {
    const studentRate = billingRates?.[sessionType];
    const defaultRate = defaultRates[sessionType];
    
    // Use student rate if it has an amount, otherwise use default
    if (studentRate?.amount && studentRate.amount.trim() !== '') {
      return {
        ...studentRate,
        isCustom: true,
      };
    }
    
    return {
      ...defaultRate,
      isCustom: false,
    };
  };

  const formatRate = (rate) => {
    const symbol = getCurrencySymbol(rate.currency);
    const amount = parseFloat(rate.amount);
    return `${symbol}${amount.toFixed(2)}`;
  };

  if (compact) {
    return (
      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <MoneyIcon sx={{ fontSize: '16px', color: theme.colors.brand.primary }} />
          Billing Rates
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sessionTypes.map((sessionType) => {
            const rate = getEffectiveRate(sessionType.key);
            return (
              <Chip
                key={sessionType.key}
                label={`${sessionType.label}: ${formatRate(rate)}/hr`}
                size="small"
                sx={{
                  backgroundColor: rate.isCustom 
                    ? `${sessionType.color}20` 
                    : `${theme.colors.text.secondary}10`,
                  color: rate.isCustom 
                    ? sessionType.color 
                    : theme.colors.text.secondary,
                  fontWeight: rate.isCustom ? 600 : 400,
                  fontSize: '12px',
                }}
              />
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <MoneyIcon sx={{ color: theme.colors.brand.primary }} />
        Billing Rates
      </Typography>

      <Grid container spacing={2}>
        {sessionTypes.map((sessionType) => {
          const rate = getEffectiveRate(sessionType.key);
          
          return (
            <Grid item xs={12} sm={4} key={sessionType.key}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  backgroundColor: `${sessionType.color}10`,
                  border: `1px solid ${sessionType.color}30`,
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Custom Rate Indicator */}
                {rate.isCustom && (
                  <Chip
                    label="Custom"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: sessionType.color,
                      color: '#ffffff',
                      fontSize: '10px',
                      height: '20px',
                    }}
                  />
                )}

                {/* Icon */}
                <Box
                  sx={{
                    color: sessionType.color,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {sessionType.icon}
                </Box>

                {/* Session Type Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.primary,
                    fontWeight: 600,
                    mb: 1,
                    fontSize: '14px',
                  }}
                >
                  {sessionType.label}
                </Typography>

                {/* Rate Display */}
                <Typography
                  variant="h6"
                  sx={{
                    color: sessionType.color,
                    fontWeight: 700,
                    fontSize: '18px',
                  }}
                >
                  {formatRate(rate)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.colors.text.secondary,
                    fontSize: '12px',
                  }}
                >
                  per hour
                </Typography>

                {/* Default Rate Indicator */}
                {!rate.isCustom && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontSize: '10px',
                      fontStyle: 'italic',
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    (default rate)
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Legend */}
      <Divider sx={{ my: 2, borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.colors.brand.primary,
            }}
          />
          <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
            Custom Rate
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.colors.text.secondary,
              opacity: 0.5,
            }}
          />
          <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
            Default Rate
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StudentBillingRatesDisplay;
