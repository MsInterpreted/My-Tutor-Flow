import React, { useState, useEffect } from 'react';
import {
  TextField,
  InputAdornment,
  Box,
  Typography,
  FormControl,
  FormHelperText,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Clear as ClearIcon, Info as InfoIcon } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { 
  formatCurrency, 
  parseCurrency, 
  getCurrency, 
  validateCurrencyAmount,
  getExchangeRate,
  DEFAULT_CURRENCY 
} from '../../config/currencyConfig';

/**
 * Currency Input Component
 * Specialized input for currency amounts with validation and formatting
 */
const CurrencyInput = ({
  value = '',
  currency = DEFAULT_CURRENCY,
  onChange,
  onCurrencyChange,
  label = 'Amount',
  placeholder,
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  showCurrencySelector = false,
  showConversionInfo = false,
  conversionCurrency = DEFAULT_CURRENCY,
  allowNegative = false,
  maxValue = 999999,
  minValue = 0,
  decimalPlaces = 2,
  size = 'medium',
  fullWidth = true,
  autoFocus = false,
  sx = {},
}) => {
  const theme = useTheme();
  const [internalValue, setInternalValue] = useState(value);
  const [validationError, setValidationError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const currencyInfo = getCurrency(currency);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Format value for display
  const formatValueForDisplay = (val) => {
    if (!val || val === '') return '';
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(numValue)) return '';
    return numValue.toString();
  };

  // Validate input value
  const validateInput = (inputValue) => {
    if (!inputValue || inputValue === '') {
      if (required) {
        return 'This field is required';
      }
      return '';
    }

    const numValue = parseFloat(inputValue);
    
    if (isNaN(numValue)) {
      return 'Please enter a valid number';
    }

    if (!allowNegative && numValue < 0) {
      return 'Negative values are not allowed';
    }

    if (numValue < minValue) {
      return `Value must be at least ${formatCurrency(minValue, currency)}`;
    }

    if (numValue > maxValue) {
      return `Value cannot exceed ${formatCurrency(maxValue, currency)}`;
    }

    // Check decimal places
    const decimalPart = inputValue.toString().split('.')[1];
    if (decimalPart && decimalPart.length > decimalPlaces) {
      return `Maximum ${decimalPlaces} decimal places allowed`;
    }

    return '';
  };

  // Handle input change
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    
    // Allow empty input
    if (inputValue === '') {
      setInternalValue('');
      setValidationError('');
      onChange?.('');
      return;
    }

    // Basic number validation (allow typing)
    const numberRegex = allowNegative 
      ? /^-?\d*\.?\d*$/ 
      : /^\d*\.?\d*$/;
    
    if (!numberRegex.test(inputValue)) {
      return; // Don't update if invalid format
    }

    setInternalValue(inputValue);
    
    // Validate and update
    const error = validateInput(inputValue);
    setValidationError(error);
    
    // Only call onChange if valid or empty
    if (!error || inputValue === '') {
      onChange?.(inputValue);
    }
  };

  // Handle blur (format and final validation)
  const handleBlur = () => {
    setIsFocused(false);
    
    if (internalValue && internalValue !== '') {
      const numValue = parseFloat(internalValue);
      if (!isNaN(numValue)) {
        // Format to proper decimal places
        const formattedValue = numValue.toFixed(decimalPlaces);
        setInternalValue(formattedValue);
        onChange?.(formattedValue);
      }
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Clear input
  const handleClear = () => {
    setInternalValue('');
    setValidationError('');
    onChange?.('');
  };

  // Get conversion info
  const conversionInfo = showConversionInfo && currency !== conversionCurrency && internalValue ? {
    rate: getExchangeRate(currency, conversionCurrency),
    convertedAmount: parseFloat(internalValue) * getExchangeRate(currency, conversionCurrency),
  } : null;

  const hasError = error || !!validationError;
  const displayHelperText = validationError || helperText;

  return (
    <FormControl fullWidth={fullWidth} error={hasError} sx={sx}>
      <TextField
        label={label}
        value={formatValueForDisplay(internalValue)}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder || `Enter amount in ${currencyInfo.name}`}
        required={required}
        disabled={disabled}
        error={hasError}
        size={size}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        type="text" // Use text to allow better control over formatting
        inputProps={{
          inputMode: 'decimal',
          pattern: allowNegative ? '[0-9]*\\.?[0-9]*|-[0-9]*\\.?[0-9]*' : '[0-9]*\\.?[0-9]*',
          min: minValue,
          max: maxValue,
          step: Math.pow(10, -decimalPlaces),
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '1.1em' }}>
                  {currencyInfo.flag}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.colors.text.secondary,
                    fontWeight: 600,
                  }}
                >
                  {currencyInfo.symbol}
                </Typography>
              </Box>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {/* Conversion Info */}
                {conversionInfo && (
                  <Tooltip
                    title={`≈ ${formatCurrency(conversionInfo.convertedAmount, conversionCurrency)} (Rate: ${conversionInfo.rate.toFixed(4)})`}
                    arrow
                  >
                    <IconButton size="small" sx={{ color: theme.colors.text.secondary }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                
                {/* Clear Button */}
                {internalValue && !disabled && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    sx={{ color: theme.colors.text.secondary }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </InputAdornment>
          ),
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
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: theme.colors.brand.primary,
            },
          },
        }}
      />
      
      {/* Helper Text */}
      {displayHelperText && (
        <FormHelperText sx={{ mx: 1.5, mt: 0.5 }}>
          {displayHelperText}
        </FormHelperText>
      )}
      
      {/* Conversion Display */}
      {conversionInfo && !hasError && (
        <Box sx={{ mt: 0.5, mx: 1.5 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.colors.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <InfoIcon sx={{ fontSize: 12 }} />
            Equivalent: {formatCurrency(conversionInfo.convertedAmount, conversionCurrency)}
            {' '}(Rate: 1 {currency} = {conversionInfo.rate.toFixed(4)} {conversionCurrency})
          </Typography>
        </Box>
      )}
    </FormControl>
  );
};

// Preset variants for common use cases
export const StudentAmountInput = (props) => (
  <CurrencyInput
    label="Student Amount"
    helperText="Enter the amount for this student"
    showConversionInfo={true}
    {...props}
  />
);

export const BillingAmountInput = (props) => (
  <CurrencyInput
    label="Billing Amount"
    helperText="Enter the billing amount"
    required={true}
    {...props}
  />
);

export const SessionRateInput = (props) => (
  <CurrencyInput
    label="Session Rate"
    helperText="Hourly rate for this session type"
    minValue={0}
    maxValue={9999}
    {...props}
  />
);

export const CompactCurrencyInput = (props) => (
  <CurrencyInput
    size="small"
    fullWidth={false}
    showConversionInfo={false}
    {...props}
  />
);

export default CurrencyInput;
