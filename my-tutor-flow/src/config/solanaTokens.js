/**
 * Solana Token Configuration
 * Defines supported tokens for My Tutor Flow payments
 */

// Token mint addresses on Solana mainnet
export const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112', // Native SOL (wrapped)
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK token mint
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC token mint
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT token mint
};

// Token metadata and display information
export const TOKENS = {
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    mint: TOKEN_MINTS.SOL,
    icon: '◎',
    color: '#9945FF',
    gradient: 'linear-gradient(135deg, #9945FF, #14F195)',
    isNative: true,
    description: 'Native Solana token',
    website: 'https://solana.com',
  },
  BONK: {
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    mint: TOKEN_MINTS.BONK,
    icon: '🐕',
    logoLinear: '/assets/logos/bonk/Bonk_Master_Linear_3D.png',
    logoOnly: '/assets/logos/bonk/Bonk_Master_Logo_Only_3D.png',
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35, #F7931E)',
    isNative: false,
    description: 'The first Solana dog coin for the people, by the people',
    website: 'https://bonkcoin.com',
    coingeckoId: 'bonk',
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    mint: TOKEN_MINTS.USDC,
    icon: '$',
    color: '#2775CA',
    gradient: 'linear-gradient(135deg, #2775CA, #1B5E20)',
    isNative: false,
    description: 'USD Coin stablecoin',
    website: 'https://www.centre.co/usdc',
    coingeckoId: 'usd-coin',
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    mint: TOKEN_MINTS.USDT,
    icon: '₮',
    color: '#26A17B',
    gradient: 'linear-gradient(135deg, #26A17B, #1B5E20)',
    isNative: false,
    description: 'Tether USD stablecoin',
    website: 'https://tether.to',
    coingeckoId: 'tether',
  },
};

// Default supported tokens for payments
export const SUPPORTED_PAYMENT_TOKENS = ['SOL', 'BONK', 'USDC'];

// Exchange rate APIs and configurations
export const EXCHANGE_RATE_CONFIG = {
  // CoinGecko API for real-time rates
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      simple: '/simple/price',
    },
  },
  
  // Supported fiat currencies
  fiatCurrencies: ['usd', 'zar', 'eur', 'gbp', 'aed'],
  
  // Cache duration for exchange rates (5 minutes)
  cacheDuration: 5 * 60 * 1000,
  
  // Fallback rates (used when API is unavailable)
  fallbackRates: {
    SOL: {
      usd: 150,
      zar: 2800,
      eur: 140,
      gbp: 120,
      aed: 550,
    },
    BONK: {
      usd: 0.000025,
      zar: 0.00047,
      eur: 0.000023,
      gbp: 0.00002,
      aed: 0.000092,
    },
    USDC: {
      usd: 1,
      zar: 18.5,
      eur: 0.92,
      gbp: 0.79,
      aed: 3.67,
    },
  },
};

// Transaction fee configurations
export const TRANSACTION_CONFIG = {
  // Priority fee in lamports (for faster confirmation)
  priorityFee: 5000,
  
  // Maximum retries for failed transactions
  maxRetries: 3,
  
  // Confirmation commitment level
  commitment: 'confirmed',
  
  // Timeout for transaction confirmation (30 seconds)
  confirmationTimeout: 30000,
  
  // Minimum balance requirements (in lamports)
  minBalanceRequirements: {
    SOL: 10000000, // 0.01 SOL
    BONK: 1000000, // 10 BONK (considering 5 decimals)
    USDC: 1000000, // 1 USDC (considering 6 decimals)
  },
};

// Payment validation rules
export const PAYMENT_VALIDATION = {
  // Minimum payment amounts in USD equivalent
  minPaymentUSD: 1,
  
  // Maximum payment amounts in USD equivalent
  maxPaymentUSD: 10000,
  
  // Decimal places for display
  displayDecimals: {
    SOL: 4,
    BONK: 0, // BONK has large supply, show whole numbers
    USDC: 2,
    USDT: 2,
  },
  
  // Slippage tolerance for token swaps (if implemented)
  slippageTolerance: 0.01, // 1%
};

// UI configuration for token display
export const TOKEN_UI_CONFIG = {
  // Default token for new payments
  defaultToken: 'SOL',
  
  // Token selection order in UI
  displayOrder: ['SOL', 'BONK', 'USDC', 'USDT'],
  
  // Animation durations
  animations: {
    tokenSwitch: 300,
    balanceUpdate: 500,
    paymentConfirm: 1000,
  },
  
  // Color themes for different tokens
  themes: {
    SOL: {
      primary: '#9945FF',
      secondary: '#14F195',
      background: '#9945FF10',
    },
    BONK: {
      primary: '#FF6B35',
      secondary: '#F7931E',
      background: '#FF6B3510',
    },
    USDC: {
      primary: '#2775CA',
      secondary: '#1B5E20',
      background: '#2775CA10',
    },
    USDT: {
      primary: '#26A17B',
      secondary: '#1B5E20',
      background: '#26A17B10',
    },
  },
};

// Utility functions
export const getTokenBySymbol = (symbol) => {
  return TOKENS[symbol.toUpperCase()];
};

export const getTokenByMint = (mint) => {
  return Object.values(TOKENS).find(token => token.mint === mint);
};

export const formatTokenAmount = (amount, tokenSymbol, includeSymbol = true) => {
  const token = getTokenBySymbol(tokenSymbol);
  if (!token) return amount.toString();
  
  const decimals = PAYMENT_VALIDATION.displayDecimals[tokenSymbol] || 4;
  const formatted = Number(amount).toFixed(decimals);
  
  return includeSymbol ? `${formatted} ${token.symbol}` : formatted;
};

export const convertToTokenUnits = (amount, tokenSymbol) => {
  const token = getTokenBySymbol(tokenSymbol);
  if (!token) return amount;
  
  return Math.floor(amount * Math.pow(10, token.decimals));
};

export const convertFromTokenUnits = (amount, tokenSymbol) => {
  const token = getTokenBySymbol(tokenSymbol);
  if (!token) return amount;
  
  return amount / Math.pow(10, token.decimals);
};

// Export default configuration
export default {
  TOKENS,
  TOKEN_MINTS,
  SUPPORTED_PAYMENT_TOKENS,
  EXCHANGE_RATE_CONFIG,
  TRANSACTION_CONFIG,
  PAYMENT_VALIDATION,
  TOKEN_UI_CONFIG,
  getTokenBySymbol,
  getTokenByMint,
  formatTokenAmount,
  convertToTokenUnits,
  convertFromTokenUnits,
};
