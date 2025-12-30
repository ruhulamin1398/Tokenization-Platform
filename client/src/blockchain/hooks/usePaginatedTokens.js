import { useReadContract } from 'wagmi';
import { blockchainConfig } from '../config';

export const usePaginatedTokens = (page = 0, pageSize = 6) => {
  const { data, isLoading, error } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getTokensPaginated',
    args: [page, pageSize],
  });

  // The contract returns [TokenInfo[], total] so we destructure it
  const [tokens, total] = data || [[], 0];

  return {
    tokens,
    total,
    isLoading,
    error,
  };
};