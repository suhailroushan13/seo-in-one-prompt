import nodemailer from "nodemailer";
import { generateSeoPromptReport } from "./pdfReport";
import { buildMarkdown, promptFilename } from "./delivery";
import { SITE_URL } from "./product";

const FROM_ADDRESS = process.env.GMAIL_OWNER ?? process.env.OWNER_EMAIL;
const SITE_NAME = process.env.SITE_NAME ?? "SEO Prompt Generator";

function getTransporter() {
  const user = process.env.GMAIL_OWNER ?? process.env.OWNER_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("Missing GMAIL_OWNER or GMAIL_APP_PASSWORD in .env");
  }
  // Google app passwords are displayed in 4-char groups; strip the spacing.
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: pass.replace(/\s+/g, "") },
  });
}

interface TemplateParams {
  name?: string;
  brandName?: string;
  pdfName: string;
  mdName: string;
  deliveryUrl?: string;
}

function buildHtml({
  name,
  brandName,
  pdfName,
  mdName,
  deliveryUrl,
}: TemplateParams): string {
  const greeting = name?.trim() ? `Hi ${name.trim()},` : "Hi,";
  const project = brandName?.trim() || "your project";
  const host = (() => {
    try {
      return new URL(SITE_URL).hostname;
    } catch {
      return SITE_URL;
    }
  })();

  const button = deliveryUrl
    ? `<tr>
            <td style="padding:0 36px 8px;">
              <a href="${deliveryUrl}" style="display:inline-block;background:#059669;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:13px 26px;border-radius:12px;">Open your prompt online</a>
              <p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">Copy it, or download PDF / Markdown / plain text.</p>
            </td>
          </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your SEO prompt for ${project}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:18px;box-shadow:0 8px 32px rgba(15,23,42,0.08);overflow:hidden;">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#059669,#10b981,#34d399);font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 36px 8px;">
              <p style="margin:0 0 20px;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#059669;">Payment confirmed</p>
              <h1 style="margin:0 0 10px;font-size:25px;line-height:1.25;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">Your SEO prompt for ${project} is ready</h1>
              <p style="margin:0;font-size:15px;color:#475569;line-height:1.65;">${greeting}</p>
              <p style="margin:14px 0 0;font-size:15px;color:#475569;line-height:1.65;">Thanks for your purchase. Your complete SEO implementation prompt is attached to this email in two formats:</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:18px 0 4px;width:100%;">
                <tr>
                  <td style="padding:11px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;color:#334155;">
                    <strong style="color:#0f172a;">${pdfName}</strong> &nbsp;·&nbsp; print-ready PDF
                  </td>
                </tr>
                <tr><td style="height:8px;font-size:0;line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding:11px 14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;color:#334155;">
                    <strong style="color:#0f172a;">${mdName}</strong> &nbsp;·&nbsp; Markdown for your editor
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${button}
          <tr>
            <td style="padding:24px 36px 32px;">
              <p style="margin:0 0 6px;font-size:14px;font-weight:600;color:#0f172a;">How to use it</p>
              <ol style="margin:0;padding-left:18px;font-size:14px;color:#475569;line-height:1.7;">
                <li>Open the attachment and copy the whole prompt.</li>
                <li>Paste it into Cursor, Claude, or any AI editor.</li>
                <li>Use a strong model (Claude Opus or Sonnet) for the best output.</li>
              </ol>
              <p style="margin:22px 0 0;font-size:13px;color:#64748b;line-height:1.6;">Reply to this email if anything looks wrong — a human reads it.</p>
              <p style="margin:20px 0 0;font-size:14px;color:#94a3b8;">— ${SITE_NAME}</p>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">
          Sent from <a href="${SITE_URL}" style="color:#64748b;text-decoration:none;font-weight:500;">${host}</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface SendPromptEmailInput {
  to: string;
  prompt: string;
  name?: string;
  brandName?: string;
  orderId?: string;
}

export async function sendPromptEmail({
  to,
  prompt,
  name,
  brandName,
  orderId,
}: SendPromptEmailInput): Promise<void> {
  const transporter = getTransporter();
  const project = (brandName ?? "").trim() || "Project";

  const { buffer, filename } = await generateSeoPromptReport({
    prompt,
    fullName: (name ?? "").trim(),
    email: to,
    brandName: project,
    orderId,
  });

  const mdName = promptFilename(brandName, "md");
  const markdown = buildMarkdown(prompt, {
    brandName,
    fullName: name,
    email: to,
    orderId,
  });
  const deliveryUrl = orderId
    ? `${SITE_URL}/delivery/${encodeURIComponent(orderId)}`
    : undefined;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to,
    subject: `Your SEO prompt for ${project} — ${SITE_NAME}`,
    text: [
      name?.trim() ? `Hi ${name.trim()},` : "Hi,",
      "",
      `Your complete SEO implementation prompt for ${project} is attached (${filename} and ${mdName}).`,
      deliveryUrl ? `\nView it online: ${deliveryUrl}` : "",
      "",
      "Paste the prompt into Cursor, Claude, or any AI editor. Use Claude Opus or Sonnet for the best results.",
      "",
      `— ${SITE_NAME}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: buildHtml({
      name,
      brandName,
      pdfName: filename,
      mdName,
      deliveryUrl,
    }),
    attachments: [
      { filename, content: buffer, contentType: "application/pdf" },
      { filename: mdName, content: markdown, contentType: "text/markdown" },
    ],
  });
}
