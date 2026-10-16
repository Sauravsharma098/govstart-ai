import { NextResponse } from 'next/server';
import { generateBidProposalDraft } from '@/lib/ai/ai-service';

export async function POST(request: Request) {
  try {
    const { tender, startup } = await request.json();
    if (!tender || !startup) {
      return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
    }

    const proposalMarkdown = generateBidProposalDraft(tender, startup);
    return NextResponse.json({
      success: true,
      proposalMarkdown
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Proposal drafting failed' }, { status: 500 });
  }
}
