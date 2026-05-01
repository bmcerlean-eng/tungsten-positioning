export const APAR_PRIMARY_PROMPT =
  "Tell me the account and AP/AR scenario you're working on, and I'll build a tailored positioning brief.";

export const APAR_QUICK_STARTS = [
  "We're pitching a global manufacturer running SAP — they process 500K invoices/year across 12 countries and need e-invoicing compliance",
  "Position InvoiceAgility as the AI Understanding Layer for AP — the CFO and CIO are aligned on AI-led finance transformation",
  "Counter a build-it-yourself agentic AP pitch — their AI CoE wants to point a GenAI agent at the AP inbox",
  "Build a competitive displacement deck: migrate a bank from Basware to Tungsten InvoiceAgility",
];

export const APAR_PROMPT_CATEGORIES = [
  {
    label: "Competitive Positioning",
    iconName: "Swords",
    color: "text-red-500",
    prompts: [
      "How do we displace SAP Concur's invoice module at this account?",
      "Build a battlecard: Tungsten InvoiceAgility vs Coupa invoice capture",
      "What's our competitive advantage over Basware for a global manufacturer?",
    ],
  },
  {
    label: "Use Case Deep-Dive",
    iconName: "Search",
    color: "text-blue-500",
    prompts: [
      "Walk me through InvoiceAgility's e-invoicing compliance for a company operating across 15 EU countries",
      "How does InvoiceAgility handle 2/3-way PO matching for a complex manufacturing supply chain?",
      "Show me the ROI model for a retailer processing 100K invoices/month with 60% manual intervention",
    ],
  },
  {
    label: "Objection Handling",
    iconName: "Shield",
    color: "text-amber-500",
    prompts: [
      "They say 'Our ERP handles AP already' — how do I respond?",
      "Their AI CoE wants to build invoice automation internally on Azure OpenAI — give me the Boring AI counter",
      "They want to point a GenAI agent at the AP inbox — how do I reframe with the agent-addressable / trusted-data wedge?",
      "The client just implemented Coupa and thinks they don't need InvoiceAgility — what's our counter?",
      "CFO says their invoice volume is too low to justify automation — help me reframe",
    ],
  },
  {
    label: "Generate Deck",
    iconName: "Presentation",
    color: "text-green-500",
    prompts: [
      "Build me a 10-slide executive deck for a global retailer focusing on touchless AP processing",
      "Create a competitive displacement deck: migrate from AvidXchange to Tungsten InvoiceAgility",
      "Generate a CFO-ready deck showing ROI from early-payment discount capture and duplicate prevention",
    ],
  },
];
