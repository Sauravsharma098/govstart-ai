import { NextResponse } from 'next/server';
import { generateTenderSummary } from '@/lib/ai/ai-service';

export async function POST(request: Request) {
  try {
    const { tender } = await request.json();
    if (!tender) {
      return NextResponse.json({ success: false, message: 'Missing tender data' }, { status: 400 });
    }

    const summary = generateTenderSummary(tender);
    return NextResponse.json({
      success: true,
      summary
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Summarization failed' }, { status: 500 });
  }
}
