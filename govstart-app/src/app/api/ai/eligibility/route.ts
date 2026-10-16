import { NextResponse } from 'next/server';
import { checkRegulatoryEligibility } from '@/lib/ai/ai-service';

export async function POST(request: Request) {
  try {
    const { tender, startup } = await request.json();
    if (!tender || !startup) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const eligibility = checkRegulatoryEligibility(tender, startup);
    return NextResponse.json({
      success: true,
      eligibility
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Eligibility analysis failed' }, { status: 500 });
  }
}
