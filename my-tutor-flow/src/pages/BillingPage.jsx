import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Tabs, Tab, Card, CardContent, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import {
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as MoneyIcon,
  AutoMode as AutoModeIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import InvoicesTable from '../components/InvoicesTableNew';
import BillingWorkflow from '../components/BillingWorkflow';
import RateConfiguration from '../components/RateConfiguration';
import BillingAnalytics from '../components/BillingAnalytics';
import AdvancedBillingFeatures from '../components/AdvancedBillingFeatures';
import BillingErrorBoundary from '../components/BillingErrorBoundary';
import SlidingBillingSelector from '../components/SlidingBillingSelector';
import { formatCurrency } from '../utils/helpers';
import firebaseService from '../services/firebaseService';
import { shouldUseDemoData } from '../config/mobileConfig';
import { businessDemoService } from '../services/businessDemoService';
import SolanaWalletButton from '../components/wallet/SolanaWalletButton';
import CryptoPaymentModal from '../components/wallet/CryptoPaymentModal';

export default function BillingPage() {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  // Helper functions for tab value conversion
  const getTabValue = (tabIndex) => {
    const tabValues = ['all-invoices', 'create-invoice', 'advanced-features', 'rate-setting', 'analytics'];
    return tabValues[tabIndex] || 'all-invoices';
  };

  const getTabIndex = (value) => {
    const tabValues = ['all-invoices', 'create-invoice', 'advanced-features', 'rate-setting', 'analytics'];
    return tabValues.indexOf(value) !== -1 ? tabValues.indexOf(value) : 0;
  };

  const [billingStats, setBillingStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    thisMonthRevenue: 0,
  });

  // Crypto payment state
  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [selectedInvoiceForCrypto, setSelectedInvoiceForCrypto] = useState(null);

  useEffect(() => {
    loadBillingStats();
  }, []);

  const loadBillingStats = async () => {
    try {
      // Use demo data for mobile demonstrations
      if (shouldUseDemoData()) {
        const demoData = businessDemoService.getDemoData('financialMetrics');
        if (demoData) {
          setBillingStats({
            totalRevenue: demoData.totalRevenue,
            pendingAmount: demoData.outstanding.pending,
            overdueAmount: demoData.outstanding.overdue,
            thisMonthRevenue: demoData.monthlyRevenue,
          });
          return;
        }
      }

      // Production-ready: Calculate real billing statistics from Firebase data
      const invoices = await firebaseService.getAllInvoices();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalRevenue = 0;
      let pendingAmount = 0;
      let overdueAmount = 0;
      let thisMonthRevenue = 0;

      invoices.forEach(invoice => {
        const amount = invoice.amount || 0;
        totalRevenue += amount;

        if (invoice.status === 'pending') {
          pendingAmount += amount;
        } else if (invoice.status === 'overdue') {
          overdueAmount += amount;
        }

        // Calculate this month's revenue
        const invoiceDate = invoice.createdAt ? new Date(invoice.createdAt) : new Date();
        if (invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear) {
          thisMonthRevenue += amount;
        }
      });

      setBillingStats({
        totalRevenue,
        pendingAmount,
        overdueAmount,
        thisMonthRevenue,
      });
    } catch (error) {
      console.error('Error loading billing stats:', error);
      // Set demo stats on error for better demo experience
      setBillingStats({
        totalRevenue: 120450,
        pendingAmount: 3250,
        overdueAmount: 1200,
        thisMonthRevenue: 20070,
      });
    }
  };

  const StatCard = ({ title, amount, color, icon, subtitle }) => (
    <Card
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
            {title}
          </Typography>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '8px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: color,
            fontWeight: 700,
            mb: 0.5,
          }}
        >
          {formatCurrency(amount)}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <BillingErrorBoundary>
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.colors.background.primary,
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
            }}
          >
            Billing & Invoices
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <SolanaWalletButton variant="outlined" size="medium" />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setActiveTab(1)}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000000',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: theme.colors.brand.primary,
                  opacity: 0.8,
                },
              }}
            >
              Create Invoice
            </Button>
          </Box>
        </Box>

        {/* Billing Statistics */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              amount={billingStats.totalRevenue}
              color={theme.colors.brand.primary}
              icon={<MoneyIcon sx={{ color: theme.colors.brand.primary }} />}
              subtitle="All time"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="This Month"
              amount={billingStats.thisMonthRevenue}
              color="#4CAF50"
              icon={<AnalyticsIcon sx={{ color: '#4CAF50' }} />}
              subtitle="Current month revenue"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              amount={billingStats.pendingAmount}
              color="#FF9800"
              icon={<ReceiptIcon sx={{ color: '#FF9800' }} />}
              subtitle="Awaiting payment"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Overdue"
              amount={billingStats.overdueAmount}
              color="#F44336"
              icon={<ReceiptIcon sx={{ color: '#F44336' }} />}
              subtitle="Past due date"
            />
          </Grid>
        </Grid>

        {/* Mobile: Sliding Navigation, Desktop: Standard Tabs */}
        {isMobile ? (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
                textAlign: 'center',
                fontSize: '16px',
              }}
            >
              Billing & Invoices
            </Typography>
            <SlidingBillingSelector
              value={getTabValue(activeTab)}
              onChange={(value) => {
                const tabIndex = getTabIndex(value);
                setActiveTab(tabIndex);
              }}
              options={[
                { value: 'all-invoices', label: 'All Invoices' },
                { value: 'create-invoice', label: 'Create Invoice' },
                { value: 'advanced-features', label: 'Advanced Features' },
                { value: 'rate-setting', label: 'Rate Setting' },
                { value: 'analytics', label: 'Analytics' }
              ]}
              disabled={false}
            />
          </Box>
        ) : (
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{
                p: 1,
                '& .MuiTab-root': {
                  color: theme.colors.text.secondary,
                  borderRadius: '12px',
                  margin: '0 4px',
                  minHeight: '48px',
                  '&.Mui-selected': {
                    color: theme.colors.brand.primary,
                    backgroundColor: `${theme.colors.brand.primary}15`,
                  },
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
              }}
            >
              <Tab label="All Invoices" icon={<ReceiptIcon />} />
              <Tab label="Create Invoice" icon={<AddIcon />} />
              <Tab label="Advanced Features" icon={<AutoModeIcon />} />
              <Tab label="Rate Settings" icon={<SettingsIcon />} />
              <Tab label="Analytics" icon={<AnalyticsIcon />} />
            </Tabs>
          </Paper>
        )}

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <InvoicesTable reload={loadBillingStats} />
          </Box>
        )}

        {activeTab === 1 && <BillingWorkflow onInvoiceCreated={loadBillingStats} />}

        {activeTab === 2 && <AdvancedBillingFeatures />}

        {activeTab === 3 && <RateConfiguration />}

        {activeTab === 4 && <BillingAnalytics billingStats={billingStats} />}

        {/* Crypto Payment Modal */}
        <CryptoPaymentModal
          open={showCryptoPayment}
          onClose={() => {
            setShowCryptoPayment(false);
            setSelectedInvoiceForCrypto(null);
          }}
          student={selectedInvoiceForCrypto?.student}
          amount={selectedInvoiceForCrypto?.amount}
          currency={selectedInvoiceForCrypto?.currency || 'ZAR'}
          onPaymentSuccess={(paymentData) => {
            console.log('Crypto payment successful:', paymentData);
            setShowCryptoPayment(false);
            setSelectedInvoiceForCrypto(null);
            loadBillingStats(); // Refresh billing stats
          }}
          onPaymentError={(error) => {
            console.error('Crypto payment failed:', error);
          }}
        />
      </Box>
    </BillingErrorBoundary>
  );
}
