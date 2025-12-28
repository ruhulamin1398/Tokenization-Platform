import { useWriteContract } from 'wagmi';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { blockchainConfig } from '../config';

export const usePurchaseToken = () => {
  const { writeContract, data: hash, isPending, isSuccess, error } = useWriteContract();

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success(`Token purchased successfully! Transaction: ${hash}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(`Error purchasing token: ${error.message}`);
    }
  }, [error]);

  const purchaseToken = (tokenAddress, amount) => {
    toast.dismiss();
    toast.loading('Purchasing token...');
    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'purchaseToken',
      args: [tokenAddress, amount],
    });
  };

  return {
    purchaseToken,
    hash,
    isPending,
    isSuccess,
    error,
  };
};