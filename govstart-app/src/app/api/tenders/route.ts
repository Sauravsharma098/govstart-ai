import { NextResponse } from 'next/server';
import { MOCK_TENDERS } from '@/lib/data/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector');
  const query = searchParams.get('q');

  let filtered = [...MOCK_TENDERS];

  if (sector && sector !== 'ALL') {
    filtered = filtered.filter(t => t.sector.toLowerCase() === sector.toLowerCase());
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    tenders: filtered
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTender = {
      id: `tender-${Date.now()}`,
      referenceNumber: body.referenceNumber || `GOV/2026/${Math.floor(100 + Math.random() * 900)}`,
      title: body.title,
      department: body.department,
      ministry: body.ministry || 'Government of India',
      category: body.category || 'General Technology',
      sector: body.sector || 'Information Technology',
      description: body.description || '',
      estimatedBudgetInr: body.estimatedBudgetInr || 50000000,
      budgetString: body.budgetString || '₹5.00 Cr',
      emdAmountInr: body.emdAmountInr || 1000000,
      emdExemptForStartups: true,
      priorTurnoverExempt: true,
      priorExperienceExempt: true,
      publishDate: new Date().toISOString().split('T')[0],
      submissionDeadline: body.submissionDeadline || '2026-12-31',
      status: 'ACTIVE' as const,
      location: body.location || 'New Delhi, India',
      tags: body.tags || ['DeepTech', 'Indigenous'],
      eligibilityCriteria: body.eligibilityCriteria || ['DPIIT recognized entity'],
      clauses: body.clauses || []
    };

    return NextResponse.json({
      success: true,
      tender: newTender
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create tender'
    }, { status: 400 });
  }
}
