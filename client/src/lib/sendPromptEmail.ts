import nodemailer from "nodemailer";
import { buildPromptPdf } from "./pdfPrompt";

const FROM = process.env.GMAIL_OWNER ?? process.env.OWNER_EMAIL;
const SITE_NAME = process.env.SITE_NAME ?? "SEO Prompt AI";

function getTransporter() {
  const user = process.env.GMAIL_OWNER ?? process.env.OWNER_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    throw new Error("Missing GMAIL_OWNER or GMAIL_APP_PASSWORD in .env");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass: pass.trim() },
  });
}

function getHtmlTemplate(name: string | undefined, filename: string): string {
  const greeting = name ? `Hi ${name},` : "Hi,";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your SEO prompt from ${SITE_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); min-height: 100vh;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh; padding: 40px 20px;">
    <tr>
      <td align="center" style="vertical-align: top;">
        <table role="presentation" cellspacing="0" cellpadding="0" style="max-width: 520px; width: 100%; background: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04); overflow: hidden;">
          <tr>
            <td style="padding: 40px 36px 32px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0f172a 0%, #334155 100%); border-radius: 12px; margin-bottom: 24px;"></div>
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">Your SEO prompt is ready</h1>
              <p style="margin: 0; font-size: 16px; color: #475569; line-height: 1.6;">${greeting}</p>
              <p style="margin: 20px 0 0; font-size: 15px; color: #475569; line-height: 1.65;">Your generated SEO prompt is attached as a <strong>PDF</strong> (<strong>${filename}</strong>). Open the attachment to view your full prompt and use it with your AI or dev team to implement the SEO setup.</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 28px;">
                <tr>
                  <td style="padding: 14px 20px; background: #f1f5f9; border-radius: 10px;">
                    <p style="margin: 0; font-size: 13px; color: #64748b;">📎 Attachment: <strong style="color: #334155;">${filename}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 36px 32px;">
              <p style="margin: 0; font-size: 14px; color: #94a3b8;">— ${SITE_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPromptEmail(
  to: string,
  prompt: string,
  name?: string,
  brandName?: string
): Promise<void> {
  console.log("[sendPromptEmail] Starting email send:", {
    to,
    promptLength: prompt.length,
    name,
    brandName,
  });

  const transporter = getTransporter();
  const userName = (name ?? "").trim() || "User";
  const brand = (brandName ?? "").trim() || "Project";
  
  console.log("[sendPromptEmail] Building PDF...");
  const { buffer, filename } = await buildPromptPdf(prompt, userName, brand);
  console.log("[sendPromptEmail] PDF built:", {
    filename,
    bufferSize: buffer.length,
  });

  const html = getHtmlTemplate(name, filename);

  console.log("[sendPromptEmail] Sending email via Gmail...");
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Your SEO prompt from ${SITE_NAME}`,
    text: `Your generated SEO prompt is attached as a PDF (${filename}). Open the attachment to view your full prompt.\n\n— ${SITE_NAME}`,
    html,
    attachments: [
      {
        filename,
        content: buffer,
        contentType: "application/pdf",
      },
    ],
  });
  console.log("[sendPromptEmail] Email sent successfully to:", to);
}
