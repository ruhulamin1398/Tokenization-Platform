import { useReadContract } from 'wagmi';
import { blockchainConfig } from '../config';
import { useAccount } from './useAccount';
import { useEffect, useState } from 'react';

export const useUserHoldings = () => {
  const { address } = useAccount();
  const [userHoldings, setUserHoldings] = useState([]);
  const [totalValue, setTotalValue] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  // Get all tokens
  const { data: allTokens, isLoading: tokensLoading } = useReadContract({
    address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
    abi: blockchainConfig.TOKEN_FACTORY_ABI,
    functionName: 'getAllTokens',
    enabled: !!address,
  });

  // Get user's token balances for each token
  useEffect(() => {
    const fetchUserHoldings = async () => {
      if (!allTokens || !address) return;

      setIsLoading(true);
      const holdings = [];
      let totalVal = 0n;

      for (const token of allTokens) {
        try {
          // Get user's balance for this token
          const balance = await fetch(`${blockchainConfig.RPC_URL}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [{
                to: token.tokenAddress,
                data: `0x70a08231000000000000000000000000${address.slice(2)}` // balanceOf(address)
              }, 'latest'],
              id: 1
            })
          });

          const balanceData = await balance.json();
          const balanceValue = BigInt(balanceData.result || '0x0');

          if (balanceValue > 0n) {
            const value = balanceValue * BigInt(token.price);
            totalVal += value;

            holdings.push({
              ...token,
              balance: balanceValue.toString(),
              value: value.toString(),
              formattedBalance: (Number(balanceValue) / 10**6).toFixed(6),
              formattedValue: (Number(value) / 10**6).toFixed(2)
            });
          }
        } catch (error) {
          console.error(`Error fetching balance for token ${token.tokenAddress}:`, error);
        }
      }

      setUserHoldings(holdings);
      setTotalValue((Number(totalVal) / 10**6).toFixed(2));
      setIsLoading(false);
    };

    fetchUserHoldings();
  }, [allTokens, address]);

  return {
    userHoldings,
    totalValue,
    isLoading: isLoading || tokensLoading,
  };
};