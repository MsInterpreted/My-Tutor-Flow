import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

/**
 * Visual Mockups for My Tutor Flow Pitch Document
 * These components create visual representations of the platform features
 */

// Dashboard Overview Mockup
export const DashboardMockup = () => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.brand.primary}`,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: theme.colors.text.primary, fontWeight: 700 }}>
        📊 Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.status.success + '20', border: `1px solid ${theme.colors.status.success}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ color: theme.colors.status.success, mr: 1 }} />
                <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                  Active Students
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                45
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                +8 this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.brand.primary + '20', border: `1px solid ${theme.colors.brand.primary}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ color: theme.colors.brand.primary, mr: 1 }} />
                <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                  Monthly Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                R47,850
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                +18% vs last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.status.warning + '20', border: `1px solid ${theme.colors.status.warning}` }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: theme.colors.status.warning, mr: 1 }} />
                <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                  Retention Rate
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ color: theme.colors.status.warning, fontWeight: 700 }}>
                94%
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Above industry avg
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, color: theme.colors.text.primary }}>
            Recent Activity
          </Typography>
          <Box sx={{ backgroundColor: theme.colors.background.primary, borderRadius: '12px', p: 2 }}>
            {[
              { name: 'Sarah Johnson', action: 'Completed Math session', time: '2 hours ago', type: 'session' },
              { name: 'Mike Chen', action: 'Payment received - USD 180', time: '4 hours ago', type: 'payment' },
              { name: 'Lisa Williams', action: 'New student registered', time: '1 day ago', type: 'student' },
            ].map((activity, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  backgroundColor: activity.type === 'session' ? theme.colors.status.success : 
                                  activity.type === 'payment' ? theme.colors.brand.primary : 
                                  theme.colors.status.info,
                  mr: 2 
                }}>
                  {activity.type === 'session' ? <SchoolIcon /> : 
                   activity.type === 'payment' ? <MoneyIcon /> : <PeopleIcon />}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    {activity.action}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                  {activity.time}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Student Management Mockup
export const StudentManagementMockup = () => {
  const theme = useTheme();
  
  const students = [
    { name: 'Sarah Johnson', grade: 'Grade 10', subjects: ['Math', 'Physics'], status: 'Active', rate: 'ZAR 350/h', phone: '+27 123 456 789' },
    { name: 'Mike Chen', grade: 'Grade 12', subjects: ['Chemistry'], status: 'Active', rate: 'USD 45/h', phone: '+27 987 654 321' },
    { name: 'Lisa Williams', grade: 'Grade 11', subjects: ['Math', 'Science'], status: 'Active', rate: 'ZAR 400/h', phone: '+27 555 123 456' },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.brand.primary}`,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: theme.colors.text.primary, fontWeight: 700 }}>
        👥 Student Management
      </Typography>
      
      {students.map((student, index) => (
        <Card key={index} sx={{ mb: 2, backgroundColor: theme.colors.background.primary }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ backgroundColor: theme.colors.brand.primary, mr: 2 }}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                      {student.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      {student.grade}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                    Subjects
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {student.subjects.map((subject, idx) => (
                      <Chip 
                        key={idx} 
                        label={subject} 
                        size="small" 
                        sx={{ backgroundColor: theme.colors.brand.primary + '20' }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={2}>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  Rate
                </Typography>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                  {student.rate}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={2}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ color: theme.colors.brand.primary, mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Contact
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={2}>
                <Chip 
                  label={student.status} 
                  color="success" 
                  size="small"
                  sx={{ backgroundColor: theme.colors.status.success + '20' }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

// Billing System Mockup
export const BillingMockup = () => {
  const theme = useTheme();
  
  const invoices = [
    { id: 'INV-2024-001', student: 'Sarah Johnson', amount: 'ZAR 1,400', status: 'Paid', date: '2024-01-15' },
    { id: 'INV-2024-002', student: 'Mike Chen', amount: 'USD 180', status: 'Pending', date: '2024-01-14' },
    { id: 'INV-2024-003', student: 'Lisa Williams', amount: 'ZAR 2,100', status: 'Paid', date: '2024-01-13' },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.brand.primary}`,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: theme.colors.text.primary, fontWeight: 700 }}>
        💰 Intelligent Billing System
      </Typography>
      
      {/* Currency Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.status.success + '10' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                ZAR Revenue
              </Typography>
              <Typography variant="h4" sx={{ color: theme.colors.status.success, fontWeight: 700 }}>
                R45,750
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                60% of total revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.brand.primary + '10' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                USD Revenue
              </Typography>
              <Typography variant="h4" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                $2,340
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                25% of total revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: theme.colors.status.warning + '10' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
                Payment Rate
              </Typography>
              <Typography variant="h4" sx={{ color: theme.colors.status.warning, fontWeight: 700 }}>
                97%
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                On-time payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Invoices */}
      <Typography variant="h6" sx={{ mb: 2, color: theme.colors.text.primary }}>
        Recent Invoices
      </Typography>
      
      {invoices.map((invoice, index) => (
        <Card key={index} sx={{ mb: 2, backgroundColor: theme.colors.background.primary }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                  {invoice.id}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  {invoice.date}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                  {invoice.student}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Typography variant="h6" sx={{ color: theme.colors.brand.primary, fontWeight: 600 }}>
                  {invoice.amount}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <Chip 
                  label={invoice.status}
                  color={invoice.status === 'Paid' ? 'success' : 'warning'}
                  sx={{ 
                    backgroundColor: invoice.status === 'Paid' ? 
                      theme.colors.status.success + '20' : 
                      theme.colors.status.warning + '20'
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Paper>
  );
};

// Analytics Mockup
export const AnalyticsMockup = () => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: '16px',
        border: `2px solid ${theme.colors.brand.primary}`,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: theme.colors.text.primary, fontWeight: 700 }}>
        📊 Business Intelligence
      </Typography>
      
      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: theme.colors.background.primary }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                Student Performance
              </Typography>
              
              {[
                { subject: 'Mathematics', average: 78, color: theme.colors.status.success },
                { subject: 'Science', average: 82, color: theme.colors.brand.primary },
                { subject: 'English', average: 75, color: theme.colors.status.warning },
              ].map((subject, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ color: theme.colors.text.primary }}>
                      {subject.subject}
                    </Typography>
                    <Typography variant="body1" sx={{ color: subject.color, fontWeight: 600 }}>
                      {subject.average}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={subject.average} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: theme.colors.background.secondary,
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: subject.color,
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Revenue Insights */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: theme.colors.background.primary }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 2 }}>
                Revenue Insights
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                  Most Profitable Session Type
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.status.success }}>
                  One-on-One Sessions
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  ZAR 450/hour average
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                  Peak Revenue Months
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.brand.primary }}>
                  June & November
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  Exam preparation periods
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                  Growth Opportunity
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.status.warning }}>
                  Online Group Classes
                </Typography>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  30% higher profit margin
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default {
  DashboardMockup,
  StudentManagementMockup,
  BillingMockup,
  AnalyticsMockup,
};
