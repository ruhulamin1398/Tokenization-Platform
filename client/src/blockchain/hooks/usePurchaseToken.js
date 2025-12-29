import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { blockchainConfig } from '../config';

export const usePurchaseToken = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess, 
    error: txError 
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

  useEffect(() => {
    if (isSuccess && hash) {
      toast.dismiss();
      toast.success(`Token purchased successfully! Transaction: ${hash}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    const errorToShow = error || txError;
    if (errorToShow) {
      toast.dismiss();
      toast.error(`Error purchasing token: ${errorToShow.message || 'Unknown error'}`);
    }
  }, [error, txError]);

  const purchaseToken = (tokenAddress, amount) => {
    // Input validation
    if (!tokenAddress || tokenAddress === '0x0' || !tokenAddress.startsWith('0x')) {
      toast.error('Invalid token address');
      return;
    }
    
    const amountBigInt = BigInt(Math.floor(amount));
    if (amountBigInt <= 0n) {
      toast.error('Amount must be greater than 0');
      return;
    }

    toast.dismiss();
    toast.loading('Purchasing token...');
    
    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'purchaseToken',
      args: [tokenAddress, amountBigInt],
    });
  };

  return {
    purchaseToken,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || txError,
  };
};