import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { blockchainConfig } from '../config';

export const useOwnerTokens = () => {
  const { address } = useAccount();

  const { data: tokens, isLoading, error } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getOwnerTokens',
    args: [address],
    enabled: !!address,
  });

  return {
    tokens,
    isLoading,
    error,
  };
};