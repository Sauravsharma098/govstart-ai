import { NextResponse } from 'next/server';
import { calculateMatchScore } from '@/lib/ai/ai-service';

export async function POST(request: Request) {
  try {
    const { tender, startup, weights } = await request.json();
    if (!tender || !startup) {
      return NextResponse.json({ success: false, message: 'Missing tender or startup data' }, { status: 400 });
    }

    const match = calculateMatchScore(tender, startup, weights);
    return NextResponse.json({
      success: true,
      match
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Match computation failed' }, { status: 500 });
  }
}
