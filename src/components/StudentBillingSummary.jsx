import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/helpers';
import firebaseService from '../services/firebaseService';

const StudentBillingSummary = ({ students, onViewDetails }) => {
  const theme = useTheme();
  const [billingData, setBillingData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!students || students.length === 0) {
      setLoading(false);
      return;
    }

    const fetchBillingData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching billing data for students...');

        // Get all invoices using firebaseService
        const allInvoices = await firebaseService.getAllInvoices();
        console.log('✅ Invoices fetched:', allInvoices.length);

        // Group invoices by student
        const studentBilling = {};
        students.forEach(student => {
          const studentInvoices = allInvoices.filter(inv => inv.studentId === student.id);

          const totalAmount = studentInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
          const paidAmount = studentInvoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + (inv.amount || 0), 0);
          const pendingAmount = studentInvoices
            .filter(inv => inv.status === 'pending' || inv.status === 'unpaid')
            .reduce((sum, inv) => sum + (inv.amount || 0), 0);
          const overdueAmount = studentInvoices
            .filter(inv => inv.status === 'overdue')
            .reduce((sum, inv) => sum + (inv.amount || 0), 0);

          studentBilling[student.id] = {
            totalInvoices: studentInvoices.length,
            totalAmount,
            paidAmount,
            pendingAmount,
            overdueAmount,
            paymentRate: totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0,
            hasOverdue: overdueAmount > 0,
            recentInvoices: studentInvoices.slice(0, 3),
          };
        });

        setBillingData(studentBilling);
        console.log('✅ Billing data processed successfully');
      } catch (error) {
        console.error('❌ Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [students]);

  const getBillingStatus = studentId => {
    const data = billingData[studentId];
    if (!data) return { status: 'no-data', color: 'default', label: 'No Data' };

    if (data.hasOverdue) return { status: 'overdue', color: 'error', label: 'Overdue' };
    if (data.pendingAmount > 0) return { status: 'pending', color: 'warning', label: 'Pending' };
    if (data.totalAmount > 0) return { status: 'paid', color: 'success', label: 'Up to Date' };
    return { status: 'no-invoices', color: 'default', label: 'No Invoices' };
  };

  const getPaymentRateColor = rate => {
    if (rate >= 90) return theme.colors.status.success;
    if (rate >= 70) return '#FF9800';
    return theme.colors.status.error;
  };

  if (loading) {
    return (
      <Paper
        sx={{
          p: 3,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
          boxShadow: theme.shadows.card,
          mb: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
          Student Billing Overview
        </Typography>
        <LinearProgress />
      </Paper>
    );
  }

  const totalRevenue = Object.values(billingData).reduce((sum, data) => sum + data.totalAmount, 0);
  const totalOverdue = Object.values(billingData).reduce(
    (sum, data) => sum + data.overdueAmount,
    0
  );
  const studentsWithOverdue = Object.values(billingData).filter(data => data.hasOverdue).length;
  const averagePaymentRate =
    Object.values(billingData).length > 0
      ? Object.values(billingData).reduce((sum, data) => sum + data.paymentRate, 0) /
        Object.values(billingData).length
      : 0;

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
        mb: 3,
      }}
    >
      <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
        Student Billing Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: theme.colors.brand.primary + '20',
              border: `1px solid ${theme.colors.brand.primary}40`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <MoneyIcon sx={{ color: theme.colors.brand.primary, fontSize: 24, mb: 1 }} />
              <Typography variant="h6" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: theme.colors.status.error + '20',
              border: `1px solid ${theme.colors.status.error}40`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <WarningIcon sx={{ color: theme.colors.status.error, fontSize: 24, mb: 1 }} />
              <Typography variant="h6" sx={{ color: theme.colors.status.error, fontWeight: 700 }}>
                {formatCurrency(totalOverdue)}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Overdue Amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: '#FF9800' + '20',
              border: `1px solid ${'#FF9800'}40`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <ReceiptIcon sx={{ color: '#FF9800', fontSize: 24, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#FF9800', fontWeight: 700 }}>
                {studentsWithOverdue}
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Students w/ Overdue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              backgroundColor: theme.colors.status.success + '20',
              border: `1px solid ${theme.colors.status.success}40`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon sx={{ color: theme.colors.status.success, fontSize: 24, mb: 1 }} />
              <Typography variant="h6" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                {Math.round(averagePaymentRate)}%
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Avg Payment Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Student Details */}
      <Typography
        variant="subtitle1"
        sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 600 }}
      >
        Individual Student Billing Status
      </Typography>

      <Grid container spacing={2}>
        {students.slice(0, 8).map(student => {
          const billing = billingData[student.id] || {};
          const status = getBillingStatus(student.id);
          const studentName =
            `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
            student.name ||
            'Unnamed Student';

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
              <Card
                sx={{
                  backgroundColor: theme.colors.background.primary,
                  border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                  '&:hover': {
                    backgroundColor: theme.isDarkMode
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(0,0,0,0.02)',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.primary,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                      }}
                    >
                      {studentName}
                    </Typography>
                    <Tooltip title="View billing details">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails && onViewDetails(student)}
                        sx={{ p: 0.5 }}
                      >
                        <VisibilityIcon sx={{ fontSize: 16, color: theme.colors.text.secondary }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                    sx={{ mb: 1, fontSize: '0.75rem' }}
                  />

                  <Box>
                    <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                      Total: {formatCurrency(billing.totalAmount || 0)}
                    </Typography>
                    {billing.overdueAmount > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.colors.status.error,
                          display: 'block',
                        }}
                      >
                        Overdue: {formatCurrency(billing.overdueAmount)}
                      </Typography>
                    )}
                    {billing.paymentRate > 0 && (
                      <Box mt={0.5}>
                        <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                          Payment Rate: {Math.round(billing.paymentRate)}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={billing.paymentRate}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: theme.isDarkMode
                              ? 'rgba(255,255,255,0.1)'
                              : 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPaymentRateColor(billing.paymentRate),
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {students.length > 8 && (
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
            textAlign: 'center',
            mt: 2,
          }}
        >
          Showing first 8 students. View individual profiles for complete billing details.
        </Typography>
      )}
    </Paper>
  );
};

export default StudentBillingSummary;
