import { buildDWASystemPrompt } from "./dwa-system-prompt";
import { DWA_SUPPLEMENTARY_CONTENT } from "./dwa-content";
import { buildAPARSystemPrompt } from "./apar-system-prompt";
import { APAR_SUPPLEMENTARY_CONTENT } from "./apar-content";
import { buildPDFSystemPrompt } from "./pdf-system-prompt";
import { PDF_SUPPLEMENTARY_CONTENT } from "./pdf-content";
import { buildPrintSystemPrompt } from "./print-system-prompt";
import { PRINT_SUPPLEMENTARY_CONTENT } from "./print-content";

export function getPillarPrompt(pillarId: string): { systemPrompt: string; content: string } {
  switch (pillarId) {
    case "ap-ar":
      return { systemPrompt: buildAPARSystemPrompt(), content: APAR_SUPPLEMENTARY_CONTENT };
    case "pdf":
      return { systemPrompt: buildPDFSystemPrompt(), content: PDF_SUPPLEMENTARY_CONTENT };
    case "print":
      return { systemPrompt: buildPrintSystemPrompt(), content: PRINT_SUPPLEMENTARY_CONTENT };
    default:
      return { systemPrompt: buildDWASystemPrompt(), content: DWA_SUPPLEMENTARY_CONTENT };
  }
}
