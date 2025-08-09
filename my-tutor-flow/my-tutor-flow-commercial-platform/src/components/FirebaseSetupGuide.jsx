// TD Learning Academy - Firebase Setup Guide
// Comprehensive guide for setting up Firebase with your domain

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Launch as LaunchIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import { testFirebaseConnection, quickFirebaseHealthCheck } from '../utils/firebaseConnectionTester';

export default function FirebaseSetupGuide() {
  const theme = useTheme();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedStep, setExpandedStep] = useState(0);

  // Test Firebase connection on component mount
  useEffect(() => {
    checkFirebaseHealth();
  }, []);

  const checkFirebaseHealth = async () => {
    try {
      const health = await quickFirebaseHealthCheck();
      setConnectionStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const runFullConnectionTest = async () => {
    setLoading(true);
    try {
      const results = await testFirebaseConnection();
      setTestResults(results);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const setupSteps = [
    {
      title: 'Firebase Console Setup',
      description: 'Configure your Firebase project',
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Your current Firebase project: <strong>my-tutor-flow</strong>
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
              <ListItemText primary="Go to Firebase Console" secondary="https://console.firebase.google.com" />
              <IconButton onClick={() => window.open('https://console.firebase.google.com', '_blank')}>
                <LaunchIcon />
              </IconButton>
            </ListItem>
            <ListItem>
              <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
              <ListItemText primary="Select your project: my-tutor-flow" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      title: 'Domain Authorization',
      description: 'Add tdla.co.za to authorized domains',
      content: (
        <Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Domain Mismatch Detected</AlertTitle>
            Your app is running on <strong>tdla.co.za</strong> but Firebase is configured for <strong>my-tutor-flow.firebaseapp.com</strong>
          </Alert>
          <List dense>
            <ListItem>
              <ListItemIcon><span>1.</span></ListItemIcon>
              <ListItemText primary="Go to Authentication → Settings → Authorized domains" />
            </ListItem>
            <ListItem>
              <ListItemIcon><span>2.</span></ListItemIcon>
              <ListItemText 
                primary="Add your domain: tdla.co.za" 
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <code>tdla.co.za</code>
                    <IconButton size="small" onClick={() => copyToClipboard('tdla.co.za')}>
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><span>3.</span></ListItemIcon>
              <ListItemText primary="Also add: www.tdla.co.za (if using www)" />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      title: 'Enable Firebase Services',
      description: 'Activate required Firebase features',
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enable these services in your Firebase project:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Chip 
                  icon={connectionStatus?.services?.auth ? <CheckIcon /> : <ErrorIcon />}
                  label="Authentication" 
                  color={connectionStatus?.services?.auth ? "success" : "error"}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText 
                primary="Firebase Authentication" 
                secondary="Go to Authentication → Get started → Enable Email/Password"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Chip 
                  icon={connectionStatus?.services?.firestore ? <CheckIcon /> : <ErrorIcon />}
                  label="Firestore" 
                  color={connectionStatus?.services?.firestore ? "success" : "error"}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText 
                primary="Cloud Firestore" 
                secondary="Go to Firestore Database → Create database → Start in test mode"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Chip 
                  icon={connectionStatus?.services?.storage ? <CheckIcon /> : <ErrorIcon />}
                  label="Storage" 
                  color={connectionStatus?.services?.storage ? "success" : "error"}
                  size="small"
                />
              </ListItemIcon>
              <ListItemText 
                primary="Cloud Storage" 
                secondary="Go to Storage → Get started → Start in test mode"
              />
            </ListItem>
          </List>
        </Box>
      )
    },
    {
      title: 'Security Rules Configuration',
      description: 'Configure Firestore and Storage rules',
      content: (
        <Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update your security rules to allow your application:
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Firestore Rules:</Typography>
          <Box sx={{ bgcolor: theme.colors.background.secondary, p: 2, borderRadius: 1, mb: 2 }}>
            <code style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
            </code>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`)}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>Storage Rules:</Typography>
          <Box sx={{ bgcolor: theme.colors.background.secondary, p: 2, borderRadius: 1 }}>
            <code style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`}
            </code>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}`)}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )
    }
  ];

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2, color: theme.colors.text.primary }}>
          🔥 Firebase Setup Guide
        </Typography>

        {/* Connection Status */}
        <Alert 
          severity={connectionStatus?.healthy ? "success" : "warning"} 
          sx={{ mb: 3 }}
          action={
            <Button 
              size="small" 
              onClick={runFullConnectionTest}
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          }
        >
          <AlertTitle>
            {connectionStatus?.healthy ? 'Firebase Partially Connected' : 'Firebase Not Connected'}
          </AlertTitle>
          {connectionStatus?.recommendation}
        </Alert>

        {/* Test Results */}
        {testResults && (
          <Alert severity={testResults.isConnected ? "success" : "error"} sx={{ mb: 3 }}>
            <AlertTitle>Connection Test Results</AlertTitle>
            <Typography variant="body2">
              Services: Auth {testResults.services.auth ? '✅' : '❌'} | 
              Firestore {testResults.services.firestore ? '✅' : '❌'} | 
              Storage {testResults.services.storage ? '✅' : '❌'}
            </Typography>
          </Alert>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Setup Steps */}
        <Stepper orientation="vertical" activeStep={-1}>
          {setupSteps.map((step, index) => (
            <Step key={index} expanded>
              <StepLabel
                onClick={() => setExpandedStep(expandedStep === index ? -1 : index)}
                sx={{ cursor: 'pointer' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {step.title}
                  {expandedStep === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </StepLabel>
              <StepContent>
                <Collapse in={expandedStep === index}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {step.description}
                    </Typography>
                    {step.content}
                  </Box>
                </Collapse>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ my: 3 }} />

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            onClick={() => window.open('https://console.firebase.google.com/project/my-tutor-flow', '_blank')}
            startIcon={<LaunchIcon />}
          >
            Open Firebase Console
          </Button>
          <Button
            variant="outlined"
            onClick={runFullConnectionTest}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Run Full Test'}
          </Button>
          <Button
            variant="outlined"
            onClick={checkFirebaseHealth}
          >
            Refresh Status
          </Button>
        </Box>

        {/* Current Configuration */}
        <Box sx={{ mt: 3, p: 2, bgcolor: theme.colors.background.secondary, borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Current Configuration:</Typography>
          <Typography variant="body2" component="div">
            • Project ID: <code>my-tutor-flow</code><br/>
            • Auth Domain: <code>my-tutor-flow.firebaseapp.com</code><br/>
            • Current Domain: <code>{window.location.hostname}</code><br/>
            • Status: <strong>{connectionStatus?.healthy ? 'Partially Working' : 'Not Connected'}</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
