import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Avatar,
  ListItemText,
  ListItemAvatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { getCurrencyOptions, formatCurrency, getExchangeRate, DEFAULT_CURRENCY } from '../config/currencyConfig';
/**
 * Enhanced Currency Selector Component for TD Learning Academy
 * Supports multi-currency selection with amount input and exchange rates
 */
const CurrencySelector = ({
  selectedCurrency = DEFAULT_CURRENCY,
  initialAmount = 0,
  onCurrencyChange,
  onAmountChange,
  showAmount = true,
  showExchangeRate = true,
  label = "Preferred Currency",
  amountLabel = "Initial Amount",
  required = false,
  disabled = false,
  error = null,
  helperText = null,
  size = "medium",
  sx = {},
}) => {
  const theme = useTheme();
  const [amountError, setAmountError] = useState('');
  const [localAmount, setLocalAmount] = useState(initialAmount || '');

  const currencyOptions = getCurrencyOptions();
  const selectedCurrencyData = currencyOptions.find(option => option.value === selectedCurrency);

  // Sync local amount with prop changes
  useEffect(() => {
    setLocalAmount(initialAmount || '');
  }, [initialAmount]);

  const handleCurrencyChange = (event) => {
    const newCurrency = event.target.value;
    onCurrencyChange?.(newCurrency);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;

    // Update local state immediately for responsive UI
    setLocalAmount(value);

    // Simplified mobile-friendly validation
    // Allow empty string, numbers, and decimal points
    const numberRegex = /^(\d*\.?\d{0,2})?$/;

    // Always call onAmountChange to keep parent state in sync
    onAmountChange?.(value);

    // Validate and set error state
    if (value === '') {
      setAmountError('');
    } else if (!numberRegex.test(value)) {
      setAmountError('Please enter numbers only (e.g., 123.45)');
    } else {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) {
        setAmountError('Please enter a valid number');
      } else if (numericValue < 0) {
        setAmountError('Amount cannot be negative');
      } else if (numericValue > 999999) {
        setAmountError('Amount is too large (max: 999,999)');
      } else {
        setAmountError('');
      }
    }
  };

  const getExchangeRateDisplay = () => {
    if (!showExchangeRate || selectedCurrency === DEFAULT_CURRENCY) {
      return null;
    }

    const rate = getExchangeRate(DEFAULT_CURRENCY, selectedCurrency);
    const formattedRate = formatCurrency(rate, selectedCurrency);

    return (
      <Typography
        variant="caption"
        sx={{
          color: theme.colors.text.secondary,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mt: 0.5
        }}
      >
        <InfoIcon sx={{ fontSize: 14 }} />
        1 ZAR = {formattedRate}
      </Typography>
    );
  };

  return (
    <Box sx={{ ...sx }}>
      {/* Currency Selection */}
      <FormControl
        fullWidth
        size={size}
        error={!!error}
        disabled={disabled}
        sx={{ mb: showAmount ? 2 : 0 }}
      >
        <InputLabel required={required}>{label}</InputLabel>
        <Select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          label={label}
          renderValue={(value) => {
            const option = currencyOptions.find(opt => opt.value === value);
            return option ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography component="span" sx={{ fontSize: '1.2em' }}>
                  {option.currency.flag}
                </Typography>
                <Typography component="span">
                  {option.currency.symbol} {option.currency.code}
                </Typography>
              </Box>
            ) : value;
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.colors.border.light,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.colors.brand.primary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.colors.brand.primary,
            },
          }}
        >
          {currencyOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '1.2em',
                    bgcolor: 'transparent'
                  }}
                >
                  {option.currency.flag}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1">
                      {option.currency.name}
                    </Typography>
                    <Chip
                      label={`${option.currency.symbol} ${option.currency.code}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        borderColor: theme.colors.brand.primary,
                        color: theme.colors.brand.primary,
                      }}
                    />
                  </Box>
                }
                secondary={
                  option.currency.isDefault ? (
                    <Typography variant="caption" color="primary">
                      Default currency
                    </Typography>
                  ) : null
                }
              />
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography variant="caption" sx={{ color: error ? 'error.main' : 'text.secondary', mt: 0.5 }}>
            {helperText}
          </Typography>
        )}
        {getExchangeRateDisplay()}
      </FormControl>

      {/* Initial Amount Input */}
      {showAmount && (
        <TextField
          fullWidth
          size={size}
          label={amountLabel}
          type="text"
          inputMode="decimal"
          value={localAmount}
          onChange={handleAmountChange}
          disabled={disabled}
          error={!!amountError}
          helperText={amountError || 'Optional: Set an initial amount for this student'}
          placeholder="0.00"
          inputProps={{
            pattern: "[0-9]*\\.?[0-9]*",
            'aria-label': `${amountLabel} in ${selectedCurrency}`,
            autoComplete: 'off',
            autoCorrect: 'off',
            autoCapitalize: 'off',
            spellCheck: 'false',
          }}
          InputProps={{
            startAdornment: selectedCurrencyData && (
              <InputAdornment position="start">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '1.1em' }}>
                    {selectedCurrencyData.currency.flag}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    {selectedCurrencyData.currency.symbol}
                  </Typography>
                </Box>
              </InputAdornment>
            ),
            inputProps: {
              min: 0,
              max: 999999,
              step: 0.01,
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: theme.colors.brand.primary,
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.colors.brand.primary,
              },
            },
          }}
        />
      )}

      {/* Currency Info Display */}
      {selectedCurrencyData && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: theme.colors.background.secondary,
            borderRadius: 1,
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: '1.2em' }}>
              {selectedCurrencyData.currency.flag}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary }}>
              {selectedCurrencyData.currency.name}
            </Typography>
            <Chip
              label={selectedCurrencyData.currency.code}
              size="small"
              sx={{
                bgcolor: theme.colors.brand.primary,
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>

          {showAmount && initialAmount > 0 && (
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
              Initial Amount: {formatCurrency(initialAmount, selectedCurrency)}
            </Typography>
          )}

          {showExchangeRate && selectedCurrency !== DEFAULT_CURRENCY && (
            <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
              Exchange Rate: 1 ZAR = {formatCurrency(getExchangeRate(DEFAULT_CURRENCY, selectedCurrency), selectedCurrency)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

// Preset components for common use cases
export const StudentCurrencySelector = (props) => (
  <CurrencySelector
    label="Student's Preferred Currency"
    amountLabel="Initial Account Balance"
    showAmount={true}
    showExchangeRate={true}
    helperText="Select the currency for billing and payments"
    {...props}
  />
);

export const BillingCurrencySelector = (props) => (
  <CurrencySelector
    label="Billing Currency"
    showAmount={false}
    showExchangeRate={true}
    helperText="Currency for invoices and payments"
    {...props}
  />
);

export const CompactCurrencySelector = (props) => (
  <CurrencySelector
    size="small"
    showAmount={false}
    showExchangeRate={false}
    {...props}
  />
);

export default CurrencySelector;
