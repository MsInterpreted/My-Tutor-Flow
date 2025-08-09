import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Switch,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Download,
  Payment,
  Schedule,
  CheckCircle,
  Error,
  Warning,
  Info,
  Receipt,
  Send,
  History,
  Settings,
  AutoMode,
  Notifications,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import { formatCurrency } from '../utils/helpers';

const AdvancedBillingFeatures = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [activeFeature, setActiveFeature] = useState('bulk-processing');
  const [bulkProcessing, setBulkProcessing] = useState({
    isRunning: false,
    progress: 0,
    currentStep: 0,
    totalSteps: 0,
    results: [],
    errors: [],
  });
  const [paymentTracking, setPaymentTracking] = useState({
    payments: [],
    overdue: [],
    upcoming: [],
  });
  const [recurringBilling, setRecurringBilling] = useState({
    schedules: [],
    nextRun: null,
    isEnabled: false,
  });

  useEffect(() => {
    loadAdvancedFeatures();
  }, []);

  const loadAdvancedFeatures = async () => {
    try {
      // Load payment tracking data
      const invoices = await firebaseService.getAllInvoices();
      const payments = invoices.filter(inv => inv.status === 'paid');
      const overdue = invoices.filter(
        inv => inv.status === 'unpaid' && new Date(inv.dueDate) < new Date()
      );
      const upcoming = invoices.filter(
        inv => inv.status === 'unpaid' && new Date(inv.dueDate) >= new Date()
      );

      setPaymentTracking({ payments, overdue, upcoming });

      // Load recurring billing schedules (mock data for now)
      setRecurringBilling({
        schedules: [
          {
            id: 'schedule1',
            name: 'Monthly Billing - All Students',
            frequency: 'monthly',
            nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isActive: true,
            studentCount: 15,
          },
          {
            id: 'schedule2',
            name: 'Weekly Billing - Premium Students',
            frequency: 'weekly',
            nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            isActive: false,
            studentCount: 5,
          },
        ],
        nextRun: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        isEnabled: true,
      });
    } catch (error) {
      console.error('Error loading advanced features:', error);
    }
  };

  const startBulkProcessing = async () => {
    setBulkProcessing(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      currentStep: 0,
      totalSteps: 5,
      results: [],
      errors: [],
    }));

    const steps = [
      'Loading student data',
      'Calculating billing amounts',
      'Generating invoices',
      'Processing payments',
      'Sending notifications',
    ];

    for (let i = 0; i < steps.length; i++) {
      setBulkProcessing(prev => ({
        ...prev,
        currentStep: i,
        progress: ((i + 1) / steps.length) * 100,
      }));

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate some results
      const stepResult = {
        step: steps[i],
        status: Math.random() > 0.1 ? 'success' : 'error',
        message:
          Math.random() > 0.1 ? `${steps[i]} completed successfully` : `Error in ${steps[i]}`,
        timestamp: new Date().toISOString(),
      };

      setBulkProcessing(prev => ({
        ...prev,
        results: [...prev.results, stepResult],
        errors: stepResult.status === 'error' ? [...prev.errors, stepResult] : prev.errors,
      }));
    }

    setBulkProcessing(prev => ({
      ...prev,
      isRunning: false,
    }));
  };

  const stopBulkProcessing = () => {
    setBulkProcessing(prev => ({
      ...prev,
      isRunning: false,
    }));
  };

  const BulkProcessingPanel = () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AutoMode sx={{ color: theme.colors.brand.primary }} />
        Bulk Invoice Processing
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.colors.background.primary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                Processing Status
              </Typography>

              {bulkProcessing.isRunning && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={bulkProcessing.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.colors.background.secondary,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.colors.brand.primary,
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.text.secondary,
                      mt: 1,
                      textAlign: 'center',
                    }}
                  >
                    {Math.round(bulkProcessing.progress)}% Complete
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? 1.5 : 2,
                  mb: 2,
                  width: '100%',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={startBulkProcessing}
                  disabled={bulkProcessing.isRunning}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    minWidth: isMobile ? '100%' : '160px',
                    minHeight: '48px',
                    padding: isMobile ? '12px 24px' : '10px 20px',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    flex: isMobile ? 'none' : '1',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                    '&:disabled': {
                      backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      color: theme.isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                    },
                    // Touch-friendly for mobile
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Start Processing
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Stop />}
                  onClick={stopBulkProcessing}
                  disabled={!bulkProcessing.isRunning}
                  sx={{
                    color: theme.colors.status.error,
                    borderColor: theme.colors.status.error,
                    minWidth: isMobile ? '100%' : '120px',
                    minHeight: '48px',
                    padding: isMobile ? '12px 24px' : '10px 20px',
                    fontSize: isMobile ? '16px' : '14px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    flex: isMobile ? 'none' : '1',
                    '&:hover': {
                      backgroundColor: `${theme.colors.status.error}10`,
                      borderColor: theme.colors.status.error,
                    },
                    '&:disabled': {
                      color: theme.isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    },
                    // Touch-friendly for mobile
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Stop
                </Button>
              </Box>

              {bulkProcessing.results.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.colors.text.primary,
                      mb: 1,
                    }}
                  >
                    Processing Results:
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {bulkProcessing.results.map((result, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          mb: 1,
                          backgroundColor:
                            result.status === 'success'
                              ? theme.colors.status.success + '20'
                              : theme.colors.status.error + '20',
                          borderRadius: '8px',
                          border: `1px solid ${
                            result.status === 'success'
                              ? theme.colors.status.success + '40'
                              : theme.colors.status.error + '40'
                          }`,
                        }}
                      >
                        {result.status === 'success' ? (
                          <CheckCircle
                            sx={{
                              color: theme.colors.status.success,
                              fontSize: 16,
                            }}
                          />
                        ) : (
                          <Error
                            sx={{
                              color: theme.colors.status.error,
                              fontSize: 16,
                            }}
                          />
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.colors.text.primary,
                            flex: 1,
                          }}
                        >
                          {result.message}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              backgroundColor: theme.colors.background.primary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              borderRadius: '12px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                Batch Configuration
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl size="small">
                  <InputLabel>Processing Mode</InputLabel>
                  <Select defaultValue="standard" label="Processing Mode">
                    <MenuItem value="standard">Standard Processing</MenuItem>
                    <MenuItem value="express">Express Processing</MenuItem>
                    <MenuItem value="scheduled">Scheduled Processing</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <InputLabel>Notification Method</InputLabel>
                  <Select defaultValue="email" label="Notification Method">
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="whatsapp">WhatsApp</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Generate PDF invoices"
                  sx={{ color: theme.colors.text.primary }}
                />

                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Send automatic reminders"
                  sx={{ color: theme.colors.text.primary }}
                />

                <FormControlLabel
                  control={<Checkbox />}
                  label="Process payments automatically"
                  sx={{ color: theme.colors.text.primary }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );

  const PaymentTrackingPanel = () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Payment sx={{ color: theme.colors.brand.primary }} />
        Payment Tracking & Status
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: theme.colors.status.success + '20',
              border: `1px solid ${theme.colors.status.success}40`,
              borderRadius: '12px',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle
                sx={{
                  color: theme.colors.status.success,
                  fontSize: 32,
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: theme.colors.status.success,
                  fontWeight: 700,
                }}
              >
                {paymentTracking.payments.length}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.primary,
                }}
              >
                Paid Invoices
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: theme.colors.status.error + '20',
              border: `1px solid ${theme.colors.status.error}40`,
              borderRadius: '12px',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning
                sx={{
                  color: theme.colors.status.error,
                  fontSize: 32,
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: theme.colors.status.error,
                  fontWeight: 700,
                }}
              >
                {paymentTracking.overdue.length}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.primary,
                }}
              >
                Overdue Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card
            sx={{
              backgroundColor: theme.colors.status.warning + '20',
              border: `1px solid ${theme.colors.status.warning}40`,
              borderRadius: '12px',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule
                sx={{
                  color: theme.colors.status.warning,
                  fontSize: 32,
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: theme.colors.status.warning,
                  fontWeight: 700,
                }}
              >
                {paymentTracking.upcoming.length}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.colors.text.primary,
                }}
              >
                Upcoming Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: theme.colors.background.primary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
          borderRadius: '12px',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Invoice
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Student
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Due Date
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...paymentTracking.overdue, ...paymentTracking.upcoming]
              .slice(0, 10)
              .map((invoice, index) => (
                <TableRow key={invoice.id || index}>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {invoice.invoiceNumber || `INV-${String(index + 1).padStart(3, '0')}`}
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {invoice.studentName || 'Student Name'}
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {formatCurrency(invoice.amount || 0)}
                  </TableCell>
                  <TableCell sx={{ color: theme.colors.text.primary }}>
                    {new Date(invoice.dueDate || Date.now()).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={invoice.status || 'unpaid'}
                      size="small"
                      sx={{
                        backgroundColor:
                          invoice.status === 'paid'
                            ? theme.colors.status.success + '20'
                            : new Date(invoice.dueDate || Date.now()) < new Date()
                              ? theme.colors.status.error + '20'
                              : theme.colors.status.warning + '20',
                        color:
                          invoice.status === 'paid'
                            ? theme.colors.status.success
                            : new Date(invoice.dueDate || Date.now()) < new Date()
                              ? theme.colors.status.error
                              : theme.colors.status.warning,
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Send Reminder">
                        <IconButton size="small" sx={{ color: theme.colors.brand.primary }}>
                          <Send fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ color: theme.colors.brand.primary }}>
                          <Receipt fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const RecurringBillingPanel = () => (
    <Paper
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        borderRadius: '16px',
        boxShadow: theme.shadows.card,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Schedule sx={{ color: theme.colors.brand.primary }} />
          Recurring Billing Schedules
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={recurringBilling.isEnabled}
              onChange={e =>
                setRecurringBilling(prev => ({
                  ...prev,
                  isEnabled: e.target.checked,
                }))
              }
            />
          }
          label="Enable Recurring Billing"
          sx={{ color: theme.colors.text.primary }}
        />
      </Box>

      <Grid container spacing={3}>
        {recurringBilling.schedules.map(schedule => (
          <Grid item xs={12} md={6} key={schedule.id}>
            <Card
              sx={{
                backgroundColor: theme.colors.background.primary,
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
                borderRadius: '12px',
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                    {schedule.name}
                  </Typography>
                  <Chip
                    label={schedule.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      backgroundColor: schedule.isActive
                        ? theme.colors.status.success + '20'
                        : theme.colors.status.error + '20',
                      color: schedule.isActive
                        ? theme.colors.status.success
                        : theme.colors.status.error,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    mb: 1,
                  }}
                >
                  Frequency: {schedule.frequency}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    mb: 1,
                  }}
                >
                  Students: {schedule.studentCount}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.text.secondary,
                    mb: 2,
                  }}
                >
                  Next Run: {schedule.nextRun.toLocaleDateString()}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Settings />}
                    sx={{
                      color: theme.colors.brand.primary,
                      borderColor: theme.colors.brand.primary,
                    }}
                  >
                    Configure
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<History />}
                    sx={{
                      color: theme.colors.brand.primary,
                      borderColor: theme.colors.brand.primary,
                    }}
                  >
                    History
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 4,
        }}
      >
        Advanced Billing Features
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1.5 : 2,
          mb: 4,
          width: '100%',
        }}
      >
        <Button
          variant={activeFeature === 'bulk-processing' ? 'contained' : 'outlined'}
          onClick={() => setActiveFeature('bulk-processing')}
          sx={{
            backgroundColor:
              activeFeature === 'bulk-processing' ? theme.colors.brand.primary : 'transparent',
            color: activeFeature === 'bulk-processing' ? '#000000' : theme.colors.brand.primary,
            borderColor: theme.colors.brand.primary,
            minWidth: isMobile ? '100%' : '180px',
            minHeight: '48px',
            padding: isMobile ? '12px 24px' : '10px 24px',
            fontSize: isMobile ? '16px' : '14px',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flex: isMobile ? 'none' : 1,
            '&:hover': {
              backgroundColor: activeFeature === 'bulk-processing'
                ? theme.colors.brand.primary
                : `${theme.colors.brand.primary}10`,
              borderColor: theme.colors.brand.primary,
            },
            // Touch-friendly for mobile
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Bulk Processing
        </Button>
        <Button
          variant={activeFeature === 'payment-tracking' ? 'contained' : 'outlined'}
          onClick={() => setActiveFeature('payment-tracking')}
          sx={{
            backgroundColor:
              activeFeature === 'payment-tracking' ? theme.colors.brand.primary : 'transparent',
            color: activeFeature === 'payment-tracking' ? '#000000' : theme.colors.brand.primary,
            borderColor: theme.colors.brand.primary,
            minWidth: isMobile ? '100%' : '180px',
            minHeight: '48px',
            padding: isMobile ? '12px 24px' : '10px 24px',
            fontSize: isMobile ? '16px' : '14px',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flex: isMobile ? 'none' : 1,
            '&:hover': {
              backgroundColor: activeFeature === 'payment-tracking'
                ? theme.colors.brand.primary
                : `${theme.colors.brand.primary}10`,
              borderColor: theme.colors.brand.primary,
            },
            // Touch-friendly for mobile
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Payment Tracking
        </Button>
        <Button
          variant={activeFeature === 'recurring-billing' ? 'contained' : 'outlined'}
          onClick={() => setActiveFeature('recurring-billing')}
          sx={{
            backgroundColor:
              activeFeature === 'recurring-billing' ? theme.colors.brand.primary : 'transparent',
            color: activeFeature === 'recurring-billing' ? '#000000' : theme.colors.brand.primary,
            borderColor: theme.colors.brand.primary,
            minWidth: isMobile ? '100%' : '180px',
            minHeight: '48px',
            padding: isMobile ? '12px 24px' : '10px 24px',
            fontSize: isMobile ? '16px' : '14px',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            whiteSpace: 'nowrap',
            flex: isMobile ? 'none' : 1,
            '&:hover': {
              backgroundColor: activeFeature === 'recurring-billing'
                ? theme.colors.brand.primary
                : `${theme.colors.brand.primary}10`,
              borderColor: theme.colors.brand.primary,
            },
            // Touch-friendly for mobile
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Recurring Billing
        </Button>
      </Box>

      {activeFeature === 'bulk-processing' && <BulkProcessingPanel />}
      {activeFeature === 'payment-tracking' && <PaymentTrackingPanel />}
      {activeFeature === 'recurring-billing' && <RecurringBillingPanel />}
    </Box>
  );
};

export default AdvancedBillingFeatures;
