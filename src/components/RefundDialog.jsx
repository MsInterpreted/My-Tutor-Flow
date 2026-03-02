import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { Undo, Warning } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import paymentService, { PAYMENT_PROVIDERS } from '../services/paymentService';
import { formatCurrency } from '../utils/helpers';

export default function RefundDialog({ open, onClose, invoice, onRefundComplete }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [refundType, setRefundType] = useState('full');
  const [refundMethod, setRefundMethod] = useState('credit');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const invoiceAmount = invoice?.amount || invoice?.totalAmount || 0;
  const paidAmount = invoice?.paidAmount || invoiceAmount;
  const refundableAmount = paidAmount - (invoice?.refundedAmount || 0);

  const effectiveAmount = refundType === 'full' ? refundableAmount : parseFloat(amount) || 0;

  // Provider refunds only for Stripe and PayPal
  const supportsProviderRefund =
    invoice?.paymentProvider === PAYMENT_PROVIDERS.STRIPE ||
    invoice?.paymentProvider === PAYMENT_PROVIDERS.PAYPAL;

  const handleSubmit = async () => {
    if (refundType === 'partial' && (!amount || parseFloat(amount) <= 0)) {
      setError('Please enter a valid refund amount.');
      return;
    }
    if (effectiveAmount > refundableAmount) {
      setError(`Refund amount cannot exceed ${formatCurrency(refundableAmount)}.`);
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // If there's a paymentId on the invoice, process via paymentService
      const refundData = {
        type: refundType,
        method: refundMethod,
        amount: effectiveAmount,
        currency: invoice?.currency || 'ZAR',
        reason,
        invoiceId: invoice?.id,
      };

      if (invoice?.lastPaymentId) {
        await paymentService.refundPayment(invoice.lastPaymentId, refundData);
      }

      if (onRefundComplete) {
        onRefundComplete(refundData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process refund.');
    } finally {
      setProcessing(false);
    }
  };

  const dialogPaperSx = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: '16px',
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    mx: isMobile ? 1 : 3,
    width: isMobile ? 'calc(100% - 16px)' : undefined,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: theme.colors.text.primary,
      '& fieldset': { borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
    },
    '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
  };

  return (
    <Dialog open={open} onClose={processing ? undefined : onClose} maxWidth="sm" fullWidth fullScreen={isMobile} PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={{ color: theme.colors.text.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Undo sx={{ color: theme.colors.brand.primary }} />
        Process Refund
      </DialogTitle>

      <DialogContent>
        {/* Invoice Summary */}
        <Box sx={{
          p: 2, borderRadius: '12px', mb: 3,
          backgroundColor: theme.colors.background.primary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
        }}>
          <Typography variant="subtitle2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
            Invoice Summary
          </Typography>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>Invoice</Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
              {invoice?.invoiceNumber || invoice?.id}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>Total Amount</Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
              {formatCurrency(invoiceAmount)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>Paid Amount</Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
              {formatCurrency(paidAmount)}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>Refundable</Typography>
            <Typography variant="body2" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
              {formatCurrency(refundableAmount)}
            </Typography>
          </Box>
        </Box>

        {/* Refund Type */}
        <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary, mb: 1 }}>
          Refund Type
        </Typography>
        <RadioGroup row={!isMobile} value={refundType} onChange={(e) => setRefundType(e.target.value)} sx={{ mb: 2 }}>
          <FormControlLabel value="full" control={<Radio />} label="Full Refund" sx={{ color: theme.colors.text.primary }} />
          <FormControlLabel value="partial" control={<Radio />} label="Partial Refund" sx={{ color: theme.colors.text.primary }} />
        </RadioGroup>

        {refundType === 'partial' && (
          <TextField
            label="Refund Amount"
            type="number"
            size="small"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ ...inputSx, mb: 2 }}
            inputProps={{ min: 0, max: refundableAmount, step: 0.01 }}
          />
        )}

        {/* Refund Method */}
        <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary, mb: 1 }}>
          Refund Method
        </Typography>
        <FormControl fullWidth size="small" sx={{ ...inputSx, mb: 2 }}>
          <InputLabel>Method</InputLabel>
          <Select value={refundMethod} label="Method" onChange={(e) => setRefundMethod(e.target.value)}>
            <MenuItem value="credit">Account Credit</MenuItem>
            {supportsProviderRefund && (
              <MenuItem value="provider">Refund to Payment Method ({invoice?.paymentProvider})</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Reason */}
        <TextField
          label="Reason for Refund"
          size="small"
          fullWidth
          multiline
          rows={isMobile ? 2 : 3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ ...inputSx, mb: 2 }}
        />

        {/* Refund Summary */}
        <Alert
          severity={effectiveAmount > 0 ? 'warning' : 'info'}
          icon={<Warning />}
          sx={{ borderRadius: '12px' }}
        >
          {effectiveAmount > 0
            ? `This will refund ${formatCurrency(effectiveAmount)} via ${refundMethod === 'credit' ? 'account credit' : 'payment provider'}.`
            : 'Enter refund details above.'}
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{error}</Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 1 : 0 }}>
        <Button
          onClick={onClose}
          disabled={processing}
          sx={{ color: theme.colors.text.secondary, textTransform: 'none', width: isMobile ? '100%' : 'auto' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={processing || effectiveAmount <= 0}
          startIcon={processing ? <CircularProgress size={16} /> : <Undo />}
          sx={{
            backgroundColor: '#F44336',
            color: '#fff',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            width: isMobile ? '100%' : 'auto',
            minHeight: isMobile ? '48px' : '36px',
            '&:hover': { backgroundColor: '#D32F2F' },
          }}
        >
          {processing ? 'Processing...' : 'Process Refund'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
