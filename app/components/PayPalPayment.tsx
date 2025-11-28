"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalPaymentProps {
  amount: number;
  characterName: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

export function PayPalPayment({ amount, characterName, onSuccess, onError }: PayPalPaymentProps) {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return <div className="text-center py-4">Loading PayPal...</div>;
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: `PixelLab Character - ${characterName}`,
              amount: {
                currency_code: "USD",
                value: amount.toFixed(2),
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        if (actions.order) {
          const details = await actions.order.capture();
          console.log("PayPal payment completed:", details);
          onSuccess();
        }
      }}
      onError={(err) => {
        console.error("PayPal error:", err);
        onError(err);
      }}
    />
  );
}
