import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { Error as ErrorIcon, Refresh, ExpandMore, BugReport } from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';

class BillingErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('🚨 Billing Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Log specific error patterns we're looking for
    if (error.message.includes('.main') || error.message.includes('undefined')) {
      console.error('🎯 COLOR REFERENCE ERROR DETECTED:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, errorId, onRetry }) => {
  const theme = useTheme();

  const isColorError =
    error?.message?.includes('.main') ||
    error?.message?.includes('undefined') ||
    error?.message?.includes('Cannot read properties');

  const getErrorType = () => {
    if (isColorError) return 'Color Reference Error';
    if (error?.message?.includes('Firebase')) return 'Firebase Error';
    if (error?.message?.includes('Network')) return 'Network Error';
    return 'JavaScript Error';
  };

  const getErrorSeverity = () => {
    if (isColorError) return 'high';
    if (error?.message?.includes('Firebase')) return 'medium';
    return 'low';
  };

  const getSeverityColor = () => {
    const severity = getErrorSeverity();
    switch (severity) {
      case 'high':
        return theme.colors.status.error;
      case 'medium':
        return theme.colors.status.warning;
      default:
        return theme.colors.status.info;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: theme.colors.background.primary,
      }}
    >
      <Paper
        sx={{
          p: 4,
          maxWidth: 800,
          width: '100%',
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.status.error}40`,
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
          <ErrorIcon
            sx={{
              color: theme.colors.status.error,
              fontSize: 48,
              mr: 2,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              color: theme.colors.text.primary,
              fontWeight: 700,
            }}
          >
            Billing System Error
          </Typography>
        </Box>

        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Something went wrong with the billing component
          </Typography>
          <Typography variant="body2">
            Don't worry - this error has been logged and we're working to fix it. You can try
            refreshing the page or contact support if the problem persists.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Chip
            label={getErrorType()}
            color="error"
            icon={<BugReport />}
            sx={{
              backgroundColor: getSeverityColor() + '20',
              color: getSeverityColor(),
              border: `1px solid ${getSeverityColor()}40`,
            }}
          />
          <Chip
            label={`Error ID: ${errorId}`}
            variant="outlined"
            sx={{
              borderColor: theme.colors.text.tertiary,
              color: theme.colors.text.tertiary,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{
              backgroundColor: theme.colors.brand.primary,
              color: '#000000',
              '&:hover': {
                backgroundColor: theme.colors.brand.secondary,
              },
            }}
          >
            Try Again
          </Button>

          <Button
            variant="outlined"
            onClick={() => window.location.reload()}
            sx={{
              borderColor: theme.colors.brand.primary,
              color: theme.colors.brand.primary,
            }}
          >
            Refresh Page
          </Button>
        </Box>

        {/* Error Details for Debugging */}
        {error && (
          <Accordion
            sx={{
              backgroundColor: theme.colors.background.tertiary,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Technical Details (for developers)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ textAlign: 'left' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: theme.colors.text.primary,
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  Error Message:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.colors.status.error,
                    fontFamily: 'monospace',
                    backgroundColor: theme.colors.background.primary,
                    p: 2,
                    borderRadius: '8px',
                    mb: 2,
                    wordBreak: 'break-all',
                  }}
                >
                  {error.message}
                </Typography>

                {error.stack && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.colors.text.primary,
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Stack Trace:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.tertiary,
                        fontFamily: 'monospace',
                        backgroundColor: theme.colors.background.primary,
                        p: 2,
                        borderRadius: '8px',
                        mb: 2,
                        fontSize: '12px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {error.stack}
                    </Typography>
                  </>
                )}

                {errorInfo?.componentStack && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.colors.text.primary,
                        mb: 1,
                        fontWeight: 600,
                      }}
                    >
                      Component Stack:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.colors.text.tertiary,
                        fontFamily: 'monospace',
                        backgroundColor: theme.colors.background.primary,
                        p: 2,
                        borderRadius: '8px',
                        fontSize: '12px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {errorInfo.componentStack}
                    </Typography>
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        <Typography
          variant="body2"
          sx={{
            color: theme.colors.text.tertiary,
            mt: 3,
            fontStyle: 'italic',
          }}
        >
          If this error persists, please contact support with Error ID: {errorId}
        </Typography>
      </Paper>
    </Box>
  );
};

export default BillingErrorBoundary;
