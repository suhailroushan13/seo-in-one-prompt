import puppeteer from "puppeteer";
import { getReportHtml } from "./reportTemplate";

interface ReportInput {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
}

const FOOTER_TEMPLATE = `
<div style="width:100%; padding:0 40px; font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; font-size:9px; color:#9ca3af; display:flex; justify-content:space-between; align-items:center;">
  <span>Generated using seopromptai.com</span>
  <span>&copy; ${new Date().getFullYear()} SEO Prompt AI</span>
  <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
</div>`;

const HEADER_TEMPLATE = `<div style="width:100%; height:1px;"></div>`;

export async function generateSeoPromptReport(
  input: ReportInput
): Promise<{ buffer: Buffer; filename: string }> {
  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = getReportHtml({
    prompt: input.prompt,
    fullName: input.fullName,
    email: input.email,
    brandName: input.brandName,
    generatedDate,
  });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "25mm",
        left: "20mm",
      },
      displayHeaderFooter: true,
      headerTemplate: HEADER_TEMPLATE,
      footerTemplate: FOOTER_TEMPLATE,
    });

    const buffer = Buffer.from(pdfBytes);
    const filename = "seo-prompt-report.pdf";

    return { buffer, filename };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
