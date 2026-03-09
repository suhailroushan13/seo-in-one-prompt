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
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const doc = createSeoPromptDocument({
    prompt: input.prompt,
    fullName: input.fullName,
    email: input.email,
    brandName: input.brandName,
    generatedDate,
  });

  const buffer = await renderToBuffer(doc as React.JSX.Element);

  return { buffer: Buffer.from(buffer), filename: "seo-prompt-report.pdf" };
}
