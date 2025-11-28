"use client";

import { useState } from "react";
import { ethers, BrowserProvider } from "ethers";

interface CryptoPaymentProps {
  amount: number;
  characterName: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

// Get payment wallet from env or use placeholder
const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET || "0xYourWalletAddressHere";

// Convert USD price to ETH (approximate, assuming $3000 per ETH)
function usdToEth(usdAmount: number): string {
  const ethPrice = 3000; // Update this based on current ETH price
  return (usdAmount / ethPrice).toFixed(4);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function CryptoPayment({ amount, characterName, onSuccess, onError }: CryptoPaymentProps) {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string>("");

  const hasMetaMask = typeof window !== "undefined" && window.ethereum;
  const ethAmount = usdToEth(amount);

  const connectWallet = async () => {
    if (!hasMetaMask) {
      alert("Please install MetaMask to pay with crypto");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      onError(err);
    }
  };

  const handlePayment = async () => {
    if (!walletAddress || !hasMetaMask) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsPaying(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: PAYMENT_WALLET,
        value: ethers.parseEther(ethAmount),
      });

      setTxHash(tx.hash);
      await tx.wait();

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      console.error("Transaction error:", err);
      onError(err);
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-gray-400 mb-4">
          {characterName} - {ethAmount} ETH (≈ ${amount.toFixed(2)} USD)
        </p>

        {!walletAddress ? (
          <div className="space-y-4">
            {hasMetaMask ? (
              <button
                onClick={connectWallet}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 rounded-lg font-bold transition-all"
              >
                Connect MetaMask
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400">MetaMask not detected</p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all"
                >
                  Install MetaMask
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPaying}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
            >
              {isPaying ? "Processing Transaction..." : `Pay ${ethAmount} ETH`}
            </button>

            {txHash && (
              <div className="bg-green-900/30 border border-green-500 p-3 rounded-lg">
                <p className="text-xs text-green-400 text-center break-all mb-2">
                  Transaction Hash: {txHash}
                </p>
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 underline"
                >
                  View on Etherscan
                </a>
              </div>
            )}

            <button
              onClick={() => setWalletAddress("")}
              className="w-full py-2 text-sm text-gray-400 hover:text-white transition-all"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
