export const PDF_PRIMARY_PROMPT =
  "Tell me the account and PDF scenario you're working on, and I'll build a tailored positioning brief.";

export const PDF_QUICK_STARTS = [
  "A 200-person law firm is locked into Adobe Acrobat Pro subscriptions at $23/user/month — help me build the cost displacement case",
  "Position Power PDF Business for a bank with 5,000 users who need redaction and encryption for regulatory compliance",
  "A government agency needs accessible, Section 508-compliant PDF tools with perpetual licensing — no subscriptions",
  "Help me handle the objection: 'We've always used Adobe, why would we change?'",
];

export const PDF_PROMPT_CATEGORIES = [
  {
    label: "Competitive Positioning",
    iconName: "Swords",
    color: "text-red-500",
    prompts: [
      "How do we displace Adobe Acrobat Pro in a 1,000-user enterprise with an expiring EA?",
      "Build a TCO comparison: Power PDF Advanced vs Adobe Acrobat Pro vs Nitro PDF Pro for 500 users over 3 years",
      "What's our positioning against Foxit for a mid-market company evaluating PDF alternatives?",
    ],
  },
  {
    label: "Use Case Deep-Dive",
    iconName: "Search",
    color: "text-blue-500",
    prompts: [
      "Walk me through the Power PDF Business deployment model for a Citrix-based financial services firm",
      "How does Power PDF handle Bates numbering and redaction for a litigation support team?",
      "Show me the e-signature workflow for a healthcare provider processing patient consent forms",
    ],
  },
  {
    label: "Objection Handling",
    iconName: "Shield",
    color: "text-amber-500",
    prompts: [
      "The client says 'Adobe is the industry standard' — how do I reframe that?",
      "Procurement wants to know why they should switch from a tool everyone already knows — build the case",
      "IT is concerned about migration complexity from Adobe to Power PDF across 2,000 desktops — what's my response?",
    ],
  },
  {
    label: "Generate Deck",
    iconName: "Presentation",
    color: "text-green-500",
    prompts: [
      "Build me a 10-slide cost displacement deck for a law firm migrating from Adobe to Power PDF",
      "Create a compliance-focused deck for a government agency evaluating Power PDF Business",
      "Generate an executive summary deck showing 3-year TCO savings for a 500-user financial services deployment",
    ],
  },
];
