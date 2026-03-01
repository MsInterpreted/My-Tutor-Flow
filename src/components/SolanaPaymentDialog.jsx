import React, { useState, useCallback, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  AccountBalanceWallet,
  CheckCircle,
  Error as ErrorIcon,
  ContentCopy,
} from '@mui/icons-material';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { useTheme } from '../theme/ThemeContext';

const STEPS = ['Connect Wallet', 'Confirm Payment', 'Processing', 'Complete'];

export default function SolanaPaymentDialog({
  open,
  onClose,
  invoice,
  recipientAddress,
  solAmount,
  onPaymentComplete,
}) {
  const theme = useTheme();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [txSignature, setTxSignature] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setActiveStep(connected ? 1 : 0);
      setError(null);
      setTxSignature(null);
      setProcessing(false);
    }
  }, [open, connected]);

  // Move to step 1 when wallet connects
  useEffect(() => {
    if (connected && activeStep === 0) {
      setActiveStep(1);
    }
  }, [connected, activeStep]);

  const handleConnectWallet = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleSendPayment = useCallback(async () => {
    if (!publicKey || !recipientAddress || !solAmount) return;

    setProcessing(true);
    setActiveStep(2);
    setError(null);

    try {
      const recipient = new PublicKey(recipientAddress);
      const lamports = Math.round(solAmount * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      setTxSignature(signature);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error('Transaction failed on-chain');
      }

      setActiveStep(3);
      if (onPaymentComplete) {
        onPaymentComplete({
          signature,
          amount: solAmount,
          from: publicKey.toBase58(),
          to: recipientAddress,
          invoiceId: invoice?.id,
        });
      }
    } catch (err) {
      setError(err.message || 'Transaction failed');
      setActiveStep(1);
    } finally {
      setProcessing(false);
    }
  }, [publicKey, recipientAddress, solAmount, sendTransaction, connection, invoice, onPaymentComplete]);

  const handleClose = () => {
    if (!processing) {
      onClose();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <AccountBalanceWallet sx={{ fontSize: 64, color: theme.colors.brand.primary, mb: 2 }} />
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              Connect Your Wallet
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 3 }}>
              Connect a Solana wallet to pay this invoice
            </Typography>
            <Button
              variant="contained"
              onClick={handleConnectWallet}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                '&:hover': { backgroundColor: theme.colors.brand.primary, opacity: 0.8 },
              }}
            >
              Select Wallet
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: theme.colors.background.primary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 1 }}>
                Connected Wallet
              </Typography>
              <Chip
                label={publicKey ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}` : ''}
                size="small"
                sx={{ backgroundColor: `${theme.colors.brand.primary}20`, color: theme.colors.brand.primary }}
              />
            </Box>

            {invoice && (
              <Box sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: theme.colors.background.primary,
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                mb: 2,
              }}>
                <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                  Invoice
                </Typography>
                <Typography variant="h6" sx={{ color: theme.colors.text.primary }}>
                  {invoice.invoiceNumber || invoice.id}
                </Typography>
              </Box>
            )}

            <Box sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: theme.colors.background.primary,
              border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              mb: 2,
            }}>
              <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                Amount
              </Typography>
              <Typography variant="h5" sx={{ color: theme.colors.brand.primary, fontWeight: 700 }}>
                {solAmount} SOL
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSendPayment}
              disabled={!publicKey || !solAmount}
              sx={{
                backgroundColor: theme.colors.brand.primary,
                color: '#000',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                '&:hover': { backgroundColor: theme.colors.brand.primary, opacity: 0.8 },
              }}
            >
              Confirm & Send Payment
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress sx={{ color: theme.colors.brand.primary, mb: 2 }} size={64} />
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              Processing Transaction
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
              Waiting for on-chain confirmation...
            </Typography>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircle sx={{ fontSize: 64, color: theme.colors.status?.success || '#4CAF50', mb: 2 }} />
            <Typography variant="h6" sx={{ color: theme.colors.text.primary, mb: 1 }}>
              Payment Successful
            </Typography>
            <Typography variant="body2" sx={{ color: theme.colors.text.secondary, mb: 2 }}>
              Your payment of {solAmount} SOL has been confirmed on-chain.
            </Typography>
            {txSignature && (
              <Box sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: theme.colors.background.primary,
                border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}>
                <Typography variant="caption" sx={{ color: theme.colors.text.secondary }}>
                  Transaction Signature
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Typography variant="body2" sx={{ color: theme.colors.text.primary, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                    {txSignature}
                  </Typography>
                  <IconButton size="small" onClick={() => copyToClipboard(txSignature)}>
                    <ContentCopy fontSize="small" sx={{ color: theme.colors.text.secondary }} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: '16px',
          border: `1px solid ${theme.isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        },
      }}
    >
      <DialogTitle sx={{ color: theme.colors.text.primary, fontWeight: 600 }}>
        Pay with Solana
      </DialogTitle>

      <DialogContent>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 3,
            '& .MuiStepLabel-label': { color: theme.colors.text.secondary, fontSize: '0.75rem' },
            '& .MuiStepLabel-label.Mui-active': { color: theme.colors.brand.primary },
            '& .MuiStepLabel-label.Mui-completed': { color: theme.colors.status?.success || '#4CAF50' },
          }}
        >
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={processing}
          sx={{ color: theme.colors.text.secondary, textTransform: 'none' }}
        >
          {activeStep === 3 ? 'Done' : 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

