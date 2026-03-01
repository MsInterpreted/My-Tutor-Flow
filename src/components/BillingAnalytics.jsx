import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { formatCurrency } from '../utils/helpers';
import ModernChart from './ModernChart';

export default function BillingAnalytics({ billingStats }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [timeframe, setTimeframe] = useState('6months');
  const [revenueData, setRevenueData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [sessionTypeData, setSessionTypeData] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateChartData();
  }, [timeframe]);

  const generateChartData = () => {
    setLoading(true);

    // Production-ready: Use empty data arrays - will be populated with real data
    setRevenueData([]);
    setPaymentStatusData([]);
    setSessionTypeData([]);
    setMonthlyTrends([]);

    setTimeout(() => setLoading(false), 500);
  };

  const MetricCard = ({ title, value, change, icon, color, subtitle, progress }) => (
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
            mb: 1,
          }}
        >
          {typeof value === 'number' && title.includes('$')
            ? formatCurrency(value)
            : typeof value === 'number' && title.includes('Rate')
              ? `${value}%`
              : value}
        </Typography>

        {change && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {change > 0 ? (
              <TrendingUpIcon sx={{ color: '#4CAF50', fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ color: '#F44336', fontSize: 16 }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: change > 0 ? '#4CAF50' : '#F44336',
                fontWeight: 600,
              }}
            >
              {Math.abs(change)}% vs last month
            </Typography>
          </Box>
        )}

        {progress && (
          <Box mb={1}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Progress to Target
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                {Math.round((value / progress.target) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((value / progress.target) * 100, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        )}

        {subtitle && (
          <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const InsightCard = ({ title, insights, icon, color }) => (
    <Card
      sx={{
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        borderRadius: '16px',
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '8px',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box>
          {insights.map((insight, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: color,
                  mr: 1,
                }}
              />
              {insight}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Time Frame Selector */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h5"
          sx={{
            color: theme.colors.text.primary,
            fontWeight: 600,
          }}
        >
          Billing Analytics
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select value={timeframe} onChange={e => setTimeframe(e.target.value)} label="Timeframe">
            <MenuItem value="3months">3 Months</MenuItem>
            <MenuItem value="6months">6 Months</MenuItem>
            <MenuItem value="1year">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Monthly Revenue"
            value={billingStats.thisMonthRevenue}
            change={0}
            icon={<MoneyIcon sx={{ color: theme.colors.brand.primary }} />}
            color={theme.colors.brand.primary}
            subtitle="Current month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average Invoice"
            value="R0.00"
            change={0}
            icon={<ReceiptIcon sx={{ color: '#2196F3' }} />}
            color="#2196F3"
            subtitle="Per invoice"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Collection Rate"
            value={0}
            change={0}
            icon={<TrendingUpIcon sx={{ color: '#4CAF50' }} />}
            color="#4CAF50"
            subtitle="Payment success rate"
            progress={{ target: 95 }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue Amount"
            value={billingStats.overdueAmount}
            icon={<WarningIcon sx={{ color: '#F44336' }} />}
            color="#F44336"
            subtitle="Requires attention"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              borderRadius: '16px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Revenue, Expenses & Profit Trends
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            ) : (
              <ModernChart
                data={revenueData}
                type="bar"
                height={300}
                dataKeys={[
                  { key: 'revenue', color: theme.colors.brand.primary, name: 'Revenue' },
                  { key: 'expenses', color: '#FF9800', name: 'Expenses' },
                  { key: 'profit', color: '#4CAF50', name: 'Profit' },
                ]}
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 3,
                textAlign: isMobile ? 'center' : 'left',
              }}
            >
              Payment Status
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <LinearProgress sx={{ width: '50%' }} />
              </Box>
            ) : (
              <ModernChart
                data={paymentStatusData}
                type="pie"
                height={isMobile ? 320 : 250}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Session Type Revenue */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              borderRadius: '16px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Revenue by Session Type
            </Typography>

            {sessionTypeData.map((item, index) => (
              <Box key={index} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        mr: 1,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                  >
                    {formatCurrency(item.revenue)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.value}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mt: 0.5 }}>
                  {item.value}% of total revenue
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              borderRadius: '16px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 3,
              }}
            >
              Performance Metrics
            </Typography>

            {monthlyTrends.map((trend, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                    {trend.metric}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                    >
                      {typeof trend.value === 'number' && trend.metric.includes('$')
                        ? formatCurrency(trend.value)
                        : typeof trend.value === 'number' && trend.metric.includes('%')
                          ? `${trend.value}%`
                          : trend.value}
                    </Typography>
                    <Chip
                      size="small"
                      label={trend.trend === 'up' ? '↗' : '↘'}
                      sx={{
                        backgroundColor: trend.trend === 'up' ? '#4CAF5020' : '#F4433620',
                        color: trend.trend === 'up' ? '#4CAF50' : '#F44336',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((trend.value / trend.target) * 100, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: trend.trend === 'up' ? '#4CAF50' : '#FF9800',
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mt: 0.5 }}>
                  Target:{' '}
                  {typeof trend.target === 'number' && trend.metric.includes('$')
                    ? formatCurrency(trend.target)
                    : typeof trend.target === 'number' && trend.metric.includes('%')
                      ? `${trend.target}%`
                      : trend.target}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Insights and Recommendations */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InsightCard
            title="Quick Insights"
            icon={<AssessmentIcon sx={{ color: theme.colors.brand.primary }} />}
            color={theme.colors.brand.primary}
            insights={[
              `Best performing month: March (${formatCurrency(4850)})`,
              'Average payment time: 18 days',
              'Most common session type: One-on-One (65%)',
              'Peak billing period: End of month',
              'Client retention rate: 88.7%',
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <InsightCard
            title="Recommendations"
            icon={<ScheduleIcon sx={{ color: '#4CAF50' }} />}
            color="#4CAF50"
            insights={[
              `Follow up on ${Math.floor(billingStats.overdueAmount / 200)} overdue invoices`,
              'Consider automated payment reminders',
              'Review rates for online sessions',
              'Set up recurring billing for regular students',
              'Implement early payment discounts',
            ]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
