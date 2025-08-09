import React from 'react';
import { Box, Typography, Chip, Tooltip, IconButton } from '@mui/material';
import { Info as InfoIcon, SwapHoriz as ConvertIcon } from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { formatCurrency, getCurrency, getExchangeRate, DEFAULT_CURRENCY } from '../../config/currencyConfig';

/**
 * Currency Display Component
 * Shows formatted currency amounts with optional conversion info
 */
const CurrencyDisplay = ({
  amount = 0,
  currency = DEFAULT_CURRENCY,
  showCode = false,
  showFlag = true,
  showConversion = false,
  conversionCurrency = DEFAULT_CURRENCY,
  size = 'medium',
  variant = 'default',
  onClick,
  sx = {},
}) => {
  const theme = useTheme();
  const currencyInfo = getCurrency(currency);
  const isClickable = !!onClick;

  // Size configurations
  const sizeConfig = {
    small: { fontSize: '0.875rem', chipSize: 'small', iconSize: 16 },
    medium: { fontSize: '1rem', chipSize: 'small', iconSize: 18 },
    large: { fontSize: '1.25rem', chipSize: 'medium', iconSize: 20 },
    xlarge: { fontSize: '1.5rem', chipSize: 'medium', iconSize: 24 },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  // Variant styles
  const variantStyles = {
    default: {
      color: theme.colors.text.primary,
      fontWeight: 500,
    },
    primary: {
      color: theme.colors.brand.primary,
      fontWeight: 600,
    },
    secondary: {
      color: theme.colors.text.secondary,
      fontWeight: 400,
    },
    success: {
      color: theme.colors.status.success,
      fontWeight: 600,
    },
    warning: {
      color: theme.colors.status.warning,
      fontWeight: 600,
    },
    error: {
      color: theme.colors.status.error,
      fontWeight: 600,
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  // Format the main amount
  const formattedAmount = formatCurrency(amount, currency, {
    showSymbol: true,
    showCode: showCode,
  });

  // Calculate conversion if needed
  const conversionInfo = showConversion && currency !== conversionCurrency ? {
    rate: getExchangeRate(currency, conversionCurrency),
    convertedAmount: amount * getExchangeRate(currency, conversionCurrency),
    formattedConverted: formatCurrency(
      amount * getExchangeRate(currency, conversionCurrency), 
      conversionCurrency
    ),
  } : null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        cursor: isClickable ? 'pointer' : 'default',
        '&:hover': isClickable ? {
          opacity: 0.8,
        } : {},
        ...sx,
      }}
      onClick={onClick}
    >
      {/* Flag */}
      {showFlag && (
        <Typography
          component="span"
          sx={{
            fontSize: config.iconSize,
            lineHeight: 1,
          }}
        >
          {currencyInfo.flag}
        </Typography>
      )}

      {/* Amount */}
      <Typography
        component="span"
        sx={{
          fontSize: config.fontSize,
          fontWeight: style.fontWeight,
          color: style.color,
          fontFamily: 'monospace', // Better for numbers
        }}
      >
        {formattedAmount}
      </Typography>

      {/* Currency Code Chip */}
      {showCode && (
        <Chip
          label={currency}
          size={config.chipSize}
          variant="outlined"
          sx={{
            height: config.iconSize + 4,
            fontSize: config.fontSize * 0.75,
            borderColor: theme.colors.brand.primary,
            color: theme.colors.brand.primary,
            '& .MuiChip-label': {
              px: 0.5,
            },
          }}
        />
      )}

      {/* Conversion Info */}
      {conversionInfo && (
        <Tooltip
          title={
            <Box>
              <Typography variant="caption" display="block">
                Exchange Rate: 1 {currency} = {conversionInfo.rate.toFixed(4)} {conversionCurrency}
              </Typography>
              <Typography variant="caption" display="block">
                Converted: {conversionInfo.formattedConverted}
              </Typography>
            </Box>
          }
          arrow
        >
          <IconButton
            size="small"
            sx={{
              width: config.iconSize + 4,
              height: config.iconSize + 4,
              color: theme.colors.text.secondary,
              '&:hover': {
                color: theme.colors.brand.primary,
              },
            }}
          >
            <ConvertIcon sx={{ fontSize: config.iconSize }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

// Preset variants for common use cases
export const PrimaryCurrencyDisplay = (props) => (
  <CurrencyDisplay variant="primary" size="large" showFlag={true} {...props} />
);

export const SecondaryCurrencyDisplay = (props) => (
  <CurrencyDisplay variant="secondary" size="medium" showFlag={false} {...props} />
);

export const CompactCurrencyDisplay = (props) => (
  <CurrencyDisplay size="small" showFlag={false} showCode={false} {...props} />
);

export const DetailedCurrencyDisplay = (props) => (
  <CurrencyDisplay 
    size="large" 
    showFlag={true} 
    showCode={true} 
    showConversion={true} 
    {...props} 
  />
);

export const SuccessCurrencyDisplay = (props) => (
  <CurrencyDisplay variant="success" size="medium" showFlag={true} {...props} />
);

export const ErrorCurrencyDisplay = (props) => (
  <CurrencyDisplay variant="error" size="medium" showFlag={true} {...props} />
);

export const WarningCurrencyDisplay = (props) => (
  <CurrencyDisplay variant="warning" size="medium" showFlag={true} {...props} />
);

export default CurrencyDisplay;
