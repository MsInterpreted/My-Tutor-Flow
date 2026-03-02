import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Payment,
  AccountBalanceWallet,
  CreditCard,
  Save,
  CheckCircle,
} from '@mui/icons-material';
import { useTheme } from '../theme/ThemeContext';
import paymentService, { PAYMENT_PROVIDERS } from '../services/paymentService';
import NotificationSettings from '../components/NotificationSettings';

export default function PaymentSettingsPage() {
  const theme = useTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const [settings, setSettings] = useState({
    defaultProvider: 'manual',
    stripe: { enabled: false, publicKey: '', secretKey: '' },
    paypal: { enabled: false, clientId: '', sandbox: true },
    payfast: { enabled: false, merchantId: '', merchantKey: '', passphrase: '', sandbox: true },
    solana: { enabled: false, recipientAddress: '', testMode: true },
    eft: { enabled: false, bankName: '', accountNumber: '', branchCode: '', reference: '' },
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loaded = await paymentService.getPaymentSettings();
      if (loaded) {
        setSettings(prev => ({ ...prev, ...loaded }));
      }
    } catch (err) {
      console.error('Failed to load payment settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      setError(null);
      await paymentService.savePaymentSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
    }
  };

  const updateProvider = (provider, field, value) => {
    setSettings(prev => ({
      ...prev,
      [provider]: { ...prev[provider], [field]: value },
    }));
  };

  const cardSx = {
    backgroundColor: theme.colors.background.secondary,
    border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    boxShadow: theme.shadows.card,
    borderRadius: '16px',
    mb: 3,
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: theme.colors.text.primary,
      '& fieldset': { borderColor: theme.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
    },
    '& .MuiInputLabel-root': { color: theme.colors.text.secondary },
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.colors.background.primary, p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" sx={{ color: theme.colors.text.primary, fontWeight: 700 }}>
          Payment Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={saved ? <CheckCircle /> : <Save />}
          onClick={handleSave}
          sx={{
            backgroundColor: saved ? (theme.colors.status?.success || '#4CAF50') : theme.colors.brand.primary,
            color: '#000',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            minWidth: isMobile ? '100%' : 'auto',
            '&:hover': { opacity: 0.8 },
          }}
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {/* Default Provider */}
      <Card sx={cardSx}>
        <CardContent>
          <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600, mb: 2 }}>
            Default Payment Provider
          </Typography>
          <FormControl fullWidth size="small" sx={inputSx}>
            <InputLabel>Default Provider</InputLabel>
            <Select
              value={settings.defaultProvider}
              label="Default Provider"
              onChange={(e) => setSettings(prev => ({ ...prev, defaultProvider: e.target.value }))}
            >
              {paymentService.getAllProviders().map(p => (
                <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Stripe Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CreditCard sx={{ color: '#6772E5' }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Stripe
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.stripe.enabled}
                      onChange={(e) => updateProvider('stripe', 'enabled', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              {settings.stripe.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Public Key" size="small" fullWidth sx={inputSx}
                    value={settings.stripe.publicKey}
                    onChange={(e) => updateProvider('stripe', 'publicKey', e.target.value)}
                  />
                  <TextField label="Secret Key" size="small" fullWidth type="password" sx={inputSx}
                    value={settings.stripe.secretKey}
                    onChange={(e) => updateProvider('stripe', 'secretKey', e.target.value)}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* PayPal Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Payment sx={{ color: theme.isDarkMode ? '#4A90D9' : '#003087' }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    PayPal
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.paypal.enabled}
                      onChange={(e) => updateProvider('paypal', 'enabled', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              {settings.paypal.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Client ID" size="small" fullWidth sx={inputSx}
                    value={settings.paypal.clientId}
                    onChange={(e) => updateProvider('paypal', 'clientId', e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Switch checked={settings.paypal.sandbox}
                        onChange={(e) => updateProvider('paypal', 'sandbox', e.target.checked)}
                      />
                    }
                    label="Sandbox Mode"
                    sx={{ color: theme.colors.text.primary }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* PayFast Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Payment sx={{ color: '#00a1e0' }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    PayFast
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.payfast.enabled}
                      onChange={(e) => updateProvider('payfast', 'enabled', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              {settings.payfast.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Merchant ID" size="small" fullWidth sx={inputSx}
                    value={settings.payfast.merchantId}
                    onChange={(e) => updateProvider('payfast', 'merchantId', e.target.value)}
                  />
                  <TextField label="Merchant Key" size="small" fullWidth type="password" sx={inputSx}
                    value={settings.payfast.merchantKey}
                    onChange={(e) => updateProvider('payfast', 'merchantKey', e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Switch checked={settings.payfast.sandbox}
                        onChange={(e) => updateProvider('payfast', 'sandbox', e.target.checked)}
                      />
                    }
                    label="Sandbox Mode"
                    sx={{ color: theme.colors.text.primary }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Solana Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccountBalanceWallet sx={{ color: '#9945FF' }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    Solana
                  </Typography>
                  <Chip label="Crypto" size="small"
                    sx={{ backgroundColor: '#9945FF20', color: '#9945FF', fontWeight: 600 }}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.solana.enabled}
                      onChange={(e) => updateProvider('solana', 'enabled', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              {settings.solana.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Recipient Wallet Address"
                    size="small"
                    fullWidth
                    sx={inputSx}
                    value={settings.solana.recipientAddress}
                    onChange={(e) => updateProvider('solana', 'recipientAddress', e.target.value)}
                    placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                  />
                  <FormControlLabel
                    control={
                      <Switch checked={settings.solana.testMode}
                        onChange={(e) => updateProvider('solana', 'testMode', e.target.checked)}
                      />
                    }
                    label="Test Mode (Devnet)"
                    sx={{ color: theme.colors.text.primary }}
                  />
                  <Alert severity="info" sx={{ borderRadius: '12px' }}>
                    {settings.solana.testMode
                      ? 'Using Solana Devnet. No real funds will be transferred.'
                      : 'Using Solana Mainnet. Real SOL will be transferred.'}
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* EFT / Bank Transfer Card */}
        <Grid item xs={12} md={6}>
          <Card sx={cardSx}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Payment sx={{ color: theme.colors.brand.primary }} />
                  <Typography variant="h6" sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                    EFT / Bank Transfer
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.eft.enabled}
                      onChange={(e) => updateProvider('eft', 'enabled', e.target.checked)}
                    />
                  }
                  label=""
                />
              </Box>
              {settings.eft.enabled && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Bank Name" size="small" fullWidth sx={inputSx}
                    value={settings.eft.bankName}
                    onChange={(e) => updateProvider('eft', 'bankName', e.target.value)}
                  />
                  <TextField label="Account Number" size="small" fullWidth sx={inputSx}
                    value={settings.eft.accountNumber}
                    onChange={(e) => updateProvider('eft', 'accountNumber', e.target.value)}
                  />
                  <TextField label="Branch Code" size="small" fullWidth sx={inputSx}
                    value={settings.eft.branchCode}
                    onChange={(e) => updateProvider('eft', 'branchCode', e.target.value)}
                  />
                  <TextField label="Payment Reference Prefix" size="small" fullWidth sx={inputSx}
                    value={settings.eft.reference}
                    onChange={(e) => updateProvider('eft', 'reference', e.target.value)}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Settings */}
      <Box sx={{ mt: 4 }}>
        <NotificationSettings />
      </Box>
    </Box>
  );
}
