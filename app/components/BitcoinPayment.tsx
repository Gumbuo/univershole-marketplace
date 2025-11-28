"use client";

import { useState } from "react";

interface BitcoinPaymentProps {
  amount: number;
  characterName: string;
  productId: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const BITCOIN_ADDRESS = "bc1qtrlyljq0kxt8fu0pevsmyw34qnvrwh8jgt77vu";
const BTC_USD_PRICE = 90000; // Approximate BTC price in USD

function usdToBtc(usdAmount: number): string {
  return (usdAmount / BTC_USD_PRICE).toFixed(8);
}

export function BitcoinPayment({ amount, characterName, productId, onSuccess, onError }: BitcoinPaymentProps) {
  const [txId, setTxId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const btcAmount = usdToBtc(amount);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${BITCOIN_ADDRESS}?amount=${btcAmount}`;

  const handleSubmit = async () => {
    if (!txId || txId.length < 10) {
      alert("Please enter a valid Bitcoin transaction ID");
      return;
    }

    try {
      setIsSubmitting(true);

      // Record purchase
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: BITCOIN_ADDRESS,
          productId: productId,
          txHash: txId,
          chainId: "bitcoin",
          chainName: "Bitcoin",
          amount: btcAmount,
          symbol: "BTC",
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        throw new Error("Failed to record purchase");
      }
    } catch (err) {
      console.error("Bitcoin payment error:", err);
      onError(err);
      setIsSubmitting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(BITCOIN_ADDRESS);
    alert("Bitcoin address copied to clipboard!");
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(btcAmount);
    alert("Amount copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-orange-900/30 p-4 rounded-lg mb-4 border border-orange-500/30">
          <div className="text-3xl mb-2">₿</div>
          <p className="text-gray-400 text-sm mb-1">{characterName}</p>
          <p className="text-2xl font-bold text-orange-400">
            {btcAmount} BTC
          </p>
          <p className="text-sm text-gray-500">≈ ${amount.toFixed(2)} USD</p>
        </div>

        {showInstructions && (
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-4 text-left">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-blue-400">How to Pay with Bitcoin</h4>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>Scan the QR code below or copy the address</li>
              <li>Send exactly {btcAmount} BTC from your wallet</li>
              <li>Copy your transaction ID from your wallet</li>
              <li>Paste it below and click Submit</li>
            </ol>
          </div>
        )}

        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg inline-block mb-4">
          <img src={qrCodeUrl} alt="Bitcoin QR Code" className="w-48 h-48" />
        </div>

        {/* Bitcoin Address */}
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400 mb-2">Send Bitcoin to:</p>
          <div className="flex items-center gap-2">
            <p className="text-white font-mono text-xs break-all flex-1">{BITCOIN_ADDRESS}</p>
            <button
              onClick={copyAddress}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-gray-800 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-400 mb-2">Amount to send:</p>
          <div className="flex items-center gap-2 justify-center">
            <p className="text-white font-mono text-lg">{btcAmount} BTC</p>
            <button
              onClick={copyAmount}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-3">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Paste your transaction ID:</p>
            <input
              type="text"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="Enter Bitcoin transaction ID..."
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Find this in your wallet after sending the payment
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !txId}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
          >
            {isSubmitting ? "Verifying..." : "Submit Payment"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            Your download will be available after we verify the transaction
          </p>
        </div>
      </div>
    </div>
  );
}
