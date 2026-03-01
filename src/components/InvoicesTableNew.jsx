import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Undo, History } from '@mui/icons-material';
import { STATUS_COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';
import { useTheme } from '../theme/ThemeContext';
import dayjs from 'dayjs';
import RefundDialog from './RefundDialog';
import PaymentHistoryDialog from './PaymentHistoryDialog';

// Firebase service import
import firebaseService from '../services/firebaseService';

export default function InvoicesTable({ data, allData, student, reload }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [invoices, setInvoices] = useState([]);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Fetch invoices using firebaseService if data not provided
  useEffect(() => {
    if (data === undefined || data === null) {
      const fetchInvoices = async () => {
        try {
          console.log('Fetching invoices via firebaseService...');
          let fetchedInvoices;

          if (student) {
            fetchedInvoices = await firebaseService.getInvoicesForStudent(student.id);
          } else {
            fetchedInvoices = await firebaseService.getAllInvoices();
          }

          setInvoices(fetchedInvoices);
        } catch (error) {
          console.warn('Error fetching invoices:', error);
          setInvoices([]);
        }
      };

      fetchInvoices();
    }
  }, [student, data]);

  // Use data from props if provided, else fallback to internal state
  const displayInvoices = data !== undefined && data !== null ? data : invoices;

  const canRefund = (inv) => {
    return inv.status === 'paid' || inv.status === 'partial';
  };

  const handleRefund = (inv) => {
    setSelectedInvoice(inv);
    setRefundDialogOpen(true);
  };

  const handleHistory = (inv) => {
    setSelectedInvoice(inv);
    setHistoryDialogOpen(true);
  };

  const handleRefundComplete = () => {
    if (reload) reload();
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
          borderRadius: '16px',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
            }}
          >
            Recent Invoices
          </Typography>
          {reload && (
            <Tooltip title="Refresh Invoices">
              <IconButton
                onClick={reload}
                size="small"
                sx={{
                  color: theme.colors.text.primary,
                  '&:hover': {
                    backgroundColor: theme.colors.background.tertiary,
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {isMobile ? (
          // Mobile card layout
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {displayInvoices.length === 0 ? (
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, textAlign: 'center', py: 3 }}>
                No invoices found.
              </Typography>
            ) : (
              displayInvoices.map(inv => {
                try {
                  return (
                    <Box
                      key={inv.id || `invoice-${Math.random()}`}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: theme.colors.background.primary,
                        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                          {inv.invoiceDate
                            ? dayjs(inv.invoiceDate).format('DD MMM YYYY')
                            : inv.createdAt
                              ? dayjs(inv.createdAt).format('DD MMM YYYY')
                              : 'N/A'}
                        </Typography>
                        <Chip
                          label={inv.status || 'pending'}
                          color={STATUS_COLORS[inv.status] || 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 700, mb: 1 }}>
                        {inv.amount != null ? formatCurrency(Number(inv.amount)) : '-'}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<History />}
                          onClick={() => handleHistory(inv)}
                          sx={{
                            color: theme.colors.brand.primary,
                            textTransform: 'none',
                            fontSize: '12px',
                            minHeight: '36px',
                            touchAction: 'manipulation',
                          }}
                        >
                          History
                        </Button>
                        {canRefund(inv) && (
                          <Button
                            size="small"
                            startIcon={<Undo />}
                            onClick={() => handleRefund(inv)}
                            sx={{
                              color: '#F44336',
                              textTransform: 'none',
                              fontSize: '12px',
                              minHeight: '36px',
                              touchAction: 'manipulation',
                            }}
                          >
                            Refund
                          </Button>
                        )}
                      </Box>
                    </Box>
                  );
                } catch (error) {
                  return null;
                }
              })
            )}
          </Box>
        ) : (
          // Desktop table layout
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: theme.colors.text.secondary }}>
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayInvoices.map(inv => {
                    try {
                      return (
                        <TableRow key={inv.id || `invoice-${Math.random()}`}>
                          <TableCell sx={{ color: theme.colors.text.primary }}>
                            {inv.invoiceDate
                              ? dayjs(inv.invoiceDate).format('YYYY-MM-DD')
                              : inv.createdAt
                                ? dayjs(inv.createdAt).format('YYYY-MM-DD')
                                : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: theme.colors.text.primary }}>
                            {inv.amount != null ? formatCurrency(Number(inv.amount)) : '-'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={inv.status || 'pending'}
                              color={STATUS_COLORS[inv.status] || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Payment History">
                                <IconButton
                                  size="small"
                                  onClick={() => handleHistory(inv)}
                                  sx={{ color: theme.colors.brand.primary }}
                                >
                                  <History fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {canRefund(inv) && (
                                <Tooltip title="Refund">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRefund(inv)}
                                    sx={{ color: '#F44336' }}
                                  >
                                    <Undo fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    } catch (error) {
                      console.error('Error rendering invoice row:', error, inv);
                      return (
                        <TableRow key={`error-${Math.random()}`}>
                          <TableCell colSpan={4} sx={{ color: theme.colors.text.secondary }}>
                            Error displaying invoice
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Refund Dialog */}
      <RefundDialog
        open={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        invoice={selectedInvoice}
        onRefundComplete={handleRefundComplete}
      />

      {/* Payment History Dialog */}
      <PaymentHistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        invoice={selectedInvoice}
      />
    </>
  );
}
