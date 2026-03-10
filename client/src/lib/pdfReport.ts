import { renderToBuffer } from "@react-pdf/renderer";
import { createSeoPromptDocument } from "./reportTemplate";

interface ReportInput {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
}

export async function generateSeoPromptReport(
  input: ReportInput
): Promise<{ buffer: Buffer; filename: string }> {
  const generatedDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const doc = createSeoPromptDocument({
    prompt: input.prompt,
    fullName: input.fullName,
    email: input.email,
    brandName: input.brandName,
    generatedDate,
  });

  const buffer = await renderToBuffer(doc as React.JSX.Element);

  const safeBrand = (input.brandName || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
  const filename =
    safeBrand.length > 0 ? `${safeBrand}-seo-prompt.pdf` : "seo-prompt.pdf";

  return { buffer: Buffer.from(buffer), filename };
}
