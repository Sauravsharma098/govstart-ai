import { NextResponse } from 'next/server';
import { MOCK_TENDERS, MOCK_STARTUPS } from '@/lib/data/mock-data';
import { evaluateSmartTenderMatch } from '@/lib/ai/smart-matcher';

export async function POST(request: Request) {
  try {
    const { tenderIds, startupId } = await request.json();

    if (!tenderIds || !Array.isArray(tenderIds) || tenderIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one tenderId is required for comparison.' },
        { status: 400 }
      );
    }

    if (tenderIds.length > 3) {
      return NextResponse.json(
        { success: false, error: 'Maximum 3 tenders can be compared side-by-side.' },
        { status: 400 }
      );
    }

    const startup = MOCK_STARTUPS.find(s => s.id === (startupId || 'startup-1')) || MOCK_STARTUPS[0];
    const compared = tenderIds.map((id: string) => {
      const tender = MOCK_TENDERS.find(t => t.id === id);
      if (!tender) return null;
      return evaluateSmartTenderMatch(tender, startup);
    }).filter(Boolean);

    return NextResponse.json({
      success: true,
      startup: {
        id: startup.id,
        name: startup.name,
        sector: startup.sector
      },
      tendersCount: compared.length,
      comparison: compared
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Comparison failed.' },
      { status: 500 }
    );
  }
}
