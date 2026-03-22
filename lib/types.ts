export interface DeckRequest {
  topic: string;
  audience: string;
  slideCount: number;
  context?: string;
}

export interface DeckSlide {
  layout: "title" | "content-white" | "content-blue" | "section" | "closing";
  title: string;
  subtitle?: string;
  bullets?: string[];
  speakerNotes?: string;
}

export interface GeneratedDeck {
  title: string;
  subtitle: string;
  slides: DeckSlide[];
}

export interface PromptCategory {
  label: string;
  iconName: string;
  color: string;
  prompts: string[];
}
