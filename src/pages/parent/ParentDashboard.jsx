import React, { useState, useEffect, useContext, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Receipt,
  Payment,
  AccountBalanceWallet,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { AuthContext } from '../../contexts/AuthContext';
import firebaseService from '../../services/firebaseService';
import paymentService from '../../services/paymentService';
import { formatCurrency } from '../../utils/helpers';
import dayjs from 'dayjs';

const SolanaPaymentProvider = lazy(() => import('../../components/SolanaPaymentProvider'));
const SolanaPaymentDialog = lazy(() => import('../../components/SolanaPaymentDialog'));

export default function ParentDashboard() {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { currentUser } = useContext(AuthContext);

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solanaDialogOpen, setSolanaDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedInvoices, settings] = await Promise.all([
        firebaseService.getAllInvoices(),
        paymentService.getPaymentSettings(),
      ]);
      setInvoices(fetchedInvoices);
      setPaymentSettings(settings);
    } catch (error) {
      console.error('Failed to load parent dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithSolana = (invoice) => {
    setSelectedInvoice(invoice);
    setSolanaDialogOpen(true);
  };

  const handleSolanaPaymentComplete = async (paymentData) => {
    try {
      await firebaseService.updateInvoicePayment(selectedInvoice.id, {
        status: 'paid',
        paidAmount: selectedInvoice.amount || selectedInvoice.totalAmount,
        lastPaymentDate: new Date(),
        paymentProvider: 'solana',
        txSignature: paymentData.signature,
      });
      setSolanaDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to update invoice after Solana payment:', error);
    }
  };

  const getPayButton = (invoice) => {
    const provider = invoice.paymentProvider || paymentSettings?.defaultProvider;
    const isSolanaEnabled = paymentSettings?.solana?.enabled;

    if (provider === 'solana' || (isSolanaEnabled && !provider)) {
      return (
        <Button
          size="small"
          variant="contained"
          startIcon={<AccountBalanceWallet />}
          onClick={() => handlePayWithSolana(invoice)}
          sx={{
            backgroundColor: '#9945FF',
            color: '#fff',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: isMobile ? '13px' : '14px',
            minHeight: isMobile ? '44px' : '36px',
            px: isMobile ? 2 : 1.5,
            touchAction: 'manipulation',
            '&:hover': { backgroundColor: '#7B35CC' },
          }}
        >
          Pay with Wallet
        </Button>
      );
    }

    if (invoice.paymentLink) {
      return (
        <Button
          size="small"
          variant="contained"
          startIcon={<Payment />}
          onClick={() => window.open(invoice.paymentLink, '_blank')}
          sx={{
            backgroundColor: theme.colors.brand.primary,
            color: '#000',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            fontSize: isMobile ? '13px' : '14px',
            minHeight: isMobile ? '44px' : '36px',
            px: isMobile ? 2 : 1.5,
            touchAction: 'manipulation',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Pay Now
        </Button>
      );
    }

    return null;
  };

  const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalOutstanding = unpaidInvoices.reduce((sum, inv) => sum + (inv.amount || inv.totalAmount || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: theme.colors.brand.primary }} />
      </Box>
    );
  }

  const cardSx = {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: theme.shadows.card,
    borderRadius: '16px',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': { transform: 'translateY(-2px)' },
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.colors.background.primary, p: isMobile ? 2 : 3 }}>
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        sx={{ color: theme.colors.text.primary, fontWeight: 700, mb: 3 }}
      >
        My Invoices
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={isMobile ? 2 : 3} mb={isMobile ? 3 : 4}>
        <Grid item xs={6} md={3}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Outstanding
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#F44336', fontWeight: 700 }}>
                {formatCurrency(totalOutstanding)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Unpaid
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#FF9800', fontWeight: 700 }}>
                {unpaidInvoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Paid
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#4CAF50', fontWeight: 700 }}>
                {paidInvoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card sx={cardSx}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2, '&:last-child': { pb: isMobile ? 1.5 : 2 } }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 0.5 }}>
                Total Invoices
              </Typography>
              <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                {invoices.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Unpaid Invoices */}
      {unpaidInvoices.length > 0 && (
        <Paper sx={{
          p: isMobile ? 2 : 3,
          mb: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
          boxShadow: theme.shadows.card,
        }}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 2 }}>
            Invoices Due
          </Typography>

          {isMobile ? (
            // Mobile card layout
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {unpaidInvoices.map(inv => (
                <Card key={inv.id} sx={{
                  backgroundColor: theme.colors.background.primary,
                  border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  borderRadius: '12px',
                }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                        {inv.invoiceNumber || `INV-${inv.id?.slice(0, 6)}`}
                      </Typography>
                      <Chip
                        label={inv.status || 'pending'}
                        size="small"
                        sx={{
                          backgroundColor: inv.status === 'overdue' ? '#F4433620' : '#FF980020',
                          color: inv.status === 'overdue' ? '#F44336' : '#FF9800',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 700, mb: 0.5 }}>
                      {formatCurrency(inv.amount || inv.totalAmount || 0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                      Due: {inv.dueDate ? dayjs(inv.dueDate).format('DD MMM YYYY') : 'N/A'}
                    </Typography>
                    <Box mt={1.5}>{getPayButton(inv)}</Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop table layout
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Invoice</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Due Date</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unpaidInvoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {inv.invoiceNumber || `INV-${inv.id?.slice(0, 6)}`}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {inv.invoiceDate ? dayjs(inv.invoiceDate).format('DD MMM YYYY') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {inv.dueDate ? dayjs(inv.dueDate).format('DD MMM YYYY') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                        {formatCurrency(inv.amount || inv.totalAmount || 0)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={inv.status || 'pending'}
                          size="small"
                          sx={{
                            backgroundColor: inv.status === 'overdue' ? '#F4433620' : '#FF980020',
                            color: inv.status === 'overdue' ? '#F44336' : '#FF9800',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>{getPayButton(inv)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}

      {/* Payment History */}
      <Paper sx={{
        p: isMobile ? 2 : 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
      }}>
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 2 }}>
          Payment History
        </Typography>

        {paidInvoices.length === 0 ? (
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, textAlign: 'center', py: 3 }}>
            No payment history yet.
          </Typography>
        ) : isMobile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {paidInvoices.slice(0, 10).map(inv => (
              <Box key={inv.id} sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                p: 1.5, borderRadius: '8px',
                backgroundColor: theme.colors.background.primary,
              }}>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    {formatCurrency(inv.amount || inv.totalAmount || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                    {inv.lastPaymentDate ? dayjs(inv.lastPaymentDate).format('DD MMM YYYY') : 'N/A'}
                  </Typography>
                </Box>
                <Chip label="Paid" size="small" sx={{ backgroundColor: '#4CAF5020', color: '#4CAF50', fontWeight: 600 }} />
              </Box>
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Invoice</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Paid Date</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paidInvoices.slice(0, 10).map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell sx={{ color: theme.colors.text.primary }}>
                      {inv.invoiceNumber || `INV-${inv.id?.slice(0, 6)}`}
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary }}>
                      {inv.lastPaymentDate ? dayjs(inv.lastPaymentDate).format('DD MMM YYYY') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                      {formatCurrency(inv.amount || inv.totalAmount || 0)}
                    </TableCell>
                    <TableCell>
                      <Chip label="Paid" size="small" icon={<CheckCircle sx={{ fontSize: 14 }} />}
                        sx={{ backgroundColor: '#4CAF5020', color: '#4CAF50', fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Solana Payment Dialog */}
      {solanaDialogOpen && selectedInvoice && (
        <Suspense fallback={null}>
          <SolanaPaymentProvider testMode={paymentSettings?.solana?.testMode ?? true}>
            <SolanaPaymentDialog
              open={solanaDialogOpen}
              onClose={() => setSolanaDialogOpen(false)}
              invoice={selectedInvoice}
              recipientAddress={paymentSettings?.solana?.recipientAddress || ''}
              solAmount={selectedInvoice.solAmount || 0.1}
              onPaymentComplete={handleSolanaPaymentComplete}
            />
          </SolanaPaymentProvider>
        </Suspense>
      )}
    </Box>
  );
}
