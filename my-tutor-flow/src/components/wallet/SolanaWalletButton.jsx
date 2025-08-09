import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { useSolanaWallet } from '../../contexts/SolanaWalletContext';

/**
 * Solana Wallet Connection Button
 * Handles wallet connection, display, and basic operations
 * for My Tutor Flow's crypto payment features
 */
const SolanaWalletButton = ({ variant = 'contained', size = 'medium', fullWidth = false }) => {
  const theme = useTheme();
  const {
    isConnected,
    isConnecting,
    walletAddress,
    balance,
    connectWallet,
    disconnectWallet,
    error,
    clearError,
  } = useSolanaWallet();

  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setShowWalletDialog(false);
    } catch (err) {
      console.error('Disconnection failed:', err);
    }
  };

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Format SOL balance
  const formatBalance = (bal) => {
    if (bal === null || bal === undefined) return '0.00';
    return bal.toFixed(4);
  };

  if (!isConnected) {
    return (
      <>
        <Button
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          onClick={handleConnect}
          disabled={isConnecting}
          startIcon={
            isConnecting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <WalletIcon />
            )
          }
          sx={{
            backgroundColor: variant === 'contained' ? theme.colors.brand.primary : 'transparent',
            borderColor: theme.colors.brand.primary,
            color: variant === 'contained' ? 'white' : theme.colors.brand.primary,
            '&:hover': {
              backgroundColor: variant === 'contained' 
                ? theme.colors.brand.primary + 'dd' 
                : theme.colors.brand.primary + '10',
            },
            fontWeight: 600,
          }}
        >
          {isConnecting ? 'Connecting...' : 'Connect Solana Wallet'}
        </Button>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={clearError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      {/* Connected Wallet Button */}
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={() => setShowWalletDialog(true)}
        startIcon={<WalletIcon />}
        sx={{
          backgroundColor: variant === 'contained' ? theme.colors.status.success : 'transparent',
          borderColor: theme.colors.status.success,
          color: variant === 'contained' ? 'white' : theme.colors.status.success,
          '&:hover': {
            backgroundColor: variant === 'contained' 
              ? theme.colors.status.success + 'dd' 
              : theme.colors.status.success + '10',
          },
          fontWeight: 600,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
            {formatBalance(balance)} SOL
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
            {formatAddress(walletAddress)}
          </Typography>
        </Box>
      </Button>

      {/* Wallet Details Dialog */}
      <Dialog
        open={showWalletDialog}
        onClose={() => setShowWalletDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            backgroundColor: theme.colors.background.primary,
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: theme.colors.brand.primary + '10',
          color: theme.colors.text.primary,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WalletIcon sx={{ mr: 2, color: theme.colors.brand.primary }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Solana Wallet
            </Typography>
          </Box>
          <IconButton onClick={() => setShowWalletDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Wallet Status */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              icon={<CheckIcon />}
              label="Connected"
              color="success"
              sx={{
                backgroundColor: theme.colors.status.success + '20',
                color: theme.colors.status.success,
                fontWeight: 600,
              }}
            />
          </Box>

          {/* Balance Card */}
          <Card sx={{ mb: 3, backgroundColor: theme.colors.background.secondary }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                color: theme.colors.brand.primary, 
                fontWeight: 700, 
                mb: 1 
              }}>
                {formatBalance(balance)} SOL
              </Typography>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Available Balance
              </Typography>
            </CardContent>
          </Card>

          {/* Wallet Address */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ 
              color: theme.colors.text.secondary, 
              mb: 1, 
              fontWeight: 600 
            }}>
              Wallet Address
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 2, 
              backgroundColor: theme.colors.background.secondary,
              borderRadius: '8px',
              border: `1px solid ${theme.colors.text.secondary}20`,
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1, 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem',
                  wordBreak: 'break-all',
                }}
              >
                {walletAddress}
              </Typography>
              <IconButton 
                onClick={copyAddress}
                size="small"
                sx={{ ml: 1 }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Network Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ 
              color: theme.colors.text.secondary, 
              mb: 1, 
              fontWeight: 600 
            }}>
              Network
            </Typography>
            <Chip
              label="Solana Devnet"
              size="small"
              sx={{
                backgroundColor: theme.colors.status.info + '20',
                color: theme.colors.status.info,
              }}
            />
          </Box>

          {/* Features Available */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ 
              color: theme.colors.text.secondary, 
              mb: 2, 
              fontWeight: 600 
            }}>
              Available Features
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="💰 Tuition Payments" size="small" variant="outlined" />
              <Chip label="🏆 NFT Certificates" size="small" variant="outlined" />
              <Chip label="📊 Transaction History" size="small" variant="outlined" />
              <Chip label="🔒 Secure Transactions" size="small" variant="outlined" />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleDisconnect}
            variant="outlined"
            color="error"
            fullWidth
            sx={{ fontWeight: 600 }}
          >
            Disconnect Wallet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Address copied to clipboard!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SolanaWalletButton;
