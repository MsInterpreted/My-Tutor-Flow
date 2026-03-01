import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebaseService before importing paymentService
vi.mock('./firebaseService', () => ({
  default: {
    addPaymentRecord: vi.fn().mockResolvedValue('payment-123'),
    getPaymentRecord: vi.fn(),
    updatePaymentRecord: vi.fn().mockResolvedValue(undefined),
    addRefundRecord: vi.fn().mockResolvedValue('refund-123'),
    getRefundsForPayment: vi.fn().mockResolvedValue([]),
    getPaymentSettings: vi.fn().mockResolvedValue(null),
    savePaymentSettings: vi.fn().mockResolvedValue(undefined),
  },
}));

import paymentService, {
  PAYMENT_STATUS,
  PAYMENT_PROVIDERS,
} from './paymentService';
import firebaseService from './firebaseService';

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Fee Calculation', () => {
    it('calculates Stripe fees correctly (2.9% + $0.30)', () => {
      const fee = paymentService.calculateFee(100, PAYMENT_PROVIDERS.STRIPE);
      expect(fee).toBe(3.2); // 2.9 + 0.30
    });

    it('calculates PayPal fees correctly (3.49% + $0.49)', () => {
      const fee = paymentService.calculateFee(100, PAYMENT_PROVIDERS.PAYPAL);
      expect(fee).toBe(3.98); // 3.49 + 0.49
    });

    it('returns zero fee for manual payments', () => {
      const fee = paymentService.calculateFee(100, PAYMENT_PROVIDERS.MANUAL);
      expect(fee).toBe(0);
    });

    it('returns zero fee for EFT payments', () => {
      const fee = paymentService.calculateFee(100, PAYMENT_PROVIDERS.EFT);
      expect(fee).toBe(0);
    });

    it('calculates Solana fees (fixed 0.00025 SOL)', () => {
      const fee = paymentService.calculateFee(1, PAYMENT_PROVIDERS.SOLANA);
      // Fee = (1 * 0 / 100) + 0.00025 = 0.00025, rounded to 2 decimals = 0
      // The rounding in calculateFee rounds to 2 decimal places, so 0.00025 -> 0
      expect(fee).toBe(0);
    });

    it('returns 0 for unknown provider', () => {
      const fee = paymentService.calculateFee(100, 'unknown');
      expect(fee).toBe(0);
    });

    it('handles zero amount', () => {
      const fee = paymentService.calculateFee(0, PAYMENT_PROVIDERS.STRIPE);
      expect(fee).toBe(0.3); // Fixed fee only
    });
  });

  describe('Provider Selection by Currency', () => {
    it('returns PayFast first for ZAR', () => {
      const providers = paymentService.getProvidersForCurrency('ZAR');
      expect(providers[0]).toBe(PAYMENT_PROVIDERS.PAYFAST);
      expect(providers).toContain(PAYMENT_PROVIDERS.STRIPE);
    });

    it('returns Stripe first for USD', () => {
      const providers = paymentService.getProvidersForCurrency('USD');
      expect(providers[0]).toBe(PAYMENT_PROVIDERS.STRIPE);
      expect(providers).toContain(PAYMENT_PROVIDERS.SOLANA);
    });

    it('returns Solana for SOL currency', () => {
      const providers = paymentService.getProvidersForCurrency('SOL');
      expect(providers).toContain(PAYMENT_PROVIDERS.SOLANA);
    });

    it('returns manual for unknown currency', () => {
      const providers = paymentService.getProvidersForCurrency('BTC');
      expect(providers).toContain(PAYMENT_PROVIDERS.MANUAL);
    });
  });

  describe('Provider Display Names', () => {
    it('returns correct display names', () => {
      expect(paymentService.getProviderDisplayName(PAYMENT_PROVIDERS.STRIPE)).toBe('Stripe');
      expect(paymentService.getProviderDisplayName(PAYMENT_PROVIDERS.PAYPAL)).toBe('PayPal');
      expect(paymentService.getProviderDisplayName(PAYMENT_PROVIDERS.SOLANA)).toBe('Solana');
      expect(paymentService.getProviderDisplayName(PAYMENT_PROVIDERS.PAYFAST)).toBe('PayFast');
      expect(paymentService.getProviderDisplayName(PAYMENT_PROVIDERS.EFT)).toBe('EFT / Bank Transfer');
    });

    it('returns raw value for unknown provider', () => {
      expect(paymentService.getProviderDisplayName('unknown')).toBe('unknown');
    });
  });

  describe('Payment Link Creation (Solana)', () => {
    it('creates a Solana payment link', async () => {
      const result = await paymentService.createSolanaPaymentLink('inv-1', 'abc123address', 0.5);
      expect(firebaseService.addPaymentRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceId: 'inv-1',
          provider: PAYMENT_PROVIDERS.SOLANA,
          recipientAddress: 'abc123address',
          requestedAmount: 0.5,
          currency: 'SOL',
          status: PAYMENT_STATUS.PENDING,
        })
      );
      expect(result.id).toBe('payment-123');
    });
  });

  describe('Refund Processing', () => {
    it('processes a credit-based refund', async () => {
      (firebaseService.getPaymentRecord as any).mockResolvedValue({
        id: 'pay-1',
        provider: PAYMENT_PROVIDERS.MANUAL,
        status: PAYMENT_STATUS.COMPLETED,
        refundedAmount: 0,
      });

      const result = await paymentService.refundPayment('pay-1', {
        type: 'full',
        method: 'credit',
        amount: 100,
        currency: 'ZAR',
        reason: 'Test refund',
      });

      expect(result.status).toBe(PAYMENT_STATUS.COMPLETED);
      expect(firebaseService.addRefundRecord).toHaveBeenCalled();
      expect(firebaseService.updatePaymentRecord).toHaveBeenCalledWith(
        'pay-1',
        expect.objectContaining({
          status: PAYMENT_STATUS.REFUNDED,
          refundedAmount: 100,
        })
      );
    });

    it('marks provider refund as processing for Stripe', async () => {
      (firebaseService.getPaymentRecord as any).mockResolvedValue({
        id: 'pay-2',
        provider: PAYMENT_PROVIDERS.STRIPE,
        status: PAYMENT_STATUS.COMPLETED,
        refundedAmount: 0,
      });

      const result = await paymentService.refundPayment('pay-2', {
        type: 'full',
        method: 'provider',
        amount: 50,
        currency: 'USD',
        reason: 'Stripe refund',
      });

      expect(result.status).toBe(PAYMENT_STATUS.PROCESSING);
    });

    it('marks provider refund as manual_required for non-Stripe/PayPal', async () => {
      (firebaseService.getPaymentRecord as any).mockResolvedValue({
        id: 'pay-3',
        provider: PAYMENT_PROVIDERS.PAYFAST,
        status: PAYMENT_STATUS.COMPLETED,
        refundedAmount: 0,
      });

      const result = await paymentService.refundPayment('pay-3', {
        type: 'full',
        method: 'provider',
        amount: 200,
        currency: 'ZAR',
        reason: 'PayFast refund',
      });

      expect(result.status).toBe('manual_required');
    });

    it('sets partially_refunded for partial refunds', async () => {
      (firebaseService.getPaymentRecord as any).mockResolvedValue({
        id: 'pay-4',
        provider: PAYMENT_PROVIDERS.MANUAL,
        status: PAYMENT_STATUS.COMPLETED,
        refundedAmount: 0,
      });

      await paymentService.refundPayment('pay-4', {
        type: 'partial',
        method: 'credit',
        amount: 30,
        currency: 'ZAR',
        reason: 'Partial refund',
      });

      expect(firebaseService.updatePaymentRecord).toHaveBeenCalledWith(
        'pay-4',
        expect.objectContaining({
          status: PAYMENT_STATUS.PARTIALLY_REFUNDED,
          refundedAmount: 30,
        })
      );
    });
  });

  describe('PAYMENT_STATUS enum', () => {
    it('includes all required statuses', () => {
      expect(PAYMENT_STATUS.PENDING).toBe('pending');
      expect(PAYMENT_STATUS.COMPLETED).toBe('completed');
      expect(PAYMENT_STATUS.REFUNDED).toBe('refunded');
      expect(PAYMENT_STATUS.PARTIALLY_REFUNDED).toBe('partially_refunded');
      expect(PAYMENT_STATUS.FAILED).toBe('failed');
      expect(PAYMENT_STATUS.CANCELLED).toBe('cancelled');
    });
  });

  describe('getAllProviders', () => {
    it('returns all providers with labels and fee info', () => {
      const providers = paymentService.getAllProviders();
      expect(providers.length).toBeGreaterThanOrEqual(5);
      providers.forEach(p => {
        expect(p).toHaveProperty('value');
        expect(p).toHaveProperty('label');
        expect(p).toHaveProperty('fees');
      });
    });
  });
});
