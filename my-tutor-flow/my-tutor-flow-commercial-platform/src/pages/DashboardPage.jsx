import { useEffect, useState, useCallback } from 'react';
import firebaseService from '../services/firebaseService';
import {
  Box,
  Typography,
  Grid,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import ActivityCard from '../components/ActivityCard';
import ProgressCircle from '../components/ProgressCircle';
import ModernChart from '../components/ModernChart';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    students: 0,
    sessions: 0,
    hours: 0,
    quickStatsByGrade: {},
    weeklyData: [],
    loading: true,
  });
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // REMOVED COMPLEX MEMOIZED FUNCTIONS - CAUSING LOADING ISSUES

  // SIMPLIFIED data fetching - NO COMPLEX PROCESSING
  const fetchData = useCallback(async () => {
    try {
      // Simple, fast data fetching
      const students = await firebaseService.getStudents();
      const allSessions = await firebaseService.getAllAttendance();

      // Basic processing only
      const activeStudents = students.filter(s => s.isActive !== false);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const monthSessions = allSessions.filter(session => {
        const sessionDate = session.date?.toDate ? session.date.toDate() : new Date(session.date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
      });

      const totalHours = monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

      // Simple grade stats
      const quickStatsByGrade = {};
      activeStudents.forEach(student => {
        if (student.grade) {
          quickStatsByGrade[student.grade] = (quickStatsByGrade[student.grade] || 0) + 1;
        }
      });

      // Simple weekly data
      const weeklyData = [
        { label: 'Mon', value: 0 },
        { label: 'Tue', value: 0 },
        { label: 'Wed', value: 0 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ];

      setStats({
        students: activeStudents.length,
        sessions: monthSessions.length,
        hours: totalHours,
        assignments: 0, // Skip marks for now
        quickStatsByGrade,
        weeklyData,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // REMOVED COMPLEX WEEKLY CALCULATION - CAUSING LOADING ISSUES

  // Real-time updates disabled - using real data only

  if (stats.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography variant="h6" sx={{ color: theme.colors.text.secondary }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        pb: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: isMobile ? 2 : 4, px: isMobile ? 2 : 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }} className="animate-fade-in">
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
              mb: 1,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            My Tutor Flow
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.colors.text.secondary,
            }}
          >
            Welcome back! Here's what's happening with your tutoring.
          </Typography>
        </Box>

        {/* Activity Cards Grid */}
        <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }} className="stagger-children">
          <Grid item xs={6} sm={6} md={3}>
            <ActivityCard
              title="My Active"
              subtitle="Students"
              icon={SchoolIcon}
              color="pink"
              stats={stats.students}
              to="/students"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <ActivityCard
              title="Fit for growth"
              subtitle="Sessions"
              icon={TrendingUpIcon}
              color="cyan"
              stats={stats.sessions}
              to="/attendance"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <ActivityCard
              title="Study Hours"
              subtitle="Study Hours"
              icon={BookIcon}
              color="blue"
              stats={`${stats.hours.toFixed(1)}h`}
              to="/reports"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <ActivityCard
              title="Assignments"
              subtitle="Completed"
              icon={AssignmentIcon}
              color="yellow"
              stats={stats.assignments || 0}
              to="/progress"
            />
          </Grid>
        </Grid>

        {/* Progress and Analytics Section */}
        <Grid container spacing={3} className="animate-slide-in-left">
          {/* Progress Circle */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                background: theme.colors.background.secondary,
                borderRadius: '20px',
                p: 3,
                textAlign: 'center',
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
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
                Progress
              </Typography>
              <ProgressCircle
                percentage={stats.hours > 0 ? Math.min((stats.hours / 100) * 100, 100) : 0}
                size={140}
                color={theme.colors.brand.primary}
                value={stats.hours.toFixed(1)}
                subtitle="HOURS"
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                  >
                    {stats.sessions > 0 ? Math.round((stats.sessions / (stats.students || 1)) * 100) / 10 : 0}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                    COMPLETION
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: theme.colors.text.primary, fontWeight: 600 }}
                  >
                    {stats.sessions}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                    SESSIONS
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Weekly Chart */}
          <Grid item xs={12} md={8}>
            <ModernChart data={stats.weeklyData} type="line" title="Weekly Activity" height={300} />
          </Grid>
        </Grid>

        {/* Bottom Section - Quick Stats */}
        <Box sx={{ mt: 4 }} className="animate-fade-in">
          <Typography
            variant="h6"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 600,
              mb: 3,
            }}
          >
            Students by Grade
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(stats.quickStatsByGrade).map(([grade, count]) => (
              <Grid item xs={6} sm={4} md={2} key={grade}>
                <Box
                  sx={{
                    background: theme.colors.background.secondary,
                    borderRadius: '12px',
                    p: 2,
                    textAlign: 'center',
                    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows.md,
                    },
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.colors.brand.primary,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {count}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.colors.text.secondary,
                      fontSize: '12px',
                    }}
                  >
                    Grade {grade}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Analytics Section - DISABLED FOR SPEED */}
        {/* <DashboardAnalytics students={[]} sessions={[]} attendance={[]} /> */}
      </Container>
    </Box>
  );
};

export default DashboardPage;
