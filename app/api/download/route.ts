import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    const productId = searchParams.get('productId');

    if (!wallet || !productId) {
      return NextResponse.json(
        { error: 'Missing wallet or productId' },
        { status: 400 }
      );
    }

    // Normalize wallet address
    const normalizedWallet = wallet.toLowerCase();

    // Check if user has purchased this item
    const purchaseKey = `purchase:${normalizedWallet}:${productId}`;
    const purchase = await kv.get(purchaseKey);

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found. Please complete payment first.' },
        { status: 403 }
      );
    }

    // Get the file path
    const filePath = join(process.cwd(), 'downloads', `${productId}.zip`);

    try {
      // Read the file
      const fileBuffer = await readFile(filePath);

      // Return the file with proper headers
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': `attachment; filename="${productId}.zip"`,
          'Cache-Control': 'no-cache',
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json(
        { error: 'File not found. Please contact support.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
