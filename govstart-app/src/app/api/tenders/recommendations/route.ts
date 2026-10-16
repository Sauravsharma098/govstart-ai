import { NextResponse } from 'next/server';
import { MOCK_TENDERS, MOCK_STARTUPS } from '@/lib/data/mock-data';
import { SmartScoringWeights } from '@/lib/types';
import { rankTendersForStartup, DEFAULT_SMART_WEIGHTS } from '@/lib/ai/smart-matcher';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const startupId = body.startupId || 'startup-1';
    const weights: SmartScoringWeights = body.weights || DEFAULT_SMART_WEIGHTS;
    const includeExpired = body.includeExpired || false;

    const startup = MOCK_STARTUPS.find(s => s.id === startupId) || MOCK_STARTUPS[0];
    const rankedRecommendations = rankTendersForStartup(MOCK_TENDERS, startup, weights, includeExpired);

    return NextResponse.json({
      success: true,
      startup: {
        id: startup.id,
        name: startup.name,
        sector: startup.sector,
        readinessScore: startup.readinessScore,
        incompleteProfile: !!startup.incompleteProfile
      },
      count: rankedRecommendations.length,
      recommendations: rankedRecommendations,
      lastRefreshedAt: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate recommendations.' },
      { status: 500 }
    );
  }
}
