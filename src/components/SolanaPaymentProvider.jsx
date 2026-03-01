import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Required CSS for wallet modal
import '@solana/wallet-adapter-react-ui/styles.css';

const DEVNET_ENDPOINT = clusterApiUrl('devnet');
const MAINNET_ENDPOINT = clusterApiUrl('mainnet-beta');

export default function SolanaPaymentProvider({ children, testMode = true }) {
  const endpoint = useMemo(
    () => (testMode ? DEVNET_ENDPOINT : MAINNET_ENDPOINT),
    [testMode]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
