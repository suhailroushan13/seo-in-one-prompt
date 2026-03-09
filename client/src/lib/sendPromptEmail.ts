import nodemailer from "nodemailer";

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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); overflow: hidden;">
          <tr>
            <td style="padding: 32px 32px 24px;">
              <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #111;">Your SEO prompt is ready</h1>
              <p style="margin: 0; font-size: 15px; color: #444; line-height: 1.5;">${greeting}</p>
              <p style="margin: 16px 0 0; font-size: 15px; color: #444; line-height: 1.5;">Your generated SEO prompt is attached as a Markdown file (<strong>${filename}</strong>). Download the attachment and use it with your AI or dev team to implement the full SEO setup.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 24px;">
              <p style="margin: 0; font-size: 14px; color: #666;">— ${SITE_NAME}</p>
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
  name?: string
): Promise<void> {
  const transporter = getTransporter();
  const date = new Date().toISOString().slice(0, 10);
  const filename = `seo-prompt-${date}.md`;
  const html = getHtmlTemplate(name, filename);

  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Your SEO prompt from ${SITE_NAME}`,
    text: `Your generated SEO prompt is attached as a Markdown file (${filename}).\n\n— ${SITE_NAME}`,
    html,
    attachments: [
      {
        filename,
        content: Buffer.from(prompt, "utf-8"),
        contentType: "text/markdown",
      },
    ],
  });
}
