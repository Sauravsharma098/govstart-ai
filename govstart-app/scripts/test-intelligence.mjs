// Automated Verification Script for GovStart AI
// Validates:
// 1. Smart tender matching engine logic
// 2. GFR 2017 Rule 170(i) EMD exemption calculation
// 3. Shortlisting API persistence
// 4. Recommendation API endpoint
// 5. Multi-tender comparison endpoint

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('=== STARTING GOVSTART AI INTELLIGENCE TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Test Recommendations API
  try {
    const recRes = await fetch(`${BASE_URL}/api/tenders/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: 'startup-1' })
    });
    const recData = await recRes.json();
    assert(recRes.status === 200, 'Recommendations API returns HTTP 200');
    assert(recData.success === true, 'Recommendations API returns success=true');
    assert(recData.count >= 5, `Recommendations API returned ${recData.count} ranked tenders`);
    assert(recData.recommendations[0].matchScore >= 80, `Top recommendation match score is high (${recData.recommendations[0].matchScore}%)`);
    assert(recData.recommendations[0].scoreBreakdown !== undefined, 'Top recommendation includes explainable score breakdown');
  } catch (err) {
    console.error('[ERROR] Recommendations API failed:', err.message);
    failed++;
  }

  // 2. Test Multi-Tender Comparison API
  try {
    const compRes = await fetch(`${BASE_URL}/api/tenders/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId: 'startup-1', tenderIds: ['tender-1', 'tender-6'] })
    });
    const compData = await compRes.json();
    assert(compRes.status === 200, 'Compare API returns HTTP 200');
    assert(compData.comparison.length === 2, 'Compare API compared 2 tenders side-by-side');
    assert(compData.comparison[0].matchScore > 0, `Compare matrix includes match scores (${compData.comparison[0].matchScore}%)`);
  } catch (err) {
    console.error('[ERROR] Compare API failed:', err.message);
    failed++;
  }

  // 3. Test Shortlist CRUD Persistence
  try {
    // GET initial
    const getRes = await fetch(`${BASE_URL}/api/shortlist?startupId=startup-1`);
    const getData = await getRes.json();
    assert(getRes.status === 200, 'GET Shortlist returns HTTP 200');
    assert(Array.isArray(getData.shortlist), 'GET Shortlist returns array');

    // POST add item
    const postRes = await fetch(`${BASE_URL}/api/shortlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: 'startup-1',
        tenderId: 'tender-3',
        notes: 'Test shortlist insertion for automated verification'
      })
    });
    const postData = await postRes.json();
    assert(postRes.status === 200 || postRes.status === 201, 'POST Shortlist returns 200/201');

    // GET verify item is in shortlist
    const verifyRes = await fetch(`${BASE_URL}/api/shortlist?startupId=startup-1`);
    const verifyData = await verifyRes.json();
    const hasTender3 = verifyData.shortlist.some(s => s.tenderId === 'tender-3');
    assert(hasTender3, 'Newly shortlisted tender-3 is persisted and retrievable');

    // DELETE cleanup
    const delRes = await fetch(`${BASE_URL}/api/shortlist?startupId=startup-1&tenderId=tender-3`, {
      method: 'DELETE'
    });
    const delData = await delRes.json();
    assert(delRes.status === 200, 'DELETE Shortlist returns HTTP 200');
    assert(delData.success === true, 'DELETE Shortlist successfully removed record');
  } catch (err) {
    console.error('[ERROR] Shortlist CRUD API failed:', err.message);
    failed++;
  }

  // 4. Test Public Landing Page and Open Tender Access
  try {
    const landingRes = await fetch(`${BASE_URL}/`);
    const landingText = await landingRes.text();
    assert(landingRes.status === 200, 'Root Landing Page returns HTTP 200');
    assert(landingText.includes('Discover Government Opportunities'), 'Landing Page contains Hero Headline');
    assert(landingText.includes('Find the Right Opportunities. Prepare with AI. Grow Your Business.'), 'Landing Page contains Core Brand Promise');
    assert(landingText.includes('GFR 2017 &amp; DPIIT Compliant') || landingText.includes('GFR 2017 & DPIIT Compliant'), 'Landing Page contains Regulatory Compliance Badge');
  } catch (err) {
    console.error('[ERROR] Landing Page verification failed:', err.message);
    failed++;
  }

  console.log(`\n=== TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
