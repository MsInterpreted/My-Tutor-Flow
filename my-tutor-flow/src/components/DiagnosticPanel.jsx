import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  BugReport as BugIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { runDiagnosticTest } from '../utils/diagnosticTest';

const DiagnosticPanel = ({ onClose }) => {
  const theme = useTheme();
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      const results = await runDiagnosticTest();
      setDiagnosticResults(results);
      console.log('🔍 Diagnostic Results:', results);
    } catch (error) {
      console.error('❌ Diagnostic test failed:', error);
      setDiagnosticResults({
        timestamp: new Date().toISOString(),
        tests: [{
          name: 'Diagnostic Test Runner',
          status: 'FAIL',
          message: `Diagnostic test failed: ${error.message}`,
          error: error
        }],
        errors: [`Diagnostic Runner: ${error.message}`],
        summary: { passed: 0, failed: 1, warnings: 0, total: 1, successRate: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <CheckIcon sx={{ color: theme.colors.status.success }} />;
      case 'FAIL':
        return <ErrorIcon sx={{ color: theme.colors.status.error }} />;
      case 'WARNING':
        return <WarningIcon sx={{ color: theme.colors.status.warning }} />;
      default:
        return <BugIcon sx={{ color: theme.colors.text.secondary }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
        return theme.colors.status.success;
      case 'FAIL':
        return theme.colors.status.error;
      case 'WARNING':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        sx={{
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '16px',
          boxShadow: theme.shadows.card,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                color: theme.colors.text.primary,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <BugIcon sx={{ color: theme.colors.brand.primary }} />
              TD Learning Academy Diagnostic
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={runDiagnostic}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
                sx={{
                  borderColor: theme.colors.brand.primary,
                  color: theme.colors.brand.primary,
                  '&:hover': {
                    borderColor: theme.colors.brand.primary,
                    backgroundColor: theme.colors.brand.primary + '10',
                  },
                }}
              >
                {loading ? 'Running...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  backgroundColor: theme.colors.brand.primary,
                  '&:hover': {
                    backgroundColor: theme.colors.brand.primary + 'CC',
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {diagnosticResults && !loading && (
            <>
              {/* Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 600 }}
                >
                  Test Summary
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<CheckIcon />}
                    label={`${diagnosticResults.summary.passed} Passed`}
                    sx={{
                      backgroundColor: theme.colors.status.success + '20',
                      color: theme.colors.status.success,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<ErrorIcon />}
                    label={`${diagnosticResults.summary.failed} Failed`}
                    sx={{
                      backgroundColor: theme.colors.status.error + '20',
                      color: theme.colors.status.error,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<WarningIcon />}
                    label={`${diagnosticResults.summary.warnings} Warnings`}
                    sx={{
                      backgroundColor: theme.colors.status.warning + '20',
                      color: theme.colors.status.warning,
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    label={`${diagnosticResults.summary.successRate}% Success Rate`}
                    sx={{
                      backgroundColor: theme.colors.brand.primary + '20',
                      color: theme.colors.brand.primary,
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Box>

              {/* Critical Errors Alert */}
              {diagnosticResults.errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Critical Issues Found:
                  </Typography>
                  {diagnosticResults.errors.map((error, index) => (
                    <Typography key={index} variant="body2">
                      • {error}
                    </Typography>
                  ))}
                </Alert>
              )}

              {/* Test Results */}
              <Typography
                variant="h6"
                sx={{ color: theme.colors.text.primary, mb: 2, fontWeight: 600 }}
              >
                Detailed Results
              </Typography>

              <List sx={{ width: '100%' }}>
                {diagnosticResults.tests.map((test, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      backgroundColor: theme.colors.background.primary,
                      border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '8px !important',
                      mb: 1,
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        {getStatusIcon(test.status)}
                        <Typography
                          sx={{
                            color: theme.colors.text.primary,
                            fontWeight: 600,
                            flex: 1,
                          }}
                        >
                          {test.name}
                        </Typography>
                        <Chip
                          label={test.status}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(test.status) + '20',
                            color: getStatusColor(test.status),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.colors.text.secondary, mb: 1 }}
                      >
                        {test.message}
                      </Typography>
                      {test.error && (
                        <Box
                          sx={{
                            backgroundColor: theme.colors.status.error + '10',
                            border: `1px solid ${theme.colors.status.error}30`,
                            borderRadius: '8px',
                            p: 2,
                            mt: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.colors.status.error,
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                            }}
                          >
                            {test.error.stack || test.error.message}
                          </Typography>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>

              <Typography
                variant="caption"
                sx={{
                  color: theme.colors.text.secondary,
                  display: 'block',
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                Last run: {new Date(diagnosticResults.timestamp).toLocaleString()}
              </Typography>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DiagnosticPanel;
