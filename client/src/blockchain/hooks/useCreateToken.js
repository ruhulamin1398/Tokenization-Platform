import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { blockchainConfig } from '../config';
import { toast } from 'react-toastify';
import { useEffect } from 'react'; 
export const useCreateToken = () => {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess, 
    error: txError 
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

  const createToken = (name, symbol, description, maxSupply, price) => {
    // Input validation
    if (!name || !symbol || !description) {
      toast.error('All fields are required');
      return;
    }
    
    if (name.length > 50) {
      toast.error('Token name must be 50 characters or less');
      return;
    }
    
    if (symbol.length > 10) {
      toast.error('Token symbol must be 10 characters or less');
      return;
    }
    
    if (description.length > 500) {
      toast.error('Description must be 500 characters or less');
      return;
    }
    
    const maxSupplyBigInt = BigInt(Math.floor(maxSupply)*10**blockchainConfig.TOKEN_DECIMALS);
    if (maxSupplyBigInt <= 0n) {
      toast.error('Max supply must be greater than 0');
      return;
    }
    
    // Convert price to wei with proper decimals
    const formatedPrice = BigInt(price);
    if (formatedPrice <= 0n) {
      toast.error('Price must be greater than 0');
      return;
    }

    toast.dismiss();
    toast.loading('Creating token on blockchain...');
    console.log("Creating token with params: ",{name, symbol, description, maxSupplyBigInt, formatedPrice});
    
    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'createToken',
      args: [name, symbol, description, maxSupplyBigInt, formatedPrice],
    });
  };

  useEffect(() => {
    if (isSuccess && hash) {
      toast.dismiss();
      toast.success(`Token created successfully! Transaction: ${hash}`);
    }
  }, [isSuccess, hash]);

  useEffect(() => {
    const errorToShow = error || txError;
    if (errorToShow) {
      toast.dismiss();
      toast.error(`Error creating token: ${errorToShow.message || 'Unknown error'}`);
    }
  }, [error, txError]);

  return {
    createToken,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error: error || txError,
  };
};