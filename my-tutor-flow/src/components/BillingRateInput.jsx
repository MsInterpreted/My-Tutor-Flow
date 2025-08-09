import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Alert,
  Fade,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import CurrencySelector from './CurrencySelector';

const BillingRateInput = ({
  sessionType,
  value = { amount: '', currency: 'ZAR' },
  onChange,
  label,
  icon,
  color,
  disabled = false,
  error = '',
  helperText = '',
  required = false,
}) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validateAmount = (amount) => {
    if (required && (!amount || amount === '' || amount === '0')) {
      return 'Rate is required';
    }

    if (amount === '' || amount === null || amount === undefined) {
      return ''; // Empty is valid if not required
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return 'Please enter a valid number';
    }

    if (numericAmount < 0) {
      return 'Rate cannot be negative';
    }

    if (numericAmount > 10000) {
      return 'Rate seems unusually high. Please verify.';
    }

    if (numericAmount > 0 && numericAmount < 0.01) {
      return 'Minimum rate is 0.01';
    }

    return '';
  };

  const handleAmountChange = (event) => {
    const newAmount = event.target.value;

    // Enhanced regex to handle various number formats
    // Allows: empty, integers, decimals, leading zeros, partial decimals
    const numberRegex = /^(\d*\.?\d{0,2})?$/;

    if (newAmount === '' || numberRegex.test(newAmount)) {
      const newValue = { ...localValue, amount: newAmount };
      setLocalValue(newValue);

      const validation = validateAmount(newAmount);
      setValidationError(validation);

      // Always call onChange to keep parent state in sync
      onChange(sessionType, newValue);
    }
  };

  const handleCurrencyChange = (currencyCode, currencyData) => {
    const newValue = { ...localValue, currency: currencyCode };
    setLocalValue(newValue);
    onChange(sessionType, newValue);
  };

  const formatDisplayAmount = (amount) => {
    if (!amount || amount === '') return '';
    const num = parseFloat(amount);
    return isNaN(num) ? amount : num.toFixed(2);
  };

  const currentError = error || validationError;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: '16px',
        background: theme.colors.background.secondary,
        border: `2px solid ${currentError ? '#f44336' : color || theme.colors.brand.primary}`,
        boxShadow: theme.shadows.card,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 8px 24px ${color || theme.colors.brand.primary}20`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box sx={{ mr: 2, color: color || theme.colors.brand.primary }}>
            {icon}
          </Box>
        )}
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            fontSize: '18px',
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* Rate Input Row */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        {/* Currency Selector */}
        <CurrencySelector
          value={localValue.currency}
          onChange={handleCurrencyChange}
          label="Currency"
          disabled={disabled}
          size="medium"
        />

        {/* Amount Input */}
        <TextField
          fullWidth
          label="Rate per Hour"
          value={localValue.amount}
          onChange={handleAmountChange}
          disabled={disabled}
          error={!!currentError}
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          inputProps={{
            pattern: "[0-9]*\\.?[0-9]*",
            'aria-label': `${label} rate per hour`,
            autoComplete: 'off',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            spellCheck: 'false',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    color: color || theme.colors.brand.primary,
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {localValue.currency === 'ZAR' ? 'R' : 
                   localValue.currency === 'USD' ? '$' : 
                   localValue.currency === 'EUR' ? '€' : 
                   localValue.currency === 'GBP' ? '£' : 'R'}
                </Typography>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderColor: color || theme.colors.brand.primary,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: color || theme.colors.brand.primary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: color || theme.colors.brand.primary,
              },
            },
            '& .MuiInputLabel-root': {
              color: theme.colors.text.secondary,
              '&.Mui-focused': {
                color: color || theme.colors.brand.primary,
              },
            },
          }}
        />
      </Box>

      {/* Error Message */}
      <Fade in={!!currentError}>
        <Box sx={{ mt: 1 }}>
          {currentError && (
            <Alert 
              severity="error" 
              sx={{ 
                fontSize: '14px',
                '& .MuiAlert-icon': {
                  fontSize: '16px',
                },
              }}
            >
              {currentError}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Helper Text */}
      {helperText && !currentError && (
        <Typography
          variant="caption"
          sx={{
            color: theme.colors.text.secondary,
            mt: 1,
            display: 'block',
            fontSize: '12px',
          }}
        >
          {helperText}
        </Typography>
      )}

      {/* Rate Preview */}
      {localValue.amount && !currentError && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: `${color || theme.colors.brand.primary}10`,
            borderRadius: '8px',
            border: `1px solid ${color || theme.colors.brand.primary}30`,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Rate: {localValue.currency === 'ZAR' ? 'R' : 
                   localValue.currency === 'USD' ? '$' : 
                   localValue.currency === 'EUR' ? '€' : 
                   localValue.currency === 'GBP' ? '£' : 'R'}
            {formatDisplayAmount(localValue.amount)} per hour
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BillingRateInput;
