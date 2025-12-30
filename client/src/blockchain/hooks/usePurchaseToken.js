import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { useAccount } from './useAccount';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { blockchainConfig } from '../config';
 
export const usePurchaseToken = () => {
  const [purchaseTokenAmount, setPurchaseTokenAmount] = useState(0);
  const [requiredUSDT, setRequiredUSDT] = useState(0);
  const [pendingPurchase, setPendingPurchase] = useState(null);
  const [isApprovalTx, setIsApprovalTx] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  
    const [quantity, setQuantity] = useState(1);

  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Fetch current USDT allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: blockchainConfig.USDT_CONTRACT_ADDRESS,
    abi:blockchainConfig.USDT_ABI,
    functionName: 'allowance',
    args: address && blockchainConfig.FACTORY_CONTRACT_ADDRESS ? [address, blockchainConfig.FACTORY_CONTRACT_ADDRESS] : undefined,
    enabled: !!address && !!blockchainConfig.FACTORY_CONTRACT_ADDRESS,
  });

  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError
  } = useWaitForTransactionReceipt({
    hash,
    enabled: !!hash,
  });

 
  useEffect(() => {
     const isNeedsApproval = allowance !== undefined && requiredUSDT > 0
    ? BigInt(allowance || 0) < BigInt(requiredUSDT)
    : false;
    setNeedsApproval(isNeedsApproval)

    console.log({isNeedsApproval, allowance, requiredUSDT})
  
  },[requiredUSDT, allowance]);

  // Handle approval success - proceed with pending purchase
  useEffect(() => {
    if (isSuccess && pendingPurchase && hash && isApprovalTx) {
      const { tokenAddress } = pendingPurchase;

      toast.dismiss();
      toast.loading('Purchasing token...');
      console.log("BigInt(purchaseTokenAmount)", BigInt(purchaseTokenAmount));

      writeContract({
        address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
        abi: blockchainConfig.TOKEN_FACTORY_ABI,
        functionName: 'purchaseToken',
        args: [tokenAddress, BigInt(purchaseTokenAmount)],
        gasLimit: 200000n,
      });

      setPendingPurchase(null);
      setIsApprovalTx(false);
    }
  }, [isSuccess, pendingPurchase, hash, writeContract, isApprovalTx, purchaseTokenAmount]);

  useEffect(() => {
    if (isSuccess && hash && !pendingPurchase && !isApprovalTx) {
      toast.dismiss();
      toast.success(`Token purchased successfully! Transaction: ${hash}`);
    }
  }, [isSuccess, hash, pendingPurchase, isApprovalTx]);

  useEffect(() => {
    const errorToShow = error || txError;
    if (errorToShow) {
      toast.dismiss();
      toast.error(`Transaction failed: ${errorToShow.message || 'Unknown error'}`);
      setIsApprovalTx(false);
      setPendingPurchase(null);
    }
  }, [error, txError]);

  const purchaseToken = (tokenAddress, amount) => {
    console.log("purchaseToken called with parameters tokenAddress, amount ", tokenAddress, amount);

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

    // Check if approval is needed
    if (needsApproval) {
      toast.dismiss();
      toast.loading('Requesting USDT approval...');
      setIsApprovalTx(true);
      console.log(" BigInt(requiredUSDT) ", BigInt(requiredUSDT));

      writeContract({
        address: blockchainConfig.USDT_CONTRACT_ADDRESS,
        abi: blockchainConfig.USDT_ABI,
        functionName: 'approve',
        args: [blockchainConfig.FACTORY_CONTRACT_ADDRESS, BigInt(requiredUSDT)],
        gasLimit: 100000n,
      });

      // Store purchase details for after approval
      setPendingPurchase({ tokenAddress, amount });
      return;
    }

    // Proceed with purchase if already approved
    toast.dismiss();
    toast.loading('Purchasing token...');
    console.log("Purchasing token with args:", tokenAddress, purchaseTokenAmount);

    writeContract({
      address: blockchainConfig.FACTORY_CONTRACT_ADDRESS,
      abi: blockchainConfig.TOKEN_FACTORY_ABI,
      functionName: 'purchaseToken',
      args: [tokenAddress, BigInt(purchaseTokenAmount)],
      gasLimit: 200000n,
    });
  };

  return {
    purchaseToken,
    needsApproval,
    allowance: allowance ? allowance.toString() : '0',
    refetchAllowance,
    purchaseTokenAmount,
    setPurchaseTokenAmount,
    requiredUSDT,
    setRequiredUSDT,
    quantity, setQuantity,
    hash,
    isPending: isPending || isConfirming,
    isSuccess: isSuccess && !pendingPurchase,
    error: error || txError,
  };
};