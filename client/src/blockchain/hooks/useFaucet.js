import React, { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { toast } from 'react-toastify';
import { useAccount } from './useAccount';
import { blockchainConfig } from '../config';

export const useFaucet = () => {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleMint = () => {
    if (!amount || !address) return;

    const amountInUnits = parseFloat(amount) * 10 ** 6; // USDT has 6 decimals

    writeContract({
      address: blockchainConfig.USDT_CONTRACT_ADDRESS,
      abi: blockchainConfig.USDT_ABI,
      functionName: 'mint',
      args: [address, amountInUnits],
    });
  };

  // Handle success and error effects
  React.useEffect(() => {
    if (isSuccess) {
      toast.success('USDT minted successfully!');
      setAmount('');
    }
    if (error) {
      toast.error(`Mint failed: ${error.message}`);
    }
  }, [isSuccess, error]);

  return {
    amount,
    setAmount,
    handleMint,
    isPending,
    isSuccess,
    error,
    isConnected: !!address,
  };
};