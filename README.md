# GovStart AI — Sovereign Public Procurement Intelligence Platform

> **"Find the Right Opportunities. Prepare with AI. Grow Your Business."**

GovStart AI is an AI-powered government business opportunity network designed for Indian startups, MSMEs, established suppliers, procurement consultants, and public sector procurement officers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Sauravsharma098/govstart-ai&root=govstart-app&project-name=govstart-ai&repository-name=govstart-ai)
[![GitHub](https://img.shields.io/badge/GitHub-Sauravsharma098%2Fgovstart--ai-blue?logo=github)](https://github.com/Sauravsharma098/govstart-ai)

---


## 🌟 Key Features

### 1. Deterministic & Explainable AI Smart Tender Match
- Multi-factor deterministic scoring:
  - **Sector Alignment (25%)**
  - **Technical Capability (25%)**
  - **Mandatory Eligibility & Statutory Waivers (20%)**
  - **Certifications & Track Record (10%)**
  - **Financial Scale & Budget (10%)**
  - **Lead Time Readiness (10%)**
- Automatic verification of **General Financial Rules (GFR) 2017 Rule 170(i)** (100% EMD waiver for DPIIT startups & MSEs).
- Department of Expenditure Order No. F.20/2/2014-PPD turnover relaxation logic.

### 2. Clause-Grounded AI Growth Copilot & Bid Studio
- Conversational assistant grounded in official tender specifications and procurement gazettes.
- Ephemeral private PDF clause extraction and contradiction detection.
- Automated generation of clause-by-clause compliance matrices and Cover checklists.

### 3. Multi-Persona Architecture
- **Startup Founders**: Rapid discovery, EMD exemptions, and relaxed turnover checks.
- **MSME Owners**: 25% public procurement policy preference tracking.
- **Established Suppliers**: High-value consortium opportunities and technical audits.
- **Procurement Advisors / Consultants**: Multi-client workspace for managing advisory bidding pipelines.
- **Procurement Officers**: Opportunity publication, clarification requests, and compliance review.
- **Platform Administrators**: System telemetry, audit logs, and access control.

### 4. Opportunity Workspace & Shortlist
- Multi-tender side-by-side comparison for up to 3 opportunities.
- Saved search alerts with customizable frequency.
- Interactive preparation workspaces and application pipeline tracking.

### 5. GovStart Academy & Bilingual Learning Hub
- Definitive guides on winning GeM contracts without prior turnover.
- Bilingual Hindi-English procurement glossary (EMD, PBG, L1, QCBS, Corrigendum).
- 10-point startup tender readiness audit checklist.

---

## 🏗️ Project Architecture

```
project/
├── govstart-app/        # Next.js 16 (App Router, Turbopack, Tailwind CSS, TypeScript)
│   ├── src/app/         # API routes & Page routing
│   ├── src/components/  # UI components & Design system
│   └── src/lib/         # AI engines, mock data, and app context
├── ai-service/          # Python / FastAPI ML & Document processing microservice
├── backend/             # Java / Spring Boot enterprise backend
├── database/            # PostgreSQL schemas & migrations
└── frontend/            # Standalone prototype UI
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Python 3.10+ (for optional AI microservice)

### Running GovStart Full-Stack App

```bash
# Navigate to the web application
cd govstart-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Test Suite

```bash
cd govstart-app
node ./scripts/test-intelligence.mjs
```

---

## ⚖️ Legal Disclaimer

GovStart AI is an independent software platform. It is not affiliated with, endorsed by, or an official agency of the Government of India, GeM SPV, or any Central/State Ministry. Match scores and statutory exemption analyses represent automated preliminary guidance and do not guarantee contract award.
