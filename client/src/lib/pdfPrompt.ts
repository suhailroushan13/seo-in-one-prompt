import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MARGIN = 50;
const FONT_SIZE = 10;
const LINE_HEIGHT = 14;

/**
 * StandardFonts.Courier only supports WinAnsi (Latin-1). Replace Unicode characters
 * that can't be encoded (e.g. box-drawing ═ ║) with ASCII equivalents.
 */
function sanitizeForWinAnsi(text: string): string {
  const replacements: [RegExp | string, string][] = [
    ["═", "="],
    ["║", "|"],
    ["╔", "+"],
    ["╗", "+"],
    ["╚", "+"],
    ["╝", "+"],
    ["╠", "+"],
    ["╣", "+"],
    ["╦", "+"],
    ["╩", "+"],
    ["╬", "+"],
    ["─", "-"],
    ["│", "|"],
    ["┌", "+"],
    ["┐", "+"],
    ["└", "+"],
    ["┘", "+"],
    ["├", "+"],
    ["┤", "+"],
    ["┬", "+"],
    ["┴", "+"],
    ["┼", "+"],
  ];
  let out = text;
  for (const [from, to] of replacements) {
    out = out.split(from as string).join(to);
  }
  // Replace any remaining non–Latin-1 (e.g. smart quotes, other Unicode) so WinAnsi can encode
  return out.replace(/[\u0100-\uFFFF]/g, "?");
}

/**
 * Build a PDF from the prompt text and return the buffer and filename for email attachment.
 */
export async function buildPromptPdf(
  prompt: string,
  _userName: string,
  _brandName: string
): Promise<{ buffer: Buffer; filename: string }> {
  console.log("[buildPromptPdf] Starting PDF generation:", {
    promptLength: prompt.length,
    userName: _userName,
    brandName: _brandName,
  });

  const sanitizedPrompt = sanitizeForWinAnsi(prompt);

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Courier);
  const pages = doc.getPages();
  let page = pages[0] ?? doc.addPage();
  const { width, height } = page.getSize();
  const maxWidth = width - MARGIN * 2;
  let y = height - MARGIN;

  const lines = sanitizedPrompt.split(/\r?\n/);
  console.log("[buildPromptPdf] Processing lines:", lines.length);

  for (const line of lines) {
    const wrapped = wrapLine(line, font, FONT_SIZE, maxWidth);

    for (const sub of wrapped) {
      if (y < MARGIN) {
        page = doc.addPage();
        y = page.getHeight() - MARGIN;
      }
      page.drawText(sub, {
        x: MARGIN,
        y,
        size: FONT_SIZE,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= LINE_HEIGHT;
    }
  }

  console.log("[buildPromptPdf] Saving PDF...");
  const bytes = await doc.save();
  const buffer = Buffer.from(bytes);
  const filename = `seo-prompt-${Date.now()}.pdf`;

  console.log("[buildPromptPdf] PDF created:", {
    filename,
    bufferSize: buffer.length,
    pageCount: doc.getPageCount(),
  });
  console.log("[buildPromptPdf] PDF generated: yes");

  return { buffer, filename };
}

function wrapLine(
  line: string,
  font: { widthOfTextAtSize: (text: string, size: number) => number },
  fontSize: number,
  maxWidth: number
): string[] {
  const out: string[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    let chunk = remaining;
    let w = font.widthOfTextAtSize(chunk, fontSize);

    while (w > maxWidth && chunk.length > 1) {
      const breakAt = Math.max(1, Math.floor((maxWidth / w) * chunk.length));
      let space = chunk.lastIndexOf(" ", breakAt);
      if (space <= 0) space = breakAt;
      chunk = chunk.slice(0, space);
      w = font.widthOfTextAtSize(chunk, fontSize);
    }

    out.push(chunk);
    remaining = remaining.slice(chunk.length).replace(/^\s+/, "");
  }

  return out.length ? out : [""];
}
