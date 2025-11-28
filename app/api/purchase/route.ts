import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const { wallet, productId, txHash } = await request.json();

    if (!wallet || !productId) {
      return NextResponse.json(
        { error: 'Missing wallet or productId' },
        { status: 400 }
      );
    }

    // Normalize wallet address to lowercase
    const normalizedWallet = wallet.toLowerCase();

    // Store purchase record
    const purchaseKey = `purchase:${normalizedWallet}:${productId}`;
    const purchaseData = {
      wallet: normalizedWallet,
      productId,
      purchasedAt: Date.now(),
      txHash: txHash || null,
    };

    await kv.set(purchaseKey, JSON.stringify(purchaseData));

    // Also add to user's purchase list
    const userPurchasesKey = `user:${normalizedWallet}:purchases`;
    await kv.sadd(userPurchasesKey, productId);

    return NextResponse.json({
      success: true,
      message: 'Purchase recorded successfully',
      download: `/api/download?wallet=${normalizedWallet}&productId=${productId}`,
    });
  } catch (error) {
    console.error('Purchase recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record purchase' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has purchased an item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const productId = searchParams.get('productId');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Missing wallet address' },
        { status: 400 }
      );
    }

    const normalizedWallet = wallet.toLowerCase();

    if (productId) {
      // Check specific product
      const purchaseKey = `purchase:${normalizedWallet}:${productId}`;
      const purchase = await kv.get(purchaseKey);

      return NextResponse.json({
        hasPurchased: !!purchase,
        purchase: purchase ? JSON.parse(purchase as string) : null,
      });
    } else {
      // Get all purchases for user
      const userPurchasesKey = `user:${normalizedWallet}:purchases`;
      const purchases = await kv.smembers(userPurchasesKey);

      return NextResponse.json({
        purchases: purchases || [],
      });
    }
  } catch (error) {
    console.error('Purchase check error:', error);
    return NextResponse.json(
      { error: 'Failed to check purchase' },
      { status: 500 }
    );
  }
}
