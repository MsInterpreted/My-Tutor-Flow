import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error, errorInfo, resetError }) => {
  // Use a fallback theme if useTheme fails (when ErrorBoundary is outside ThemeProvider)
  let theme;
  try {
    theme = useTheme();
  } catch (e) {
    // Fallback theme when outside ThemeProvider
    theme = {
      colors: {
        background: { primary: '#ffffff', secondary: '#f5f5f5' },
        text: { primary: '#333333', secondary: '#666666' },
        brand: { primary: '#1976d2' },
      },
    };
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Alert severity="error" sx={{ mb: 3, maxWidth: '600px' }}>
        <Typography variant="h6" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          An unexpected error occurred. Please try refreshing the page or contact support if the
          problem persists.
        </Typography>
        {process.env.NODE_ENV === 'development' && error && (
          <Box sx={{ mt: 2, textAlign: 'left' }}>
            <Typography
              variant="caption"
              component="pre"
              sx={{
                fontSize: '0.75rem',
                backgroundColor: theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              {error.toString()}
              {errorInfo && errorInfo.componentStack}
            </Typography>
          </Box>
        )}
      </Alert>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={resetError}
          sx={{
            backgroundColor: theme.colors.primary,
            '&:hover': {
              backgroundColor: theme.colors.primary + 'dd',
            },
          }}
        >
          Try Again
        </Button>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{
            borderColor: theme.colors.primary,
            color: theme.colors.primary,
            '&:hover': {
              backgroundColor: theme.colors.primary + '10',
            },
          }}
        >
          Refresh Page
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorBoundary;
