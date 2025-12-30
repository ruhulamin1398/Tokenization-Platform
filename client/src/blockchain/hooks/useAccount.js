import { useAccount as useWagmiAccount, useReadContract } from 'wagmi';
import { blockchainConfig } from '../config';

export const useAccount = () => {
  const { address, ...accountData } = useWagmiAccount();
  const { data: usdtBalance } = useReadContract({
    address: blockchainConfig.USDT_CONTRACT_ADDRESS,
    abi: blockchainConfig.USDT_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!address,
  });

  const formattedUsdtBalance = usdtBalance ? (Number(usdtBalance) / 10 ** 6).toFixed(2) : '0.00';

  return {
    ...accountData,
    address,
    usdtBalance: formattedUsdtBalance,
    rawUsdtBalance: usdtBalance || 0n,
  };
};