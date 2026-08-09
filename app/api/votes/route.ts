import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

function votersKey(productId: string) {
  return `votes:${productId}:voters`;
}

export async function POST(request: NextRequest) {
  try {
    const { productId, voterId } = await request.json();

    if (!productId || !voterId) {
      return NextResponse.json(
        { error: 'Missing productId or voterId' },
        { status: 400 }
      );
    }

    const key = votersKey(productId);
    const alreadyVoted = await kv.sismember(key, voterId);

    if (!alreadyVoted) {
      await kv.sadd(key, voterId);
    }

    const count = await kv.scard(key);

    return NextResponse.json({ success: true, count, alreadyVoted });
  } catch (error) {
    console.error('Vote recording error:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json({ error: 'Missing ids' }, { status: 400 });
    }

    const ids = idsParam.split(',').map((id) => id.trim()).filter(Boolean);
    const counts: Record<string, number> = {};

    await Promise.all(
      ids.map(async (id) => {
        counts[id] = await kv.scard(votersKey(id));
      })
    );

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Vote count fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote counts' },
      { status: 500 }
    );
  }
}
