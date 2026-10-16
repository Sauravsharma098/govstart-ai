import { NextResponse } from 'next/server';
import { answerDocumentQuery } from '@/lib/ai/tender-pdf-analyzer';
import { TenderAnalysisResult } from '@/lib/types/analysis';

export async function POST(request: Request) {
  try {
    const { question, rawText, analysis } = await request.json();

    if (!question || !question.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question parameter cannot be empty.' },
        { status: 400 }
      );
    }

    const response = answerDocumentQuery(
      question,
      rawText || '',
      analysis as TenderAnalysisResult
    );

    return NextResponse.json({
      success: true,
      message: response
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process document question.' },
      { status: 500 }
    );
  }
}
