import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Autocomplete,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme as useMuiTheme,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import firebaseService from '../services/firebaseService';
import OverviewAnalytics from '../components/OverviewAnalytics';
import StudentProgressReports from '../components/StudentProgressReports';
import SlidingReportsSelector from '../components/SlidingReportsSelector';

const ReportsPage = () => {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  // Helper functions for tab value conversion
  const getTabValue = (tabIndex) => {
    const tabValues = ['overview-analytics', 'student-progress-reports'];
    return tabValues[tabIndex] || 'overview-analytics';
  };

  const getTabIndex = (value) => {
    const tabValues = ['overview-analytics', 'student-progress-reports'];
    return tabValues.indexOf(value) !== -1 ? tabValues.indexOf(value) : 0;
  };
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Student analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalStudents: 0,
    averageGrade: 0,
    performanceDistribution: [],
    gradeProgression: [],
    subjectPerformance: [],
    topPerformersCount: 0,
    subjectsCount: 0,
  });

  useEffect(() => {
    fetchDataAndGenerateAnalytics();
  }, []);

  const fetchDataAndGenerateAnalytics = async () => {
    try {
      setLoading(true);

      // PERFORMANCE: Single fetch for both students and analytics
      const [studentsData, marksData] = await Promise.all([
        firebaseService.getStudents(),
        firebaseService.getAllMarks ? firebaseService.getAllMarks() : Promise.resolve([]),
      ]);

      // Set students data
      setStudents(studentsData);

      // Calculate real analytics from actual data
      const totalStudents = studentsData.length;
      const averageGrade = calculateAverageGrade(marksData);
      const performanceDistribution = calculatePerformanceDistribution(marksData);
      const gradeProgression = calculateGradeProgression(marksData);
      const subjectPerformance = calculateSubjectPerformance(marksData);
      const topPerformersCount = calculateTopPerformers(marksData);
      const subjectsCount = subjectPerformance.length;

      setAnalyticsData({
        totalStudents,
        averageGrade,
        performanceDistribution,
        gradeProgression,
        subjectPerformance,
        topPerformersCount,
        subjectsCount,
      });
    } catch (error) {
      console.error('Error fetching data and generating analytics:', error);
      // Fallback to empty data
      setAnalyticsData({
        totalStudents: 0,
        averageGrade: 0,
        performanceDistribution: [],
        gradeProgression: [],
        subjectPerformance: [],
        topPerformersCount: 0,
        subjectsCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for analytics calculations
  const calculateAverageGrade = (marks) => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + (mark.mark || 0), 0);
    return Math.round((total / marks.length) * 10) / 10;
  };

  const calculatePerformanceDistribution = (marks) => {
    if (marks.length === 0) {
      return [
        { range: '90-100%', students: 0, color: '#00D4AA' },
        { range: '80-89%', students: 0, color: '#4A90E2' },
        { range: '70-79%', students: 0, color: '#FFD93D' },
        { range: '60-69%', students: 0, color: '#FF6B6B' },
        { range: 'Below 60%', students: 0, color: '#FF4757' },
      ];
    }

    const distribution = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      'below-60': 0,
    };

    marks.forEach(mark => {
      const score = mark.mark || 0;
      if (score >= 90) distribution['90-100']++;
      else if (score >= 80) distribution['80-89']++;
      else if (score >= 70) distribution['70-79']++;
      else if (score >= 60) distribution['60-69']++;
      else distribution['below-60']++;
    });

    return [
      { range: '90-100%', students: distribution['90-100'], color: '#00D4AA' },
      { range: '80-89%', students: distribution['80-89'], color: '#4A90E2' },
      { range: '70-79%', students: distribution['70-79'], color: '#FFD93D' },
      { range: '60-69%', students: distribution['60-69'], color: '#FF6B6B' },
      { range: 'Below 60%', students: distribution['below-60'], color: '#FF4757' },
    ];
  };

  const calculateGradeProgression = (marks) => {
    if (marks.length === 0) return [];

    const termAverages = {};
    const termCounts = {};

    marks.forEach(mark => {
      const term = mark.term || 'Term 1';
      if (!termAverages[term]) {
        termAverages[term] = 0;
        termCounts[term] = 0;
      }
      termAverages[term] += mark.mark || 0;
      termCounts[term]++;
    });

    return Object.entries(termAverages)
      .map(([term, total]) => ({
        term,
        average: Math.round((total / termCounts[term]) * 10) / 10,
      }))
      .sort((a, b) => a.term.localeCompare(b.term));
  };

  const calculateSubjectPerformance = (marks) => {
    if (marks.length === 0) return [];

    const subjectData = {};

    marks.forEach(mark => {
      const subject = mark.subject || 'Unknown';
      if (!subjectData[subject]) {
        subjectData[subject] = { total: 0, count: 0 };
      }
      subjectData[subject].total += mark.mark || 0;
      subjectData[subject].count++;
    });

    return Object.entries(subjectData)
      .map(([subject, data]) => ({
        subject,
        average: Math.round((data.total / data.count) * 10) / 10,
        students: data.count,
      }))
      .sort((a, b) => b.average - a.average);
  };

  const calculateTopPerformers = (marks) => {
    if (marks.length === 0) return 0;

    // Group marks by student and calculate averages
    const studentAverages = {};
    marks.forEach(mark => {
      const studentId = mark.studentId;
      if (!studentAverages[studentId]) {
        studentAverages[studentId] = { total: 0, count: 0 };
      }
      studentAverages[studentId].total += mark.mark || 0;
      studentAverages[studentId].count++;
    });

    // Count students with 90%+ average
    let topPerformers = 0;
    Object.values(studentAverages).forEach(student => {
      const average = student.total / student.count;
      if (average >= 90) {
        topPerformers++;
      }
    });

    return topPerformers;
  };

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
          mb: 3,
        }}
      >
        Reports & Analytics
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
            Reports & Analytics
          </Typography>
          <SlidingReportsSelector
            value={getTabValue(activeTab)}
            onChange={(value) => {
              const tabIndex = getTabIndex(value);
              setActiveTab(tabIndex);
            }}
            options={[
              { value: 'overview-analytics', label: 'Overview Analytics' },
              { value: 'student-progress-reports', label: 'Student Progress Reports' }
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
          <Tab label="Overview Analytics" icon={<AnalyticsIcon />} />
          <Tab label="Student Progress Reports" icon={<AssessmentIcon />} />
        </Tabs>
      )}

      {/* PERFORMANCE: Lazy load tab content only when active */}
      {activeTab === 0 && !loading && (
        <OverviewAnalytics analyticsData={analyticsData} theme={theme} />
      )}

      {activeTab === 1 && !loading && (
        <StudentProgressReports
          students={students}
          selectedStudent={selectedStudent}
          setSelectedStudent={setSelectedStudent}
          reportDialogOpen={reportDialogOpen}
          setReportDialogOpen={setReportDialogOpen}
          theme={theme}
        />
      )}

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="body1" sx={{ color: theme.colors.text.secondary }}>
            Loading analytics data...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ReportsPage;
