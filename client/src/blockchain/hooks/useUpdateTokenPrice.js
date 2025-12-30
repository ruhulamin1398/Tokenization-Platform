import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { blockchainConfig } from '../config';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const useUpdateTokenPrice = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

  const updateTokenPrice = (tokenAddress, newPrice) => {
    // Input validation
    if (!tokenAddress || tokenAddress === '0x0' || !tokenAddress.startsWith('0x')) {
      toast.error('Invalid token address');
      return;
    }

    const priceBigInt = BigInt(Math.floor(newPrice));
    if (priceBigInt <= 0n) {
      toast.error('Price must be greater than 0');
      return;
    }

    toast.dismiss();
    toast.loading('Updating token price...');

    console.log("Updating token price:", { tokenAddress, newPrice: priceBigInt });

    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'updateTokenPrice',
      args: [tokenAddress, priceBigInt],
    });
  };

  useEffect(() => {
    if (isSuccess && hash) {
      toast.dismiss();
      toast.success(`Token price updated successfully! Transaction: ${hash}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    const errorToShow = error || txError;
    if (errorToShow) {
      toast.dismiss();
      toast.error(`Error updating price: ${errorToShow.message || 'Unknown error'}`);
    }
  }, [error, txError]);

  return {
    updateTokenPrice,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || txError,
  };
};