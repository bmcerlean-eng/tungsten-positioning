/**
 * Centralised proof points for Tungsten Automation positioning across all four pillars.
 *
 * Refreshed from the March 2026 corporate AI Strategy paper and the IDP 2.0 Capability Map.
 * Importing from this single source keeps DWA, AP/AR, Print, and PDF prompts aligned and
 * makes future updates to a single number a one-line change.
 */

export const SCALE_PROOF_POINTS = {
  rdYears: "40+ years of R&D in document intelligence",
  preTrainedModels: "3,000+ pre-trained extraction models in the Document Library",
  customers: "25,000+ global customers",
  partners: "850+ partners worldwide",
  patents: "230+ patents",
  documentsProcessedPerYear: "10B+ documents processed per year",
  enterpriseConnectors: "100+ enterprise connectors out of the box",
  employees: "2,200 employees across 32 countries",
  marqueeBanks: "8 of the top 10 global banks",
  marqueeInsurers: "7 of the top 10 global insurers",
  marqueeLogistics: "3 of the 5 largest global logistics companies",
} as const;

export const MOMENTUM_PROOF_POINTS = {
  agenticProcessUsageGrowth:
    "+550% growth in in-product agentic process usage over the last 6 months",
  agenticExtractionGrowth:
    "+180% growth in in-product agentic extraction over the last 6 months",
} as const;

export const RECOGNITION_PROOF_POINTS = {
  gartnerMqIdp:
    "2025 Gartner Magic Quadrant Leader for Intelligent Document Processing — recognised for both Completeness of Vision and Ability to Execute",
  hellios: "Hellios Certified Accredited Supplier",
  pdfAwards: [
    "TrustRadius Buyer's Choice 2026",
    "TrustRadius Top Rated 2025",
    "TrustRadius Most Loved 2024",
    "Capterra Best Ease of Use 2024",
    "GetApp Category Leaders 2024",
    "G2 High Performer 2024",
  ],
} as const;

export const COMPLIANCE_PROOF_POINTS = {
  certifications: [
    "FedRAMP High",
    "SOC 2 Type 1 & 2",
    "SOC 3",
    "ISO 27001:2022",
    "HIPAA",
    "PCI DSS",
    "GDPR",
    "CCPA",
    "Peppol",
    "EU AI Act",
    "Responsible AI Governance",
  ],
  annualPenTesting: "Annual third-party penetration testing",
} as const;

export const MARKET_PROOF_POINTS = {
  unstructuredDataShare:
    "80–90% of enterprise data is unstructured (Gartner) — contracts, invoices, emails, call transcripts, regulatory filings",
  unstructuredInGenAi:
    "Less than 1% of enterprise unstructured data is currently used in generative AI (IDC)",
  zeroRoiShare:
    "95% of generative AI investments see zero measurable ROI (MIT NANDA, 2025) despite $30–40B invested",
  enterpriseGenAiAdoption:
    "More than 80% of enterprises will deploy GenAI-enabled agents and applications in production by end of 2026 (Gartner)",
  aiReadinessGap:
    "Only 8.6% of organisations are actually AI-ready, despite 57% of leaders claiming they are (Huble, 2025)",
  unstructuredDataBlocker:
    "45% of enterprises cite unstructured, fragmented data as their #1 barrier to AI success",
  poorDataQualityImpact:
    "69% of companies say poor data quality limits their ability to make informed decisions",
  dataVolumeGrowth:
    "181 zettabytes of data created in 2025 — the vast majority unstructured and growing (IDC)",
  pilotsAbandoned:
    "S&P Global: 42% of companies abandoned most AI initiatives in 2025",
  pocSuccessRate:
    "BCG: only 26% of AI projects succeed beyond proof of concept",
  vendorVsDiySuccess:
    "Vendor-sourced AI solutions succeed at 2× the rate of DIY builds (67% vs 33%)",
  topAiObstacles:
    "Top obstacles to AI success: data quality/readiness (43%), technical maturity (43%), skills shortage (35%)",
  dataReadinessBudgetShare:
    "Winning AI programmes earmark 50–70% of their timeline and budget for data readiness",
} as const;

export const DWA_OUTCOME_PROOF_POINTS = {
  fedex: "FedEx — $40M+ annual ROI; scaled from 350M to 1B pages over 3 years",
  citi: "Citi — trade finance vendor consolidation; eliminated technical debt",
  siemens: "Siemens — over 90% automation on delivery note processing",
  tetrosyl: "Tetrosyl Group — 90 hours/month saved; 99% error reduction",
  usManufacturing:
    "U.S. manufacturing benchmark — 41% efficiency gain, 42% turnaround reduction, 38% cost savings",
  aviva: "Aviva — $116M of insurance fraud uncovered through intelligent document analysis",
  universityHospitals:
    "University Hospitals — $9.6M of value across 68 processes via workflow automation",
  safeGuard:
    "Safe-Guard Products International — 75% reduction in adjudication time",
  marginalen: "Marginalen Bank — 8 hours per day saved in document processing",
  processingTimeReduction:
    "Up to 90% processing-time reduction across document-intensive workflows",
} as const;

export const APAR_OUTCOME_PROOF_POINTS = {
  firstTimeAccuracy: "95%+ first-time invoice capture accuracy across all formats",
  manualProcessingReduction:
    "Up to 80% reduction in manual invoice processing time",
  earlyPaymentDiscountUplift:
    "50%+ improvement in early-payment discount capture",
  duplicatePaymentRecovery:
    "Duplicate payment detection prevents 1–3% of AP spend being wasted",
  cycleTimeReduction:
    "Average invoice-to-payment cycle reduced from 45 days to under 10 days",
  einvoicingCoverage:
    "100+ countries covered for e-invoicing compliance with continuous mandate tracking",
  manualVsAutomatedCost:
    "Industry average $15–$40 per invoice manually vs $2–$5 with InvoiceAgility",
} as const;

/**
 * A compact, reusable block of proof points suitable for dropping into any system prompt.
 * Used by all four pillar prompts to keep the corporate umbrella consistent.
 */
export function buildCorporateProofPointsBlock(): string {
  const certs = COMPLIANCE_PROOF_POINTS.certifications.join(", ");
  return `### Tungsten at a Glance — Proven at Scale

- **Domain expertise**: ${SCALE_PROOF_POINTS.rdYears}
- **Pre-trained models**: ${SCALE_PROOF_POINTS.preTrainedModels}
- **Customers**: ${SCALE_PROOF_POINTS.customers}, ${SCALE_PROOF_POINTS.marqueeBanks}, ${SCALE_PROOF_POINTS.marqueeInsurers}, ${SCALE_PROOF_POINTS.marqueeLogistics}
- **Partner ecosystem**: ${SCALE_PROOF_POINTS.partners}
- **Patents**: ${SCALE_PROOF_POINTS.patents} (incl. US Patent 12,197,412 B2 covering hierarchical document representation for LLM-grounded extraction)
- **Scale**: ${SCALE_PROOF_POINTS.documentsProcessedPerYear}; ${SCALE_PROOF_POINTS.enterpriseConnectors}
- **Momentum**: ${MOMENTUM_PROOF_POINTS.agenticProcessUsageGrowth}; ${MOMENTUM_PROOF_POINTS.agenticExtractionGrowth}
- **Recognition**: ${RECOGNITION_PROOF_POINTS.gartnerMqIdp}
- **Compliance & governance**: ${certs}; ${COMPLIANCE_PROOF_POINTS.annualPenTesting}`;
}

/**
 * A condensed market-reality block used in build-vs-buy framing.
 */
export function buildMarketRealityBlock(): string {
  return `### The Market Reality (Cite These When the Conversation Turns to AI Investment)

- ${MARKET_PROOF_POINTS.unstructuredDataShare}
- ${MARKET_PROOF_POINTS.unstructuredInGenAi}
- ${MARKET_PROOF_POINTS.zeroRoiShare}
- ${MARKET_PROOF_POINTS.aiReadinessGap}
- ${MARKET_PROOF_POINTS.unstructuredDataBlocker}
- ${MARKET_PROOF_POINTS.pilotsAbandoned}
- ${MARKET_PROOF_POINTS.pocSuccessRate}
- ${MARKET_PROOF_POINTS.vendorVsDiySuccess}
- ${MARKET_PROOF_POINTS.dataReadinessBudgetShare}`;
}
