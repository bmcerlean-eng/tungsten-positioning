export const PRINT_PRIMARY_PROMPT =
  "Tell me the account and print management scenario you're working on, and I'll build a tailored positioning brief.";

export const PRINT_QUICK_STARTS = [
  "A bank with 200 branches wants to eliminate print servers and implement secure release at every MFP — position Printix",
  "Help me displace PaperCut at a healthcare system — they need HIPAA-compliant printing with audit trails",
  "A global enterprise with 10,000 users across 15 countries needs cloud print management — no VPN, no print servers",
  "Position ControlSuite for a manufacturer who needs content-aware printing for quality documents and compliance labels",
];

export const PRINT_PROMPT_CATEGORIES = [
  {
    label: "Competitive Positioning",
    iconName: "Swords",
    color: "text-red-500",
    prompts: [
      "How do we displace PaperCut at this account? They've had it for 5 years.",
      "Build a battlecard: Printix vs Microsoft Universal Print — what does Universal Print lack?",
      "The client is evaluating Y Soft and Printix — give me the competitive positioning to win",
    ],
  },
  {
    label: "Use Case Deep-Dive",
    iconName: "Search",
    color: "text-blue-500",
    prompts: [
      "Walk me through secure print release for a hospital with 50 MFPs across 3 buildings",
      "How does Printix handle a multi-country deployment with diverse fleets and no VPN?",
      "Show me the ControlSuite value story for content-aware printing in a regulated manufacturer",
    ],
  },
  {
    label: "Objection Handling",
    iconName: "Shield",
    color: "text-amber-500",
    prompts: [
      "The CIO says 'print is dying' — how do I reframe the conversation around print management?",
      "IT says Microsoft Universal Print is good enough — give me the counter-argument",
      "The client says they have no budget for print infrastructure — how do I flip that objection?",
    ],
  },
  {
    label: "Generate Deck",
    iconName: "Presentation",
    color: "text-green-500",
    prompts: [
      "Build me a 10-slide deck for a bank wanting to eliminate print servers across 200 branches",
      "Create a competitive displacement deck: migrate from PaperCut to Printix",
      "Generate a value-led deck for the IT Director showing print infrastructure cost savings",
    ],
  },
];
