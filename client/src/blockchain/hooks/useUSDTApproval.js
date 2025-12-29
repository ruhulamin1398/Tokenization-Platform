import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { blockchainConfig } from '../config';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { parseUnits, formatUnits, maxUint256 } from 'viem';

// ERC20 ABI for approve and allowance
const ERC20_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

export const useUSDTApproval = (requiredAmount) => {
  const { address } = useAccount();
  const requiredAmountBigInt = requiredAmount ? BigInt(requiredAmount) : 0n;

  // Check current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: blockchainConfig.USDT_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && blockchainConfig.FACTORY_CONTRACT_ADDRESS ? [address, blockchainConfig.FACTORY_CONTRACT_ADDRESS] : undefined,
    enabled: !!address && !!blockchainConfig.FACTORY_CONTRACT_ADDRESS && requiredAmountBigInt > 0n,
  });

  // Write contract for approval
  const { 
    writeContract: writeApprove, 
    data: approveHash, 
    isPending: isApproving,
    error: approveError 
  } = useWriteContract();

  // Wait for approval transaction
  const { 
    isLoading: isConfirmingApproval, 
    isSuccess: isApprovalSuccess,
    error: approvalTxError 
  } = useWaitForTransactionReceipt({
    hash: approveHash,
    enabled: !!approveHash,
  });

  // Check if approval is needed
  const needsApproval = allowance !== undefined && requiredAmountBigInt > 0n 
    ? allowance < requiredAmountBigInt 
    : false;

  // Request approval
  const requestApproval = (amount = null) => {
    const amountToApprove = amount ? BigInt(amount) : maxUint256;
    
    toast.dismiss();
    toast.loading('Requesting USDT approval...');
    
    writeApprove({
      address: blockchainConfig.USDT_CONTRACT_ADDRESS,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [blockchainConfig.FACTORY_CONTRACT_ADDRESS, amountToApprove],
    });
  };

  // Handle approval success/error
  useEffect(() => {
    if (isApprovalSuccess) {
      toast.dismiss();
      toast.success('USDT approval successful!');
      refetchAllowance();
    }
  }, [isApprovalSuccess, refetchAllowance]);

  useEffect(() => {
    if (approveError || approvalTxError) {
      toast.dismiss();
      const error = approveError || approvalTxError;
      toast.error(`Approval failed: ${error?.message || 'Unknown error'}`);
    }
  }, [approveError, approvalTxError]);

  return {
    allowance: allowance ? allowance.toString() : '0',
    needsApproval,
    requestApproval,
    isApproving: isApproving || isConfirmingApproval,
    isApprovalSuccess,
    approveError: approveError || approvalTxError,
    refetchAllowance,
  };
};

