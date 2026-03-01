import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { 
  formatCurrency, 
  getCurrency, 
  convertCurrency, 
  DEFAULT_CURRENCY 
} from '../../config/currencyConfig';
import CurrencyDisplay from './CurrencyDisplay';

/**
 * Currency Summary Component
 * Shows summary of amounts across different currencies
 */
const CurrencySummary = ({
  currencyData = [],
  baseCurrency = DEFAULT_CURRENCY,
  title = "Currency Summary",
  showConversion = true,
  showTrends = false,
  compact = false,
  sx = {},
}) => {
  const theme = useTheme();

  // Calculate totals
  const totalInBaseCurrency = currencyData.reduce((sum, item) => {
    const convertedAmount = convertCurrency(item.amount, item.currency, baseCurrency);
    return sum + convertedAmount;
  }, 0);

  // Sort by amount (descending)
  const sortedData = [...currencyData].sort((a, b) => {
    const aConverted = convertCurrency(a.amount, a.currency, baseCurrency);
    const bConverted = convertCurrency(b.amount, b.currency, baseCurrency);
    return bConverted - aConverted;
  });

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp sx={{ color: theme.colors.status.success }} />;
      case 'down': return <TrendingDown sx={{ color: theme.colors.status.error }} />;
      default: return <Remove sx={{ color: theme.colors.text.secondary }} />;
    }
  };

  if (compact) {
    return (
      <Card sx={{ ...sx }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.colors.text.secondary }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {sortedData.map((item, index) => (
              <Chip
                key={`${item.currency}-${index}`}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '0.9em' }}>
                      {getCurrency(item.currency).flag}
                    </Typography>
                    <Typography variant="caption">
                      {formatCurrency(item.amount, item.currency)}
                    </Typography>
                  </Box>
                }
                variant="outlined"
                size="small"
                sx={{
                  borderColor: theme.colors.brand.primary,
                  color: theme.colors.brand.primary,
                }}
              />
            ))}
          </Box>
          
          {showConversion && totalInBaseCurrency > 0 && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: theme.colors.text.secondary,
                mt: 1,
                display: 'block',
              }}
            >
              Total: {formatCurrency(totalInBaseCurrency, baseCurrency)}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        borderRadius: 2,
        border: `1px solid ${theme.colors.border.light}`,
        ...sx 
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: theme.colors.text.primary,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          💰 {title}
        </Typography>
        
        {showConversion && (
          <Chip
            label={`Total: ${formatCurrency(totalInBaseCurrency, baseCurrency)}`}
            sx={{
              bgcolor: theme.colors.brand.primary,
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      {currencyData.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            color: theme.colors.text.secondary,
          }}
        >
          <Typography variant="body1">
            No currency data available
          </Typography>
        </Box>
      ) : (
        <>
          {/* Currency Breakdown */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {sortedData.map((item, index) => {
              const currencyInfo = getCurrency(item.currency);
              const convertedAmount = convertCurrency(item.amount, item.currency, baseCurrency);
              const percentage = totalInBaseCurrency > 0 ? (convertedAmount / totalInBaseCurrency) * 100 : 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={`${item.currency}-${index}`}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      border: `1px solid ${theme.colors.border.light}`,
                      '&:hover': {
                        borderColor: theme.colors.brand.primary,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: 'transparent',
                            fontSize: '1.2em',
                          }}
                        >
                          {currencyInfo.flag}
                        </Avatar>
                        <Box sx={{ ml: 1, flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {currencyInfo.code}
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                            {currencyInfo.name}
                          </Typography>
                        </Box>
                        {showTrends && item.trend && (
                          <Box sx={{ ml: 1 }}>
                            {getTrendIcon(item.trend)}
                          </Box>
                        )}
                      </Box>
                      
                      <CurrencyDisplay
                        amount={item.amount}
                        currency={item.currency}
                        variant="primary"
                        size="large"
                        showFlag={false}
                      />
                      
                      {showConversion && item.currency !== baseCurrency && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.colors.text.secondary,
                            display: 'block',
                            mt: 0.5,
                          }}
                        >
                          ≈ {formatCurrency(convertedAmount, baseCurrency)}
                        </Typography>
                      )}
                      
                      {percentage > 0 && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.colors.brand.primary,
                            display: 'block',
                            mt: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          {percentage.toFixed(1)}% of total
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Detailed List */}
          {sortedData.length > 3 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: theme.colors.text.secondary,
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Detailed Breakdown
              </Typography>
              
              <List dense>
                {sortedData.map((item, index) => {
                  const currencyInfo = getCurrency(item.currency);
                  const convertedAmount = convertCurrency(item.amount, item.currency, baseCurrency);
                  
                  return (
                    <ListItem key={`${item.currency}-${index}`} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent', fontSize: '1em' }}>
                          {currencyInfo.flag}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(item.amount, item.currency)}
                            </Typography>
                            <Chip 
                              label={currencyInfo.code} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          showConversion && item.currency !== baseCurrency ? 
                            `≈ ${formatCurrency(convertedAmount, baseCurrency)}` : 
                            currencyInfo.name
                        }
                      />
                      {showTrends && item.trend && (
                        <Box sx={{ ml: 1 }}>
                          {getTrendIcon(item.trend)}
                        </Box>
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}
        </>
      )}
    </Paper>
  );
};

export default CurrencySummary;
