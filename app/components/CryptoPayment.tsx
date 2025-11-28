"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";

interface CryptoPaymentProps {
  amount: number;
  characterName: string;
  productId: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const PAYMENT_WALLET = process.env.NEXT_PUBLIC_PAYMENT_WALLET || "0x7092c339b172a0d13f38926ee8fe1c815663cfc9";

const SUPPORTED_CHAINS = {
  ethereum: {
    chainId: "0x1",
    chainIdNum: 1,
    name: "Ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://eth.llamarpc.com"],
    blockExplorerUrls: ["https://etherscan.io"],
    usdPrice: 3000,
  },
  polygon: {
    chainId: "0x89",
    chainIdNum: 137,
    name: "Polygon",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    usdPrice: 0.5,
  },
  avalanche: {
    chainId: "0xa86a",
    chainIdNum: 43114,
    name: "Avalanche",
    nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
    usdPrice: 25,
  },
  bsc: {
    chainId: "0x38",
    chainIdNum: 56,
    name: "BNB Smart Chain",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    usdPrice: 600,
  },
  arbitrum: {
    chainId: "0xa4b1",
    chainIdNum: 42161,
    name: "Arbitrum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    usdPrice: 3000,
  },
  optimism: {
    chainId: "0xa",
    chainIdNum: 10,
    name: "Optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    usdPrice: 3000,
  },
  base: {
    chainId: "0x2105",
    chainIdNum: 8453,
    name: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    usdPrice: 3000,
  },
};

type ChainKey = keyof typeof SUPPORTED_CHAINS;

function usdToNative(usdAmount: number, tokenPrice: number): string {
  return (usdAmount / tokenPrice).toFixed(6);
}

function getChainByChainId(chainId: number): ChainKey | null {
  for (const [key, chain] of Object.entries(SUPPORTED_CHAINS)) {
    if (chain.chainIdNum === chainId) {
      return key as ChainKey;
    }
  }
  return null;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function CryptoPayment({ amount, characterName, productId, onSuccess, onError }: CryptoPaymentProps) {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [currentChain, setCurrentChain] = useState<ChainKey>("ethereum");
  const [connectedChainId, setConnectedChainId] = useState<number | null>(null);

  const hasMetaMask = typeof window !== "undefined" && window.ethereum;
  const chainConfig = SUPPORTED_CHAINS[currentChain];
  const tokenAmount = usdToNative(amount, chainConfig.usdPrice);
  const isWrongChain = connectedChainId !== null && connectedChainId !== chainConfig.chainIdNum;

  useEffect(() => {
    if (hasMetaMask && walletAddress) {
      detectChain();
    }
  }, [walletAddress, hasMetaMask]);

  const detectChain = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setConnectedChainId(Number(network.chainId));

      const detectedChain = getChainByChainId(Number(network.chainId));
      if (detectedChain) {
        setCurrentChain(detectedChain);
      }
    } catch (err) {
      console.error("Failed to detect chain:", err);
    }
  };

  const switchChain = async (chainKey: ChainKey) => {
    if (!hasMetaMask) return;

    const chain = SUPPORTED_CHAINS[chainKey];

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain.chainId }],
      });
      setCurrentChain(chainKey);
      setConnectedChainId(chain.chainIdNum);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: chain.chainId,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: chain.rpcUrls,
              blockExplorerUrls: chain.blockExplorerUrls,
            }],
          });
          setCurrentChain(chainKey);
          setConnectedChainId(chain.chainIdNum);
        } catch (addError) {
          console.error("Failed to add chain:", addError);
          onError(addError);
        }
      } else {
        console.error("Failed to switch chain:", switchError);
        onError(switchError);
      }
    }
  };

  const connectWallet = async () => {
    if (!hasMetaMask) {
      alert("Please install MetaMask to pay with crypto");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      await detectChain();
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

    if (isWrongChain) {
      alert(`Please switch to ${chainConfig.name} network first`);
      return;
    }

    try {
      setIsPaying(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: PAYMENT_WALLET,
        value: ethers.parseEther(tokenAmount),
      });

      setTxHash(tx.hash);
      await tx.wait();

      try {
        await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet: walletAddress,
            productId: productId,
            txHash: tx.hash,
            chainId: chainConfig.chainIdNum,
            chainName: chainConfig.name,
            amount: tokenAmount,
            symbol: chainConfig.nativeCurrency.symbol,
          }),
        });
      } catch (err) {
        console.error('Failed to record purchase:', err);
      }

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
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-3">Select Payment Network</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => {
              const isSelected = currentChain === key;
              const isConnected = connectedChainId === chain.chainIdNum;

              return (
                <button
                  key={key}
                  onClick={() => walletAddress && switchChain(key as ChainKey)}
                  disabled={!walletAddress}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected
                      ? "bg-cyan-600/20 border-cyan-500 text-cyan-400"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  } ${!walletAddress ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="font-bold text-sm">{chain.nativeCurrency.symbol}</div>
                  <div className="text-xs">{chain.name}</div>
                  {isConnected && <div className="text-xs text-green-400 mt-1">● Connected</div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
          <p className="text-gray-400 text-sm mb-1">{characterName}</p>
          <p className="text-2xl font-bold text-cyan-400">
            {tokenAmount} {chainConfig.nativeCurrency.symbol}
          </p>
          <p className="text-sm text-gray-500">≈ ${amount.toFixed(2)} USD</p>
        </div>

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

            {isWrongChain && (
              <div className="bg-orange-900/30 border border-orange-500 p-3 rounded-lg">
                <p className="text-orange-400 text-sm mb-2">
                  Wrong network! Please switch to {chainConfig.name}
                </p>
                <button
                  onClick={() => switchChain(currentChain)}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-bold transition-all"
                >
                  Switch to {chainConfig.name}
                </button>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isPaying || isWrongChain}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
            >
              {isPaying
                ? "Processing Transaction..."
                : `Pay ${tokenAmount} ${chainConfig.nativeCurrency.symbol}`
              }
            </button>

            {txHash && (
              <div className="bg-green-900/30 border border-green-500 p-3 rounded-lg">
                <p className="text-xs text-green-400 text-center break-all mb-2">
                  Transaction Hash: {txHash}
                </p>
                <a
                  href={`${chainConfig.blockExplorerUrls[0]}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 underline block text-center"
                >
                  View on {chainConfig.name} Explorer
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
