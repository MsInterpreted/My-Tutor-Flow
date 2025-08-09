// TD Learning Academy - Student Currency Utilities
// Helper functions for managing student currency preferences and billing

import { 
  DEFAULT_CURRENCY, 
  formatCurrency, 
  getCurrency, 
  validateCurrencyAmount,
  getDefaultRatesInCurrency,
  convertCurrency 
} from '../config/currencyConfig';
import currencyService from '../services/currencyService';

/**
 * Student Currency Management Utilities
 */

// Default student currency configuration
export const getDefaultStudentCurrencyConfig = () => ({
  preferredCurrency: DEFAULT_CURRENCY,
  initialAmount: 0,
  billingRates: {
    online: { amount: 300, currency: DEFAULT_CURRENCY },
    in_person_class: { amount: 250, currency: DEFAULT_CURRENCY },
    in_person_one_on_one: { amount: 350, currency: DEFAULT_CURRENCY },
    intensive: { amount: 450, currency: DEFAULT_CURRENCY },
    exam_prep: { amount: 400, currency: DEFAULT_CURRENCY },
    homework: { amount: 200, currency: DEFAULT_CURRENCY },
  },
  currencySettings: {
    displayFormat: 'symbol',
    showExchangeRate: false,
    lastCurrencyUpdate: new Date().toISOString(),
  },
});

// Initialize student with currency settings
export const initializeStudentCurrency = (studentData, selectedCurrency = DEFAULT_CURRENCY) => {
  const defaultConfig = getDefaultStudentCurrencyConfig();
  const defaultRates = getDefaultRatesInCurrency(selectedCurrency);

  return {
    ...studentData,
    preferredCurrency: selectedCurrency,
    initialAmount: 0,
    billingRates: {
      online: { amount: defaultRates.online, currency: selectedCurrency },
      in_person_class: { amount: defaultRates.group, currency: selectedCurrency },
      in_person_one_on_one: { amount: defaultRates.individual, currency: selectedCurrency },
      intensive: { amount: defaultRates.intensive, currency: selectedCurrency },
      exam_prep: { amount: defaultRates.examPrep, currency: selectedCurrency },
      homework: { amount: defaultRates.homework, currency: selectedCurrency },
    },
    currencySettings: defaultConfig.currencySettings,
  };
};

// Update student currency and convert existing rates
export const updateStudentCurrency = (studentData, newCurrency, convertRates = true) => {
  const oldCurrency = studentData.preferredCurrency || DEFAULT_CURRENCY;
  
  if (oldCurrency === newCurrency) {
    return studentData; // No change needed
  }

  const updatedData = {
    ...studentData,
    preferredCurrency: newCurrency,
    currencySettings: {
      ...studentData.currencySettings,
      lastCurrencyUpdate: new Date().toISOString(),
    },
  };

  // Convert existing billing rates if requested
  if (convertRates && studentData.billingRates) {
    const convertedRates = {};
    
    Object.entries(studentData.billingRates).forEach(([sessionType, rateData]) => {
      if (rateData && rateData.amount) {
        const convertedAmount = convertCurrency(rateData.amount, oldCurrency, newCurrency);
        convertedRates[sessionType] = {
          amount: convertedAmount,
          currency: newCurrency,
        };
      } else {
        // Use default rate for this session type in new currency
        const defaultRates = getDefaultRatesInCurrency(newCurrency);
        const sessionTypeMap = {
          online: 'online',
          in_person_class: 'group',
          in_person_one_on_one: 'individual',
          intensive: 'intensive',
          exam_prep: 'examPrep',
          homework: 'homework',
        };
        
        convertedRates[sessionType] = {
          amount: defaultRates[sessionTypeMap[sessionType]] || defaultRates.individual,
          currency: newCurrency,
        };
      }
    });

    updatedData.billingRates = convertedRates;
  }

  // Convert initial amount if it exists
  if (studentData.initialAmount && convertRates) {
    updatedData.initialAmount = convertCurrency(
      studentData.initialAmount, 
      oldCurrency, 
      newCurrency
    );
  }

  return updatedData;
};

// Validate student currency data
export const validateStudentCurrencyData = (studentData) => {
  const errors = [];

  // Validate preferred currency
  if (!studentData.preferredCurrency) {
    errors.push('Preferred currency is required');
  } else if (!['ZAR', 'USD', 'GBP', 'EUR', 'AED'].includes(studentData.preferredCurrency)) {
    errors.push('Invalid currency code');
  }

  // Validate initial amount
  if (studentData.initialAmount !== undefined && studentData.initialAmount !== null) {
    const amountValidation = validateCurrencyAmount(
      studentData.initialAmount, 
      studentData.preferredCurrency
    );
    if (!amountValidation.isValid) {
      errors.push(...amountValidation.errors.map(err => `Initial amount: ${err}`));
    }
  }

  // Validate billing rates
  if (studentData.billingRates) {
    Object.entries(studentData.billingRates).forEach(([sessionType, rateData]) => {
      if (rateData && rateData.amount !== undefined) {
        const rateValidation = validateCurrencyAmount(
          rateData.amount, 
          rateData.currency || studentData.preferredCurrency
        );
        if (!rateValidation.isValid) {
          errors.push(...rateValidation.errors.map(err => `${sessionType} rate: ${err}`));
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format student billing rate for display
export const formatStudentBillingRate = (rateData, fallbackCurrency = DEFAULT_CURRENCY) => {
  if (!rateData || !rateData.amount) {
    return 'Not set';
  }

  const currency = rateData.currency || fallbackCurrency;
  return formatCurrency(rateData.amount, currency);
};

// Get student's effective billing rate for a session type
export const getStudentSessionRate = (studentData, sessionType) => {
  // Check if student has custom rate for this session type
  if (studentData.billingRates && studentData.billingRates[sessionType]) {
    const rateData = studentData.billingRates[sessionType];
    if (rateData.amount) {
      return {
        amount: rateData.amount,
        currency: rateData.currency || studentData.preferredCurrency,
        isCustom: true,
      };
    }
  }

  // Fall back to default rates in student's currency
  const studentCurrency = studentData.preferredCurrency || DEFAULT_CURRENCY;
  const defaultRates = getDefaultRatesInCurrency(studentCurrency);
  
  const sessionTypeMap = {
    online: 'online',
    in_person_class: 'group',
    in_person_one_on_one: 'individual',
    intensive: 'intensive',
    exam_prep: 'examPrep',
    homework: 'homework',
  };

  const rateKey = sessionTypeMap[sessionType] || 'individual';
  
  return {
    amount: defaultRates[rateKey],
    currency: studentCurrency,
    isCustom: false,
  };
};

// Calculate session cost for student
export const calculateStudentSessionCost = (studentData, sessionType, duration) => {
  const rate = getStudentSessionRate(studentData, sessionType);
  const cost = currencyService.calculateSessionCost(
    sessionType, 
    duration, 
    rate.currency, 
    rate.amount
  );

  return {
    cost,
    currency: rate.currency,
    rate: rate.amount,
    duration,
    formattedCost: formatCurrency(cost, rate.currency),
    isCustomRate: rate.isCustom,
  };
};

// Get currency display info for student
export const getStudentCurrencyDisplay = (studentData) => {
  const currency = getCurrency(studentData.preferredCurrency || DEFAULT_CURRENCY);
  const settings = studentData.currencySettings || {};

  return {
    code: currency.code,
    name: currency.name,
    symbol: currency.symbol,
    flag: currency.flag,
    displayFormat: settings.displayFormat || 'symbol',
    showExchangeRate: settings.showExchangeRate || false,
  };
};

// Format amount in student's preferred currency
export const formatAmountForStudent = (amount, studentData, options = {}) => {
  const currency = studentData.preferredCurrency || DEFAULT_CURRENCY;
  const settings = studentData.currencySettings || {};
  
  const formatOptions = {
    showSymbol: true,
    showCode: settings.displayFormat === 'code' || settings.displayFormat === 'both',
    ...options,
  };

  return formatCurrency(amount, currency, formatOptions);
};

// Get student billing summary
export const getStudentBillingSummary = (studentData) => {
  const currency = studentData.preferredCurrency || DEFAULT_CURRENCY;
  const currencyInfo = getCurrency(currency);
  
  const summary = {
    currency: {
      code: currency,
      name: currencyInfo.name,
      symbol: currencyInfo.symbol,
      flag: currencyInfo.flag,
    },
    initialAmount: studentData.initialAmount || 0,
    formattedInitialAmount: formatCurrency(studentData.initialAmount || 0, currency),
    billingRates: {},
    hasCustomRates: false,
  };

  // Process billing rates
  if (studentData.billingRates) {
    Object.entries(studentData.billingRates).forEach(([sessionType, rateData]) => {
      if (rateData && rateData.amount) {
        summary.billingRates[sessionType] = {
          amount: rateData.amount,
          currency: rateData.currency || currency,
          formatted: formatCurrency(rateData.amount, rateData.currency || currency),
        };
        summary.hasCustomRates = true;
      }
    });
  }

  return summary;
};

// Migrate legacy student data to include currency support
export const migrateStudentToCurrencySupport = (legacyStudentData) => {
  // Check if student already has currency support
  if (legacyStudentData.preferredCurrency) {
    return legacyStudentData; // Already migrated
  }

  // Initialize with default currency configuration
  const migratedData = initializeStudentCurrency(legacyStudentData, DEFAULT_CURRENCY);

  // If legacy billing rates exist, preserve them
  if (legacyStudentData.billingRates) {
    Object.entries(legacyStudentData.billingRates).forEach(([sessionType, rateData]) => {
      if (rateData && rateData.amount) {
        migratedData.billingRates[sessionType] = {
          amount: parseFloat(rateData.amount) || 0,
          currency: rateData.currency || DEFAULT_CURRENCY,
        };
      }
    });
  }

  return {
    ...migratedData,
    updatedAt: new Date().toISOString(),
  };
};

export default {
  getDefaultStudentCurrencyConfig,
  initializeStudentCurrency,
  updateStudentCurrency,
  validateStudentCurrencyData,
  formatStudentBillingRate,
  getStudentSessionRate,
  calculateStudentSessionCost,
  getStudentCurrencyDisplay,
  formatAmountForStudent,
  getStudentBillingSummary,
  migrateStudentToCurrencySupport,
};
