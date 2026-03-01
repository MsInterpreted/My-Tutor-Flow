// MyTutorFlow - Payment Service
// Handles payment providers, Solana integration, refunds, and payment status tracking

import firebaseService from './firebaseService';

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
  CANCELLED: 'cancelled',
};

export const PAYMENT_PROVIDERS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  PAYFAST: 'payfast',
  SOLANA: 'solana',
  MANUAL: 'manual',
  EFT: 'eft',
};

const PROVIDER_DISPLAY_NAMES = {
  [PAYMENT_PROVIDERS.STRIPE]: 'Stripe',
  [PAYMENT_PROVIDERS.PAYPAL]: 'PayPal',
  [PAYMENT_PROVIDERS.PAYFAST]: 'PayFast',
  [PAYMENT_PROVIDERS.SOLANA]: 'Solana',
  [PAYMENT_PROVIDERS.MANUAL]: 'Manual',
  [PAYMENT_PROVIDERS.EFT]: 'EFT / Bank Transfer',
};

// Provider fee rates (approximate)
const PROVIDER_FEES = {
  [PAYMENT_PROVIDERS.STRIPE]: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
  [PAYMENT_PROVIDERS.PAYPAL]: { percentage: 3.49, fixed: 0.49, currency: 'USD' },
  [PAYMENT_PROVIDERS.PAYFAST]: { percentage: 3.5, fixed: 2.0, currency: 'ZAR' },
  [PAYMENT_PROVIDERS.SOLANA]: { percentage: 0, fixed: 0.00025, currency: 'SOL' },
  [PAYMENT_PROVIDERS.MANUAL]: { percentage: 0, fixed: 0, currency: 'any' },
  [PAYMENT_PROVIDERS.EFT]: { percentage: 0, fixed: 0, currency: 'any' },
};

// Currency to suggested providers mapping
const CURRENCY_PROVIDERS = {
  ZAR: [PAYMENT_PROVIDERS.PAYFAST, PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.EFT],
  USD: [PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.PAYPAL, PAYMENT_PROVIDERS.SOLANA],
  GBP: [PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.PAYPAL],
  EUR: [PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.PAYPAL],
  AED: [PAYMENT_PROVIDERS.STRIPE, PAYMENT_PROVIDERS.MANUAL],
  SOL: [PAYMENT_PROVIDERS.SOLANA],
};

class PaymentService {
  // Get display name for a provider
  getProviderDisplayName(provider) {
    return PROVIDER_DISPLAY_NAMES[provider] || provider;
  }

  // Calculate estimated fee for a provider
  calculateFee(amount, provider) {
    const feeStructure = PROVIDER_FEES[provider];
    if (!feeStructure) return 0;
    const percentageFee = (amount * feeStructure.percentage) / 100;
    return Math.round((percentageFee + feeStructure.fixed) * 100) / 100;
  }

  // Get suggested providers for a currency
  getProvidersForCurrency(currency) {
    return CURRENCY_PROVIDERS[currency] || [PAYMENT_PROVIDERS.MANUAL];
  }

  // Get all available providers
  getAllProviders() {
    return Object.entries(PROVIDER_DISPLAY_NAMES).map(([value, label]) => ({
      value,
      label,
      fees: PROVIDER_FEES[value],
    }));
  }

  // Create a Solana payment link / details for an invoice
  async createSolanaPaymentLink(invoiceId, recipientAddress, amount) {
    try {
      const paymentRecord = {
        invoiceId,
        provider: PAYMENT_PROVIDERS.SOLANA,
        recipientAddress,
        requestedAmount: amount,
        currency: 'SOL',
        status: PAYMENT_STATUS.PENDING,
        createdAt: new Date(),
      };

      const paymentId = await firebaseService.addPaymentRecord(paymentRecord);
      return { id: paymentId, ...paymentRecord };
    } catch (error) {
      console.error('Failed to create Solana payment link:', error);
      throw error;
    }
  }

  // Verify a Solana payment after on-chain confirmation
  async verifySolanaPayment(paymentId, txSignature, fromAddress) {
    try {
      await firebaseService.updatePaymentRecord(paymentId, {
        status: PAYMENT_STATUS.COMPLETED,
        txSignature,
        fromAddress,
        completedAt: new Date(),
      });
      return { success: true, paymentId, txSignature };
    } catch (error) {
      console.error('Failed to verify Solana payment:', error);
      throw error;
    }
  }

  // Record a manual/EFT payment
  async recordPayment(invoiceId, paymentData) {
    try {
      const paymentRecord = {
        invoiceId,
        provider: paymentData.provider || PAYMENT_PROVIDERS.MANUAL,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference: paymentData.reference || '',
        notes: paymentData.notes || '',
        status: PAYMENT_STATUS.COMPLETED,
        paymentDate: paymentData.paymentDate || new Date(),
        createdAt: new Date(),
      };

      const paymentId = await firebaseService.addPaymentRecord(paymentRecord);
      return { id: paymentId, ...paymentRecord };
    } catch (error) {
      console.error('Failed to record payment:', error);
      throw error;
    }
  }

  // Process a refund
  async refundPayment(paymentId, refundData) {
    try {
      const refundRecord = {
        paymentId,
        type: refundData.type || 'full', // 'full' | 'partial'
        method: refundData.method || 'credit', // 'provider' | 'credit'
        amount: refundData.amount,
        currency: refundData.currency,
        reason: refundData.reason || '',
        status: PAYMENT_STATUS.PROCESSING,
        createdAt: new Date(),
      };

      // For Stripe/PayPal, the actual refund would be processed via Cloud Functions
      // For others, mark as manual_required
      const payment = await firebaseService.getPaymentRecord(paymentId);
      if (!payment) throw new Error('Payment not found');

      if (refundData.method === 'provider') {
        if (payment.provider === PAYMENT_PROVIDERS.STRIPE || payment.provider === PAYMENT_PROVIDERS.PAYPAL) {
          refundRecord.status = PAYMENT_STATUS.PROCESSING;
        } else {
          refundRecord.status = 'manual_required';
        }
      } else {
        // Credit-based refund can be processed immediately
        refundRecord.status = PAYMENT_STATUS.COMPLETED;
      }

      const refundId = await firebaseService.addRefundRecord(refundRecord);

      // Update the payment status
      const isFullRefund = refundData.type === 'full';
      await firebaseService.updatePaymentRecord(paymentId, {
        status: isFullRefund ? PAYMENT_STATUS.REFUNDED : PAYMENT_STATUS.PARTIALLY_REFUNDED,
        refundedAmount: (payment.refundedAmount || 0) + refundData.amount,
        lastRefundDate: new Date(),
      });

      return { id: refundId, ...refundRecord };
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw error;
    }
  }

  // Get refunds for a specific payment
  async getRefundsForPayment(paymentId) {
    try {
      return await firebaseService.getRefundsForPayment(paymentId);
    } catch (error) {
      console.error('Failed to get refunds:', error);
      return [];
    }
  }

  // Get payment settings for the tenant
  async getPaymentSettings() {
    try {
      return await firebaseService.getPaymentSettings();
    } catch (error) {
      console.error('Failed to get payment settings:', error);
      return null;
    }
  }

  // Save payment settings
  async savePaymentSettings(settings) {
    try {
      await firebaseService.savePaymentSettings(settings);
      return { success: true };
    } catch (error) {
      console.error('Failed to save payment settings:', error);
      throw error;
    }
  }
}

const paymentService = new PaymentService();
export default paymentService;
