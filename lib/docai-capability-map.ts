/**
 * Tungsten DocAI™ Platform — IDP 2.0 Complete Enterprise Capability Map.
 *
 * This is the structured (machine-readable) form of the capability map artifact.
 * Every capability shown on the visual map is captured here as data so the
 * positioning prompts can pull the *right* cluster at the *right* moment in a
 * conversation — using each capability as concrete, already-shipped evidence in
 * the build-vs-buy argument.
 *
 * Use pattern (in system prompts):
 *   "When the prospect raises [topic], surface the relevant capability cluster
 *   from the DocAI Capability Map and frame the build-vs-buy cost: 'Here's what
 *   we already ship, certified, at scale. What it would take you to recreate.'"
 */

export type CapabilityLayer =
  | "ingestion"
  | "idp"
  | "workflow-orchestration-rpa"
  | "ai-ml-agentic"
  | "integration-security"
  | "deployment-analytics"
  | "enterprise-services"
  | "certifications-compliance";

export interface Capability {
  id: string;
  label: string;
  layer: CapabilityLayer;
  /** Sub-grouping within a layer (e.g. "OCR / ICR Engines", "Extraction"). */
  group?: string;
  /** One-line description of what the capability does, in customer language. */
  summary?: string;
  /** Why this is hard to recreate — used to anchor the build-vs-buy argument. */
  buildCost?: string;
}

export const LAYER_LABELS: Record<CapabilityLayer, string> = {
  ingestion: "Document Ingestion",
  idp: "Intelligent Document Processing",
  "workflow-orchestration-rpa": "Workflow, Orchestration & RPA",
  "ai-ml-agentic": "AI, ML & Agentic",
  "integration-security": "Integration & Security",
  "deployment-analytics": "Deployment & Analytics",
  "enterprise-services": "Enterprise Services & Support",
  "certifications-compliance": "Certifications & Compliance",
};

export const CAPABILITIES: Capability[] = [
  // --- Document Ingestion ---
  { id: "ing-structured-unstructured", label: "Structured, Semi-Structured & Unstructured Content", layer: "ingestion", summary: "One ingestion pipeline for every shape of input." },
  { id: "ing-first-third-party-agents", label: "First- and Third-Party Agents", layer: "ingestion", summary: "Agent-driven ingestion via MCP / A2A; agents push or pull content into the platform." },
  { id: "ing-high-speed-scanners", label: "High-Speed Scanners", layer: "ingestion" },
  { id: "ing-email", label: "Email", layer: "ingestion", summary: "Mailbox monitoring with attachment + body extraction." },
  { id: "ing-rest-api", label: "REST API", layer: "ingestion" },
  { id: "ing-mobile-capture-sdk", label: "Mobile Capture SDK (iOS / Android)", layer: "ingestion", summary: "Drop-in mobile capture SDK with on-device image cleanup." },
  { id: "ing-web-portal", label: "Web Portal Upload", layer: "ingestion" },
  { id: "ing-watch-folder", label: "Watch Folder Monitoring", layer: "ingestion" },
  { id: "ing-cloud-storage", label: "Cloud Storage (S3, Azure Blob, GCS)", layer: "ingestion" },
  { id: "ing-sharepoint", label: "SharePoint Connector", layer: "ingestion" },
  { id: "ing-box-dropbox", label: "Box / Dropbox Connector", layer: "ingestion" },
  { id: "ing-sftp-ftp", label: "SFTP / FTP Import", layer: "ingestion" },
  { id: "ing-barcode-qr", label: "Barcode / QR Routing", layer: "ingestion" },
  { id: "ing-batch-import", label: "Batch Import & Queuing", layer: "ingestion" },
  { id: "ing-real-time-event-streaming", label: "Real-Time Event Streaming", layer: "ingestion" },

  // --- IDP: Pre-Processing ---
  { id: "idp-deskew-rotation", label: "Deskew & Rotation", layer: "idp", group: "Pre-Processing" },
  { id: "idp-noise-removal", label: "Noise Removal", layer: "idp", group: "Pre-Processing" },
  { id: "idp-binarization", label: "Binarization", layer: "idp", group: "Pre-Processing" },
  { id: "idp-page-segmentation", label: "Page Segmentation", layer: "idp", group: "Pre-Processing" },
  { id: "idp-image-enhancement", label: "Image Enhancement", layer: "idp", group: "Pre-Processing" },
  { id: "idp-pdfa-conversion", label: "PDF/A Conversion", layer: "idp", group: "Pre-Processing" },

  // --- IDP: OCR / ICR Engines ---
  { id: "idp-omnipage", label: "Tungsten OmniPage OCR Engine", layer: "idp", group: "OCR / ICR Engines", summary: "30+ years of OCR R&D; multi-language, multi-script.", buildCost: "Industry-leading OCR is decades of training data and engineering." },
  { id: "idp-azure-doc-intelligence", label: "Azure Doc Intelligence", layer: "idp", group: "OCR / ICR Engines" },
  { id: "idp-google-vision-ocr", label: "Google Vision OCR", layer: "idp", group: "OCR / ICR Engines" },
  { id: "idp-icr-handwriting", label: "ICR Handwriting", layer: "idp", group: "OCR / ICR Engines" },

  // --- IDP: Classification ---
  { id: "idp-supervised-ml-classification", label: "Supervised ML Models", layer: "idp", group: "Classification" },
  { id: "idp-layout-classification", label: "Layout-Based Classification", layer: "idp", group: "Classification" },
  { id: "idp-rules-augmented-classification", label: "Rules-Augmented Classification", layer: "idp", group: "Classification" },
  { id: "idp-content-classification", label: "Content-Based Classification", layer: "idp", group: "Classification" },
  { id: "idp-llm-classification", label: "LLM-Powered Classification", layer: "idp", group: "Classification" },
  { id: "idp-zero-shot-clustering", label: "Zero-Shot Clustering", layer: "idp", group: "Classification" },

  // --- IDP: Extraction ---
  { id: "idp-pretrained-models", label: "3,000+ Pre-Trained Models", layer: "idp", group: "Extraction", summary: "The largest pre-trained extraction library in the industry.", buildCost: "Each model is months of curation, labelling, training, and validation." },
  { id: "idp-custom-model-training", label: "Custom Model Training", layer: "idp", group: "Extraction" },
  { id: "idp-llm-extraction", label: "LLM-Powered Extraction", layer: "idp", group: "Extraction", summary: "Powered by Tungsten Copilot™ on top of patented hierarchical doc representation." },
  { id: "idp-table-line-item", label: "Table / Line Item Extraction", layer: "idp", group: "Extraction" },
  { id: "idp-fraud-forensics", label: "Fraud Detection & Document Forensics", layer: "idp", group: "Extraction", summary: "$116M of insurance fraud uncovered at Aviva alone." },
  { id: "idp-key-value-pairs", label: "Key-Value Pair Extraction", layer: "idp", group: "Extraction" },
  { id: "idp-regex-rules", label: "Regex & Rules Engine", layer: "idp", group: "Extraction" },
  { id: "idp-signature-detection", label: "Signature Detection & Verification", layer: "idp", group: "Extraction" },
  { id: "idp-id-verification", label: "ID Verification", layer: "idp", group: "Extraction" },
  { id: "idp-barcodes-qr-extraction", label: "Barcodes / QR Codes", layer: "idp", group: "Extraction" },

  // --- IDP: Validation & Post-Processing ---
  { id: "idp-confidence-scoring", label: "Confidence Scoring", layer: "idp", group: "Validation & Post-Processing", summary: "Every extracted field carries a confidence score for downstream routing." },
  { id: "idp-hitl-review", label: "Human-in-the-Loop Review", layer: "idp", group: "Validation & Post-Processing" },
  { id: "idp-business-rule-validation", label: "Business Rule Validation", layer: "idp", group: "Validation & Post-Processing" },
  { id: "idp-data-normalization", label: "Data Normalization", layer: "idp", group: "Validation & Post-Processing" },
  { id: "idp-duplicate-detection", label: "Duplicate Detection", layer: "idp", group: "Validation & Post-Processing", summary: "Catches the duplicates that cost AP teams 0.1–0.5% of total spend." },
  { id: "idp-audit-trail-logging", label: "Audit Trail & Logging", layer: "idp", group: "Validation & Post-Processing" },
  { id: "idp-auto-learning-feedback", label: "Auto-Learning / Feedback Loop", layer: "idp", group: "Validation & Post-Processing", summary: "Continuous improvement from human corrections — no drift, no degradation." },
  { id: "idp-output-formatting", label: "Output Formatting", layer: "idp", group: "Validation & Post-Processing" },

  // --- Workflow / Orchestration ---
  { id: "wf-process-designer", label: "Process Designer", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-conditional-routing", label: "Conditional Routing", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-sla-escalations", label: "SLA & Escalations", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-parallel-processing", label: "Parallel Processing", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-async-microservices", label: "Synchronous & Asynchronous Microservices", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-timers-signals", label: "Timers & Signals", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-human-tasks-forms", label: "Human Tasks & Forms", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },
  { id: "wf-event-driven-triggers", label: "Event-Driven Triggers", layer: "workflow-orchestration-rpa", group: "Workflow Orchestration" },

  // --- Case Management ---
  { id: "cm-dynamic-case-management", label: "Dynamic Case Management", layer: "workflow-orchestration-rpa", group: "Case Management" },
  { id: "cm-ad-hoc-task-creation", label: "Ad-Hoc Task Creation", layer: "workflow-orchestration-rpa", group: "Case Management" },
  { id: "cm-case-templates", label: "Case Templates", layer: "workflow-orchestration-rpa", group: "Case Management" },
  { id: "cm-case-analytics", label: "Case Analytics", layer: "workflow-orchestration-rpa", group: "Case Management" },

  // --- RPA ---
  { id: "rpa-desktop-automation", label: "Desktop Automation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-attended-unattended-bots", label: "Attended / Unattended Bots", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-bot-orchestrator", label: "Bot Orchestrator", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-screen-scraping", label: "Screen Scraping", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-mcp-tool-integration", label: "MCP / Tool Integration", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-citrix-automation", label: "Citrix Automation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-sap-gui-automation", label: "SAP GUI Automation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-terminal-emulation", label: "Terminal Emulation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-web-automation", label: "Web Automation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },
  { id: "rpa-excel-automation", label: "Excel Automation", layer: "workflow-orchestration-rpa", group: "Robotic Process Automation" },

  // --- AI / ML / Agentic ---
  { id: "ai-foundation-open-models", label: "All Major Foundation & Open Models", layer: "ai-ml-agentic", group: "LLM & Generative AI", summary: "OpenAI, Anthropic, Google, Microsoft, Meta, Mistral — and your own." },
  { id: "ai-custom-llm-integration", label: "Custom LLM Integration", layer: "ai-ml-agentic", group: "LLM & Generative AI" },
  { id: "ai-prompt-mgmt-guardrails", label: "Prompt Management & Guardrails", layer: "ai-ml-agentic", group: "LLM & Generative AI" },
  { id: "ai-tungsten-copilot", label: "Tungsten Copilot™", layer: "ai-ml-agentic", group: "LLM & Generative AI", summary: "Parent brand for zero-shot classification and extraction; subsumes Copilot for Extraction, Knowledge Discovery, and Copilot for Development." },
  { id: "ai-prompt-injection-prevention", label: "Prompt Injection Prevention", layer: "ai-ml-agentic", group: "LLM & Generative AI", summary: "Hierarchical doc representation drastically reduces the prompt-injection attack surface." },
  { id: "ai-us-patent", label: "US Patent 12,197,412 B2 — Hierarchical Document Representation", layer: "ai-ml-agentic", group: "LLM & Generative AI", buildCost: "You can't reverse-engineer a patented technique into a prototype." },
  { id: "ai-mcp-tool-integration", label: "MCP / Tool Integration", layer: "ai-ml-agentic", group: "Agentic Foundation", summary: "Open protocol — your agents call DocAI capabilities like any other tool." },
  { id: "ai-third-party-agents", label: "3rd-Party Agents", layer: "ai-ml-agentic", group: "Agentic Foundation" },
  { id: "ai-agentic-orchestration", label: "Agentic Orchestration", layer: "ai-ml-agentic", group: "Agentic Foundation" },
  { id: "ai-knowledge-graphs", label: "Knowledge Graphs", layer: "ai-ml-agentic", group: "Agentic Foundation" },
  { id: "ai-vector-search-rag", label: "Vector Search & RAG", layer: "ai-ml-agentic", group: "Agentic Foundation" },
  { id: "ai-llm-choice-framework", label: "LLM Choice Framework", layer: "ai-ml-agentic", group: "Agentic Foundation", summary: "Right model for the right task — not one model for everything." },

  // --- Integration & Security ---
  { id: "int-sap-oracle-microsoft", label: "SAP / Oracle / Microsoft Connectors", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-salesforce", label: "Salesforce", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-servicenow", label: "ServiceNow", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-rest-soap", label: "REST / SOAP APIs", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-database", label: "Database Connectors", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-erp-crm", label: "ERP / CRM Adapters", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "int-ecm", label: "ECM Connectors", layer: "integration-security", group: "100+ Enterprise Connectors" },
  { id: "sec-sso-saml-oauth", label: "SSO / SAML / OAuth 2.0", layer: "integration-security", group: "Security & Governance" },
  { id: "sec-ldap-ad", label: "LDAP / Active Directory", layer: "integration-security", group: "Security & Governance" },
  { id: "sec-rbac", label: "RBAC & Permissions", layer: "integration-security", group: "Security & Governance" },
  { id: "sec-full-audit-trail", label: "Full Audit Trail", layer: "integration-security", group: "Security & Governance" },
  { id: "sec-encryption", label: "Encryption (Rest / Transit)", layer: "integration-security", group: "Security & Governance" },
  { id: "dev-net-sdk-rest-api", label: ".NET SDK & REST API", layer: "integration-security", group: "Developer Tools" },
  { id: "dev-low-code-designer", label: "Low-Code Designer", layer: "integration-security", group: "Developer Tools" },
  { id: "dev-cicd-pipelines", label: "CI/CD Pipelines", layer: "integration-security", group: "Developer Tools" },
  { id: "dev-testing-framework", label: "Testing Framework", layer: "integration-security", group: "Developer Tools" },
  { id: "dev-github-integration", label: "GitHub Integration", layer: "integration-security", group: "Developer Tools" },

  // --- Deployment & Analytics ---
  { id: "dep-on-premises", label: "On-Premises", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "dep-azure-managed", label: "Azure Cloud (Managed)", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "dep-aws-gcp", label: "AWS / GCP", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "dep-kubernetes", label: "Kubernetes & Containers", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "dep-hybrid", label: "Hybrid Architecture", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "dep-air-gapped", label: "Air-Gapped Environments", layer: "deployment-analytics", group: "Deployment Options" },
  { id: "ana-real-time-dashboards", label: "Real-Time Dashboards", layer: "deployment-analytics", group: "Analytics & Observability" },
  { id: "ana-agent-auditing", label: "Agent Auditing / Monitoring", layer: "deployment-analytics", group: "Analytics & Observability" },
  { id: "ana-sla-monitoring", label: "SLA Monitoring", layer: "deployment-analytics", group: "Analytics & Observability" },
  { id: "ana-bottleneck-detection", label: "Bottleneck Detection", layer: "deployment-analytics", group: "Analytics & Observability" },
  { id: "ana-regulatory-compliance-reporting", label: "Regulatory Compliance Reporting", layer: "deployment-analytics", group: "Analytics & Observability" },
  { id: "inf-multi-tenant", label: "Multi-Tenant Architecture", layer: "deployment-analytics", group: "Infrastructure & Scalability" },
  { id: "inf-high-availability", label: "High Availability", layer: "deployment-analytics", group: "Infrastructure & Scalability" },
  { id: "inf-disaster-recovery", label: "Disaster Recovery", layer: "deployment-analytics", group: "Infrastructure & Scalability" },
  { id: "inf-load-balancing", label: "Load Balancing", layer: "deployment-analytics", group: "Infrastructure & Scalability" },
  { id: "inf-auto-scaling", label: "Auto Scaling", layer: "deployment-analytics", group: "Infrastructure & Scalability" },

  // --- Enterprise Services & Support ---
  { id: "ess-24x7-support", label: "24x7 Global Support", layer: "enterprise-services" },
  { id: "ess-expert-resources", label: "Expert Resources", layer: "enterprise-services" },
  { id: "ess-performance-testing", label: "Performance Testing", layer: "enterprise-services" },
  { id: "ess-automated-qa", label: "Automated QA Testing", layer: "enterprise-services" },
  { id: "ess-language-translation", label: "Language Translation for Global Rollout", layer: "enterprise-services" },
  { id: "ess-training-enablement", label: "Training & Enablement Courses", layer: "enterprise-services" },

  // --- Certifications & Compliance ---
  { id: "cert-iso-27001", label: "ISO 27001:2022", layer: "certifications-compliance" },
  { id: "cert-soc2", label: "SOC 2 Type 1 & 2", layer: "certifications-compliance" },
  { id: "cert-soc3", label: "SOC 3", layer: "certifications-compliance" },
  { id: "cert-fedramp-high", label: "FedRAMP High", layer: "certifications-compliance" },
  { id: "cert-pci-dss", label: "PCI DSS", layer: "certifications-compliance" },
  { id: "cert-hipaa", label: "HIPAA", layer: "certifications-compliance" },
  { id: "cert-gdpr", label: "GDPR", layer: "certifications-compliance" },
  { id: "cert-ccpa", label: "CCPA", layer: "certifications-compliance" },
  { id: "cert-peppol", label: "Peppol", layer: "certifications-compliance" },
  { id: "cert-hellios", label: "Hellios Certified Accredited Supplier", layer: "certifications-compliance" },
  { id: "cert-annual-pen-testing", label: "Annual Penetration Testing", layer: "certifications-compliance" },
  { id: "cert-responsible-ai", label: "Responsible AI Governance", layer: "certifications-compliance" },
];

export function getCapabilitiesByLayer(layer: CapabilityLayer): Capability[] {
  return CAPABILITIES.filter((c) => c.layer === layer);
}

export function getCapabilitiesByGroup(group: string): Capability[] {
  return CAPABILITIES.filter((c) => c.group === group);
}

export function summariseLayer(layer: CapabilityLayer): string {
  const items = getCapabilitiesByLayer(layer);
  const groups = new Map<string, Capability[]>();
  const ungrouped: Capability[] = [];
  for (const c of items) {
    if (c.group) {
      if (!groups.has(c.group)) groups.set(c.group, []);
      groups.get(c.group)!.push(c);
    } else {
      ungrouped.push(c);
    }
  }
  const lines: string[] = [`#### ${LAYER_LABELS[layer]}`];
  if (ungrouped.length > 0) {
    lines.push(ungrouped.map((c) => `- **${c.label}**${c.summary ? ` — ${c.summary}` : ""}`).join("\n"));
  }
  for (const [group, caps] of groups) {
    lines.push(`\n*${group}*`);
    lines.push(caps.map((c) => `- **${c.label}**${c.summary ? ` — ${c.summary}` : ""}`).join("\n"));
  }
  return lines.join("\n");
}

/**
 * Render the entire capability map as a markdown document for embedding in a
 * system prompt. Used by DWA where the full taxonomy is positioning ammunition.
 */
export function buildFullCapabilityMapBlock(): string {
  const layers: CapabilityLayer[] = [
    "ingestion",
    "idp",
    "workflow-orchestration-rpa",
    "ai-ml-agentic",
    "integration-security",
    "deployment-analytics",
    "enterprise-services",
    "certifications-compliance",
  ];
  return [
    `### Tungsten DocAI™ Platform — IDP 2.0 Complete Enterprise Capability Map`,
    `Every capability below is **already shipped, certified, and running at enterprise scale** inside the DocAI Platform. When a prospect raises a topic, surface the relevant cluster as concrete evidence of what they would otherwise have to build, integrate, certify, and maintain themselves.`,
    ...layers.map(summariseLayer),
    `**Enterprise Scale**: 40+ years of R&D · 3,000+ pre-trained models · 100+ enterprise connectors · 10B+ documents processed/year · Deterministic + Probabilistic AI · 25,000 customers · 850+ partners · highly-regulated industries.`,
  ].join("\n\n");
}

/**
 * Compact instruction block for system prompts: tells the model how and when to
 * pull capability-map evidence into a positioning response.
 */
export function buildCapabilityMapInstruction(): string {
  return `### How to Use the DocAI Capability Map in a Conversation

The Tungsten DocAI™ Platform Capability Map (above) is your **build-vs-buy weapon**. Every box on the map is a feature already shipped, certified, and operating at enterprise scale.

When the conversation turns to:
- *"We can build this ourselves"* / *"Our AI CoE will handle this"* / *"We have hyperscaler credits"*
- A specific capability the prospect is worried about (OCR accuracy, prompt injection, e-invoicing compliance, agent integration, audit trails, multi-vendor printer fleets, redaction, etc.)
- A request to compare Tungsten to a niche tool that only covers a slice of the map

…then **surface the relevant cluster** of capabilities from the map and frame it: *"Here's what we already ship, certified, at scale. To match it, you'd be hiring, building, integrating, certifying, and maintaining each of these — across years, not sprints. Boring AI: let the platform do the boring work; point your best people at what makes your business different."*

Be selective — pull the 5–10 capabilities most relevant to the conversation, not the entire map. Always tie the capabilities back to a customer outcome, not a feature list.`;
}
