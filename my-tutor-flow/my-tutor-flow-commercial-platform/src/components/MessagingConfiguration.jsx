import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Link,
} from '@mui/material';
import {
  WhatsApp,
  WeChat,
  CheckCircle,
  Error,
  Warning,
  Info,
  Settings,
  Send,
  Phone,
  Message,
  Security,
  Integration,
  Api,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import messagingService from '../services/messagingService';

const MessagingConfiguration = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [whatsappConfig, setWhatsappConfig] = useState({
    enabled: false,
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
    webhookVerifyToken: '',
    isConnected: false,
  });
  const [wechatConfig, setWechatConfig] = useState({
    enabled: false,
    appId: '',
    appSecret: '',
    isConnected: false,
  });
  const [testDialog, setTestDialog] = useState(false);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    // Load existing configuration from localStorage or API
    const savedWhatsApp = localStorage.getItem('whatsapp_config');
    const savedWeChat = localStorage.getItem('wechat_config');

    if (savedWhatsApp) {
      setWhatsappConfig(JSON.parse(savedWhatsApp));
    }
    if (savedWeChat) {
      setWechatConfig(JSON.parse(savedWeChat));
    }
  };

  const saveConfiguration = async () => {
    try {
      // Save to localStorage (in production, this would be saved to your backend)
      localStorage.setItem('whatsapp_config', JSON.stringify(whatsappConfig));
      localStorage.setItem('wechat_config', JSON.stringify(wechatConfig));

      // Initialize messaging service with new config
      await messagingService.initialize();

      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration. Please try again.');
    }
  };

  const testWhatsAppConnection = async () => {
    try {
      const isConnected = await messagingService.verifyWhatsAppConnection();
      setWhatsappConfig(prev => ({ ...prev, isConnected }));

      setTestResults(prev => [
        ...prev,
        {
          platform: 'WhatsApp',
          status: 'success',
          message: 'Connection successful!',
        },
      ]);
    } catch (error) {
      setWhatsappConfig(prev => ({ ...prev, isConnected: false }));

      setTestResults(prev => [
        ...prev,
        {
          platform: 'WhatsApp',
          status: 'error',
          message: error.message,
        },
      ]);
    }
  };

  const testWeChatConnection = async () => {
    try {
      await messagingService.initializeWeChat();
      setWechatConfig(prev => ({ ...prev, isConnected: true }));

      setTestResults(prev => [
        ...prev,
        {
          platform: 'WeChat',
          status: 'success',
          message: 'Connection successful!',
        },
      ]);
    } catch (error) {
      setWechatConfig(prev => ({ ...prev, isConnected: false }));

      setTestResults(prev => [
        ...prev,
        {
          platform: 'WeChat',
          status: 'error',
          message: error.message,
        },
      ]);
    }
  };

  const sendTestMessage = async () => {
    setTestDialog(true);
    setTestResults([]);

    // Test WhatsApp if enabled
    if (whatsappConfig.enabled && whatsappConfig.isConnected) {
      try {
        const testData = {
          studentName: 'Test Student',
          invoiceNumber: 'TEST-001',
          amount: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

        const result = await messagingService.sendInvoiceViaWhatsApp(
          '+1234567890', // Test number
          testData,
          'https://example.com/test-invoice.pdf'
        );

        setTestResults(prev => [
          ...prev,
          {
            platform: 'WhatsApp',
            status: result.success ? 'success' : 'error',
            message: result.success ? 'Test message sent!' : result.error,
          },
        ]);
      } catch (error) {
        setTestResults(prev => [
          ...prev,
          {
            platform: 'WhatsApp',
            status: 'error',
            message: error.message,
          },
        ]);
      }
    }

    // Test WeChat if enabled
    if (wechatConfig.enabled && wechatConfig.isConnected) {
      try {
        const testData = {
          studentName: 'Test Student',
          invoiceNumber: 'TEST-001',
          amount: 100,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };

        const result = await messagingService.sendMessageViaWeChat('test_open_id', testData);

        setTestResults(prev => [
          ...prev,
          {
            platform: 'WeChat',
            status: result.success ? 'success' : 'error',
            message: result.success ? 'Test message sent!' : result.error,
          },
        ]);
      } catch (error) {
        setTestResults(prev => [
          ...prev,
          {
            platform: 'WeChat',
            status: 'error',
            message: error.message,
          },
        ]);
      }
    }
  };

  const steps = [
    {
      label: 'WhatsApp Business API Setup',
      content: (
        <Card
          sx={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <WhatsApp sx={{ color: '#25D366', fontSize: 32 }} />
              <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                WhatsApp Business API Configuration
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={whatsappConfig.enabled}
                    onChange={e =>
                      setWhatsappConfig(prev => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                }
                label="Enable WhatsApp"
                sx={{ ml: 'auto' }}
              />
            </Box>

            {whatsappConfig.enabled && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number ID"
                    value={whatsappConfig.phoneNumberId}
                    onChange={e =>
                      setWhatsappConfig(prev => ({
                        ...prev,
                        phoneNumberId: e.target.value,
                      }))
                    }
                    helperText="From WhatsApp Business API Dashboard"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Account ID"
                    value={whatsappConfig.businessAccountId}
                    onChange={e =>
                      setWhatsappConfig(prev => ({
                        ...prev,
                        businessAccountId: e.target.value,
                      }))
                    }
                    helperText="Your WhatsApp Business Account ID"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Access Token"
                    type="password"
                    value={whatsappConfig.accessToken}
                    onChange={e =>
                      setWhatsappConfig(prev => ({
                        ...prev,
                        accessToken: e.target.value,
                      }))
                    }
                    helperText="Permanent access token from Meta Developer Console"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Webhook Verify Token"
                    value={whatsappConfig.webhookVerifyToken}
                    onChange={e =>
                      setWhatsappConfig(prev => ({
                        ...prev,
                        webhookVerifyToken: e.target.value,
                      }))
                    }
                    helperText="Token for webhook verification"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={testWhatsAppConnection}
                      startIcon={<Api />}
                      sx={{
                        color: theme.colors.brand.primary,
                        borderColor: theme.colors.brand.primary,
                      }}
                    >
                      Test Connection
                    </Button>

                    {whatsappConfig.isConnected && (
                      <Chip icon={<CheckCircle />} label="Connected" color="success" size="small" />
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Setup Instructions:</strong>
                <br />
                1. Create a WhatsApp Business Account at{' '}
                <Link href="https://business.whatsapp.com" target="_blank">
                  business.whatsapp.com
                </Link>
                <br />
                2. Set up WhatsApp Business API in Meta Developer Console
                <br />
                3. Get your Phone Number ID and Access Token
                <br />
                4. Configure webhook URL: <code>https://yourdomain.com/webhook/whatsapp</code>
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      ),
    },
    {
      label: 'WeChat Integration Setup',
      content: (
        <Card
          sx={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <WeChat sx={{ color: '#1AAD19', fontSize: 32 }} />
              <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                WeChat Work API Configuration
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={wechatConfig.enabled}
                    onChange={e =>
                      setWechatConfig(prev => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                }
                label="Enable WeChat"
                sx={{ ml: 'auto' }}
              />
            </Box>

            {wechatConfig.enabled && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="App ID"
                    value={wechatConfig.appId}
                    onChange={e =>
                      setWechatConfig(prev => ({
                        ...prev,
                        appId: e.target.value,
                      }))
                    }
                    helperText="WeChat Work Application ID"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="App Secret"
                    type="password"
                    value={wechatConfig.appSecret}
                    onChange={e =>
                      setWechatConfig(prev => ({
                        ...prev,
                        appSecret: e.target.value,
                      }))
                    }
                    helperText="WeChat Work Application Secret"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={testWeChatConnection}
                      startIcon={<Api />}
                      sx={{
                        color: theme.colors.brand.primary,
                        borderColor: theme.colors.brand.primary,
                      }}
                    >
                      Test Connection
                    </Button>

                    {wechatConfig.isConnected && (
                      <Chip icon={<CheckCircle />} label="Connected" color="success" size="small" />
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Setup Instructions:</strong>
                <br />
                1. Register for WeChat Work at{' '}
                <Link href="https://work.weixin.qq.com" target="_blank">
                  work.weixin.qq.com
                </Link>
                <br />
                2. Create an application in WeChat Work Admin Console
                <br />
                3. Get your App ID and App Secret
                <br />
                4. Configure message templates for invoice delivery
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      ),
    },
    {
      label: 'Message Templates',
      content: (
        <Card
          sx={{
            backgroundColor: theme.colors.background.primary,
            border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
            borderRadius: '12px',
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 3 }}>
              Message Templates Configuration
            </Typography>

            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Important:</strong> Message templates must be approved by WhatsApp/WeChat
                before use. This process can take 24-48 hours.
              </Typography>
            </Alert>

            <Typography variant="subtitle1" sx={{ color: theme.colors.text.primary, mb: 2 }}>
              Required Templates:
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <Message sx={{ color: theme.colors.brand.primary }} />
                </ListItemIcon>
                <ListItemText
                  primary="Invoice Delivery Template"
                  secondary="Template for sending invoices with PDF attachment"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Warning sx={{ color: theme.colors.status.warning }} />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Reminder Template"
                  secondary="Template for overdue payment reminders"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <CheckCircle sx={{ color: theme.colors.status.success }} />
                </ListItemIcon>
                <ListItemText
                  primary="Payment Confirmation Template"
                  secondary="Template for payment confirmation messages"
                />
              </ListItem>
            </List>

            <Button
              variant="outlined"
              startIcon={<Settings />}
              sx={{
                color: theme.colors.brand.primary,
                borderColor: theme.colors.brand.primary,
                mt: 2,
              }}
            >
              Configure Templates
            </Button>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          color: theme.colors.text.primary,
          fontWeight: 700,
          mb: 4,
        }}
      >
        Messaging Integration Setup
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              backgroundColor: theme.colors.background.secondary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '16px',
              boxShadow: theme.shadows.card,
              p: 3,
            }}
          >
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                    <Typography sx={{ color: theme.colors.text.primary }}>{step.label}</Typography>
                  </StepLabel>
                  <StepContent>
                    {step.content}
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(index + 1)}
                        disabled={index === steps.length - 1}
                        sx={{
                          backgroundColor: theme.colors.brand.primary,
                          color: '#000000',
                          '&:hover': {
                            backgroundColor: theme.colors.brand.primary,
                            opacity: 0.8,
                          },
                        }}
                      >
                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                      </Button>

                      <Button
                        disabled={index === 0}
                        onClick={() => setActiveStep(index - 1)}
                        sx={{ color: theme.colors.text.secondary }}
                      >
                        Back
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
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
              Quick Actions
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={sendTestMessage}
                disabled={!whatsappConfig.enabled && !wechatConfig.enabled}
                sx={{
                  backgroundColor: theme.colors.brand.primary,
                  color: '#000000',
                  '&:hover': {
                    backgroundColor: theme.colors.brand.primary,
                    opacity: 0.8,
                  },
                }}
              >
                Send Test Message
              </Button>

              <Button
                variant="outlined"
                startIcon={<Settings />}
                onClick={saveConfiguration}
                sx={{
                  color: theme.colors.brand.primary,
                  borderColor: theme.colors.brand.primary,
                }}
              >
                Save Configuration
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle2"
              sx={{
                color: theme.colors.text.primary,
                mb: 2,
              }}
            >
              Integration Status
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsApp sx={{ color: '#25D366', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  WhatsApp:
                </Typography>
                <Chip
                  label={whatsappConfig.enabled ? 'Enabled' : 'Disabled'}
                  size="small"
                  color={whatsappConfig.enabled ? 'success' : 'default'}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WeChat sx={{ color: '#1AAD19', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  WeChat:
                </Typography>
                <Chip
                  label={wechatConfig.enabled ? 'Enabled' : 'Disabled'}
                  size="small"
                  color={wechatConfig.enabled ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Test Results Dialog */}
      <Dialog open={testDialog} onClose={() => setTestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Test Message Results</DialogTitle>
        <DialogContent>
          {testResults.length === 0 ? (
            <Typography>Sending test messages...</Typography>
          ) : (
            <List>
              {testResults.map((result, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {result.status === 'success' ? (
                      <CheckCircle sx={{ color: theme.colors.status.success }} />
                    ) : (
                      <Error sx={{ color: theme.colors.status.error }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={result.platform} secondary={result.message} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessagingConfiguration;
