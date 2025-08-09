import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  transact,
  MockConnection as Connection,
  MockPublicKey as PublicKey,
  MockSystemProgram as SystemProgram,
  MockTransaction as Transaction,
  toByteArray
} from '../utils/mwaPolyfill.js';

// Mock clusterApiUrl for demo
const clusterApiUrl = () => 'https://api.devnet.solana.com';

/**
 * Solana Mobile Wallet Adapter Context
 * Provides wallet connection, transaction signing, and payment processing
 * for My Tutor Flow's crypto payment features
 */

// App Identity for MWA
export const APP_IDENTITY = {
  name: 'My Tutor Flow',
  uri: 'https://mytutorflow.com',
  icon: 'favicon.ico',
};

// Create Context
const SolanaWalletContext = createContext({
  // Connection state
  isConnected: false,
  isConnecting: false,
  walletAddress: null,
  balance: null,
  
  // Wallet actions
  connectWallet: async () => {},
  disconnectWallet: async () => {},
  
  // Transaction actions
  sendPayment: async () => {},
  signMessage: async () => {},
  
  // Utility
  getBalance: async () => {},
  error: null,
  clearError: () => {},
});

// Solana connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

export const SolanaWalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [error, setError] = useState(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Connect to Solana wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const authorizationResult = await transact(async (wallet) => {
        const result = await wallet.authorize({
          cluster: 'solana:devnet',
          identity: APP_IDENTITY,
          auth_token: authToken || undefined,
        });
        return result;
      });

      if (authorizationResult?.accounts?.[0]) {
        const address = authorizationResult.accounts[0].address;
        const publicKey = new PublicKey(toByteArray(address));
        
        setWalletAddress(publicKey.toString());
        setAuthToken(authorizationResult.auth_token);
        setIsConnected(true);
        
        // Get balance
        await getBalance(publicKey);
        
        console.log('✅ Wallet connected:', publicKey.toString());
      }
    } catch (err) {
      console.error('❌ Wallet connection failed:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, authToken]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      if (authToken) {
        await transact(async (wallet) => {
          await wallet.deauthorize({ auth_token: authToken });
        });
      }
      
      setIsConnected(false);
      setWalletAddress(null);
      setBalance(null);
      setAuthToken(null);
      
      console.log('✅ Wallet disconnected');
    } catch (err) {
      console.error('❌ Wallet disconnection failed:', err);
      setError(err.message || 'Failed to disconnect wallet');
    }
  }, [authToken]);

  // Get wallet balance
  const getBalance = useCallback(async (publicKey = null) => {
    try {
      const key = publicKey || (walletAddress ? new PublicKey(walletAddress) : null);
      if (!key) return;
      
      const balanceInLamports = await connection.getBalance(key);
      const balanceInSOL = balanceInLamports / 1e9; // Convert lamports to SOL
      
      setBalance(balanceInSOL);
      return balanceInSOL;
    } catch (err) {
      console.error('❌ Failed to get balance:', err);
      setError(err.message || 'Failed to get balance');
    }
  }, [walletAddress]);

  // Send SOL payment
  const sendPayment = useCallback(async (recipientAddress, amountSOL, memo = '') => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const recipient = new PublicKey(recipientAddress);
      const sender = new PublicKey(walletAddress);
      const lamports = Math.floor(amountSOL * 1e9); // Convert SOL to lamports

      const signature = await transact(async (wallet) => {
        // Get latest blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        
        // Create transfer instruction
        const transferInstruction = SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports,
        });

        // Create transaction
        const transaction = new Transaction({
          recentBlockhash: blockhash,
          feePayer: sender,
        }).add(transferInstruction);

        // Add memo if provided
        if (memo) {
          const memoInstruction = {
            keys: [],
            programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
            data: Buffer.from(memo, 'utf8'),
          };
          transaction.add(memoInstruction);
        }

        // Sign and send transaction
        const signatures = await wallet.signAndSendTransactions({
          transactions: [transaction],
        });

        return signatures[0];
      });

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

      // Update balance
      await getBalance();
      
      console.log('✅ Payment sent:', signature);
      return signature;
      
    } catch (err) {
      console.error('❌ Payment failed:', err);
      setError(err.message || 'Payment failed');
      throw err;
    }
  }, [isConnected, walletAddress, getBalance]);

  // Sign message
  const signMessage = useCallback(async (message) => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const messageBuffer = new Uint8Array(
        message.split('').map(c => c.charCodeAt(0))
      );

      const signedMessages = await transact(async (wallet) => {
        return await wallet.signMessages({
          addresses: [walletAddress],
          payloads: [messageBuffer],
        });
      });

      console.log('✅ Message signed');
      return signedMessages[0];
      
    } catch (err) {
      console.error('❌ Message signing failed:', err);
      setError(err.message || 'Message signing failed');
      throw err;
    }
  }, [isConnected, walletAddress]);

  // Auto-refresh balance periodically
  useEffect(() => {
    if (isConnected && walletAddress) {
      const interval = setInterval(() => {
        getBalance();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, walletAddress, getBalance]);

  const value = {
    // State
    isConnected,
    isConnecting,
    walletAddress,
    balance,
    error,
    
    // Actions
    connectWallet,
    disconnectWallet,
    sendPayment,
    signMessage,
    getBalance,
    clearError,
  };

  return (
    <SolanaWalletContext.Provider value={value}>
      {children}
    </SolanaWalletContext.Provider>
  );
};

// Custom hook to use Solana wallet
export const useSolanaWallet = () => {
  const context = useContext(SolanaWalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
};

export default SolanaWalletContext;
