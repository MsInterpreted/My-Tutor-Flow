import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { History, Payment, Undo } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import { formatCurrency } from '../utils/helpers';
import dayjs from 'dayjs';

export default function PaymentHistoryDialog({ open, onClose, invoice }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && invoice?.id) {
      loadHistory();
    }
  }, [open, invoice?.id]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const [fetchedPayments, fetchedRefunds] = await Promise.all([
        firebaseService.getPaymentsForInvoice(invoice.id),
        // Get refunds from payment history on the invoice
        Promise.resolve(invoice?.paymentHistory || []),
      ]);
      setPayments(fetchedPayments);

      // Also include inline payment history from invoice
      const inlineEntries = (invoice?.paymentHistory || []).map((entry, idx) => ({
        id: `inline-${idx}`,
        ...entry,
        isInline: true,
      }));

      // Combine and deduplicate
      const allPayments = fetchedPayments.length > 0 ? fetchedPayments : inlineEntries;
      setPayments(allPayments);
    } catch (error) {
      console.error('Failed to load payment history:', error);
      // Fall back to invoice's inline payment history
      setPayments(
        (invoice?.paymentHistory || []).map((entry, idx) => ({
          id: `inline-${idx}`,
          ...entry,
          isInline: true,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const isRefundEntry = (entry) => {
    return entry.method === 'refund' || entry.type === 'refund' || entry.status === 'refunded';
  };

  const getTypeChip = (entry) => {
    if (isRefundEntry(entry)) {
      return (
        <Chip
          label="Refund"
          size="small"
          icon={<Undo sx={{ fontSize: 14 }} />}
          sx={{ backgroundColor: '#F4433620', color: '#F44336', fontWeight: 600 }}
        />
      );
    }
    return (
      <Chip
        label="Payment"
        size="small"
        icon={<Payment sx={{ fontSize: 14 }} />}
        sx={{ backgroundColor: '#4CAF5020', color: '#4CAF50', fontWeight: 600 }}
      />
    );
  };

  const dialogPaperSx = {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: '16px',
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    mx: isMobile ? 1 : 3,
    width: isMobile ? 'calc(100% - 16px)' : undefined,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle sx={{ color: theme.colors.text.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <History sx={{ color: theme.colors.brand.primary }} />
        Payment History
        {invoice && (
          <Chip
            label={invoice.invoiceNumber || invoice.id}
            size="small"
            sx={{ ml: 1, backgroundColor: `${theme.colors.brand.primary}20`, color: theme.colors.brand.primary }}
          />
        )}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: theme.colors.brand.primary }} />
          </Box>
        ) : payments.length === 0 ? (
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, textAlign: 'center', py: 4 }}>
            No payment history for this invoice.
          </Typography>
        ) : isMobile ? (
          // Mobile card layout
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {payments.map((entry) => (
              <Box key={entry.id} sx={{
                p: 2, borderRadius: '12px',
                backgroundColor: theme.colors.background.primary,
                border: `1px solid ${isRefundEntry(entry) ? '#F4433630' : (theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')}`,
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  {getTypeChip(entry)}
                  <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                    {entry.date ? dayjs(entry.date instanceof Date ? entry.date : entry.date?.toDate ? entry.date.toDate() : entry.date).format('DD MMM YYYY') : 'N/A'}
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: isRefundEntry(entry) ? '#F44336' : theme.colors.text.primary,
                    fontWeight: 700,
                  }}
                >
                  {isRefundEntry(entry) ? '-' : ''}{formatCurrency(entry.amount || entry.convertedAmount || 0)}
                </Typography>
                {entry.method && (
                  <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                    via {entry.method}
                  </Typography>
                )}
                {entry.reference && (
                  <Typography variant="caption" display="block" sx={{ color: theme.colors.text.secondary }}>
                    Ref: {entry.reference}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          // Desktop table layout
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Method</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Reference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((entry) => (
                  <TableRow
                    key={entry.id}
                    sx={{
                      backgroundColor: isRefundEntry(entry) ? '#F4433608' : 'transparent',
                    }}
                  >
                    <TableCell>{getTypeChip(entry)}</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary }}>
                      {entry.date ? dayjs(entry.date instanceof Date ? entry.date : entry.date?.toDate ? entry.date.toDate() : entry.date).format('DD MMM YYYY HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{
                      color: isRefundEntry(entry) ? '#F44336' : theme.colors.text.primary,
                      fontWeight: 600,
                    }}>
                      {isRefundEntry(entry) ? '-' : ''}{formatCurrency(entry.amount || entry.convertedAmount || 0)}
                      {entry.currency && ` ${entry.currency}`}
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary }}>
                      {entry.method || '-'}
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary }}>
                      {entry.reference || entry.creditId || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: theme.colors.text.secondary, textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
