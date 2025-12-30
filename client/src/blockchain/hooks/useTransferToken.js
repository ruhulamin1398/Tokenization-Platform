import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from './useAccount';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { blockchainConfig } from '../config';

export const useTransferToken = (onSuccess) => {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

  const transferToken = async (tokenAddress, amount, recipient) => {
    console.log('useTransferToken called with:', { tokenAddress, amount, recipient });

    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please fill in all fields');
      return;
    }

    // Validate recipient address
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast.error('Invalid recipient address');
      return;
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Invalid transfer amount');
      return;
    }

    if (!tokenAddress) {
      console.error('Token address is missing');
      toast.error('Token address is missing');
      return;
    }

    try {
      setIsTransferring(true);

      // Convert amount to token units (6 decimals like USDT)
      const amountInUnits = BigInt(Math.floor(amountValue * 1000000));

      console.log('Calling writeContract with:', {
        address: tokenAddress,
        functionName: 'transfer',
        args: [recipient, amountInUnits]
      });

      writeContract({
        address: tokenAddress,
        abi: [
          {
            "inputs": [
              {"name": "to", "type": "address"},
              {"name": "value", "type": "uint256"}
            ],
            "name": "transfer",
            "outputs": [{"name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'transfer',
        args: [recipient, amountInUnits],
      });

    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Failed to initiate transfer');
      setIsTransferring(false);
    }
  };

  // Handle successful transfer
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success('Token transfer successful!');
      setTransferAmount('');
      setRecipientAddress('');
      setIsTransferring(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isSuccess, hash, onSuccess]);

  // Handle transfer error
  useEffect(() => {
    if (txError) {
      console.error('Transfer transaction error:', txError);
      toast.error('Transfer failed');
      setIsTransferring(false);
    }
  }, [txError]);

  return {
    transferAmount,
    setTransferAmount,
    recipientAddress,
    setRecipientAddress,
    transferToken,
    isTransferring: isTransferring || isPending,
    isConfirming,
    isSuccess,
    error: error || txError
  };
};