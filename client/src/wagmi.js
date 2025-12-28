import { createConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import {
  metaMaskWallet,
  rabbyWallet,
  braveWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const wallets = [
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet,
      rabbyWallet,
      braveWallet,
      walletConnectWallet,
    ],
  },
];

export const config = createConfig({
  chains: [sepolia],
  connectors: connectorsForWallets(wallets, {
    appName: 'Tokenization Platform',
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  }),
  ssr: false,
});