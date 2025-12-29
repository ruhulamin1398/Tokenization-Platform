import { useReadContract } from 'wagmi';
import { blockchainConfig } from '../config';

export const useAllTokens = () => {
  const { data: tokens, isLoading, error } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getAllTokens',
  });

  return {
    tokens,
    isLoading,
    error,
  };
};