import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';
import { SwapVert as SwapIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { 
  getCurrencyOptions, 
  convertCurrency, 
  formatCurrency, 
  getExchangeRate,
  DEFAULT_CURRENCY 
} from '../../config/currencyConfig';
import CurrencyInput from './CurrencyInput';
import { CompactCurrencySelector } from '../CurrencySelector';

/**
 * Currency Converter Component
 * Allows users to convert between different currencies
 */
const CurrencyConverter = ({
  initialFromCurrency = DEFAULT_CURRENCY,
  initialToCurrency = 'USD',
  initialAmount = 100,
  showTitle = true,
  compact = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [fromAmount, setFromAmount] = useState(initialAmount);
  const [toAmount, setToAmount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Calculate conversion whenever inputs change
  useEffect(() => {
    if (fromAmount && fromCurrency && toCurrency) {
      const converted = convertCurrency(fromAmount, fromCurrency, toCurrency);
      setToAmount(converted);
    } else {
      setToAmount(0);
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  // Swap currencies
  const handleSwapCurrencies = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = fromAmount;
    
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setFromAmount(toAmount);
  };

  // Refresh exchange rates (placeholder for future API integration)
  const handleRefreshRates = () => {
    setLastUpdated(new Date());
    // TODO: Implement actual exchange rate refresh
  };

  // Get exchange rate info
  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const reverseRate = getExchangeRate(toCurrency, fromCurrency);

  if (compact) {
    return (
      <Card sx={{ ...sx }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <CurrencyInput
                value={fromAmount}
                currency={fromCurrency}
                onChange={setFromAmount}
                label="From"
                size="small"
                fullWidth
              />
            </Grid>
            
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <IconButton 
                onClick={handleSwapCurrencies}
                size="small"
                sx={{ 
                  bgcolor: theme.colors.background.secondary,
                  '&:hover': { bgcolor: theme.colors.brand.primary + '20' }
                }}
              >
                <SwapIcon />
              </IconButton>
            </Grid>
            
            <Grid item xs={5}>
              <CurrencyInput
                value={toAmount}
                currency={toCurrency}
                onChange={() => {}} // Read-only
                label="To"
                size="small"
                disabled
                fullWidth
              />
            </Grid>
          </Grid>
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
      {showTitle && (
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
            💱 Currency Converter
          </Typography>
          
          <Tooltip title="Refresh exchange rates">
            <IconButton 
              onClick={handleRefreshRates}
              size="small"
              sx={{ color: theme.colors.text.secondary }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* From Currency */}
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.colors.text.secondary,
                mb: 1,
                fontWeight: 600,
              }}
            >
              From
            </Typography>
            <CompactCurrencySelector
              selectedCurrency={fromCurrency}
              onCurrencyChange={setFromCurrency}
              fullWidth
            />
          </Box>
          
          <CurrencyInput
            value={fromAmount}
            currency={fromCurrency}
            onChange={setFromAmount}
            label="Amount"
            placeholder="Enter amount to convert"
            fullWidth
          />
        </Grid>

        {/* Swap Button */}
        <Grid item xs={12} md={2}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              minHeight: 120,
            }}
          >
            <IconButton
              onClick={handleSwapCurrencies}
              sx={{
                bgcolor: theme.colors.brand.primary,
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  bgcolor: theme.colors.brand.primary,
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <SwapIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* To Currency */}
        <Grid item xs={12} md={5}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: theme.colors.text.secondary,
                mb: 1,
                fontWeight: 600,
              }}
            >
              To
            </Typography>
            <CompactCurrencySelector
              selectedCurrency={toCurrency}
              onCurrencyChange={setToCurrency}
              fullWidth
            />
          </Box>
          
          <CurrencyInput
            value={toAmount}
            currency={toCurrency}
            onChange={() => {}} // Read-only
            label="Converted Amount"
            disabled
            fullWidth
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Exchange Rate Information */}
      <Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: theme.colors.text.secondary,
            mb: 2,
            fontWeight: 600,
          }}
        >
          Exchange Rate Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: theme.colors.background.secondary,
                borderRadius: 1,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                1 {fromCurrency} =
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {formatCurrency(exchangeRate, toCurrency)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: theme.colors.background.secondary,
                borderRadius: 1,
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                1 {toCurrency} =
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.colors.brand.primary,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                {formatCurrency(reverseRate, fromCurrency)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.colors.text.secondary,
            mt: 2,
            display: 'block',
            textAlign: 'center',
          }}
        >
          Last updated: {lastUpdated.toLocaleTimeString()} • Rates are approximate
        </Typography>
      </Box>
    </Paper>
  );
};

export default CurrencyConverter;
