// TD Learning Academy - Enhanced Billing Service with Credit Management
// Handles payments, overpayments, credits, and multi-currency support

import firebaseService from './firebaseService';

class BillingService {
  constructor() {
    this.supportedCurrencies = ['ZAR', 'USD', 'GBP', 'EUR', 'AED'];
    this.exchangeRates = {
      ZAR: 1.0,
      USD: 0.055,
      GBP: 0.043,
      EUR: 0.051,
      AED: 0.202,
    };
  }

  // Convert amount between currencies
  convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to ZAR first, then to target currency
    const zarAmount = amount / this.exchangeRates[fromCurrency];
    const convertedAmount = zarAmount * this.exchangeRates[toCurrency];
    
    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  }

  // Process payment with automatic credit calculation
  async processPayment(invoiceId, paymentData) {
    try {
      console.log('💳 Processing payment for invoice:', invoiceId);
      
      // Get the invoice
      const invoice = await firebaseService.getInvoice(invoiceId);
      if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
      }

      // Convert payment amount to invoice currency if different
      let paymentAmount = paymentData.amount;
      if (paymentData.currency !== invoice.currency) {
        paymentAmount = this.convertCurrency(
          paymentData.amount,
          paymentData.currency,
          invoice.currency
        );
        console.log(`💱 Converted ${paymentData.amount} ${paymentData.currency} to ${paymentAmount} ${invoice.currency}`);
      }

      // Calculate payment details
      const outstandingAmount = invoice.totalAmount - (invoice.paidAmount || 0);
      const overpayment = Math.max(0, paymentAmount - outstandingAmount);
      const actualPayment = Math.min(paymentAmount, outstandingAmount);
      
      // Update invoice with payment
      const updatedInvoice = {
        paidAmount: (invoice.paidAmount || 0) + actualPayment,
        status: actualPayment >= outstandingAmount ? 'paid' : 'partial',
        lastPaymentDate: new Date(),
        lastPaymentAmount: paymentAmount,
        lastPaymentCurrency: paymentData.currency,
        paymentHistory: [
          ...(invoice.paymentHistory || []),
          {
            date: new Date(),
            amount: paymentData.amount,
            currency: paymentData.currency,
            convertedAmount: paymentAmount,
            convertedCurrency: invoice.currency,
            method: paymentData.method || 'manual',
            reference: paymentData.reference || '',
          }
        ]
      };

      // Update the invoice
      await firebaseService.updateInvoicePayment(invoiceId, updatedInvoice);

      // Handle overpayment as credit
      let creditApplied = null;
      if (overpayment > 0) {
        creditApplied = await this.addStudentCredit(invoice.studentId, {
          amount: overpayment,
          currency: invoice.currency,
          source: 'overpayment',
          invoiceId: invoiceId,
          date: new Date(),
          description: `Overpayment credit from invoice ${invoice.invoiceNumber || invoiceId}`,
        });
        
        console.log(`💰 Added credit of ${overpayment} ${invoice.currency} for overpayment`);
      }

      return {
        success: true,
        invoice: { ...invoice, ...updatedInvoice },
        paymentProcessed: actualPayment,
        overpayment: overpayment,
        creditApplied: creditApplied,
        message: overpayment > 0 
          ? `Payment processed. ${overpayment} ${invoice.currency} added as credit.`
          : 'Payment processed successfully.'
      };

    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      throw error;
    }
  }

  // Add credit to student account
  async addStudentCredit(studentId, creditData) {
    try {
      const creditRecord = {
        studentId,
        amount: creditData.amount,
        currency: creditData.currency,
        source: creditData.source || 'manual',
        description: creditData.description || 'Credit added',
        date: creditData.date || new Date(),
        status: 'active',
        invoiceId: creditData.invoiceId || null,
        createdAt: new Date(),
      };

      // Add credit to Firebase
      const creditId = await firebaseService.addStudentCredit(studentId, creditRecord);
      
      return {
        id: creditId,
        ...creditRecord
      };
    } catch (error) {
      console.error('❌ Failed to add student credit:', error);
      throw error;
    }
  }

  // Get student credits
  async getStudentCredits(studentId) {
    try {
      return await firebaseService.getStudentCredits(studentId);
    } catch (error) {
      console.error('❌ Failed to get student credits:', error);
      return [];
    }
  }

  // Apply credit to invoice
  async applyCreditToInvoice(invoiceId, creditId, amount) {
    try {
      console.log(`💳 Applying credit ${creditId} to invoice ${invoiceId}`);
      
      // Get invoice and credit
      const [invoice, credit] = await Promise.all([
        firebaseService.getInvoice(invoiceId),
        firebaseService.getStudentCredit(creditId)
      ]);

      if (!invoice || !credit) {
        throw new Error('Invoice or credit not found');
      }

      if (credit.status !== 'active') {
        throw new Error('Credit is not active');
      }

      // Convert credit amount to invoice currency if needed
      let creditAmount = amount || credit.amount;
      if (credit.currency !== invoice.currency) {
        creditAmount = this.convertCurrency(creditAmount, credit.currency, invoice.currency);
      }

      // Calculate how much can be applied
      const outstandingAmount = invoice.totalAmount - (invoice.paidAmount || 0);
      const applicableAmount = Math.min(creditAmount, outstandingAmount);

      // Update invoice
      const updatedInvoice = {
        paidAmount: (invoice.paidAmount || 0) + applicableAmount,
        status: applicableAmount >= outstandingAmount ? 'paid' : 'partial',
        creditApplied: (invoice.creditApplied || 0) + applicableAmount,
        lastCreditDate: new Date(),
        paymentHistory: [
          ...(invoice.paymentHistory || []),
          {
            date: new Date(),
            amount: applicableAmount,
            currency: invoice.currency,
            method: 'credit',
            creditId: creditId,
            reference: `Credit applied from ${credit.description}`,
          }
        ]
      };

      // Update credit
      const remainingCredit = credit.amount - applicableAmount;
      const updatedCredit = {
        amount: remainingCredit,
        status: remainingCredit <= 0 ? 'used' : 'active',
        lastUsed: new Date(),
        usageHistory: [
          ...(credit.usageHistory || []),
          {
            date: new Date(),
            invoiceId: invoiceId,
            amountUsed: applicableAmount,
            currency: invoice.currency,
          }
        ]
      };

      // Update both records
      await Promise.all([
        firebaseService.updateInvoicePayment(invoiceId, updatedInvoice),
        firebaseService.updateStudentCredit(creditId, updatedCredit)
      ]);

      return {
        success: true,
        appliedAmount: applicableAmount,
        remainingCredit: remainingCredit,
        invoice: { ...invoice, ...updatedInvoice },
        message: `Credit of ${applicableAmount} ${invoice.currency} applied successfully.`
      };

    } catch (error) {
      console.error('❌ Failed to apply credit:', error);
      throw error;
    }
  }

  // Get student account balance (total credits)
  async getStudentBalance(studentId) {
    try {
      const credits = await this.getStudentCredits(studentId);
      const activeCredits = credits.filter(credit => credit.status === 'active');
      
      // Group by currency
      const balances = {};
      activeCredits.forEach(credit => {
        if (!balances[credit.currency]) {
          balances[credit.currency] = 0;
        }
        balances[credit.currency] += credit.amount;
      });

      return {
        balances,
        totalCredits: activeCredits.length,
        credits: activeCredits
      };
    } catch (error) {
      console.error('❌ Failed to get student balance:', error);
      return { balances: {}, totalCredits: 0, credits: [] };
    }
  }

  // Generate payment summary for invoice
  async generatePaymentSummary(invoiceId) {
    try {
      const invoice = await firebaseService.getInvoice(invoiceId);
      if (!invoice) {
        throw new Error(`Invoice ${invoiceId} not found`);
      }

      const paidAmount = invoice.paidAmount || 0;
      const creditApplied = invoice.creditApplied || 0;
      const outstandingAmount = invoice.totalAmount - paidAmount;

      return {
        invoiceId,
        totalAmount: invoice.totalAmount,
        paidAmount,
        creditApplied,
        outstandingAmount,
        currency: invoice.currency,
        status: invoice.status,
        paymentHistory: invoice.paymentHistory || [],
        isFullyPaid: outstandingAmount <= 0,
        lastPaymentDate: invoice.lastPaymentDate,
      };
    } catch (error) {
      console.error('❌ Failed to generate payment summary:', error);
      throw error;
    }
  }

  // Calculate total outstanding amount for student
  async getStudentOutstandingAmount(studentId) {
    try {
      const invoices = await firebaseService.getInvoicesForStudent(studentId);
      const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');
      
      let totalOutstanding = 0;
      const currencyBreakdown = {};

      unpaidInvoices.forEach(invoice => {
        const outstanding = invoice.totalAmount - (invoice.paidAmount || 0);
        if (outstanding > 0) {
          totalOutstanding += outstanding;
          if (!currencyBreakdown[invoice.currency]) {
            currencyBreakdown[invoice.currency] = 0;
          }
          currencyBreakdown[invoice.currency] += outstanding;
        }
      });

      return {
        totalOutstanding,
        currencyBreakdown,
        unpaidInvoices: unpaidInvoices.length,
        invoices: unpaidInvoices
      };
    } catch (error) {
      console.error('❌ Failed to get student outstanding amount:', error);
      return { totalOutstanding: 0, currencyBreakdown: {}, unpaidInvoices: 0, invoices: [] };
    }
  }
}

// Create and export singleton instance
const billingService = new BillingService();
export default billingService;
