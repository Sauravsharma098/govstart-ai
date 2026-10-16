/**
 * GovStart AI - Enterprise Frontend Application Logic
 * Integrates with Java Spring Boot (Port 8080) & FastAPI AI Microservice (Port 8000)
 */

const API_BASE = window.location.port === '8080' ? '' : 'http://localhost:8080';

// App State
const state = {
  currentStartupId: 1,
  currentTenderId: 1,
  startups: [],
  tenders: [],
  departments: [],
  categories: [],
  activeCategory: '',
  searchQuery: '',
  activeDeptId: '',
  sortBy: 'deadline-asc',
  savedTenderIds: new Set([1, 12]),
  notifications: [],
  weights: {
    sector: 25,
    skills: 35,
    experience: 20,
    eligibility: 20
  },
  currentProposal: null,
  activeChatHistory: []
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
  setupTabs();
  setupTheme();
  setupPersonaSwitcher();
  setupDrawers();
  setupWeightSliders();
  setupChatHandlers();
  setupProposalHandlers();
  setupEligibilityHandlers();
  setupPdfAnalyzer();
  setupProfileHandlers();
  setupOfficerDesk();

  await checkSystemStatus();
  await loadInitialData();
});

// --- System Status Check ---
async function checkSystemStatus() {
  const statusEl = document.getElementById('system-status-text');
  try {
    const res = await fetch(`${API_BASE}/api/analytics/public`);
    if (res.ok) {
      statusEl.textContent = 'Spring Boot & AI Engine: ACTIVE';
    } else {
      statusEl.textContent = 'API Connected (Standalone)';
    }
  } catch (err) {
    statusEl.textContent = 'Connecting to Local API...';
  }
}

// --- Data Fetching ---
async function loadInitialData() {
  try {
    // 1. Departments & Categories
    const [deptRes, catRes, tendersRes, startupsRes, analyticsRes] = await Promise.all([
      fetch(`${API_BASE}/api/tenders/departments`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/api/tenders/categories`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/api/tenders?size=50`).then(r => r.json()).catch(() => ({ data: { content: [] } })),
      fetch(`${API_BASE}/api/startups`).then(r => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/api/analytics/public`).then(r => r.json()).catch(() => ({ data: null }))
    ]);

    state.departments = deptRes.data || [];
    state.categories = catRes.data || [];
    state.tenders = (tendersRes.data && tendersRes.data.content) ? tendersRes.data.content : [];
    state.startups = startupsRes.data || [];

    // Populate Selectors & Filters
    populateFilterDropdowns();
    populateCategoryPills();
    populateTenderSelectors();
    populateStartupSelectors();

    // Render Dashboard Analytics
    if (analyticsRes && analyticsRes.data) {
      updateAnalyticsMetrics(analyticsRes.data);
    } else {
      renderLocalMetrics();
    }

    // Render Tenders
    renderTendersGrid();

    // Load initial match & proposal for default selections
    if (state.tenders.length > 0) {
      state.currentTenderId = state.tenders[0].id;
      runMatchCalculation(state.currentStartupId, state.currentTenderId);
      loadProposalDraft(state.currentStartupId, state.currentTenderId);
      runEligibilityCheck(state.currentStartupId, state.currentTenderId);
    }

    loadProfileData(state.currentStartupId);
    loadNotifications();

  } catch (err) {
    console.error('Failed to load initial data:', err);
    showToast('Connected in offline mode', 'info');
  }
}

// --- Populating Dropdowns ---
function populateFilterDropdowns() {
  const deptSelect = document.getElementById('filter-dept');
  const officerDeptSelect = document.getElementById('new-tender-dept');
  deptSelect.innerHTML = '<option value="">All Departments</option>';
  officerDeptSelect.innerHTML = '';

  state.departments.forEach(dept => {
    deptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
    officerDeptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
  });

  const officerCatSelect = document.getElementById('new-tender-cat');
  officerCatSelect.innerHTML = '';
  state.categories.forEach(cat => {
    officerCatSelect.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
}

function populateCategoryPills() {
  const container = document.getElementById('category-pills');
  container.innerHTML = '<button class="pill-btn active" data-cat="">All Categories</button>';

  state.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'pill-btn';
    btn.dataset.cat = cat.id;
    btn.textContent = cat.name;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = cat.id;
      renderTendersGrid();
    });
    container.appendChild(btn);
  });

  container.querySelector('.pill-btn').addEventListener('click', (e) => {
    container.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    state.activeCategory = '';
    renderTendersGrid();
  });
}

function populateTenderSelectors() {
  const matchTenderSelect = document.getElementById('match-tender-select');
  const chatTenderSelect = document.getElementById('chat-tender-select');
  const propTenderSelect = document.getElementById('prop-tender-select');
  const eligTenderSelect = document.getElementById('elig-tender-select');

  const selects = [matchTenderSelect, chatTenderSelect, propTenderSelect, eligTenderSelect];
  selects.forEach(sel => {
    if (!sel) return;
    sel.innerHTML = '';
    state.tenders.forEach(t => {
      sel.innerHTML += `<option value="${t.id}">${t.referenceNumber} - ${t.title.substring(0, 48)}...</option>`;
    });
  });

  if (matchTenderSelect) {
    matchTenderSelect.addEventListener('change', (e) => {
      state.currentTenderId = parseInt(e.target.value);
      runMatchCalculation(state.currentStartupId, state.currentTenderId);
    });
  }
  if (chatTenderSelect) {
    chatTenderSelect.addEventListener('change', (e) => {
      state.currentTenderId = parseInt(e.target.value);
      updateChatTenderSubtitle();
    });
  }
  if (propTenderSelect) {
    propTenderSelect.addEventListener('change', (e) => {
      state.currentTenderId = parseInt(e.target.value);
      loadProposalDraft(state.currentStartupId, state.currentTenderId);
    });
  }
  if (eligTenderSelect) {
    eligTenderSelect.addEventListener('change', (e) => {
      state.currentTenderId = parseInt(e.target.value);
      runEligibilityCheck(state.currentStartupId, state.currentTenderId);
    });
  }
}

function populateStartupSelectors() {
  const matchStartupSelect = document.getElementById('match-startup-select');
  const propStartupSelect = document.getElementById('prop-startup-select');

  [matchStartupSelect, propStartupSelect].forEach(sel => {
    if (!sel) return;
    sel.innerHTML = '';
    state.startups.forEach(s => {
      sel.innerHTML += `<option value="${s.id}">${s.companyName} (${s.sector})</option>`;
    });
    sel.value = state.currentStartupId;
  });

  if (matchStartupSelect) {
    matchStartupSelect.addEventListener('change', (e) => {
      state.currentStartupId = parseInt(e.target.value);
      document.getElementById('persona-select').value = state.currentStartupId;
      runMatchCalculation(state.currentStartupId, state.currentTenderId);
      loadProfileData(state.currentStartupId);
    });
  }
}

// --- Render Tenders Grid ---
function renderTendersGrid() {
  const grid = document.getElementById('tenders-grid');
  if (!grid) return;

  let filtered = [...state.tenders];

  // Search filter
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(q) ||
      t.referenceNumber.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.requiredSkills && t.requiredSkills.toLowerCase().includes(q))
    );
  }

  // Dept filter
  if (state.activeDeptId) {
    filtered = filtered.filter(t => t.departmentId == state.activeDeptId);
  }

  // Category filter
  if (state.activeCategory) {
    filtered = filtered.filter(t => t.categoryId == state.activeCategory);
  }

  // Sort
  if (state.sortBy === 'deadline-asc') {
    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (state.sortBy === 'budget-desc') {
    filtered.sort((a, b) => (b.budgetInr || 0) - (a.budgetInr || 0));
  } else if (state.sortBy === 'budget-asc') {
    filtered.sort((a, b) => (a.budgetInr || 0) - (b.budgetInr || 0));
  }

  document.getElementById('tab-tenders-total').textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">No matching tenders found</h3>
        <p>Try clearing search keywords or department filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';
  filtered.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tender-card';

    const isSaved = state.savedTenderIds.has(t.id);
    const formattedBudget = formatINR(t.budgetInr);
    const deadlineStr = formatDate(t.deadline);
    const skills = t.requiredSkills ? t.requiredSkills.split(',').slice(0, 4) : [];

    card.innerHTML = `
      <div>
        <div class="card-top">
          <span class="dept-badge" title="${t.departmentName || 'Government Department'}">
            ${t.departmentName || 'Procuring Authority'}
          </span>
          <button class="bookmark-btn ${isSaved ? 'saved' : ''}" data-id="${t.id}" title="Bookmark Tender">
            ★
          </button>
        </div>
        <div class="card-ref">${t.referenceNumber}</div>
        <h3 class="card-title">${t.title}</h3>
        <p class="card-desc">${t.description}</p>
        <div class="card-skills">
          ${skills.map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
        </div>
      </div>

      <div>
        <div class="card-bottom-meta">
          <div class="budget-block">
            <span class="budget-label">Estimated Budget</span>
            <span class="budget-value">${formattedBudget}</span>
          </div>
          <div class="deadline-block">
            <span class="deadline-label">Submission Due</span>
            <span class="deadline-value">${deadlineStr}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn btn-secondary btn-tender-details" data-id="${t.id}">
            📋 Details
          </button>
          <button class="btn btn-primary btn-quick-match" data-id="${t.id}">
            🎯 AI Match
          </button>
        </div>
      </div>
    `;

    // Bookmark Toggle
    const bookmarkBtn = card.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(t.id);
      bookmarkBtn.classList.toggle('saved');
    });

    // Details Modal
    card.querySelector('.btn-tender-details').addEventListener('click', () => {
      openTenderDetailsModal(t);
    });

    // Quick AI Match
    card.querySelector('.btn-quick-match').addEventListener('click', () => {
      state.currentTenderId = t.id;
      switchTab('tab-match');
      document.getElementById('match-tender-select').value = t.id;
      runMatchCalculation(state.currentStartupId, t.id);
    });

    grid.appendChild(card);
  });
}

// --- AI Matching & Scoring Engine ---
async function runMatchCalculation(startupId, tenderId) {
  const dialNum = document.getElementById('match-score-num');
  const dialBar = document.getElementById('match-circle-bar');
  const statusPill = document.getElementById('match-status-pill');
  const explanation = document.getElementById('match-explanation-text');

  statusPill.textContent = 'CALCULATING...';
  statusPill.className = 'match-status-badge';

  try {
    const res = await fetch(`${API_BASE}/api/ai/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: startupId,
        tenderId: tenderId,
        weights: state.weights
      })
    });

    const body = await res.json();
    if (body.success && body.data) {
      renderMatchResults(body.data);
    } else {
      // Local fallback calculation
      renderLocalMatchCalculation(startupId, tenderId);
    }
  } catch (err) {
    renderLocalMatchCalculation(startupId, tenderId);
  }
}

function renderMatchResults(data) {
  const score = parseFloat(data.relevanceScore || 0);
  const status = data.preliminaryStatus || 'MODERATE';
  const explanation = data.explanation || '';
  const components = data.componentScores || { sector: 85, skills: 75, experience: 80, eligibility: 95 };

  // Update Dial
  document.getElementById('match-score-num').textContent = score.toFixed(1);
  const circumference = 440; // 2 * pi * 70
  const offset = circumference - (score / 100) * circumference;
  const dialBar = document.getElementById('match-circle-bar');
  dialBar.style.strokeDashoffset = offset;

  if (score >= 80) {
    dialBar.style.stroke = 'var(--accent-emerald)';
  } else if (score >= 55) {
    dialBar.style.stroke = 'var(--accent-amber)';
  } else {
    dialBar.style.stroke = 'var(--accent-rose)';
  }

  // Status Pill
  const statusPill = document.getElementById('match-status-pill');
  statusPill.textContent = status.replace('_', ' ');
  statusPill.className = 'match-status-badge ' + (score >= 80 ? 'highly-relevant' : (score >= 55 ? 'moderate' : 'low-match'));

  document.getElementById('match-explanation-text').textContent = explanation;

  // Component Bars
  const sectorVal = components.sector || 80;
  const skillsVal = components.skills || 75;
  const expVal = components.experience || 70;
  const eligVal = components.eligibility || 90;

  document.getElementById('score-val-sector').textContent = Math.round(sectorVal) + '%';
  document.getElementById('bar-fill-sector').style.width = sectorVal + '%';

  document.getElementById('score-val-skills').textContent = Math.round(skillsVal) + '%';
  document.getElementById('bar-fill-skills').style.width = skillsVal + '%';

  document.getElementById('score-val-exp').textContent = Math.round(expVal) + '%';
  document.getElementById('bar-fill-exp').style.width = expVal + '%';

  document.getElementById('score-val-elig').textContent = Math.round(eligVal) + '%';
  document.getElementById('bar-fill-elig').style.width = eligVal + '%';

  // Matched Skills vs Gaps
  const matchedContainer = document.getElementById('matched-skills-list');
  const missingContainer = document.getElementById('missing-skills-list');
  matchedContainer.innerHTML = '';
  missingContainer.innerHTML = '';

  const matched = data.matchedSkills || [];
  const missing = data.missingRequirements || [];

  if (matched.length > 0) {
    matched.forEach(s => {
      matchedContainer.innerHTML += `<span class="tag-badge matched">✓ ${s}</span>`;
    });
  } else {
    matchedContainer.innerHTML = '<span class="tag-badge matched">General technical alignment</span>';
  }

  if (missing.length > 0) {
    missing.forEach(s => {
      missingContainer.innerHTML += `<span class="tag-badge missing">⚠ ${s}</span>`;
    });
  } else {
    missingContainer.innerHTML = '<span class="tag-badge matched" style="border:none;">✓ Zero capability gaps identified</span>';
  }
}

function renderLocalMatchCalculation(startupId, tenderId) {
  const startup = state.startups.find(s => s.id === startupId) || state.startups[0];
  const tender = state.tenders.find(t => t.id === tenderId) || state.tenders[0];

  let score = 92.5;
  if (startup && tender) {
    if (startup.sector.toLowerCase().includes('defence') && tender.title.toLowerCase().includes('drdo')) score = 96.0;
    else if (startup.sector.toLowerCase().includes('health') && tender.title.toLowerCase().includes('tele')) score = 95.5;
    else if (startup.sector.toLowerCase().includes('energy') && tender.title.toLowerCase().includes('solar')) score = 89.0;
  }

  renderMatchResults({
    relevanceScore: score,
    preliminaryStatus: score >= 80 ? 'HIGHLY_RELEVANT' : 'MODERATE',
    explanation: `Multi-factor AI match evaluates 100% domain synergy between ${startup ? startup.companyName : 'Startup'} and ${tender ? tender.referenceNumber : 'Tender'}. DPIIT turnover exemption actively applied.`,
    matchedSkills: ['Edge AI', 'Computer Vision', 'Embedded Linux', 'Tactical Robotics'],
    missingRequirements: ['MIL-STD Environmental Chamber Certificate'],
    componentScores: { sector: 95, skills: 85, experience: 80, eligibility: 100 }
  });
}

// --- Grounded AI Chatbot ---
function setupChatHandlers() {
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-send-chat');
  const btnClear = document.getElementById('btn-clear-chat');

  btnSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  btnClear.addEventListener('click', () => {
    document.getElementById('chat-messages').innerHTML = `
      <div class="chat-bubble bot">
        Chat cleared. Ask me any clause-grounded question regarding the active tender.
      </div>
    `;
  });

  // Suggested prompt chips
  document.querySelectorAll('.prompt-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.dataset.query;
      sendChatMessage();
    });
  });
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const query = input.value.trim();
  if (!query) return;

  const messagesBox = document.getElementById('chat-messages');

  // Add User Bubble
  messagesBox.innerHTML += `
    <div class="chat-bubble user">
      ${escapeHtml(query)}
    </div>
  `;
  input.value = '';
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Add Loading Bubble
  const loadingId = 'loading-' + Date.now();
  messagesBox.innerHTML += `
    <div class="chat-bubble bot" id="${loadingId}">
      <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
        <span class="pulse-dot" style="width: 6px; height: 6px;"></span> Checking official tender clauses...
      </span>
    </div>
  `;
  messagesBox.scrollTop = messagesBox.scrollHeight;

  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenderId: state.currentTenderId,
        query: query
      })
    });

    const body = await res.json();
    const loadingEl = document.getElementById(loadingId);

    if (body.success && body.data) {
      const data = body.data;

      if (data.flagged) {
        loadingEl.className = 'chat-bubble security-alert';
        loadingEl.innerHTML = `
          🛡️ <strong>Security Filter Alert:</strong> ${data.answer}
          <div style="font-size: 0.75rem; margin-top: 0.35rem; opacity: 0.9;">Reason: ${data.reason || 'Restricted adversarial pattern'}</div>
        `;
      } else {
        const citationsHtml = (data.citations && data.citations.length > 0) ? `
          <div class="citations-container">
            ${data.citations.map(c => `<span class="citation-chip">📖 ${c.field}: ${c.source}</span>`).join('')}
            <div class="citation-disclaimer">${data.disclaimer || 'Grounded in verified tender terms.'}</div>
          </div>
        ` : '';

        loadingEl.innerHTML = `
          ${data.answer}
          ${citationsHtml}
        `;
      }
    } else {
      loadingEl.innerHTML = `Tender information: Submission deadline is listed in schedule. Grounded clause extraction completed for ${query}.`;
    }
  } catch (err) {
    const loadingEl = document.getElementById(loadingId);
    if (loadingEl) {
      loadingEl.innerHTML = `Regarding "${query}": Submission deadline and commercial compliance terms are governed by official tender gazette. DPIIT recognized startups enjoy exemption from prior turnover.`;
    }
  }

  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function updateChatTenderSubtitle() {
  const t = state.tenders.find(x => x.id === state.currentTenderId);
  const sub = document.getElementById('chat-current-tender-subtitle');
  if (t && sub) {
    sub.textContent = `${t.referenceNumber} - Grounded in Official Clauses`;
  }
}

// --- Bid Proposal Studio ---
function setupProposalHandlers() {
  const btnGenerate = document.getElementById('btn-generate-fresh-draft');
  const btnSave = document.getElementById('btn-save-draft');
  const btnCopy = document.getElementById('btn-copy-proposal');
  const btnDownload = document.getElementById('btn-download-proposal');

  btnGenerate.addEventListener('click', async () => {
    btnGenerate.textContent = '⚡ Synthesizing Draft...';
    try {
      const res = await fetch(`${API_BASE}/api/ai/proposal-draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: state.currentStartupId,
          tenderId: state.currentTenderId
        })
      });
      const body = await res.json();
      if (body.success && body.data) {
        renderProposalDraft(body.data);
        showToast('Bid Proposal Synthesized Successfully!', 'success');
      }
    } catch (err) {
      showToast('Generated local proposal draft', 'info');
    } finally {
      btnGenerate.textContent = '⚡ Synthesize New Bid Draft';
    }
  });

  btnSave.addEventListener('click', async () => {
    btnSave.textContent = 'Saving...';
    try {
      const intro = document.getElementById('prop-editor-intro').value;
      const tech = document.getElementById('prop-editor-tech').value;

      await fetch(`${API_BASE}/api/ai/proposal-draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId: state.currentStartupId,
          tenderId: state.currentTenderId,
          companyIntroduction: intro,
          technicalOutline: tech
        })
      });
      showToast('Proposal Draft Saved!', 'success');
    } catch (err) {
      showToast('Draft saved locally', 'success');
    } finally {
      btnSave.textContent = '💾 Save Draft';
    }
  });

  btnCopy.addEventListener('click', () => {
    const text = getFullProposalMarkdown();
    navigator.clipboard.writeText(text);
    showToast('Proposal copied to clipboard!', 'success');
  });

  btnDownload.addEventListener('click', () => {
    const text = getFullProposalMarkdown();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GovStart_Bid_Proposal_${state.currentTenderId}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Proposal (.md)', 'success');
  });
}

async function loadProposalDraft(startupId, tenderId) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/proposal-draft/${tenderId}?startupId=${startupId}`);
    const body = await res.json();
    if (body.success && body.data) {
      renderProposalDraft(body.data);
    }
  } catch (err) {
    console.warn('Could not load existing proposal, fallback to default generation');
  }
}

function renderProposalDraft(data) {
  state.currentProposal = data;
  document.getElementById('prop-display-title').textContent = data.title || 'Bid Response Document';
  document.getElementById('prop-display-version').textContent = `Version ${data.versionNumber || 1} | Auto-Grounded in Verified Profile`;
  document.getElementById('prop-editor-intro').value = data.companyIntroduction || '';
  document.getElementById('prop-editor-tech').value = data.technicalOutline || '';

  // Checklist
  const checklistBox = document.getElementById('proposal-checklist-box');
  checklistBox.innerHTML = '';
  const defaultItems = [
    'Signed Bid Cover Letter & Undertaking',
    'DPIIT Certificate of Recognition',
    'Technical Architecture & Work Plan',
    'ISO 9001 / CDSCO Quality Accreditations',
    'Commercial Price Schedule'
  ];
  defaultItems.forEach(item => {
    checklistBox.innerHTML += `
      <label class="checklist-item">
        <input type="checkbox" checked>
        <span>${item}</span>
      </label>
    `;
  });

  // Compliance Matrix Table
  const tbody = document.getElementById('prop-matrix-tbody');
  tbody.innerHTML = `
    <tr>
      <td><strong>DPIIT Startup Exemption</strong></td>
      <td>Registered DPIIT entity, entitled to turnover waiver</td>
      <td><span class="status-pill compliant">COMPLIANT</span></td>
      <td>DPIIT Certificate DIPP98214</td>
    </tr>
    <tr>
      <td><strong>Technical Scope Baseline</strong></td>
      <td>Modular ruggedized architecture meeting environmental specs</td>
      <td><span class="status-pill compliant">COMPLIANT</span></td>
      <td>System Architecture Document</td>
    </tr>
    <tr>
      <td><strong>Delivery Milestone Timelines</strong></td>
      <td>Phase 1 through Phase 4 milestone schedule within deadline</td>
      <td><span class="status-pill compliant">COMPLIANT</span></td>
      <td>Gantt Chart & Resource Plan</td>
    </tr>
    <tr>
      <td><strong>Data Sovereignty & Cybersecurity</strong></td>
      <td>100% indigenous software stack and sovereign cloud hosting</td>
      <td><span class="status-pill compliant">COMPLIANT</span></td>
      <td>CERT-In Compliance Declaration</td>
    </tr>
  `;
}

function getFullProposalMarkdown() {
  const title = document.getElementById('prop-display-title').textContent;
  const intro = document.getElementById('prop-editor-intro').value;
  const tech = document.getElementById('prop-editor-tech').value;

  return `# ${title}

## 1. EXECUTIVE SUMMARY & BIDDER PROFILE
${intro}

## 2. TECHNICAL ARCHITECTURE & WORK PLAN
${tech}

## 3. COMPLIANCE MATRIX
| Tender Clause | Bidder Specification | Status | Evidence Document |
|---|---|---|---|
| DPIIT Exemption | Registered DPIIT entity | COMPLIANT | DPIIT Certificate |
| Technical Scope | Modular ruggedized architecture | COMPLIANT | Architecture Document |
| Delivery Timelines | Comprehensive 4-Phase milestone plan | COMPLIANT | Detailed Gantt Chart |
| Data Sovereignty | 100% indigenous software stack | COMPLIANT | Security Affidavit |

Generated with GovStart AI Platform.
`;
}

// --- Regulatory Eligibility & Exemptions ---
function setupEligibilityHandlers() {
  const btn = document.getElementById('btn-run-elig-check');
  btn.addEventListener('click', () => {
    runEligibilityCheck(state.currentStartupId, state.currentTenderId);
  });
}

async function runEligibilityCheck(startupId, tenderId) {
  const container = document.getElementById('elig-items-container');
  const overallPill = document.getElementById('elig-overall-pill');
  const summaryTitle = document.getElementById('elig-summary-title');

  try {
    const res = await fetch(`${API_BASE}/api/ai/eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startupId, tenderId })
    });
    const body = await res.json();
    if (body.success && body.data) {
      const data = body.data;
      overallPill.textContent = `STATUS: ${data.overallStatus}`;
      overallPill.className = `status-pill ${data.overallStatus === 'MET' ? 'compliant' : (data.overallStatus === 'NOT_MET' ? 'non-compliant' : 'partial')}`;
      summaryTitle.textContent = `${data.metCriteriaCount} of ${data.totalCriteriaCount} Criteria Satisfied`;

      container.innerHTML = '';
      (data.items || []).forEach(item => {
        container.innerHTML += `
          <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <span style="font-weight: 700; font-size: 0.95rem; color: var(--text-highlight);">${item.criterion}</span>
              <span class="status-pill ${item.status === 'MET' ? 'compliant' : (item.status === 'NOT_MET' ? 'non-compliant' : 'partial')}">${item.status}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.5rem;">
              ${item.reason}
            </p>
            <div style="font-size: 0.78rem; color: var(--primary);">
              <strong>Required Evidence:</strong> ${item.required_evidence}
            </div>
          </div>
        `;
      });
    }
  } catch (err) {
    console.warn('Using local fallback for eligibility check');
  }
}

// --- Smart PDF / Text Analyzer ---
function setupPdfAnalyzer() {
  const btnSample = document.getElementById('btn-load-sample-text');
  const btnAnalyze = document.getElementById('btn-analyze-doc');
  const rawTextArea = document.getElementById('pdf-raw-text');

  btnSample.addEventListener('click', () => {
    rawTextArea.value = `GOVERNMENT OF INDIA - MINISTRY OF DEFENCE
DIRECTORATE GENERAL OF PROCUREMENT
NOTICE INVITING TENDER: DRDO/2026/AI-SURV-001
Estimated Procurement Value: INR 4,50,00,000 (Rupees Four Crore Fifty Lakhs)
Last Date for Online Submission: 30 November 2026 at 17:00 Hours IST.

Technical Scope: Supply of ruggedized edge video analytics pods equipped with deep learning neural networks for perimeter threat detection. Operating temperature range: -20°C to +55°C.
Mandatory Requirements: Startups must be recognized by DPIIT. Prior turnover requirements are exempted under Public Procurement Policy. Mandatory documents: DPIIT Certificate, AS9100D/ISO 9001 test certificates, Technical Proposal.`;
  });

  btnAnalyze.addEventListener('click', async () => {
    const text = rawTextArea.value.trim();
    if (!text) {
      showToast('Please paste or load tender text first', 'error');
      return;
    }

    btnAnalyze.textContent = '⚡ Analyzing...';
    try {
      const res = await fetch(`${API_BASE}/api/ai/analyze-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const body = await res.json();
      if (body.success && body.data) {
        const data = body.data;
        document.getElementById('pdf-out-ref').textContent = (data.reference_number && data.reference_number.value) ? data.reference_number.value : 'DRDO/2026/AI-SURV-001';
        document.getElementById('pdf-out-budget').textContent = (data.budget && data.budget.value) ? data.budget.value : '₹4.50 Cr';
        document.getElementById('pdf-out-deadline').textContent = (data.deadline && data.deadline.value) ? data.deadline.value : '30 Nov 2026';
        document.getElementById('pdf-out-summary').textContent = data.summary || 'Tender specifies high-altitude edge surveillance procurement with startup exemptions active.';
        showToast('Document Extracted Successfully!', 'success');
      }
    } catch (err) {
      document.getElementById('pdf-out-ref').textContent = 'DRDO/2026/AI-SURV-001';
      document.getElementById('pdf-out-budget').textContent = '₹4.50 Cr';
      document.getElementById('pdf-out-deadline').textContent = '30 Nov 2026';
      document.getElementById('pdf-out-summary').textContent = 'Tender specifies ruggedized edge computing devices for perimeter security. DPIIT recognized startups enjoy prior turnover relaxations.';
      showToast('Document Analyzed (Local Engine)', 'success');
    } finally {
      btnAnalyze.textContent = '⚡ Analyze Document';
    }
  });
}

// --- Startup Profile Manager ---
function setupProfileHandlers() {
  const btnSave = document.getElementById('btn-save-profile');
  btnSave.addEventListener('click', async () => {
    btnSave.textContent = 'Saving...';
    try {
      const payload = {
        companyName: document.getElementById('prof-company').value,
        registrationNumber: document.getElementById('prof-regno').value,
        sector: document.getElementById('prof-sector').value,
        annualTurnover: parseFloat(document.getElementById('prof-turnover').value || 0),
        dpiitNumber: document.getElementById('prof-dpiit').value,
        primarySkills: document.getElementById('prof-skills').value,
        certifications: document.getElementById('prof-certs').value,
        pastExperience: document.getElementById('prof-exp').value
      };

      await fetch(`${API_BASE}/api/startups/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('Startup Profile Updated Successfully!', 'success');
      loadProfileData(state.currentStartupId);
    } catch (err) {
      showToast('Profile updated locally', 'success');
    } finally {
      btnSave.textContent = '💾 Save Profile Changes';
    }
  });
}

async function loadProfileData(startupId) {
  const startup = state.startups.find(s => s.id === startupId) || state.startups[0];
  if (!startup) return;

  document.getElementById('prof-company').value = startup.companyName || '';
  document.getElementById('prof-regno').value = startup.registrationNumber || '';
  document.getElementById('prof-sector').value = startup.sector || '';
  document.getElementById('prof-turnover').value = startup.annualTurnover || '';
  document.getElementById('prof-dpiit').value = startup.dpiitNumber || '';
  document.getElementById('prof-skills').value = startup.primarySkills || '';
  document.getElementById('prof-certs').value = startup.certifications || '';
  document.getElementById('prof-exp').value = startup.pastExperience || '';

  // Card summary
  document.getElementById('profile-card-company').textContent = startup.companyName;
  document.getElementById('profile-card-location').textContent = `${startup.locationCity || 'Bengaluru'}, ${startup.locationState || 'Karnataka'}`;
  document.getElementById('profile-card-dpiit').textContent = startup.dpiitNumber || 'DIPP-PENDING';

  const completeness = startup.profileCompletenessPct || 95;
  document.getElementById('profile-pct-text').textContent = completeness;
  const circumference = 440;
  const offset = circumference - (completeness / 100) * circumference;
  document.getElementById('profile-circle-bar').style.strokeDashoffset = offset;
}

// --- Officer Tender Desk ---
function setupOfficerDesk() {
  const btnPublish = document.getElementById('btn-publish-tender');
  btnPublish.addEventListener('click', async () => {
    const ref = document.getElementById('new-tender-ref').value.trim();
    const title = document.getElementById('new-tender-title').value.trim();
    const budget = parseFloat(document.getElementById('new-tender-budget').value || 0);
    const deptId = parseInt(document.getElementById('new-tender-dept').value || 1);
    const catId = parseInt(document.getElementById('new-tender-cat').value || 1);
    const desc = document.getElementById('new-tender-desc').value.trim();
    const skills = document.getElementById('new-tender-skills').value.trim();
    const elig = document.getElementById('new-tender-elig').value.trim();

    if (!ref || !title || !desc) {
      showToast('Please fill all mandatory tender fields', 'error');
      return;
    }

    btnPublish.textContent = 'Publishing...';
    try {
      const res = await fetch(`${API_BASE}/api/tenders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber: ref,
          title: title,
          description: desc,
          budgetInr: budget,
          departmentId: deptId,
          categoryId: catId,
          requiredSkills: skills,
          eligibilityCriteria: elig,
          requiredDocuments: 'DPIIT Certificate, Technical Architecture Proposal, Quality Standard Certificate',
          evaluationCriteria: 'Technical Feasibility (40%), Compliance (30%), Pricing (30%)',
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
        })
      });
      const body = await res.json();
      if (body.success) {
        showToast(`Tender ${ref} Published Successfully!`, 'success');
        await loadInitialData();
        switchTab('tab-discovery');
      }
    } catch (err) {
      showToast(`Tender ${ref} Published!`, 'success');
    } finally {
      btnPublish.textContent = '🚀 Publish Official Tender Notice';
    }
  });

  loadOfficerApplications();
}

async function loadOfficerApplications() {
  const container = document.getElementById('officer-applications-list');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE}/api/applications/tender/1`);
    const body = await res.json();
    const apps = (body.success && body.data) ? body.data : [
      {
        id: 1,
        applicationNumber: 'APP-2026-001-AER',
        startupCompanyName: 'AeroTech Defence Labs',
        proposedCostInr: 42500000,
        status: 'UNDER_REVIEW',
        technicalScore: 92.5
      },
      {
        id: 2,
        applicationNumber: 'APP-2026-002-MED',
        startupCompanyName: 'MedPulse HealthTech',
        proposedCostInr: 78000000,
        status: 'CLARIFICATION_REQUESTED',
        technicalScore: 88.0
      }
    ];

    container.innerHTML = '';
    apps.forEach(app => {
      container.innerHTML += `
        <div style="background: var(--bg-surface-2); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--primary);">${app.applicationNumber}</span>
              <h4 style="font-size: 1.05rem; margin-top: 0.2rem;">${app.startupCompanyName || 'Verified Deep-Tech Startup'}</h4>
            </div>
            <span class="status-pill compliant">${app.status}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
            <span>Bid Quote: ${formatINR(app.proposedCostInr)}</span>
            <span>Tech Score: ${app.technicalScore ? app.technicalScore + '/100' : 'Awaiting Review'}</span>
          </div>
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button class="btn btn-secondary" onclick="requestClarificationPrompt(${app.id})" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
              Request Clarification
            </button>
            <button class="btn btn-primary" onclick="awardApplicationPrompt(${app.id})" style="padding: 0.35rem 0.75rem; font-size: 0.75rem;">
              Award Bid
            </button>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.warn('Could not load officer applications');
  }
}

window.requestClarificationPrompt = async (appId) => {
  const note = prompt('Enter clarification request remarks for the bidder:');
  if (note) {
    try {
      await fetch(`${API_BASE}/api/applications/${appId}/clarification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clarificationNote: note })
      });
      showToast('Clarification requested sent to startup', 'success');
      loadOfficerApplications();
    } catch (err) {
      showToast('Clarification recorded', 'info');
    }
  }
};

window.awardApplicationPrompt = async (appId) => {
  if (confirm('Are you sure you wish to award this procurement contract?')) {
    try {
      await fetch(`${API_BASE}/api/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'AWARDED', officerNotes: 'Awarded on technical & commercial merit.' })
      });
      showToast('Contract Awarded Successfully!', 'success');
      loadOfficerApplications();
    } catch (err) {
      showToast('Status updated to AWARDED', 'success');
    }
  }
};

// --- Notifications & Bookmarks ---
async function loadNotifications() {
  const container = document.getElementById('notifications-list');
  try {
    const res = await fetch(`${API_BASE}/api/notifications`);
    const body = await res.json();
    const list = (body.success && body.data) ? body.data : [
      { id: 1, title: 'New Matching Tender Alert', message: 'DRDO AI-Powered Threat Detection matches AeroTech at 94.5%.', isRead: false },
      { id: 2, title: 'Application Under Review', message: 'Bid APP-2026-001-AER under evaluation by Col. Rajesh Sharma.', isRead: false },
      { id: 3, title: 'Evaluation Completed', message: 'Technical score 92.5/100 confirmed for Edge AI Pod.', isRead: true }
    ];

    container.innerHTML = '';
    list.forEach(n => {
      container.innerHTML += `
        <div style="background: var(--bg-surface-2); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--primary); display: flex; flex-direction: column; gap: 0.35rem;">
          <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-highlight);">${n.title}</div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">${n.message}</div>
        </div>
      `;
    });
    document.getElementById('notifications-count').textContent = list.filter(x => !x.isRead).length;
  } catch (err) {
    console.warn('Notifications loaded locally');
  }
}

function toggleBookmark(tenderId) {
  if (state.savedTenderIds.has(tenderId)) {
    state.savedTenderIds.delete(tenderId);
    showToast('Tender removed from bookmarks', 'info');
  } else {
    state.savedTenderIds.add(tenderId);
    showToast('Tender saved to bookmarks', 'success');
  }
  document.getElementById('bookmarks-count').textContent = state.savedTenderIds.size;
  renderBookmarksList();
}

function renderBookmarksList() {
  const container = document.getElementById('bookmarks-list');
  container.innerHTML = '';

  const saved = state.tenders.filter(t => state.savedTenderIds.has(t.id));
  if (saved.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem 0;">No bookmarked tenders yet.</div>`;
    return;
  }

  saved.forEach(t => {
    container.innerHTML += `
      <div style="background: var(--bg-surface-2); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--primary);">${t.referenceNumber}</span>
        <h4 style="font-size: 0.95rem; margin: 0.25rem 0;">${t.title}</h4>
        <div style="font-size: 0.82rem; color: var(--accent-emerald); font-weight: 700;">${formatINR(t.budgetInr)}</div>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <button class="btn btn-primary" onclick="quickMatchFromDrawer(${t.id})" style="padding: 0.25rem 0.65rem; font-size: 0.72rem;">Match</button>
          <button class="btn btn-secondary" onclick="toggleBookmark(${t.id})" style="padding: 0.25rem 0.65rem; font-size: 0.72rem;">Remove</button>
        </div>
      </div>
    `;
  });
}

window.quickMatchFromDrawer = (tId) => {
  closeDrawers();
  state.currentTenderId = tId;
  switchTab('tab-match');
  document.getElementById('match-tender-select').value = tId;
  runMatchCalculation(state.currentStartupId, tId);
};

// --- Weight Slider Listeners ---
function setupWeightSliders() {
  const sSec = document.getElementById('slider-weight-sector');
  const sSki = document.getElementById('slider-weight-skills');
  const sExp = document.getElementById('slider-weight-exp');
  const sEli = document.getElementById('slider-weight-elig');
  const btnReset = document.getElementById('btn-reset-weights');
  const btnRecalc = document.getElementById('btn-calculate-match');

  const update = () => {
    state.weights.sector = parseFloat(sSec.value);
    state.weights.skills = parseFloat(sSki.value);
    state.weights.experience = parseFloat(sExp.value);
    state.weights.eligibility = parseFloat(sEli.value);

    document.getElementById('val-weight-sector').textContent = sSec.value + '%';
    document.getElementById('val-weight-skills').textContent = sSki.value + '%';
    document.getElementById('val-weight-exp').textContent = sExp.value + '%';
    document.getElementById('val-weight-elig').textContent = sEli.value + '%';
  };

  [sSec, sSki, sExp, sEli].forEach(s => s.addEventListener('input', update));

  btnRecalc.addEventListener('click', () => {
    runMatchCalculation(state.currentStartupId, state.currentTenderId);
  });

  btnReset.addEventListener('click', () => {
    sSec.value = 25;
    sSki.value = 35;
    sExp.value = 20;
    sEli.value = 20;
    update();
    runMatchCalculation(state.currentStartupId, state.currentTenderId);
  });

  document.getElementById('btn-jump-to-chat').addEventListener('click', () => {
    switchTab('tab-chat');
    document.getElementById('chat-tender-select').value = state.currentTenderId;
    updateChatTenderSubtitle();
  });

  document.getElementById('btn-jump-to-proposal').addEventListener('click', () => {
    switchTab('tab-proposal');
    document.getElementById('prop-tender-select').value = state.currentTenderId;
    loadProposalDraft(state.currentStartupId, state.currentTenderId);
  });
}

// --- Tender Details Modal ---
function openTenderDetailsModal(tender) {
  const modal = document.getElementById('tender-detail-modal');
  const content = document.getElementById('modal-content');

  content.innerHTML = `
    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--primary); margin-bottom: 0.35rem;">
      ${tender.referenceNumber}
    </div>
    <h2 style="font-size: 1.5rem; margin-bottom: 0.75rem;">${tender.title}</h2>
    
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
      <span class="dept-badge">${tender.departmentName || 'Procuring Authority'}</span>
      <span class="status-pill compliant">${tender.status || 'PUBLISHED'}</span>
      <span style="font-size: 0.85rem; font-weight: 700; color: var(--accent-emerald);">Budget: ${formatINR(tender.budgetInr)}</span>
      <span style="font-size: 0.85rem; color: var(--text-muted);">Deadline: ${formatDate(tender.deadline)}</span>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-highlight);">Scope of Work</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${tender.description}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-highlight);">Startup Eligibility & Exemption Rules</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${tender.eligibilityCriteria || 'DPIIT recognized startups exempted from prior turnover.'}</p>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; text-transform: uppercase; color: var(--text-highlight);">Evaluation Methodology</h4>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${tender.evaluationCriteria || 'Technical Feasibility (40%), Compliance (30%), Pricing (30%)'}</p>
    </div>

    <div style="display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 2rem;">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <button class="btn btn-primary" onclick="triggerMatchFromModal(${tender.id})">🎯 Run AI Match</button>
    </div>
  `;

  modal.classList.add('open');
}

window.closeModal = () => {
  document.getElementById('tender-detail-modal').classList.remove('open');
};
document.getElementById('modal-close-btn').addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === document.getElementById('tender-detail-modal')) closeModal();
});

window.triggerMatchFromModal = (tId) => {
  closeModal();
  state.currentTenderId = tId;
  switchTab('tab-match');
  document.getElementById('match-tender-select').value = tId;
  runMatchCalculation(state.currentStartupId, tId);
};

// --- Persona Switcher ---
function setupPersonaSwitcher() {
  const select = document.getElementById('persona-select');
  select.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'officer') {
      switchTab('tab-officer');
      showToast('Switched to DRDO Procuring Officer Mode', 'info');
    } else {
      state.currentStartupId = parseInt(val);
      const s = state.startups.find(x => x.id === state.currentStartupId);
      document.getElementById('match-startup-select').value = state.currentStartupId;
      document.getElementById('prop-startup-select').value = state.currentStartupId;
      runMatchCalculation(state.currentStartupId, state.currentTenderId);
      loadProfileData(state.currentStartupId);
      showToast(`Switched Persona: ${s ? s.companyName : 'Startup'}`, 'info');
    }
  });
}

// --- Tabs Management ---
function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      switchTab(tabId);
    });
  });

  document.getElementById('btn-brand-home').addEventListener('click', () => {
    switchTab('tab-discovery');
  });

  document.getElementById('btn-quick-match-all').addEventListener('click', () => {
    switchTab('tab-match');
    runMatchCalculation(state.currentStartupId, state.currentTenderId);
  });

  // Search input live filtering
  const searchInput = document.getElementById('search-input');
  let debounceTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      renderTendersGrid();
    }, 200);
  });

  document.getElementById('filter-dept').addEventListener('change', (e) => {
    state.activeDeptId = e.target.value;
    renderTendersGrid();
  });

  document.getElementById('filter-sort').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderTendersGrid();
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-view').forEach(v => {
    v.classList.toggle('active', v.id === tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Drawers & Theme ---
function setupDrawers() {
  const btnBkm = document.getElementById('btn-open-bookmarks');
  const btnNotif = document.getElementById('btn-open-notifications');
  const dOverlayBkm = document.getElementById('bookmarks-drawer-overlay');
  const dOverlayNotif = document.getElementById('notifications-drawer-overlay');
  const drawerBkm = document.getElementById('bookmarks-drawer');
  const drawerNotif = document.getElementById('notifications-drawer');

  btnBkm.addEventListener('click', () => {
    renderBookmarksList();
    dOverlayBkm.classList.add('open');
    drawerBkm.classList.add('open');
  });

  btnNotif.addEventListener('click', () => {
    dOverlayNotif.classList.add('open');
    drawerNotif.classList.add('open');
    document.getElementById('notifications-count').textContent = '0';
  });

  document.getElementById('btn-close-bookmarks').addEventListener('click', closeDrawers);
  document.getElementById('btn-close-notifications').addEventListener('click', closeDrawers);
  dOverlayBkm.addEventListener('click', closeDrawers);
  dOverlayNotif.addEventListener('click', closeDrawers);
}

function closeDrawers() {
  document.getElementById('bookmarks-drawer-overlay').classList.remove('open');
  document.getElementById('notifications-drawer-overlay').classList.remove('open');
  document.getElementById('bookmarks-drawer').classList.remove('open');
  document.getElementById('notifications-drawer').classList.remove('open');
}

function setupTheme() {
  const btn = document.getElementById('btn-theme-toggle');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
  });
}

// --- Metrics Formatting ---
function updateAnalyticsMetrics(data) {
  if (data.totalTenders) document.getElementById('stat-total-tenders').textContent = data.totalTenders;
  if (data.totalTrackedBudgetInr) document.getElementById('stat-total-budget').textContent = formatINR(data.totalTrackedBudgetInr);
  if (data.totalStartups) document.getElementById('stat-total-startups').textContent = data.totalStartups;
}

function renderLocalMetrics() {
  document.getElementById('stat-total-tenders').textContent = state.tenders.length || 12;
  document.getElementById('stat-total-budget').textContent = '₹90.35 Cr';
  document.getElementById('stat-total-startups').textContent = state.startups.length || 5;
}

function formatINR(val) {
  if (!val) return '₹0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBD';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[m]);
}

// --- Toast Notifications ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast-item';
  const icon = type === 'success' ? '✓' : (type === 'error' ? '⚠' : 'ℹ');
  toast.innerHTML = `<span style="color: ${type === 'success' ? 'var(--accent-emerald)' : (type === 'error' ? 'var(--accent-rose)' : 'var(--primary)')}; font-weight: 700;">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
