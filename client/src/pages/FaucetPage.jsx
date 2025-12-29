import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi'; 
import { toast } from 'react-toastify';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { blockchainConfig } from '../blockchain/config';

const FaucetPage = () => {
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

  React.useEffect(() => {
    if (isSuccess) {
      toast.success('USDT minted successfully!');
      setAmount('');
    }
    if (error) {
      toast.error(`Mint failed: ${error.message}`);
    }
  }, [isSuccess, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">USDT Faucet</h2>
          <p className="text-gray-400">Mint test USDT tokens to your wallet</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., 100"
              min="0"
              step="0.01"
            />
          </div>

          {!address ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Connect Wallet</span>
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <button
              onClick={handleMint}
              disabled={isPending || !amount}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
            >
              {isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Minting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Mint USDT</span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaucetPage;