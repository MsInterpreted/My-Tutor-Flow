import { useMemo } from 'react';
import { Paper, Typography, Grid, Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { SESSION_TYPE_LABELS } from '../utils/constants';
import { useTheme } from '../theme/ThemeContext';
import dayjs from 'dayjs';

const SESSION_COLORS = {
  online: '#00D4AA',
  in_person_class: '#4A90E2',
  in_person_one_on_one: '#FF6B9D',
};

const SUBJECT_COLORS = [
  '#00D4AA', // Primary green
  '#4A90E2', // Blue
  '#FF6B9D', // Pink
  '#FFA726', // Orange
  '#AB47BC', // Purple
  '#26C6DA', // Cyan
  '#66BB6A', // Light green
  '#EF5350', // Red
];

export default function AnalyticsCharts({ attendance, marks }) {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  // Bar chart: attendance per month
  const attendanceChartData = useMemo(() => {
    const byMonth = {};
    attendance.forEach(a => {
      const month = dayjs(a.date).format('YYYY-MM');
      if (!byMonth[month])
        byMonth[month] = {
          month,
          ...Object.fromEntries(Object.keys(SESSION_TYPE_LABELS).map(t => [t, 0])),
        };
      byMonth[month][a.sessionType] += Number(a.duration || 0);
    });
    return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
  }, [attendance]);

  // Pie chart: session type breakdown
  const attendancePieData = useMemo(() => {
    const pie = {};
    attendance.forEach(a => {
      pie[a.sessionType] = (pie[a.sessionType] || 0) + Number(a.duration || 0);
    });
    return Object.keys(SESSION_TYPE_LABELS).map(type => ({
      name: SESSION_TYPE_LABELS[type],
      value: pie[type] || 0,
      type,
    }));
  }, [attendance]);

  // Marks line chart: terms vs subjects
  const { marksChartData, marksLineData } = useMemo(() => {
    const subjects = Array.from(new Set(marks.map(m => m.subject)));
    const byTerm = {};
    marks.forEach(m => {
      const term = m.term || 'Term';
      if (!byTerm[term]) byTerm[term] = { term };
      byTerm[term][m.subject] = m.mark;
    });
    return { marksChartData: subjects, marksLineData: Object.values(byTerm) };
  }, [marks]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 3,
          fontFamily: theme.typography.fontFamily.primary,
        }}
      >
        Analytics & Progress
      </Typography>
      {/* Mobile: Vertical Stack Layout, Desktop: Grid Layout */}
      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%' }}>
          {/* Monthly Attendance - First in stack */}
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              width: '100%',
              mx: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
                fontSize: '22px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
              }}
            >
              Monthly Attendance
            </Typography>
            {attendanceChartData.length > 0 ? (
              <ResponsiveContainer
                width="100%"
                height={450}
                style={{
                  margin: '0 auto',
                  display: 'block',
                  width: '100%',
                }}
              >
                <BarChart
                  data={attendanceChartData}
                  margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <YAxis
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.colors.background.tertiary,
                      border: 'none',
                      borderRadius: '8px',
                      color: theme.colors.text.primary,
                      boxShadow: theme.shadows.lg,
                    }}
                  />
                  <Legend />
                  {Object.keys(SESSION_TYPE_LABELS).map(type => (
                    <Bar
                      key={type}
                      dataKey={type}
                      stackId="a"
                      fill={SESSION_COLORS[type]}
                      name={SESSION_TYPE_LABELS[type]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 450,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.text.secondary,
                }}
              >
                <Typography variant="body1">No attendance data available</Typography>
              </Box>
            )}
          </Paper>

          {/* Session Types - Second in stack */}
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              width: '100%',
              mx: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
                fontSize: '22px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
              }}
            >
              Session Types
            </Typography>
            {attendancePieData.some(item => item.value > 0) ? (
              <ResponsiveContainer
                width="100%"
                height={400}
                style={{
                  margin: '0 auto',
                  display: 'block',
                  width: '100%',
                }}
              >
                <PieChart>
                  <Pie
                    data={attendancePieData.filter(item => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                  >
                    {attendancePieData.filter(item => item.value > 0).map(entry => (
                      <Cell key={entry.type} fill={SESSION_COLORS[entry.type]} />
                    ))}
                  </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.colors.background.tertiary,
                    border: 'none',
                    borderRadius: '8px',
                    color: theme.colors.text.primary,
                    boxShadow: theme.shadows.lg,
                  }}
                />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.text.secondary,
                }}
              >
                <Typography variant="body1">No session type data available</Typography>
              </Box>
            )}
          </Paper>

          {/* Academic Progress - Third in stack */}
          <Paper
            sx={{
              p: 2,
              borderRadius: '16px',
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: theme.shadows.card,
              width: '100%',
              mx: 0,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 600,
                mb: 2,
                fontSize: '22px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                lineHeight: 1.2,
              }}
            >
              Academic Progress
            </Typography>
            <ResponsiveContainer
              width="100%"
              height={450}
              style={{
                margin: '0 auto',
                display: 'block',
                width: '100%',
              }}
            >
              <AreaChart
                data={marksLineData}
                margin={{ top: 20, right: 5, left: 5, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.colors.brand.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.colors.brand.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="term"
                  tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.colors.background.tertiary }}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                  axisLine={{ stroke: theme.colors.background.tertiary }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: theme.colors.background.tertiary,
                    border: 'none',
                    borderRadius: '8px',
                    color: theme.colors.text.primary,
                    boxShadow: theme.shadows.lg,
                  }}
                />
                {marksChartData.map((subject, index) => (
                  <Area
                    key={subject.subject}
                    type="monotone"
                    dataKey={subject.subject}
                    stroke={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                    fill="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: SUBJECT_COLORS[index % SUBJECT_COLORS.length], strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: SUBJECT_COLORS[index % SUBJECT_COLORS.length], strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Monthly Attendance - Desktop Layout */}
          <Grid item xs={12} md={7}>
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
                  mb: 3,
                  fontSize: '16px',
                  textAlign: 'left',
                }}
              >
                Monthly Attendance
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={attendanceChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="month"
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <YAxis
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.colors.background.tertiary,
                      border: 'none',
                      borderRadius: '8px',
                      color: theme.colors.text.primary,
                      boxShadow: theme.shadows.lg,
                    }}
                  />
                  <Legend />
                  {Object.keys(SESSION_TYPE_LABELS).map(type => (
                    <Bar
                      key={type}
                      dataKey={type}
                      stackId="a"
                      fill={SESSION_COLORS[type]}
                      name={SESSION_TYPE_LABELS[type]}
                      radius={[2, 2, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Session Types - Desktop Layout */}
          <Grid item xs={12} md={5}>
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
                  mb: 3,
                  fontSize: '16px',
                  textAlign: 'left',
                }}
              >
                Session Types
              </Typography>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={attendancePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                  >
                    {attendancePieData.map(entry => (
                      <Cell key={entry.type} fill={SESSION_COLORS[entry.type]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.colors.background.tertiary,
                      border: 'none',
                      borderRadius: '8px',
                      color: theme.colors.text.primary,
                      boxShadow: theme.shadows.lg,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Academic Progress - Desktop Layout */}
          <Grid item xs={12}>
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
                  mb: 3,
                  fontSize: '16px',
                  textAlign: 'left',
                }}
              >
                Academic Progress
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={marksLineData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.colors.brand.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={theme.colors.brand.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="term"
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: theme.colors.text.secondary, fontSize: 12 }}
                    axisLine={{ stroke: theme.colors.background.tertiary }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.colors.background.tertiary,
                      border: 'none',
                      borderRadius: '8px',
                      color: theme.colors.text.primary,
                      boxShadow: theme.shadows.lg,
                    }}
                  />
                  {marksChartData.map((subject, index) => (
                    <Area
                      key={subject.subject}
                      type="monotone"
                      dataKey={subject.subject}
                      stroke={SUBJECT_COLORS[index % SUBJECT_COLORS.length]}
                      fill="url(#colorGradient)"
                      strokeWidth={3}
                      dot={{ fill: SUBJECT_COLORS[index % SUBJECT_COLORS.length], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: SUBJECT_COLORS[index % SUBJECT_COLORS.length], strokeWidth: 2 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
