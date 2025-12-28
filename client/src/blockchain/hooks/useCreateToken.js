import { useWriteContract } from 'wagmi';
import { blockchainConfig } from '../config';
import {toast} from 'react-toastify';
import { useEffect } from 'react';

export const useCreateToken = () => {
  const { writeContract, data: hash, isPending, isSuccess, error } = useWriteContract();

  const createToken = (name, symbol, description, maxSupply, price) => {
    toast.dismiss();
    toast.loading('Creating token on blockchain...');
    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'createToken',
      args: [name, symbol, description, maxSupply, price*10**6],
    });
    
  };

  useEffect(() => { 
    if(isSuccess){
        toast.dismiss();
        toast.success(`Token created successfully! Transaction: ${hash}`);
    }
    if(error){
        toast.dismiss();
        toast.error(`Error creating token: ${error.message}`);
    }
  }, [isSuccess, error]);

  return {
    createToken,
    hash,
    isPending,
    isSuccess,
    error,
  };
};