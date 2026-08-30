export interface PromptSection {
  /** `null` for the introductory paragraph that precedes the first banner. */
  title: string | null;
  body: string;
}

const isRule = (line: string) => /^={5,}\s*$/.test(line.trim());

/**
 * Splits a generated prompt on its `===` banner headings, so it can be rendered
 * as navigable sections instead of one wall of text.
 */
export function parsePromptSections(prompt: string): PromptSection[] {
  const lines = prompt.replace(/\r\n/g, "\n").split("\n");
  const sections: PromptSection[] = [];
  let currentTitle: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join("\n").replace(/^\n+|\n+$/g, "");
    if (currentTitle !== null || body) sections.push({ title: currentTitle, body });
    buffer = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const titleLine = lines[i + 1];
    const closingLine = lines[i + 2];
    if (
      isRule(line) &&
      titleLine !== undefined &&
      titleLine.trim() &&
      !isRule(titleLine) &&
      closingLine !== undefined &&
      isRule(closingLine)
    ) {
      flush();
      currentTitle = titleLine.trim();
      i += 2;
      continue;
    }
    buffer.push(line);
  }
  flush();

  return sections.filter((section) => section.title || section.body);
}

/** Strips a leading `N.` from a banner title for compact navigation labels. */
export function shortSectionLabel(title: string): string {
  return title.replace(/^\s*\d+\.\s*/, "").trim();
}
