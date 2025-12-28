import { createConfig } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { http } from 'wagmi';
import { config } from './config';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
    trustWallet,
    baseAccount,
    walletConnectWallet,
    rabbyWallet,
    okxWallet,
    binanceWallet,
    phantomWallet,
    bitgetWallet,
    oneKeyWallet,
    coin98Wallet,
    ledgerWallet,
    gateWallet,
    braveWallet,
    bybitWallet,
    tokenPocketWallet,
    uniswapWallet
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                walletConnectWallet,
                metaMaskWallet,
                braveWallet,
                trustWallet,
                baseAccount,
                tokenPocketWallet,
                rabbyWallet,
            ],
        },
        {
            groupName: 'Other Popular',
            wallets: [
                uniswapWallet,
                binanceWallet,
                phantomWallet,
                bitgetWallet,
                bybitWallet,
                oneKeyWallet,
                ledgerWallet,
                okxWallet,
                gateWallet,
            ],
        },
    ],
    {
        appName: 'Aurex',
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
    }
);

export const wagmiConfig = createConfig({
    connectors,
    chains: [config.CHAIN],
    transports: {
        [config.CHAIN_ID]: http(config.RPC_URL),
    },
});