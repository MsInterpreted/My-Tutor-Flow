import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Security,
  Shield,
  Warning,
  CheckCircle,
  Error,
  Visibility,
  Download,
  Delete,
  Refresh,
  Timeline,
  Person,
  Lock,
  VpnKey,
  Assessment,
  History,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import securityService from '../services/securityService';
import ModernChart from './ModernChart';

const SecurityDashboard = () => {
  const theme = useTheme();
  const [auditLogs, setAuditLogs] = useState([]);
  const [securityReport, setSecurityReport] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
  });
  const [showGDPRDialog, setShowGDPRDialog] = useState(false);
  const [gdprUserId, setGdprUserId] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      const logs = securityService.getAuditLogs(filters);
      setAuditLogs(logs);

      const report = securityService.generateSecurityReport();
      setSecurityReport(report);
    } catch (error) {
      console.error('Error loading security data:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    loadSecurityData();
  };

  const clearFilters = () => {
    setFilters({
      action: '',
      userId: '',
      startDate: '',
      endDate: '',
    });
    setTimeout(loadSecurityData, 100);
  };

  const exportAuditLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address'].join(','),
      ...auditLogs.map(log =>
        [
          log.timestamp,
          log.userEmail,
          log.action,
          log.resource,
          JSON.stringify(log.details),
          log.ipAddress,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleGDPRRequest = type => {
    if (!gdprUserId) return;

    if (type === 'export') {
      const userData = securityService.exportUserData(gdprUserId);
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_${gdprUserId}_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (type === 'delete') {
      if (
        window.confirm(
          'Are you sure you want to delete all data for this user? This action cannot be undone.'
        )
      ) {
        securityService.deleteUserData(gdprUserId);
        alert('User data deletion request has been logged and will be processed.');
      }
    }

    setShowGDPRDialog(false);
    setGdprUserId('');
    loadSecurityData();
  };

  const getActionColor = action => {
    const colors = {
      login: theme.colors.status.success,
      logout: theme.colors.status.info,
      login_failed: theme.colors.status.error,
      create: theme.colors.brand.primary,
      update: theme.colors.status.warning,
      delete: theme.colors.status.error,
      read: theme.colors.status.info,
      export: theme.colors.status.warning,
    };
    return colors[action] || theme.colors.text.secondary;
  };

  const securityMetrics = securityReport
    ? [
        {
          title: 'Total Events',
          value: securityReport.totalEvents,
          icon: <Timeline />,
          color: theme.colors.brand.primary,
        },
        {
          title: 'Failed Logins',
          value: securityReport.failedLogins,
          icon: <Warning />,
          color: theme.colors.status.error,
        },
        {
          title: 'Data Access',
          value: securityReport.dataAccess,
          icon: <Visibility />,
          color: theme.colors.status.info,
        },
        {
          title: 'Active Users',
          value: securityReport.uniqueUsers,
          icon: <Person />,
          color: theme.colors.status.success,
        },
      ]
    : [];

  const chartData = securityReport
    ? Object.entries(securityReport.eventsByAction).map(([action, count]) => ({
        label: action.replace('_', ' ').toUpperCase(),
        value: count,
      }))
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Security sx={{ color: theme.colors.brand.primary }} />
        Security & Compliance Dashboard
      </Typography>

      {/* Security Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {securityMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: theme.colors.background.secondary,
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: '16px',
                boxShadow: theme.shadows.card,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '12px',
                      backgroundColor: metric.color + '20',
                      color: metric.color,
                    }}
                  >
                    {metric.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: theme.colors.text.primary,
                        fontWeight: 700,
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.secondary,
                      }}
                    >
                      {metric.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Security Events Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              boxShadow: theme.shadows.card,
              p: 3,
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
              Security Events (Last 30 Days)
            </Typography>
            {chartData.length > 0 ? (
              <ModernChart type="pie" data={chartData} height={300} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                }}
              >
                <Typography sx={{ color: theme.colors.text.secondary }}>
                  No data available
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              boxShadow: theme.shadows.card,
              p: 3,
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
              Security Actions
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Download sx={{ color: theme.colors.brand.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary="Export Audit Logs"
                  secondary="Download complete audit trail"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={exportAuditLogs}
                  sx={{
                    color: theme.colors.brand.primary,
                    borderColor: theme.colors.brand.primary,
                  }}
                >
                  Export
                </Button>
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemIcon>
                  <Shield sx={{ color: theme.colors.status.success }} />
                </ListItemIcon>
                <ListItemText
                  primary="GDPR Compliance"
                  secondary="Data export and deletion requests"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowGDPRDialog(true)}
                  sx={{
                    color: theme.colors.status.success,
                    borderColor: theme.colors.status.success,
                  }}
                >
                  Manage
                </Button>
              </ListItem>

              <Divider />

              <ListItem>
                <ListItemIcon>
                  <Assessment sx={{ color: theme.colors.status.warning }} />
                </ListItemIcon>
                <ListItemText
                  primary="Security Report"
                  secondary="Generate comprehensive security analysis"
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={loadSecurityData}
                  sx={{
                    color: theme.colors.status.warning,
                    borderColor: theme.colors.status.warning,
                  }}
                >
                  Generate
                </Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Audit Log Filters */}
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              boxShadow: theme.shadows.card,
              p: 3,
              mb: 3,
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
              Audit Log Filters
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Action</InputLabel>
                  <Select
                    value={filters.action}
                    onChange={e => handleFilterChange('action', e.target.value)}
                    label="Action"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="login">Login</MenuItem>
                    <MenuItem value="logout">Logout</MenuItem>
                    <MenuItem value="create">Create</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                    <MenuItem value="delete">Delete</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="User ID"
                  value={filters.userId}
                  onChange={e => handleFilterChange('userId', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Start Date"
                  value={filters.startDate}
                  onChange={e => handleFilterChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="End Date"
                  value={filters.endDate}
                  onChange={e => handleFilterChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={applyFilters}
                  sx={{
                    backgroundColor: theme.colors.brand.primary,
                    color: '#000000',
                    '&:hover': {
                      backgroundColor: theme.colors.brand.primary,
                      opacity: 0.8,
                    },
                  }}
                >
                  Apply
                </Button>
              </Grid>

              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    color: theme.colors.text.secondary,
                    borderColor: theme.colors.text.secondary,
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Audit Logs Table */}
        <Grid item xs={12}>
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              boxShadow: theme.shadows.card,
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.colors.text.primary,
                  fontWeight: 600,
                }}
              >
                Audit Logs ({auditLogs.length} entries)
              </Typography>

              <Tooltip title="Refresh">
                <IconButton onClick={loadSecurityData} sx={{ color: theme.colors.brand.primary }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      User
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      Action
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      Resource
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      IP Address
                    </TableCell>
                    <TableCell sx={{ color: theme.colors.text.secondary, fontWeight: 600 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.slice(0, 100).map(log => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {log.userEmail}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          sx={{
                            backgroundColor: getActionColor(log.action) + '20',
                            color: getActionColor(log.action),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {log.resource}
                      </TableCell>
                      <TableCell sx={{ color: theme.colors.text.primary }}>
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => setSelectedLog(log)}
                            sx={{ color: theme.colors.brand.primary }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Log Details Dialog */}
      <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="md" fullWidth>
        <DialogTitle>Audit Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>User:</strong> {selectedLog.userEmail} ({selectedLog.userId})
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Action:</strong> {selectedLog.action}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Resource:</strong> {selectedLog.resource}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Resource ID:</strong> {selectedLog.resourceId}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>IP Address:</strong> {selectedLog.ipAddress}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Session ID:</strong> {selectedLog.sessionId}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Details:</strong>
              </Typography>
              <pre
                style={{
                  backgroundColor: theme.colors.background.primary,
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedLog(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* GDPR Dialog */}
      <Dialog
        open={showGDPRDialog}
        onClose={() => setShowGDPRDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>GDPR Data Management</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Handle GDPR data requests for users. Enter the user ID to export or delete their data.
          </Alert>

          <TextField
            fullWidth
            label="User ID"
            value={gdprUserId}
            onChange={e => setGdprUserId(e.target.value)}
            placeholder="Enter user ID for GDPR request"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowGDPRDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleGDPRRequest('export')}
            disabled={!gdprUserId}
            sx={{ color: theme.colors.brand.primary }}
          >
            Export Data
          </Button>
          <Button
            onClick={() => handleGDPRRequest('delete')}
            disabled={!gdprUserId}
            sx={{ color: theme.colors.status.error }}
          >
            Delete Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SecurityDashboard;
