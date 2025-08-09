// TD Learning Academy - Currency Management Service
// Handles all currency-related operations and data management

import { 
  SUPPORTED_CURRENCIES, 
  DEFAULT_CURRENCY, 
  formatCurrency, 
  convertCurrency, 
  getCurrency,
  validateCurrencyAmount,
  getDefaultRatesInCurrency 
} from '../config/currencyConfig';

/**
 * Currency Service for TD Learning Academy
 * Manages student currencies, billing calculations, and currency conversions
 */

class CurrencyService {
  constructor() {
    this.supportedCurrencies = SUPPORTED_CURRENCIES;
    this.defaultCurrency = DEFAULT_CURRENCY;
  }

  // Student Currency Management
  
  /**
   * Set student's preferred currency and initial amount
   */
  setStudentCurrency(studentId, currencyCode, initialAmount = 0) {
    const validation = validateCurrencyAmount(initialAmount, currencyCode);
    
    if (!validation.isValid) {
      throw new Error(`Invalid currency amount: ${validation.errors.join(', ')}`);
    }

    return {
      studentId,
      currency: currencyCode,
      initialAmount: validation.amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Update student's currency settings
   */
  updateStudentCurrency(studentId, newCurrencyCode, newAmount = null) {
    const currencyData = {
      studentId,
      currency: newCurrencyCode,
      updatedAt: new Date().toISOString(),
    };

    if (newAmount !== null) {
      const validation = validateCurrencyAmount(newAmount, newCurrencyCode);
      if (!validation.isValid) {
        throw new Error(`Invalid currency amount: ${validation.errors.join(', ')}`);
      }
      currencyData.amount = validation.amount;
    }

    return currencyData;
  }

  // Billing Calculations

  /**
   * Calculate session cost in student's preferred currency
   */
  calculateSessionCost(sessionType, duration, studentCurrency = DEFAULT_CURRENCY, customRate = null) {
    let baseRate;
    
    if (customRate) {
      baseRate = customRate;
    } else {
      const defaultRates = getDefaultRatesInCurrency(studentCurrency);
      baseRate = defaultRates[sessionType] || defaultRates.individual;
    }

    const totalCost = (baseRate * duration) / 60; // Convert minutes to hours
    return Math.round(totalCost * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Calculate total billing amount for multiple sessions
   */
  calculateTotalBilling(sessions, studentCurrency = DEFAULT_CURRENCY) {
    let total = 0;
    const breakdown = [];

    sessions.forEach(session => {
      const cost = this.calculateSessionCost(
        session.type,
        session.duration,
        studentCurrency,
        session.customRate
      );

      total += cost;
      breakdown.push({
        sessionId: session.id,
        type: session.type,
        duration: session.duration,
        cost: cost,
        currency: studentCurrency,
        date: session.date,
      });
    });

    return {
      total: Math.round(total * 100) / 100,
      currency: studentCurrency,
      breakdown,
      formattedTotal: formatCurrency(total, studentCurrency),
    };
  }

  /**
   * Convert billing amount between currencies
   */
  convertBillingAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return {
        originalAmount: amount,
        convertedAmount: amount,
        fromCurrency,
        toCurrency,
        exchangeRate: 1,
        formattedOriginal: formatCurrency(amount, fromCurrency),
        formattedConverted: formatCurrency(amount, toCurrency),
      };
    }

    const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    const exchangeRate = convertedAmount / amount;

    return {
      originalAmount: amount,
      convertedAmount,
      fromCurrency,
      toCurrency,
      exchangeRate,
      formattedOriginal: formatCurrency(amount, fromCurrency),
      formattedConverted: formatCurrency(convertedAmount, toCurrency),
    };
  }

  // Invoice Generation

  /**
   * Generate invoice data with currency formatting
   */
  generateInvoiceData(studentData, sessions, additionalCharges = []) {
    const studentCurrency = studentData.currency || DEFAULT_CURRENCY;
    const billing = this.calculateTotalBilling(sessions, studentCurrency);
    
    // Calculate additional charges
    let additionalTotal = 0;
    const formattedAdditionalCharges = additionalCharges.map(charge => {
      const chargeAmount = charge.amount || 0;
      additionalTotal += chargeAmount;
      
      return {
        ...charge,
        amount: chargeAmount,
        formattedAmount: formatCurrency(chargeAmount, studentCurrency),
      };
    });

    const subtotal = billing.total + additionalTotal;
    const tax = 0; // No VAT for tutoring services in SA (typically)
    const grandTotal = subtotal + tax;

    return {
      student: studentData,
      currency: studentCurrency,
      sessions: billing.breakdown,
      additionalCharges: formattedAdditionalCharges,
      totals: {
        sessionsTotal: billing.total,
        additionalTotal,
        subtotal,
        tax,
        grandTotal,
        formattedSessionsTotal: formatCurrency(billing.total, studentCurrency),
        formattedAdditionalTotal: formatCurrency(additionalTotal, studentCurrency),
        formattedSubtotal: formatCurrency(subtotal, studentCurrency),
        formattedTax: formatCurrency(tax, studentCurrency),
        formattedGrandTotal: formatCurrency(grandTotal, studentCurrency),
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // Currency Display Utilities

  /**
   * Format amount for display in UI components
   */
  formatForDisplay(amount, currencyCode, options = {}) {
    return formatCurrency(amount, currencyCode, {
      showSymbol: true,
      showCode: false,
      ...options,
    });
  }

  /**
   * Format amount for reports and exports
   */
  formatForExport(amount, currencyCode) {
    return formatCurrency(amount, currencyCode, {
      showSymbol: true,
      showCode: true,
    });
  }

  /**
   * Get currency symbol for quick display
   */
  getCurrencySymbol(currencyCode) {
    const currency = getCurrency(currencyCode);
    return currency.symbol;
  }

  /**
   * Get currency name for display
   */
  getCurrencyName(currencyCode) {
    const currency = getCurrency(currencyCode);
    return currency.name;
  }

  // Validation and Utilities

  /**
   * Validate student currency data
   */
  validateStudentCurrencyData(data) {
    const errors = [];

    if (!data.currency || !SUPPORTED_CURRENCIES[data.currency]) {
      errors.push('Invalid or missing currency code');
    }

    if (data.initialAmount !== undefined) {
      const validation = validateCurrencyAmount(data.initialAmount, data.currency);
      if (!validation.isValid) {
        errors.push(...validation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get supported currencies for dropdown options
   */
  getSupportedCurrencies() {
    return Object.entries(SUPPORTED_CURRENCIES).map(([code, currency]) => ({
      value: code,
      label: `${currency.flag} ${currency.name}`,
      shortLabel: `${currency.symbol} ${code}`,
      symbol: currency.symbol,
      name: currency.name,
      isDefault: currency.isDefault,
    }));
  }

  /**
   * Get default rates for a specific currency
   */
  getSessionRatesForCurrency(currencyCode) {
    return getDefaultRatesInCurrency(currencyCode);
  }

  /**
   * Calculate exchange rate display
   */
  getExchangeRateDisplay(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return `1 ${fromCurrency} = 1 ${toCurrency}`;
    }

    const convertedAmount = convertCurrency(1, fromCurrency, toCurrency);
    return `1 ${fromCurrency} = ${formatCurrency(convertedAmount, toCurrency)} ${toCurrency}`;
  }

  // Analytics and Reporting

  /**
   * Calculate revenue by currency
   */
  calculateRevenueByCurrency(invoices) {
    const revenueByCurrency = {};

    invoices.forEach(invoice => {
      const currency = invoice.currency || DEFAULT_CURRENCY;
      if (!revenueByCurrency[currency]) {
        revenueByCurrency[currency] = {
          currency,
          total: 0,
          count: 0,
          invoices: [],
        };
      }

      revenueByCurrency[currency].total += invoice.total || 0;
      revenueByCurrency[currency].count += 1;
      revenueByCurrency[currency].invoices.push(invoice.id);
    });

    // Format totals
    Object.values(revenueByCurrency).forEach(data => {
      data.formattedTotal = formatCurrency(data.total, data.currency);
    });

    return revenueByCurrency;
  }

  /**
   * Convert all revenue to base currency for comparison
   */
  normalizeRevenueToBaseCurrency(revenueByCurrency) {
    let totalInBaseCurrency = 0;
    const normalizedData = {};

    Object.entries(revenueByCurrency).forEach(([currency, data]) => {
      const convertedAmount = convertCurrency(data.total, currency, DEFAULT_CURRENCY);
      totalInBaseCurrency += convertedAmount;
      
      normalizedData[currency] = {
        ...data,
        convertedToBase: convertedAmount,
        formattedConvertedToBase: formatCurrency(convertedAmount, DEFAULT_CURRENCY),
      };
    });

    return {
      totalInBaseCurrency,
      formattedTotalInBaseCurrency: formatCurrency(totalInBaseCurrency, DEFAULT_CURRENCY),
      currencyBreakdown: normalizedData,
    };
  }
}

// Create and export singleton instance
const currencyService = new CurrencyService();
export default currencyService;
