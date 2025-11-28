"use client";

import { useState } from "react";
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface SolanaPaymentProps {
  amount: number;
  characterName: string;
  productId: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const PAYMENT_WALLET = "BatmsoasEdyzWubCxmpDrqktK3SWQYXoqjowct663o4t";
const SOL_USD_PRICE = 150; // Approximate SOL price in USD

function usdToSol(usdAmount: number): string {
  return (usdAmount / SOL_USD_PRICE).toFixed(6);
}

declare global {
  interface Window {
    solana?: any;
  }
}

export function SolanaPayment({ amount, characterName, productId, onSuccess, onError }: SolanaPaymentProps) {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [txSignature, setTxSignature] = useState<string>("");

  const hasPhantom = typeof window !== "undefined" && window.solana?.isPhantom;
  const solAmount = usdToSol(amount);

  const connectWallet = async () => {
    if (!hasPhantom) {
      alert("Please install Phantom wallet to pay with Solana");
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      const response = await window.solana.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (err) {
      console.error("Failed to connect Phantom:", err);
      onError(err);
    }
  };

  const handlePayment = async () => {
    if (!walletAddress || !hasPhantom) {
      alert("Please connect your Phantom wallet first");
      return;
    }

    try {
      setIsPaying(true);

      // Connect to Solana mainnet
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed");

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletAddress),
          toPubkey: new PublicKey(PAYMENT_WALLET),
          lamports: Math.floor(parseFloat(solAmount) * LAMPORTS_PER_SOL),
        })
      );

      transaction.feePayer = new PublicKey(walletAddress);
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const signed = await window.solana.signAndSendTransaction(transaction);
      setTxSignature(signed.signature);

      // Wait for confirmation
      await connection.confirmTransaction(signed.signature);

      // Record purchase
      try {
        await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet: walletAddress,
            productId: productId,
            txHash: signed.signature,
            chainId: "solana",
            chainName: "Solana",
            amount: solAmount,
            symbol: "SOL",
          }),
        });
      } catch (err) {
        console.error('Failed to record purchase:', err);
      }

      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err) {
      console.error("Solana transaction error:", err);
      onError(err);
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-purple-900/30 p-4 rounded-lg mb-4 border border-purple-500/30">
          <div className="text-3xl mb-2">◎</div>
          <p className="text-gray-400 text-sm mb-1">{characterName}</p>
          <p className="text-2xl font-bold text-purple-400">
            {solAmount} SOL
          </p>
          <p className="text-sm text-gray-500">≈ ${amount.toFixed(2)} USD</p>
        </div>

        {!walletAddress ? (
          <div className="space-y-4">
            {hasPhantom ? (
              <button
                onClick={connectWallet}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
              >
                <span>👻</span>
                Connect Phantom Wallet
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-red-400">Phantom wallet not detected</p>
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all"
                >
                  Install Phantom
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
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
            >
              {isPaying ? "Processing Transaction..." : `Pay ${solAmount} SOL`}
            </button>

            {txSignature && (
              <div className="bg-green-900/30 border border-green-500 p-3 rounded-lg">
                <p className="text-xs text-green-400 text-center break-all mb-2">
                  Transaction Signature: {txSignature}
                </p>
                <a
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 underline block text-center"
                >
                  View on Solscan
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
