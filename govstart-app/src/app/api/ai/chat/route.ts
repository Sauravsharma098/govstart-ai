import { NextResponse } from 'next/server';
import { answerTenderQuery } from '@/lib/ai/ai-service';
import { MOCK_TENDERS } from '@/lib/data/mock-data';

export async function POST(request: Request) {
  try {
    const { question, tenderId } = await request.json();
    if (!question) {
      return NextResponse.json({ success: false, message: 'Missing question' }, { status: 400 });
    }

    const tender = MOCK_TENDERS.find(t => t.id === tenderId) || MOCK_TENDERS[0];
    const result = answerTenderQuery(question, tender);

    return NextResponse.json({
      success: true,
      answer: result.answer,
      citations: result.citations
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'AI Chat failed' }, { status: 500 });
  }
}
