/**
 * Mobile Wallet Adapter Polyfill for Web Environment
 * Provides mock MWA functionality for demo purposes
 * In production, this would only work on actual Solana Mobile devices
 */

// Mock base64 encoding/decoding for web
export const toByteArray = (base64String) => {
  try {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Failed to decode base64:', error);
    return new Uint8Array(0);
  }
};

export const fromByteArray = (bytes) => {
  try {
    const binaryString = String.fromCharCode(...bytes);
    return btoa(binaryString);
  } catch (error) {
    console.error('Failed to encode base64:', error);
    return '';
  }
};

// Mock MWA transact function for web demo
export const transact = async (callback) => {
  // In a real mobile environment, this would connect to an actual wallet
  // For demo purposes, we'll simulate a wallet connection
  
  console.log('🔗 [DEMO] Simulating Mobile Wallet Adapter connection...');
  
  // Simulate connection delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock wallet object
  const mockWallet = {
    authorize: async ({ cluster, identity, auth_token }) => {
      console.log('🔐 [DEMO] Authorizing wallet connection...', { cluster, identity });
      
      // Simulate authorization delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Return mock authorization result
      return {
        accounts: [{
          address: fromByteArray(new Uint8Array(32).fill(1)), // Mock address
          label: 'Demo Wallet',
        }],
        auth_token: 'demo_auth_token_' + Date.now(),
        wallet_uri_base: 'https://demo-wallet.com',
      };
    },
    
    deauthorize: async ({ auth_token }) => {
      console.log('🔓 [DEMO] Deauthorizing wallet...', { auth_token });
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    
    signAndSendTransactions: async ({ transactions }) => {
      console.log('📝 [DEMO] Signing and sending transactions...', { count: transactions.length });
      
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock transaction signatures
      return transactions.map(() => 
        'demo_signature_' + Math.random().toString(36).substring(2, 15)
      );
    },
    
    signTransactions: async ({ transactions }) => {
      console.log('✍️ [DEMO] Signing transactions...', { count: transactions.length });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return the same transactions (mock signing)
      return transactions;
    },
    
    signMessages: async ({ addresses, payloads }) => {
      console.log('📄 [DEMO] Signing messages...', { addresses, payloads: payloads.length });
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return mock signatures
      return payloads.map(() => new Uint8Array(64).fill(1)); // Mock signature bytes
    },
  };
  
  try {
    const result = await callback(mockWallet);
    console.log('✅ [DEMO] MWA transaction completed successfully');
    return result;
  } catch (error) {
    console.error('❌ [DEMO] MWA transaction failed:', error);
    throw error;
  }
};

// App identity for demo
export const APP_IDENTITY = {
  name: 'My Tutor Flow',
  uri: 'https://mytutorflow.com',
  icon: 'favicon.ico',
};

// Mock Solana connection for demo
export class MockConnection {
  constructor(endpoint, commitment) {
    this.endpoint = endpoint;
    this.commitment = commitment;
    console.log('🌐 [DEMO] Mock Solana connection created:', { endpoint, commitment });
  }
  
  async getBalance(publicKey) {
    console.log('💰 [DEMO] Getting balance for:', publicKey.toString());
    // Return mock balance (0.5 SOL)
    return 500000000; // 0.5 SOL in lamports
  }
  
  async getLatestBlockhash() {
    console.log('🔗 [DEMO] Getting latest blockhash...');
    return {
      blockhash: 'demo_blockhash_' + Date.now(),
      lastValidBlockHeight: 1000000,
    };
  }
  
  async confirmTransaction(signature, commitment) {
    console.log('✅ [DEMO] Confirming transaction:', { signature, commitment });
    
    // Simulate confirmation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      value: {
        err: null, // No error = success
        confirmations: 1,
      },
    };
  }
  
  async sendTransaction(transaction, signers, options) {
    console.log('📤 [DEMO] Sending transaction...', { signers: signers?.length, options });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return 'demo_tx_signature_' + Math.random().toString(36).substring(2, 15);
  }
}

// Export mock versions of Solana web3.js classes for demo
export class MockPublicKey {
  constructor(value) {
    this.value = value;
  }
  
  toString() {
    return this.value || 'DemoPublicKey1111111111111111111111111111';
  }
  
  toBase58() {
    return this.toString();
  }
}

export class MockTransaction {
  constructor(options = {}) {
    this.recentBlockhash = options.recentBlockhash;
    this.feePayer = options.feePayer;
    this.instructions = [];
  }
  
  add(instruction) {
    this.instructions.push(instruction);
    return this;
  }
}

export class MockSystemProgram {
  static transfer({ fromPubkey, toPubkey, lamports }) {
    return {
      keys: [
        { pubkey: fromPubkey, isSigner: true, isWritable: true },
        { pubkey: toPubkey, isSigner: false, isWritable: true },
      ],
      programId: new MockPublicKey('11111111111111111111111111111112'),
      data: Buffer.from([2, 0, 0, 0, ...new Uint8Array(8)]), // Mock transfer instruction
    };
  }
}

// Demo notification function
export const showDemoNotification = (message, type = 'info') => {
  console.log(`🔔 [DEMO ${type.toUpperCase()}] ${message}`);
  
  // You could integrate with your app's notification system here
  if (window.showNotification) {
    window.showNotification(message, type);
  }
};

export default {
  transact,
  toByteArray,
  fromByteArray,
  APP_IDENTITY,
  MockConnection,
  MockPublicKey,
  MockTransaction,
  MockSystemProgram,
  showDemoNotification,
};
