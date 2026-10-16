import { NextResponse } from 'next/server';
import { MOCK_SHORTLISTS, MOCK_TENDERS, MOCK_STARTUPS } from '@/lib/data/mock-data';
import { ShortlistRecord } from '@/lib/types';
import { evaluateSmartTenderMatch } from '@/lib/ai/smart-matcher';

// In-memory persistent shortlist store for demo mode
// Note: lazy init avoids Turbopack circular module resolution issue
let _shortlistsInitialized = false;
let userShortlists: ShortlistRecord[] = [];

function ensureInitialized() {
  if (!_shortlistsInitialized) {
    if (Array.isArray(MOCK_SHORTLISTS) && MOCK_SHORTLISTS.length > 0) {
      userShortlists = [...MOCK_SHORTLISTS];
    } else if (MOCK_TENDERS.length > 0) {
      userShortlists = [
        {
          id: 'sl-1',
          userId: 'user-startup-1',
          startupId: 'startup-1',
          tenderId: MOCK_TENDERS[0].id,
          tender: MOCK_TENDERS[0],
          addedAt: '2026-10-14T10:30:00Z',
          matchScore: 97,
          eligibilityStatus: 'ELIGIBLE_PROVISIONAL',
          dataConfidence: 'HIGH',
          notes: 'Primary DRDO target. 100% EMD waiver confirmed. Signed NDA pending.'
        },
        {
          id: 'sl-2',
          userId: 'user-startup-1',
          startupId: 'startup-1',
          tenderId: MOCK_TENDERS[5]?.id || MOCK_TENDERS[1].id,
          tender: MOCK_TENDERS[5] || MOCK_TENDERS[1],
          addedAt: '2026-10-15T14:15:00Z',
          matchScore: 89,
          eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
          dataConfidence: 'HIGH',
          notes: 'ISRO FPGA edge units. Sub-zero flight test report required.'
        }
      ];
    }
    _shortlistsInitialized = true;
  }
}

export async function GET(request: Request) {
  ensureInitialized();
  const { searchParams } = new URL(request.url);
  const startupId = searchParams.get('startupId') || 'startup-1';

  const userItems = userShortlists.filter(s => s.startupId === startupId);
  return NextResponse.json({
    success: true,
    count: userItems.length,
    shortlist: userItems
  });
}

export async function POST(request: Request) {
  ensureInitialized();
  try {
    const body = await request.json();
    const { startupId, tenderId, notes, tags } = body;

    if (!startupId || !tenderId) {
      return NextResponse.json(
        { success: false, error: 'Both startupId and tenderId are required.' },
        { status: 400 }
      );
    }

    // Prevent duplicate entries
    const existing = userShortlists.find(s => s.startupId === startupId && s.tenderId === tenderId);
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message: 'Tender is already present in your shortlist.',
        record: existing
      });
    }

    const tender = MOCK_TENDERS.find(t => t.id === tenderId);
    const startup = MOCK_STARTUPS.find(s => s.id === startupId) || MOCK_STARTUPS[0];

    if (!tender) {
      return NextResponse.json(
        { success: false, error: 'Tender not found.' },
        { status: 404 }
      );
    }

    const evalResult = evaluateSmartTenderMatch(tender, startup);

    const newRecord: ShortlistRecord = {
      id: `sl-${Date.now()}`,
      userId: `user-${startupId}`,
      startupId,
      tenderId,
      tender,
      addedAt: new Date().toISOString(),
      matchScore: evalResult.matchScore,
      eligibilityStatus: evalResult.eligibilityStatus,
      dataConfidence: evalResult.dataConfidence,
      notes: notes || 'Shortlisted via AI Smart Tender Match',
      tags: tags || [tender.category, tender.sector]
    };

    userShortlists = [newRecord, ...userShortlists];

    return NextResponse.json({
      success: true,
      message: 'Tender successfully added to shortlist.',
      record: newRecord
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update shortlist.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  ensureInitialized();
  try {
    const { searchParams } = new URL(request.url);
    const startupId = searchParams.get('startupId') || 'startup-1';
    const tenderId = searchParams.get('tenderId');

    if (!tenderId) {
      return NextResponse.json(
        { success: false, error: 'tenderId query parameter is required.' },
        { status: 400 }
      );
    }

    userShortlists = userShortlists.filter(s => !(s.startupId === startupId && s.tenderId === tenderId));

    return NextResponse.json({
      success: true,
      message: 'Tender removed from shortlist.'
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete shortlist record.' },
      { status: 500 }
    );
  }
}
