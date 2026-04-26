// TD Learning Academy - Multi-Currency Configuration
// Comprehensive currency support for international students

/**
 * Supported Currencies Configuration
 * Includes formatting, symbols, and exchange rate management
 */

// Supported currencies with detailed configuration
export const SUPPORTED_CURRENCIES = {
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    symbolPosition: 'before', // before or after the amount
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    locale: 'en-ZA',
    flag: '🇿🇦',
    isDefault: true, // Default currency for TD Learning Academy
    exchangeRateBase: 1.0, // Base currency for exchange calculations
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound Sterling',
    symbol: '£',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    locale: 'en-GB',
    flag: '🇬🇧',
    isDefault: false,
    exchangeRateBase: 0.045, // Approximate rate (1 ZAR = 0.045 GBP)
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    locale: 'en-US',
    flag: '🇺🇸',
    isDefault: false,
    exchangeRateBase: 0.055, // Approximate rate (1 ZAR = 0.055 USD)
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    locale: 'en-EU',
    flag: '🇪🇺',
    isDefault: false,
    exchangeRateBase: 0.050, // Approximate rate (1 ZAR = 0.050 EUR)
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    locale: 'ar-AE',
    flag: '🇦🇪',
    isDefault: false,
    exchangeRateBase: 0.20, // Approximate rate (1 ZAR = 0.20 AED)
  },
};

// Currency codes array for easy iteration
export const CURRENCY_CODES = Object.keys(SUPPORTED_CURRENCIES);

// Default currency (South African Rand for TD Learning Academy)
export const DEFAULT_CURRENCY = 'ZAR';

// Exchange rate configuration
export const EXCHANGE_RATE_CONFIG = {
  baseCurrency: 'ZAR', // TD Learning Academy's base currency
  lastUpdated: new Date().toISOString(),
  source: 'manual', // manual, api, or external
  updateFrequency: 'daily', // daily, weekly, manual
  
  // Note: In production, these should be fetched from a real exchange rate API
  rates: {
    ZAR: 1.0,      // Base currency
    GBP: 0.045,    // 1 ZAR = 0.045 GBP
    USD: 0.055,    // 1 ZAR = 0.055 USD
    EUR: 0.050,    // 1 ZAR = 0.050 EUR
    AED: 0.20,     // 1 ZAR = 0.20 AED
  },
};

// Currency formatting utilities
export const formatCurrency = (amount, currencyCode = DEFAULT_CURRENCY, options = {}) => {
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  if (!currency) {
    console.warn(`Unsupported currency: ${currencyCode}`);
    return `${amount}`;
  }

  const {
    showSymbol = true,
    showCode = false,
    decimalPlaces = currency.decimalPlaces,
    locale = currency.locale,
  } = options;

  // Format the number
  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Math.abs(amount));

  // Build the formatted string
  let result = '';
  
  if (showSymbol && currency.symbolPosition === 'before') {
    result += currency.symbol;
  }
  
  result += formattedAmount;
  
  if (showSymbol && currency.symbolPosition === 'after') {
    result += currency.symbol;
  }
  
  if (showCode) {
    result += ` ${currency.code}`;
  }

  // Handle negative amounts
  if (amount < 0) {
    result = `-${result}`;
  }

  return result;
};

// Parse currency string back to number
export const parseCurrency = (currencyString, currencyCode = DEFAULT_CURRENCY) => {
  const currency = SUPPORTED_CURRENCIES[currencyCode];
  if (!currency) return 0;

  // Remove currency symbol and code
  let cleanString = currencyString
    .replace(currency.symbol, '')
    .replace(currency.code, '')
    .replace(/\s/g, '') // Remove spaces
    .replace(new RegExp(`\\${currency.thousandsSeparator}`, 'g'), '') // Remove thousands separator
    .replace(currency.decimalSeparator, '.'); // Normalize decimal separator

  return parseFloat(cleanString) || 0;
};

// Convert between currencies
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATE_CONFIG.rates[fromCurrency];
  const toRate = EXCHANGE_RATE_CONFIG.rates[toCurrency];

  if (!fromRate || !toRate) {
    console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    return amount;
  }

  // Convert to base currency (ZAR) first, then to target currency
  const baseAmount = amount / fromRate;
  const convertedAmount = baseAmount * toRate;

  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

// Get currency display options for dropdowns
export const getCurrencyOptions = () => {
  return CURRENCY_CODES.map(code => {
    const currency = SUPPORTED_CURRENCIES[code];
    return {
      value: code,
      label: `${currency.flag} ${currency.name} (${currency.symbol})`,
      shortLabel: `${currency.symbol} ${code}`,
      currency: currency,
    };
  });
};

// Get currency by code
export const getCurrency = (code) => {
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];
};

// Validate currency code
export const isValidCurrency = (code) => {
  return CURRENCY_CODES.includes(code);
};

// Get default rates for session types in different currencies
export const getDefaultRatesInCurrency = (currencyCode) => {
  const baseCurrency = DEFAULT_CURRENCY;
  const baseRates = {
    individual: 350,
    group: 250,
    online: 300,
    intensive: 450,
    examPrep: 400,
    homework: 200,
  };

  if (currencyCode === baseCurrency) {
    return baseRates;
  }

  // Convert base rates to target currency
  const convertedRates = {};
  Object.entries(baseRates).forEach(([sessionType, rate]) => {
    convertedRates[sessionType] = convertCurrency(rate, baseCurrency, currencyCode);
  });

  return convertedRates;
};

// Currency validation for forms
export const validateCurrencyAmount = (amount, currencyCode) => {
  const currency = getCurrency(currencyCode);
  const numAmount = typeof amount === 'string' ? parseCurrency(amount, currencyCode) : amount;

  const errors = [];

  if (isNaN(numAmount)) {
    errors.push('Invalid amount format');
  }

  if (numAmount < 0) {
    errors.push('Amount cannot be negative');
  }

  if (numAmount > 999999) {
    errors.push('Amount is too large');
  }

  // Check decimal places
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > currency.decimalPlaces) {
    errors.push(`Maximum ${currency.decimalPlaces} decimal places allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    amount: numAmount,
  };
};

// Update exchange rates (placeholder for future API integration)
export const updateExchangeRates = async () => {
  // TODO: Integrate with real exchange rate API
  // For now, return current rates
  console.log('Exchange rates update - using manual rates');
  return EXCHANGE_RATE_CONFIG.rates;
};

// Get exchange rate between two currencies
export const getExchangeRate = (fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return 1;
  
  const fromRate = EXCHANGE_RATE_CONFIG.rates[fromCurrency];
  const toRate = EXCHANGE_RATE_CONFIG.rates[toCurrency];
  
  if (!fromRate || !toRate) return 1;
  
  return toRate / fromRate;
};

// Format currency for display in tables and lists
export const formatCurrencyCompact = (amount, currencyCode) => {
  return formatCurrency(amount, currencyCode, { 
    showSymbol: true, 
    showCode: false 
  });
};

// Format currency with full details
export const formatCurrencyFull = (amount, currencyCode) => {
  const currency = getCurrency(currencyCode);
  return `${formatCurrency(amount, currencyCode)} ${currency.name}`;
};

export default {
  SUPPORTED_CURRENCIES,
  CURRENCY_CODES,
  DEFAULT_CURRENCY,
  EXCHANGE_RATE_CONFIG,
  formatCurrency,
  parseCurrency,
  convertCurrency,
  getCurrencyOptions,
  getCurrency,
  isValidCurrency,
  getDefaultRatesInCurrency,
  validateCurrencyAmount,
  updateExchangeRates,
  getExchangeRate,
  formatCurrencyCompact,
  formatCurrencyFull,
};
