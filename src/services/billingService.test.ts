import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebaseService
vi.mock('./firebaseService', () => ({
  default: {
    getInvoice: vi.fn(),
    updateInvoicePayment: vi.fn().mockResolvedValue(undefined),
    addStudentCredit: vi.fn().mockResolvedValue('credit-123'),
    getStudentCredits: vi.fn().mockResolvedValue([]),
    getStudentCredit: vi.fn(),
    updateStudentCredit: vi.fn().mockResolvedValue(undefined),
    getInvoicesForStudent: vi.fn().mockResolvedValue([]),
  },
}));

import billingService from './billingService';
import firebaseService from './firebaseService';

describe('BillingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Currency Conversion', () => {
    it('returns same amount when currencies match', () => {
      const result = billingService.convertCurrency(100, 'ZAR', 'ZAR');
      expect(result).toBe(100);
    });

    it('converts ZAR to USD', () => {
      const result = billingService.convertCurrency(100, 'ZAR', 'USD');
      expect(result).toBe(5.5); // 100 * 0.055
    });

    it('converts USD to ZAR', () => {
      const result = billingService.convertCurrency(5.5, 'USD', 'ZAR');
      // 5.5 / 0.055 = 100, then * 1.0 = 100
      expect(result).toBe(100);
    });

    it('converts GBP to EUR', () => {
      const result = billingService.convertCurrency(100, 'GBP', 'EUR');
      // 100 / 0.043 * 0.051 = ~118.60
      expect(result).toBeCloseTo(118.60, 0);
    });

    it('rounds to 2 decimal places', () => {
      const result = billingService.convertCurrency(33.33, 'ZAR', 'USD');
      const decimalPart = result.toString().split('.')[1];
      expect(decimalPart ? decimalPart.length : 0).toBeLessThanOrEqual(2);
    });
  });

  describe('Payment Processing', () => {
    it('processes a full payment correctly', async () => {
      const mockInvoice = {
        id: 'inv-1',
        totalAmount: 500,
        paidAmount: 0,
        currency: 'ZAR',
        paymentHistory: [],
      };
      (firebaseService.getInvoice as any).mockResolvedValue(mockInvoice);

      const result = await billingService.processPayment('inv-1', {
        amount: 500,
        currency: 'ZAR',
        method: 'manual',
      });

      expect(result.success).toBe(true);
      expect(result.paymentProcessed).toBe(500);
      expect(result.overpayment).toBe(0);
      expect(firebaseService.updateInvoicePayment).toHaveBeenCalledWith(
        'inv-1',
        expect.objectContaining({
          paidAmount: 500,
          status: 'paid',
        })
      );
    });

    it('processes a partial payment correctly', async () => {
      const mockInvoice = {
        id: 'inv-2',
        totalAmount: 500,
        paidAmount: 0,
        currency: 'ZAR',
        paymentHistory: [],
      };
      (firebaseService.getInvoice as any).mockResolvedValue(mockInvoice);

      const result = await billingService.processPayment('inv-2', {
        amount: 200,
        currency: 'ZAR',
        method: 'manual',
      });

      expect(result.success).toBe(true);
      expect(result.paymentProcessed).toBe(200);
      expect(result.overpayment).toBe(0);
      expect(firebaseService.updateInvoicePayment).toHaveBeenCalledWith(
        'inv-2',
        expect.objectContaining({
          paidAmount: 200,
          status: 'partial',
        })
      );
    });

    it('handles overpayment by creating credit', async () => {
      const mockInvoice = {
        id: 'inv-3',
        totalAmount: 300,
        paidAmount: 0,
        studentId: 'student-1',
        currency: 'ZAR',
        paymentHistory: [],
      };
      (firebaseService.getInvoice as any).mockResolvedValue(mockInvoice);

      const result = await billingService.processPayment('inv-3', {
        amount: 350,
        currency: 'ZAR',
        method: 'manual',
      });

      expect(result.success).toBe(true);
      expect(result.paymentProcessed).toBe(300);
      expect(result.overpayment).toBe(50);
      expect(result.creditApplied).not.toBeNull();
      expect(firebaseService.addStudentCredit).toHaveBeenCalledWith(
        'student-1',
        expect.objectContaining({
          amount: 50,
          source: 'overpayment',
        })
      );
    });

    it('processes payment with currency conversion', async () => {
      const mockInvoice = {
        id: 'inv-4',
        totalAmount: 1000,
        paidAmount: 0,
        currency: 'ZAR',
        paymentHistory: [],
      };
      (firebaseService.getInvoice as any).mockResolvedValue(mockInvoice);

      const result = await billingService.processPayment('inv-4', {
        amount: 55,
        currency: 'USD',
        method: 'paypal',
      });

      expect(result.success).toBe(true);
      // 55 USD = 1000 ZAR (55 / 0.055 = 1000)
      expect(result.paymentProcessed).toBe(1000);
    });

    it('throws error for non-existent invoice', async () => {
      (firebaseService.getInvoice as any).mockResolvedValue(null);

      await expect(
        billingService.processPayment('fake-id', {
          amount: 100,
          currency: 'ZAR',
        })
      ).rejects.toThrow('Invoice fake-id not found');
    });
  });

  describe('Credit System', () => {
    it('adds student credit', async () => {
      const result = await billingService.addStudentCredit('student-1', {
        amount: 100,
        currency: 'ZAR',
        source: 'manual',
        description: 'Test credit',
      });

      expect(result.id).toBe('credit-123');
      expect(result.amount).toBe(100);
      expect(result.status).toBe('active');
    });

    it('gets student credits', async () => {
      const mockCredits = [
        { id: 'c1', amount: 50, currency: 'ZAR', status: 'active' },
        { id: 'c2', amount: 30, currency: 'ZAR', status: 'active' },
      ];
      (firebaseService.getStudentCredits as any).mockResolvedValue(mockCredits);

      const credits = await billingService.getStudentCredits('student-1');
      expect(credits).toHaveLength(2);
    });
  });

  describe('Refund as Credit', () => {
    it('creates credit record from refund data', async () => {
      const result = await billingService.processRefundAsCredit('student-1', {
        amount: 200,
        currency: 'ZAR',
        reason: 'Customer request',
        invoiceId: 'inv-5',
      });

      expect(result.id).toBe('credit-123');
      expect(firebaseService.addStudentCredit).toHaveBeenCalledWith(
        'student-1',
        expect.objectContaining({
          amount: 200,
          currency: 'ZAR',
          source: 'refund',
        })
      );
    });
  });

  describe('Student Balance Calculation', () => {
    it('calculates balance from active credits', async () => {
      const mockCredits = [
        { id: 'c1', amount: 50, currency: 'ZAR', status: 'active' },
        { id: 'c2', amount: 100, currency: 'ZAR', status: 'active' },
        { id: 'c3', amount: 25, currency: 'USD', status: 'active' },
        { id: 'c4', amount: 30, currency: 'ZAR', status: 'used' },
      ];
      (firebaseService.getStudentCredits as any).mockResolvedValue(mockCredits);

      const balance = await billingService.getStudentBalance('student-1');
      expect(balance.balances.ZAR).toBe(150);
      expect(balance.balances.USD).toBe(25);
      expect(balance.totalCredits).toBe(3); // Only active
    });

    it('returns empty balances for student with no credits', async () => {
      (firebaseService.getStudentCredits as any).mockResolvedValue([]);

      const balance = await billingService.getStudentBalance('student-1');
      expect(balance.balances).toEqual({});
      expect(balance.totalCredits).toBe(0);
    });
  });

  describe('Student Outstanding Amount', () => {
    it('calculates total outstanding correctly', async () => {
      const mockInvoices = [
        { id: 'i1', totalAmount: 500, paidAmount: 200, status: 'partial', currency: 'ZAR' },
        { id: 'i2', totalAmount: 300, paidAmount: 0, status: 'pending', currency: 'ZAR' },
        { id: 'i3', totalAmount: 200, paidAmount: 200, status: 'paid', currency: 'ZAR' },
      ];
      (firebaseService.getInvoicesForStudent as any).mockResolvedValue(mockInvoices);

      const result = await billingService.getStudentOutstandingAmount('student-1');
      expect(result.totalOutstanding).toBe(600); // 300 + 300
      expect(result.unpaidInvoices).toBe(2);
    });
  });
});
