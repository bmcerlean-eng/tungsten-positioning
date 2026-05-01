export const DWA_PRIMARY_PROMPT =
  "Tell me the account and scenario you're working on, and I'll build a tailored positioning brief.";

export const DWA_QUICK_STARTS = [
  "Position Tungsten as the AI Understanding Layer for Citibank — their AI CoE is mandated to build document understanding internally on Azure OpenAI",
  "Brief a CIO who thinks their AI CoE will solve unstructured data internally — make the Boring AI / build-vs-buy case",
  "Build me a deck for Aviva — position Knowledge Discovery for broker submission analysis and cross-claim fraud detection",
  "Help me handle the objection: 'Our agents will just call the LLM directly — why do we need Tungsten?'",
];

export const DWA_PROMPT_CATEGORIES = [
  {
    label: "Competitive Positioning",
    iconName: "Swords",
    color: "text-red-500",
    prompts: [
      "How do we win against [competitor] in this account?",
      "What's our pricing advantage vs Hyland for high-volume IDP?",
      "Build a battlecard: Tungsten vs Google Document AI for this use case",
    ],
  },
  {
    label: "Use Case Deep-Dive",
    iconName: "Search",
    color: "text-blue-500",
    prompts: [
      "Walk me through the Knowledge Discovery use case for syndicated lending",
      "What's the best TotalAgility tier for a mid-market insurer processing 500K claims/year?",
      "Show me how Copilot for Extraction reduces model training time for this document type",
    ],
  },
  {
    label: "Objection Handling",
    iconName: "Shield",
    color: "text-amber-500",
    prompts: [
      "They say 'We can build this with Azure AI Document Intelligence' — how do I respond?",
      "The client's AI CoE says they'll build this internally — give me the Boring AI counter",
      "They say 'Our agents will just call the LLM directly' — how do I reframe with the AI Understanding Layer wedge?",
      "The client thinks RPA from UiPath can handle their document processing — what's our counter?",
      "Procurement is pushing back on price — help me justify TotalAgility Advanced vs ABBYY",
    ],
  },
  {
    label: "Generate Deck",
    iconName: "Presentation",
    color: "text-green-500",
    prompts: [
      "Build me a 10-slide executive deck for [account] focusing on AI-ready data",
      "Create a competitive displacement deck: migrate from OpenText to Tungsten",
      "Generate a value-led deck for the CIO showing ROI across 3 use cases",
    ],
  },
];
