export const PRINT_SUPPLEMENTARY_CONTENT = `
## Discovery Questions for AEs and BDRs

Use these questions during initial discovery calls to qualify opportunities and identify positioning angles.

### Fleet & Infrastructure
1. How many print devices are in your fleet across all locations?
2. Do you still run on-premises print servers? How many?
3. Do remote workers need VPN to print? What's the friction?
4. What's your current print management solution (PaperCut, Y Soft, native OS print)?

### Compliance & Security
5. Do you have compliance requirements for print audit trails or secure release (GDPR, HIPAA, SOX)?
6. Is secure print release (badge/card/QR) deployed today, or are documents left uncollected at printers?

### Workforce & Cost
7. What percentage of your workforce is remote or hybrid?
8. What's your estimated annual print infrastructure cost (servers, licenses, IT support, hardware)?

### Capture & Workflows
9. Do you need document capture/scan workflows in addition to print management (scan-to-email, scan-to-SharePoint)?

---

## Common Objections and Responses

### 1. "Print is dying — why invest in print management?"
**Reframe:** Print volumes may decline but print MANAGEMENT is growing. Regulatory compliance, secure document handling, and audit trails are more critical than ever. The question isn't whether you print — it's whether you control what happens when you do. Unmanaged print environments are a data exfiltration risk, a compliance gap, and a hidden cost centre.
**Evidence:** GDPR, HIPAA, and SOX all require audit trails for sensitive document handling. Organisations without secure release leave an average of 20% of print jobs uncollected at the printer — that's sensitive data sitting in open trays.

### 2. "We already have PaperCut / Y Soft"
**Reframe:** Legacy print management was designed for on-premises environments. It requires print servers in every location, VPN access for remote workers, and constant IT maintenance — driver updates, server patching, queue management. Printix is serverless SaaS — eliminate that infrastructure entirely. No servers, no VPN, automatic updates, cloud-native security.
**Evidence:** Organisations migrating from on-prem print management to Printix typically decommission all print servers within 90 days. IT support tickets related to printing drop significantly when VPN dependency is removed.

### 3. "Microsoft Universal Print is enough"
**Reframe:** Universal Print provides basic print routing — it sends a document to a printer. But it lacks secure print release at the device, content-aware document processing, capture and scan workflows, fleet analytics, cost allocation, and compliance audit trails. Universal Print is a print queue, not a print management platform. For organisations with compliance requirements, multi-vendor fleets, or secure release needs, it falls short.
**Evidence:** Universal Print has no secure release mechanism (no card, no QR, no PIN at the device). No content-aware processing to detect sensitive data mid-print-stream. No analytics dashboard for fleet optimisation or cost reporting.

### 4. "No budget for print infrastructure"
**Reframe:** That's exactly the point — Printix eliminates print infrastructure. No servers to buy, no hardware to maintain, no patches to apply. SaaS pricing replaces capital expenditure with predictable operating expenditure. The cost of doing nothing is the cost of maintaining your current print servers, VPN infrastructure, and IT support burden.
**Evidence:** Print server infrastructure costs are often invisible because they're spread across hardware budgets, licensing agreements, and IT support hours. When aggregated, organisations are frequently surprised by the true cost of maintaining on-premises print management.

### 5. "Our fleet is too diverse — multiple brands, multiple locations"
**Reframe:** Printix was designed for exactly this scenario. Automatic printer discovery identifies every device on the network regardless of manufacturer. Intelligent driver management handles multi-vendor fleets natively — HP, Canon, Ricoh, Xerox, Konica Minolta, all managed from one cloud console. Cross-platform support means Windows, Mac, Chromebook, iOS, and Android users all print through the same system.
**Evidence:** Printix supports automatic discovery and management across all major printer manufacturers. Cross-platform support includes Windows, Windows ARM, Mac, iOS, Android, and Chromebook — all from a single cloud management plane.

---

## Industry-Specific Value Hooks

### Banking & Financial Services
- Secure print release at every branch MFP — no documents left uncollected in open trays
- Full audit trail for regulatory compliance (SOX, PCI-DSS, GDPR) — who printed what, when, where
- Eliminate print servers across hundreds of branches — centralise management in the cloud
- Content-aware printing to prevent sensitive financial data from being printed without authorisation

### Healthcare
- HIPAA-compliant printing with secure release — patient records never sit unattended at a printer
- Mobile printing for clinical staff — print from tablets and mobile devices at point of care
- Audit trails for every print, copy, and scan event involving protected health information
- Eliminate VPN dependency for travelling clinicians and remote administrative staff

### Government
- Classified and sensitive document handling with secure release and full audit trails
- Zero Trust architecture aligns with government cybersecurity mandates
- Cross-agency fleet management — consolidate print infrastructure across departments
- Cost transparency and allocation reporting for public accountability

### Manufacturing
- Content-aware printing for quality documents, compliance labels, and controlled specifications
- Floor-level printing with secure release — prevent IP leakage on production documentation
- Multi-site fleet management across plants, offices, and distribution centres
- ControlSuite integration for real-time document interrogation of quality and compliance prints
`;
