import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/helpers';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import UserManagement from '../components/UserManagement';
import BusinessIntelligenceDashboard from '../components/BusinessIntelligenceDashboard';
import SlidingBusinessDashboardSelector from '../components/SlidingBusinessDashboardSelector';
import { AuthContext } from '../contexts/AuthContext';
import { getUserProfile } from '../services/authorizationService';

const BusinessDashboard = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('monthly');
  const { currentUser, userProfile: contextUserProfile, loadingAuth } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper functions for tab value conversion
  const getTabValue = (tabIndex) => {
    const tabValues = ['financial-overview', 'business-intelligence', 'client-payment', 'user-management'];
    return tabValues[tabIndex] || 'financial-overview';
  };

  const getTabIndex = (value) => {
    const tabValues = ['financial-overview', 'business-intelligence', 'client-payment', 'user-management'];
    return tabValues.indexOf(value) !== -1 ? tabValues.indexOf(value) : 0;
  };

  useEffect(() => {
    // Use the userProfile from AuthContext if available, otherwise fetch it
    if (contextUserProfile) {
      setUserProfile(contextUserProfile);
      setLoading(false);
    } else if (currentUser && !loadingAuth) {
      const fetchUserProfile = async () => {
        setLoading(true);
        try {
          const profile = await getUserProfile(currentUser.uid);
          setUserProfile(profile);
        } catch (error) {
          console.warn('Error fetching user profile:', error);
          setUserProfile(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else if (loadingAuth) {
      setLoading(true);
    }
  }, [currentUser, contextUserProfile, loadingAuth]);

  // Business metrics data - will be calculated from real data
  const [businessData, setBusinessData] = useState({
    revenue: {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      growth: 0,
    },
    expenses: {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      breakdown: [],
    },
    profitability: {
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      margin: 0,
    },
    clients: {
      total: 0,
      active: 0,
      onTime: 0,
      late: 0,
      overdue: 0,
    },
    monthlyTrend: [],
  });

  const [clientPaymentStatus, setClientPaymentStatus] = useState([]);

  const getStatusColor = status => {
    switch (status) {
      case 'paid':
        return theme.colors.status.success;
      case 'late':
        return theme.colors.status.warning;
      case 'overdue':
        return theme.colors.status.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'late':
        return <AccessTimeIcon sx={{ fontSize: 16 }} />;
      case 'overdue':
        return <WarningIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        background: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ fontSize: 24, color: 'white' }} />
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: theme.colors.status.success }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: theme.colors.status.error }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: trend === 'up' ? theme.colors.status.success : theme.colors.status.error,
                fontWeight: 600,
              }}
            >
              {trendValue}%
            </Typography>
          </Box>
        )}
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 600,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: theme.colors.text.secondary,
        }}
      >
        {subtitle}
      </Typography>
    </Paper>
  );

  // Show loading state while authentication is being determined
  if (loadingAuth) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.colors.background.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
          Loading Business Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 1,
        }}
      >
        Business Dashboard
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.colors.text.secondary,
          mb: 4,
        }}
      >
        Monitor your tutoring business performance and financial health
      </Typography>

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
            Business Dashboard
          </Typography>
          <SlidingBusinessDashboardSelector
            value={getTabValue(activeTab)}
            onChange={(value) => {
              const tabIndex = getTabIndex(value);
              setActiveTab(tabIndex);
            }}
            options={[
              { value: 'financial-overview', label: 'Financial Overview' },
              { value: 'business-intelligence', label: 'Business Intelligence' },
              { value: 'client-payment', label: 'Client Payment' },
              ...(userProfile?.roleInfo?.canManageUsers ? [{ value: 'user-management', label: 'User Management' }] : [])
            ]}
            disabled={loading}
          />
        </Box>
      ) : (
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: theme.colors.text.secondary,
              '&.Mui-selected': {
                color: theme.colors.brand.primary,
              },
            },
          }}
        >
          <Tab label="Financial Overview" icon={<AnalyticsIcon />} />
          <Tab label="Business Intelligence" icon={<TrendingUpIcon />} />
          <Tab label="Client Payments" icon={<PeopleIcon />} />
          {userProfile?.roleInfo?.canManageUsers && (
            <Tab label="User Management" icon={<PeopleIcon />} />
          )}
        </Tabs>
      )}

      {/* PERFORMANCE: Lazy load tab content only when active and not loading */}
      {activeTab === 0 && !loading && (
        <FinancialOverview
          businessData={businessData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          MetricCard={MetricCard}
          theme={theme}
        />
      )}

      {activeTab === 1 && !loading && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
            Business Intelligence
          </Typography>
          <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
            Advanced analytics temporarily disabled for faster loading.
          </Typography>
        </Box>
      )}

      {activeTab === 2 && !loading && (
        <ClientPayments
          clientPaymentStatus={clientPaymentStatus}
          businessData={businessData}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          theme={theme}
        />
      )}

      {activeTab === 3 && !loading && userProfile?.roleInfo?.canManageUsers && currentUser && (
        <UserManagement currentUser={currentUser} userProfile={userProfile} />
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
            Loading dashboard data...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

// Financial Overview Component
const FinancialOverview = ({ businessData, timeframe, setTimeframe, MetricCard, theme }) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  return (
  <Grid container spacing={3}>
    {/* Key Metrics */}
    <Grid item xs={12} md={3}>
      <MetricCard
        title="Monthly Revenue"
        value={formatCurrency(businessData.revenue.monthly)}
        subtitle="This month's earnings"
        icon={MoneyIcon}
        color={theme.colors.brand.primary}
        trend="up"
        trendValue={businessData.revenue.growth}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <MetricCard
        title="Monthly Expenses"
        value={formatCurrency(businessData.expenses.monthly)}
        subtitle="Operating costs"
        icon={ReceiptIcon}
        color="#FF6B6B"
        trend="down"
        trendValue={2.1}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <MetricCard
        title="Net Profit"
        value={formatCurrency(businessData.profitability.monthly)}
        subtitle={`${businessData.profitability.margin}% margin`}
        icon={TrendingUpIcon}
        color="#00D4AA"
        trend="up"
        trendValue={18.5}
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <MetricCard
        title="Active Clients"
        value={businessData.clients.active}
        subtitle={`${businessData.clients.total} total clients`}
        icon={PeopleIcon}
        color="#4A90E2"
        trend="up"
        trendValue={8.3}
      />
    </Grid>

    {/* Revenue Trend */}
    <Grid item xs={12} md={8}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '16px',
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 2 }}>
          Revenue & Profit Trend
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={businessData.monthlyTrend}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.colors.brand.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.colors.brand.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.background.tertiary} />
            <XAxis dataKey="month" tick={{ fill: theme.colors.text.secondary }} />
            <YAxis tick={{ fill: theme.colors.text.secondary }} />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.colors.background.tertiary,
                border: 'none',
                borderRadius: '8px',
                color: theme.colors.text.primary,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={theme.colors.brand.primary}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#00D4AA"
              fillOpacity={1}
              fill="url(#colorProfit)"
              strokeWidth={2}
            />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>

    {/* Expense Breakdown */}
    <Grid item xs={12} md={4}>
      <Paper
        sx={{
          p: 3,
          borderRadius: '16px',
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
            mb: 2,
            textAlign: 'center'
          }}
        >
          Expense Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={isMobile ? 400 : 300}>
          <PieChart>
            <Pie
              data={businessData.expenses.breakdown}
              cx="50%"
              cy={isMobile ? "45%" : "50%"}
              innerRadius={isMobile ? 60 : 50}
              outerRadius={isMobile ? 120 : 80}
              paddingAngle={5}
              dataKey="amount"
              label={({ category, amount }) => formatCurrency(amount)}
              labelLine={false}
            >
              {businessData.expenses.breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.colors.background.tertiary,
                border: 'none',
                borderRadius: '8px',
                color: theme.colors.text.primary,
                fontSize: isMobile ? '14px' : '12px',
              }}
            />
            <Legend
              verticalAlign={isMobile ? "bottom" : "bottom"}
              height={isMobile ? 60 : 36}
              iconType="circle"
              wrapperStyle={{
                paddingTop: isMobile ? '20px' : '10px',
                fontSize: isMobile ? '14px' : '12px',
                textAlign: 'center',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
  </Grid>
  );
};

// Client Payments Component
const ClientPayments = ({
  clientPaymentStatus,
  businessData,
  getStatusColor,
  getStatusIcon,
  theme,
}) => (
  <Grid container spacing={3}>
    {/* Payment Status Overview */}
    <Grid item xs={12} md={3}>
      <Card sx={{ backgroundColor: theme.colors.background.secondary, height: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
            Payment Status
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">On Time</Typography>
              <Typography variant="body2" sx={{ color: theme.colors.status.success }}>
                {businessData.clients.onTime}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(businessData.clients.onTime / businessData.clients.total) * 100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.background.tertiary }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Late</Typography>
              <Typography variant="body2" sx={{ color: theme.colors.status.warning }}>
                {businessData.clients.late}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(businessData.clients.late / businessData.clients.total) * 100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.background.tertiary }}
            />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Overdue</Typography>
              <Typography variant="body2" sx={{ color: theme.colors.status.error }}>
                {businessData.clients.overdue}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(businessData.clients.overdue / businessData.clients.total) * 100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.background.tertiary }}
            />
          </Box>
        </CardContent>
      </Card>
    </Grid>

    {/* Client Payment Table */}
    <Grid item xs={12} md={9}>
      <Paper
        sx={{
          borderRadius: '16px',
          background: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          boxShadow: theme.shadows.card,
        }}
      >
        <Box sx={{ p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
            Client Payment Status
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Days Overdue</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientPaymentStatus.map(client => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {client.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ${client.amount}
                    </Typography>
                  </TableCell>
                  <TableCell>{client.dueDate}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(client.status)}
                      label={client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(client.status),
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {client.daysOverdue > 0 ? (
                      <Typography variant="body2" sx={{ color: theme.colors.status.error }}>
                        {client.daysOverdue} days
                      </Typography>
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined">
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  </Grid>
);

export default BusinessDashboard;
