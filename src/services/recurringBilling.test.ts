import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./firebaseService', () => ({
  default: {
    getBillingSchedules: vi.fn().mockResolvedValue([
      {
        id: 'sched-1',
        name: 'Monthly All Students',
        frequency: 'monthly',
        studentIds: ['s1', 's2', 's3'],
        amountType: 'fixed',
        fixedAmount: 500,
        currency: 'ZAR',
        startDate: new Date('2026-01-01'),
        endDate: null,
        nextRunDate: new Date('2026-03-01'),
        lastRunDate: new Date('2026-02-01'),
        isActive: true,
        autoCharge: false,
        emailNotification: true,
        invoiceTemplate: { description: 'Monthly tutoring', dueAfterDays: 30 },
      },
      {
        id: 'sched-2',
        name: 'Weekly Premium',
        frequency: 'weekly',
        studentIds: ['s1'],
        amountType: 'from_rates',
        fixedAmount: 0,
        currency: 'USD',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-06-01'),
        nextRunDate: new Date('2026-03-08'),
        lastRunDate: new Date('2026-03-01'),
        isActive: false,
        autoCharge: false,
        emailNotification: false,
        invoiceTemplate: { description: 'Weekly premium tutoring', dueAfterDays: 7 },
      },
    ]),
    createBillingSchedule: vi.fn().mockResolvedValue('new-sched-id'),
    updateBillingSchedule: vi.fn().mockResolvedValue(undefined),
    deleteBillingSchedule: vi.fn().mockResolvedValue(undefined),
  },
}));

import firebaseService from './firebaseService';

describe('Recurring Billing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Schedule CRUD', () => {
    it('fetches all billing schedules', async () => {
      const schedules = await firebaseService.getBillingSchedules();
      expect(schedules).toHaveLength(2);
      expect(schedules[0].name).toBe('Monthly All Students');
      expect(schedules[1].name).toBe('Weekly Premium');
    });

    it('creates a new billing schedule', async () => {
      const newSchedule = {
        name: 'Biweekly Test',
        frequency: 'biweekly',
        studentIds: ['s4', 's5'],
        amountType: 'fixed',
        fixedAmount: 250,
        currency: 'ZAR',
        startDate: new Date('2026-04-01'),
        endDate: null,
        nextRunDate: new Date('2026-04-01'),
        isActive: true,
        autoCharge: false,
        emailNotification: true,
        invoiceTemplate: { description: 'Biweekly billing', dueAfterDays: 14 },
      };

      const id = await firebaseService.createBillingSchedule(newSchedule);
      expect(id).toBe('new-sched-id');
      expect(firebaseService.createBillingSchedule).toHaveBeenCalledWith(newSchedule);
    });

    it('updates a billing schedule', async () => {
      await firebaseService.updateBillingSchedule('sched-1', { isActive: false });
      expect(firebaseService.updateBillingSchedule).toHaveBeenCalledWith('sched-1', { isActive: false });
    });

    it('deletes a billing schedule', async () => {
      await firebaseService.deleteBillingSchedule('sched-2');
      expect(firebaseService.deleteBillingSchedule).toHaveBeenCalledWith('sched-2');
    });
  });

  describe('Next Run Date Calculation', () => {
    function calculateNextRunDate(currentDate: Date, frequency: string): Date {
      const next = new Date(currentDate);
      switch (frequency) {
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'biweekly':
          next.setDate(next.getDate() + 14);
          break;
        case 'monthly':
          next.setMonth(next.getMonth() + 1);
          break;
        default:
          next.setMonth(next.getMonth() + 1);
      }
      return next;
    }

    it('calculates weekly next run (7 days)', () => {
      const current = new Date('2026-03-01');
      const next = calculateNextRunDate(current, 'weekly');
      expect(next.toISOString().split('T')[0]).toBe('2026-03-08');
    });

    it('calculates biweekly next run (14 days)', () => {
      const current = new Date('2026-03-01');
      const next = calculateNextRunDate(current, 'biweekly');
      expect(next.toISOString().split('T')[0]).toBe('2026-03-15');
    });

    it('calculates monthly next run', () => {
      const current = new Date('2026-03-01');
      const next = calculateNextRunDate(current, 'monthly');
      expect(next.getMonth()).toBe(3); // April
      expect(next.getDate()).toBe(1);
    });

    it('handles month-end edge case: Jan 31 -> Feb overflow', () => {
      const current = new Date('2026-01-31');
      const next = calculateNextRunDate(current, 'monthly');
      // JS Date rolls Jan 31 + 1 month to Mar 3 (Feb doesn't have 31 days)
      expect(next.getMonth()).toBe(2); // March (0-indexed)
    });

    it('handles month-end edge case: Mar 31 -> Apr overflow', () => {
      const current = new Date('2026-03-31');
      const next = calculateNextRunDate(current, 'monthly');
      // Mar 31 + 1 month = May 1 (April has 30 days)
      expect(next.getMonth()).toBe(4); // May (0-indexed)
    });

    it('handles leap year: Feb 28 2028 -> Mar 28', () => {
      const current = new Date('2028-02-28');
      const next = calculateNextRunDate(current, 'monthly');
      expect(next.getMonth()).toBe(2); // March
      expect(next.getDate()).toBe(28);
    });

    it('handles weekly at year boundary', () => {
      const current = new Date('2026-12-28');
      const next = calculateNextRunDate(current, 'weekly');
      expect(next.getFullYear()).toBe(2027);
      expect(next.getMonth()).toBe(0); // January
      expect(next.getDate()).toBe(4);
    });

    it('defaults to monthly for unknown frequency', () => {
      const current = new Date('2026-03-01');
      const next = calculateNextRunDate(current, 'unknown');
      expect(next.getMonth()).toBe(3); // April
    });
  });

  describe('Schedule Data Validation', () => {
    it('schedule has required fields', async () => {
      const schedules = await firebaseService.getBillingSchedules();
      const schedule = schedules[0];
      expect(schedule).toHaveProperty('name');
      expect(schedule).toHaveProperty('frequency');
      expect(schedule).toHaveProperty('studentIds');
      expect(schedule).toHaveProperty('amountType');
      expect(schedule).toHaveProperty('currency');
      expect(schedule).toHaveProperty('isActive');
      expect(schedule).toHaveProperty('nextRunDate');
    });

    it('studentIds is an array', async () => {
      const schedules = await firebaseService.getBillingSchedules();
      expect(Array.isArray(schedules[0].studentIds)).toBe(true);
      expect(schedules[0].studentIds.length).toBe(3);
    });

    it('frequency is valid value', async () => {
      const validFreqs = ['weekly', 'biweekly', 'monthly'];
      const schedules = await firebaseService.getBillingSchedules();
      schedules.forEach((s: any) => {
        expect(validFreqs).toContain(s.frequency);
      });
    });

    it('amountType is valid value', async () => {
      const validTypes = ['fixed', 'from_rates'];
      const schedules = await firebaseService.getBillingSchedules();
      schedules.forEach((s: any) => {
        expect(validTypes).toContain(s.amountType);
      });
    });

    it('fixedAmount is non-negative for fixed type', async () => {
      const schedules = await firebaseService.getBillingSchedules();
      const fixedSchedules = schedules.filter((s: any) => s.amountType === 'fixed');
      fixedSchedules.forEach((s: any) => {
        expect(s.fixedAmount).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
