export const APAR_SUPPLEMENTARY_CONTENT = `
## Discovery Questions for AEs and BDRs

Use these questions during initial discovery calls to qualify AP/AR opportunities and identify positioning angles.

### Understanding the Current State
1. What's your current monthly/annual invoice volume across all entities?
2. Which ERP system(s) are you running? (D365 Business Central, D365 F&O, Oracle Financial Cloud, NetSuite, SAP?)
3. What percentage of your invoices are processed touchless today vs requiring manual intervention?
4. Are you subject to e-invoicing mandates in any of your operating countries?
5. What's your current duplicate payment rate and how do you detect them?

### Assessing Efficiency and Working Capital
6. How long is your average invoice-to-payment cycle? Are you capturing early-payment discounts?
7. What are your biggest supplier complaints related to payments?
8. Do you handle both AP and AR, or primarily one?

### Gauging Automation Readiness
9. What's the biggest bottleneck in your current invoice process — capture, approvals, compliance, or payment?
10. Have you evaluated AP automation solutions before? What held you back?

---

## Common Objections and Responses

### 1. "Our ERP handles AP already."
**Reframe:** ERP modules handle workflow — routing, approvals, and payments. But they lack intelligent capture. InvoiceAgility's 95%+ first-time accuracy and ML extraction eliminate the manual data entry your ERP can't avoid. Someone is still keying in invoice data — InvoiceAgility makes that unnecessary.
**Evidence:** Organisations using ERP-only AP processing average $15–$40 per invoice in manual processing costs. InvoiceAgility brings that down to $2–$5 with touchless automation. The ERP stays — it just gets fed perfect data automatically.

### 2. "We just implemented Concur/Coupa."
**Reframe:** InvoiceAgility complements procurement platforms by providing the intelligent capture layer they lack. Concur excels at T&E; Coupa excels at procurement. Neither was built for AI-powered invoice capture and extraction. InvoiceAgility feeds them clean, validated data so your investment delivers its full potential.
**Evidence:** Coupa's invoice capture relies on supplier portal adoption — which averages 30–40% compliance. InvoiceAgility captures any invoice from any source with 95%+ accuracy, regardless of how the supplier sends it.

### 3. "Our volume is too low to justify automation."
**Reframe:** Even modest volumes benefit — the ROI comes from accuracy and speed, not just volume. Duplicate payment detection alone typically recovers 0.1–0.5% of total AP spend. Early-payment discount capture, error reduction, and compliance automation deliver returns regardless of volume.
**Evidence:** A mid-market company processing 5,000 invoices/month at $20 per manual invoice spends $1.2M/year on AP processing. At $3 per automated invoice, that's $1.02M in annual savings — a payback period of months, not years.

### 4. "We're concerned about global e-invoicing compliance."
**Reframe:** This is exactly where InvoiceAgility shines. With 100+ countries supported and continuous mandate tracking, you get automated compliance validation without building dedicated compliance teams in every geography. As mandates like EU ViDA, India GST, Saudi ZATCA, and Brazil NFe accelerate, InvoiceAgility keeps you compliant automatically.
**Evidence:** Non-compliance with e-invoicing mandates can result in blocked transactions, fines, and audit failures. Manual compliance monitoring requires dedicated staff and constant regulatory tracking. InvoiceAgility automates this entirely.

### 5. "Too expensive to switch AP systems."
**Reframe:** Calculate the cost of NOT switching — duplicate payments (1–3% of AP spend), missed early-payment discounts (2% on 10-day terms), late payment penalties, manual processing costs ($15–$40 per invoice), and growing compliance exposure. InvoiceAgility typically pays for itself in 6–9 months.
**Evidence:** The total cost of manual AP processing — including labor, errors, rework, missed discounts, and compliance risk — far exceeds the investment in automation. Start with a phased approach: automate the highest-volume invoice streams first and expand as ROI is proven.

### 6. "Our AI CoE is building invoice automation internally on Azure OpenAI."
**Reframe:** Boring AI. AP is mandatory, repeatable, and high-stakes — but it's not what differentiates your business. Let your CoE build what makes you unique. Let InvoiceAgility (and the Tungsten DocAI Platform underneath) handle ingestion, OCR, classification, line-item extraction, PO matching, duplicate detection, e-invoicing compliance, and ERP integration — capabilities built over decades, certified to SOC 2 / ISO 27001 / FedRAMP / EU AI Act, and shipped to 25,000+ customers. 95% of internal GenAI pilots fail to deliver measurable ROI; vendor-sourced AI succeeds at 2× the rate of DIY.
**Evidence:** Replicating InvoiceAgility internally would require recreating intelligent capture (95%+ first-time accuracy), 100+ countries of e-invoicing compliance, ERP-native integration with D365 / Oracle / NetSuite / Coupa, duplicate-detection ML, prompt-injection-resistant LLM extraction, and a continuously-learning feedback loop — across years, not sprints. The Boring AI play frees the CoE to focus on differentiation.

### 7. "We'll point a GenAI agent at our AP inbox — it'll just figure it out."
**Reframe:** Then your agent inherits the data problem: ungoverned, unstructured, unverifiable, hallucinating line items and GL codes, with no audit trail when an auditor asks where a payment authorisation came from. InvoiceAgility makes your agent's output reliable by giving it trusted, AI-ready invoice data — agent-addressable via MCP / A2A. The probabilistic agent reasons; the deterministic platform validates. Probabilistic intelligence belongs inside deterministic systems.
**Evidence:** InvoiceAgility delivers confidence scoring on every extracted field, business-rule validation, duplicate detection, full audit trail, and patented hierarchical document representation that reduces prompt-injection attack surface. Your agent calls these capabilities as governed tool calls — it doesn't invent invoice data from raw PDFs.

---

## Industry-Specific Value Hooks

### Banking & Financial Services
- High-volume vendor invoice processing across multiple entities and jurisdictions
- Regulatory compliance requirements for financial documentation and audit trails
- Complex approval hierarchies and segregation of duties requirements
- Opportunity: Reduce AP processing costs while strengthening compliance and audit readiness

### Healthcare
- Invoice volumes from thousands of suppliers — medical equipment, pharmaceuticals, facilities, services
- Strict regulatory requirements (HIPAA compliance in document handling)
- Pressure to reduce administrative costs and redirect savings to patient care
- Opportunity: Automate invoice capture to reduce the $15–$40 per invoice manual cost and accelerate supplier payments

### Manufacturing
- High-volume, complex invoices with detailed line items across global supply chains
- Multi-country operations with diverse e-invoicing mandates
- 2/3-way PO matching requirements for materials and components
- Opportunity: Touchless processing for recurring supplier invoices with intelligent line item extraction and automated PO matching

### Retail
- Massive invoice volumes from product suppliers, logistics providers, and service vendors
- Seasonal peaks that overwhelm manual AP teams
- Multi-currency, multi-language invoices from global supply chains
- Opportunity: Scale AP processing elastically with AI — handle peak volumes without adding headcount
`;
