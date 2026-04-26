import React from 'react';
import { Grid, Paper, Typography, Box, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
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
} from 'recharts';
import { TrendingUp, School, Grade, Assessment } from '@mui/icons-material';

const OverviewAnalytics = ({ analyticsData, theme }) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: '16px',
        background: theme.colors.background.secondary,
        border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: theme.shadows.card,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Icon sx={{ fontSize: 30, color: 'white' }} />
      </Box>
      <Typography
        variant="h3"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 1,
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
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.secondary,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Grid container spacing={3}>
      {/* Key Statistics */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Students"
          value={analyticsData.totalStudents}
          icon={School}
          color={theme.colors.brand.primary}
          subtitle="Active learners"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Average Grade"
          value={`${analyticsData.averageGrade}%`}
          icon={Grade}
          color="#4A90E2"
          subtitle="Overall performance"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Top Performers"
          value={analyticsData.topPerformersCount || 0}
          icon={TrendingUp}
          color="#00D4AA"
          subtitle="90%+ average"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Subjects Taught"
          value={analyticsData.subjectsCount || 0}
          icon={Assessment}
          color="#FFD93D"
          subtitle="Active subjects"
        />
      </Grid>

      {/* Performance Distribution */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
            height: isMobile ? '500px' : '400px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 2,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            Performance Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={isMobile ? 400 : 300}>
            <PieChart>
              <Pie
                data={analyticsData.performanceDistribution}
                cx="50%"
                cy={isMobile ? "45%" : "50%"}
                innerRadius={isMobile ? 80 : 60}
                outerRadius={isMobile ? 140 : 100}
                paddingAngle={5}
                dataKey="students"
                label={({ range, students }) => `${range}: ${students}`}
                labelLine={false}
              >
                {analyticsData.performanceDistribution.map((entry, index) => (
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

      {/* Grade Progression */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            boxShadow: theme.shadows.card,
            height: isMobile ? '450px' : '400px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 2,
              textAlign: isMobile ? 'center' : 'left',
            }}
          >
            Grade Progress
          </Typography>
          <ResponsiveContainer width="100%" height={isMobile ? 350 : 300}>
            <LineChart
              data={analyticsData.gradeProgression}
              margin={{
                top: 20,
                right: isMobile ? 40 : 30,
                left: isMobile ? 40 : 20,
                bottom: 20
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.background.tertiary} />
              <XAxis
                dataKey="term"
                tick={{
                  fill: theme.colors.text.secondary,
                  fontSize: isMobile ? 14 : 12,
                }}
                axisLine={{ stroke: theme.colors.background.tertiary }}
                tickLine={{ stroke: theme.colors.background.tertiary }}
              />
              <YAxis
                tick={{
                  fill: theme.colors.text.secondary,
                  fontSize: isMobile ? 14 : 12,
                }}
                axisLine={{ stroke: theme.colors.background.tertiary }}
                tickLine={{ stroke: theme.colors.background.tertiary }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background.tertiary,
                  border: 'none',
                  borderRadius: '8px',
                  color: theme.colors.text.primary,
                  fontSize: isMobile ? '14px' : '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke={theme.colors.brand.primary}
                strokeWidth={isMobile ? 4 : 3}
                dot={{
                  fill: theme.colors.brand.primary,
                  strokeWidth: 2,
                  r: isMobile ? 8 : 6
                }}
                activeDot={{
                  r: isMobile ? 10 : 8,
                  stroke: theme.colors.brand.primary,
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Subject Performance */}
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
              mb: 2,
            }}
          >
            Subject Performance Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={analyticsData.subjectPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.background.tertiary} />
              <XAxis
                dataKey="subject"
                tick={{ fill: theme.colors.text.secondary }}
                axisLine={{ stroke: theme.colors.background.tertiary }}
              />
              <YAxis
                tick={{ fill: theme.colors.text.secondary }}
                axisLine={{ stroke: theme.colors.background.tertiary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.colors.background.tertiary,
                  border: 'none',
                  borderRadius: '8px',
                  color: theme.colors.text.primary,
                }}
              />
              <Bar dataKey="average" fill={theme.colors.brand.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OverviewAnalytics;
