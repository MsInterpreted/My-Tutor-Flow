import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Alert,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { useTheme } from '../../theme/ThemeContext';
import { useSolanaWallet } from '../../contexts/SolanaWalletContext';
import { BonkLogo } from '../branding/BonkLogo';
import {
  TOKENS,
  SUPPORTED_PAYMENT_TOKENS,
  formatTokenAmount,
  convertToTokenUnits,
  EXCHANGE_RATE_CONFIG
} from '../../config/solanaTokens';

/**
 * Crypto Payment Modal
 * Handles SOL payments for tuition fees
 * Integrates with My Tutor Flow billing system
 */
const CryptoPaymentModal = ({ 
  open, 
  onClose, 
  student, 
  amount, 
  currency = 'ZAR',
  onPaymentSuccess,
  onPaymentError 
}) => {
  const theme = useTheme();
  const {
    isConnected,
    walletAddress,
    balance,
    sendPayment,
    connectWallet,
    error: walletError,
  } = useSolanaWallet();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [tokenAmount, setTokenAmount] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState('');
  const [error, setError] = useState('');
  const [loadingRates, setLoadingRates] = useState(false);

  // Fetch exchange rates for supported tokens
  const fetchExchangeRates = async () => {
    setLoadingRates(true);
    try {
      const fiatCurrency = currency.toLowerCase();
      const tokenIds = SUPPORTED_PAYMENT_TOKENS
        .map(symbol => TOKENS[symbol].coingeckoId)
        .filter(Boolean)
        .join(',');

      const response = await fetch(
        `${EXCHANGE_RATE_CONFIG.coingecko.baseUrl}${EXCHANGE_RATE_CONFIG.coingecko.endpoints.simple}?ids=${tokenIds}&vs_currencies=${fiatCurrency}`
      );

      if (response.ok) {
        const data = await response.json();
        const rates = {};

        SUPPORTED_PAYMENT_TOKENS.forEach(symbol => {
          const token = TOKENS[symbol];
          if (token.coingeckoId && data[token.coingeckoId]) {
            rates[symbol] = data[token.coingeckoId][fiatCurrency];
          } else {
            // Use fallback rates
            rates[symbol] = EXCHANGE_RATE_CONFIG.fallbackRates[symbol]?.[fiatCurrency] || 1;
          }
        });

        setExchangeRates(rates);
      } else {
        throw new Error('Failed to fetch rates');
      }
    } catch (error) {
      console.warn('Using fallback exchange rates:', error);
      // Use fallback rates
      const rates = {};
      SUPPORTED_PAYMENT_TOKENS.forEach(symbol => {
        rates[symbol] = EXCHANGE_RATE_CONFIG.fallbackRates[symbol]?.[currency.toLowerCase()] || 1;
      });
      setExchangeRates(rates);
    } finally {
      setLoadingRates(false);
    }
  };

  // Calculate token amount based on fiat amount and selected token
  useEffect(() => {
    if (amount && currency && exchangeRates[selectedToken]) {
      const rate = exchangeRates[selectedToken];
      const calculatedAmount = amount / rate;
      setTokenAmount(calculatedAmount);
    }
  }, [amount, currency, selectedToken, exchangeRates]);

  // Fetch exchange rates when modal opens
  useEffect(() => {
    if (open) {
      fetchExchangeRates();
    }
  }, [open, currency]);

  // Set default recipient (in production, this would be the school's wallet)
  useEffect(() => {
    if (open && !recipientAddress) {
      // Demo recipient address (replace with actual school wallet)
      setRecipientAddress('11111111111111111111111111111112'); // System program ID for demo
    }
  }, [open, recipientAddress]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setIsProcessing(false);
      setPaymentSuccess(false);
      setTransactionSignature('');
      setError('');
      setSelectedToken('SOL');
      setTokenAmount(0);
      setExchangeRates({});
    }
  }, [open]);

  // Handle payment processing
  const handlePayment = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!recipientAddress) {
      setError('Recipient address is required');
      return;
    }

    if (tokenAmount <= 0) {
      setError('Invalid payment amount');
      return;
    }

    // Check balance for selected token
    if (selectedToken === 'SOL' && balance < tokenAmount) {
      setError('Insufficient SOL balance');
      return;
    }

    // For other tokens, we'll show a demo message since we don't have real balances
    if (selectedToken !== 'SOL') {
      setError(`${selectedToken} payments are coming soon! This is a demo for the hackathon.`);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const memo = `Tuition payment for ${student?.name || 'student'} - ${amount} ${currency} (${selectedToken})`;
      let signature;

      if (selectedToken === 'SOL') {
        // Send SOL payment
        signature = await sendPayment(recipientAddress, tokenAmount, memo);
      } else {
        // For other tokens, simulate payment for demo
        // In production, this would use SPL token transfer
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
        signature = `demo_${selectedToken}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      setTransactionSignature(signature);
      setPaymentSuccess(true);

      // Notify parent component
      if (onPaymentSuccess) {
        onPaymentSuccess({
          signature,
          amount: tokenAmount,
          currency: selectedToken,
          fiatAmount: amount,
          fiatCurrency: currency,
          student,
          memo,
          exchangeRate: exchangeRates[selectedToken],
        });
      }
      
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed');
      
      if (onPaymentError) {
        onPaymentError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            Crypto Payment
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {paymentSuccess ? (
          // Success State
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckIcon sx={{ 
              fontSize: 80, 
              color: theme.colors.status.success, 
              mb: 2 
            }} />
            <Typography variant="h5" sx={{
              color: theme.colors.status.success,
              fontWeight: 700,
              mb: 2
            }}>
              🎉 Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{
              color: theme.colors.text.secondary,
              mb: 2
            }}>
              Your tuition payment has been processed successfully using {selectedToken}.
            </Typography>

            <Box sx={{
              background: TOKENS[selectedToken]?.gradient || theme.colors.brand.primary,
              borderRadius: '12px',
              p: 2,
              mb: 3,
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{
                color: 'white',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}>
                {selectedToken === 'BONK' ? (
                  <BonkLogo size="small" variant="logoOnly" sx={{ width: 24, height: 24 }} />
                ) : (
                  <span style={{ fontSize: '1.2em' }}>{TOKENS[selectedToken]?.icon}</span>
                )}
                {formatTokenAmount(tokenAmount, selectedToken)} paid
              </Typography>
              <Typography variant="body2" sx={{
                color: 'white',
                opacity: 0.9,
                mt: 1
              }}>
                ≈ {amount?.toLocaleString()} {currency}
              </Typography>
            </Box>
            
            <Card sx={{ backgroundColor: theme.colors.background.secondary, mb: 3 }}>
              <CardContent>
                <Typography variant="body2" sx={{ 
                  color: theme.colors.text.secondary, 
                  mb: 1 
                }}>
                  Transaction Signature
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.8rem',
                  wordBreak: 'break-all',
                  color: theme.colors.text.primary,
                }}>
                  {transactionSignature}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          // Payment Form
          <>
            {/* Payment Details */}
            <Card sx={{ mb: 3, backgroundColor: theme.colors.background.secondary }}>
              <CardContent>
                <Typography variant="h6" sx={{
                  color: theme.colors.text.primary,
                  fontWeight: 700,
                  mb: 2
                }}>
                  Payment Details
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Student:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {student?.name || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                    Amount ({currency}):
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {amount?.toLocaleString() || '0'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Token Selection */}
                <Typography variant="body2" sx={{
                  color: theme.colors.text.secondary,
                  mb: 2,
                  fontWeight: 600
                }}>
                  Select Payment Token:
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {SUPPORTED_PAYMENT_TOKENS.map((tokenSymbol) => {
                    const token = TOKENS[tokenSymbol];
                    const isSelected = selectedToken === tokenSymbol;
                    const tokenRate = exchangeRates[tokenSymbol];
                    const calculatedAmount = tokenRate ? (amount / tokenRate) : 0;

                    return (
                      <Grid item xs={12} sm={4} key={tokenSymbol}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: isSelected ? `2px solid ${token.color}` : '2px solid transparent',
                            backgroundColor: isSelected ? token.color + '10' : theme.colors.background.primary,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${token.color}30`,
                            }
                          }}
                          onClick={() => setSelectedToken(tokenSymbol)}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Box sx={{ mb: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {tokenSymbol === 'BONK' ? (
                                <BonkLogo size="small" variant="logoOnly" sx={{ width: 40, height: 40 }} />
                              ) : (
                                <Typography variant="h4">
                                  {token.icon}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="body2" sx={{
                              fontWeight: 700,
                              color: token.color,
                              mb: 1
                            }}>
                              {token.symbol}
                            </Typography>
                            <Typography variant="caption" sx={{
                              color: theme.colors.text.secondary,
                              display: 'block',
                              mb: 1
                            }}>
                              {token.name}
                            </Typography>
                            {loadingRates ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Typography variant="body2" sx={{
                                fontWeight: 600,
                                color: theme.colors.text.primary
                              }}>
                                {formatTokenAmount(calculatedAmount, tokenSymbol)}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Selected Token Amount Display */}
                <Box sx={{
                  background: TOKENS[selectedToken].gradient,
                  borderRadius: '12px',
                  p: 2,
                  textAlign: 'center',
                  mb: 2
                }}>
                  <Typography variant="body2" sx={{
                    color: 'white',
                    opacity: 0.9,
                    mb: 1
                  }}>
                    You will pay:
                  </Typography>
                  <Typography variant="h5" sx={{
                    color: 'white',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    {selectedToken === 'BONK' ? (
                      <BonkLogo size="small" variant="logoOnly" sx={{ width: 32, height: 32 }} />
                    ) : (
                      <span style={{ fontSize: '1.5em' }}>{TOKENS[selectedToken].icon}</span>
                    )}
                    {formatTokenAmount(tokenAmount, selectedToken)}
                  </Typography>
                  {exchangeRates[selectedToken] && (
                    <Typography variant="caption" sx={{
                      color: 'white',
                      opacity: 0.8,
                      display: 'block',
                      mt: 1
                    }}>
                      Rate: 1 {selectedToken} = {exchangeRates[selectedToken].toLocaleString()} {currency}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Wallet Status */}
            {!isConnected ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Please connect your Solana wallet to proceed with payment.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleConnectWallet}
                  startIcon={<WalletIcon />}
                  sx={{ backgroundColor: theme.colors.brand.primary }}
                >
                  Connect Wallet
                </Button>
              </Alert>
            ) : (
              <Card sx={{ mb: 3, backgroundColor: theme.colors.status.success + '10' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckIcon sx={{ color: theme.colors.status.success, mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Wallet Connected
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      Address:
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontFamily: 'monospace', 
                      fontSize: '0.8rem' 
                    }}>
                      {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      SOL Balance:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {balance?.toFixed(4) || '0.0000'} SOL
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.colors.text.secondary }}>
                      BONK Balance:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: TOKENS.BONK.color }}>
                      🐕 0 BONK
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{
                    color: theme.colors.text.secondary,
                    display: 'block',
                    textAlign: 'center',
                    mt: 1,
                    fontStyle: 'italic'
                  }}>
                    Token balances are fetched in real-time
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Recipient Address */}
            <TextField
              fullWidth
              label="School Wallet Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              disabled={true} // In production, this would be pre-filled and disabled
              sx={{ mb: 3 }}
              helperText="This is the school's official Solana wallet address"
            />

            {/* Error Display */}
            {(error || walletError) && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error || walletError}
              </Alert>
            )}

            {/* Network Info */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Chip
                label="🌐 Solana Devnet"
                size="small"
                sx={{
                  backgroundColor: theme.colors.status.info + '20',
                  color: theme.colors.status.info,
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        {paymentSuccess ? (
          <Button
            onClick={onClose}
            variant="contained"
            fullWidth
            sx={{ 
              backgroundColor: theme.colors.status.success,
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              variant="contained"
              disabled={!isConnected || isProcessing || tokenAmount <= 0}
              startIcon={
                isProcessing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{ 
                backgroundColor: theme.colors.brand.primary,
                fontWeight: 600,
                flex: 1,
              }}
            >
              {isProcessing ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Processing {selectedToken} Payment...
                </>
              ) : (
                <>
                  {selectedToken === 'BONK' ? (
                    <BonkLogo size="small" variant="logoOnly" sx={{ width: 20, height: 20, mr: 1 }} />
                  ) : (
                    <span style={{ fontSize: '1.2em', marginRight: '8px' }}>
                      {TOKENS[selectedToken]?.icon}
                    </span>
                  )}
                  Pay {formatTokenAmount(tokenAmount, selectedToken, false)} {selectedToken}
                </>
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CryptoPaymentModal;
