interface ReportParams {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
  generatedDate: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function getReportHtml(params: ReportParams): string {
  const { prompt, fullName, email, brandName, generatedDate } = params;

  const sections = parsePromptSections(prompt);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SEO Prompt Report – ${escapeHtml(brandName)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --color-bg: #ffffff;
    --color-surface: #f8f9fb;
    --color-border: #e5e7eb;
    --color-text: #111827;
    --color-text-secondary: #6b7280;
    --color-text-muted: #9ca3af;
    --color-accent: #2563eb;
    --color-accent-light: #eff6ff;
    --radius: 10px;
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
    --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  }

  html, body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-bg);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .page-wrapper {
    max-width: 100%;
    padding: 0;
  }

  /* ── HEADER ── */
  .report-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0 24px;
    border-bottom: 2px solid var(--color-border);
    margin-bottom: 28px;
    page-break-inside: avoid;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-logo {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .header-text h1 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text);
  }

  .header-text p {
    font-size: 12px;
    color: var(--color-text-muted);
    margin-top: 1px;
  }

  .header-date {
    text-align: right;
    font-size: 12px;
    color: var(--color-text-muted);
    white-space: nowrap;
  }

  .header-date strong {
    display: block;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  /* ── SECTION TITLES ── */
  .section-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: 12px;
  }

  /* ── CLIENT CARD ── */
  .client-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 28px;
    box-shadow: var(--shadow-card);
    page-break-inside: avoid;
  }

  .client-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }

  .client-field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin-bottom: 4px;
  }

  .client-field span {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text);
  }

  /* ── PROMPT SECTION ── */
  .prompt-section {
    margin-bottom: 24px;
  }

  .prompt-box {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 24px 28px;
    box-shadow: var(--shadow-card);
  }

  .prompt-text {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--color-text);
    white-space: pre-wrap;
    word-break: break-word;
    tab-size: 4;
  }

  /* Structured prompt styling */
  .prompt-section-block {
    margin-bottom: 20px;
  }

  .prompt-section-block:last-child {
    margin-bottom: 0;
  }

  .prompt-heading {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-accent);
    letter-spacing: -0.01em;
    padding-bottom: 6px;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--color-border);
  }

  .prompt-sub-content {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--color-text);
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* ── DIVIDER ── */
  .divider {
    height: 1px;
    background: var(--color-border);
    margin: 20px 0;
    border: none;
  }

  /* ── BADGE ── */
  .badge {
    display: inline-block;
    background: var(--color-accent-light);
    color: var(--color-accent);
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 100px;
    letter-spacing: 0.02em;
  }

  /* ── WATERMARK ── */
  .watermark {
    position: fixed;
    bottom: 60px;
    right: 40px;
    font-size: 72px;
    font-weight: 700;
    color: rgba(0,0,0,0.018);
    letter-spacing: -0.04em;
    pointer-events: none;
    transform: rotate(-18deg);
    z-index: -1;
  }
</style>
</head>
<body>
<div class="page-wrapper">

  <div class="watermark">SEO Prompt AI</div>

  <!-- Header -->
  <header class="report-header">
    <div class="header-left">
      <img
        class="header-logo"
        src="https://seopromptai.com/favicon.ico"
        alt="SEO Prompt AI"
        onerror="this.style.display='none'"
      />
      <div class="header-text">
        <h1>SEO Prompt Report</h1>
        <p>Generated by SEO Prompt AI</p>
      </div>
    </div>
    <div class="header-date">
      <strong>${escapeHtml(generatedDate)}</strong>
      <span>seopromptai.com</span>
    </div>
  </header>

  <!-- Client Details -->
  <div class="client-card">
    <p class="section-title">Client Details</p>
    <div class="client-grid">
      <div class="client-field">
        <label>Full Name</label>
        <span>${escapeHtml(fullName || "—")}</span>
      </div>
      <div class="client-field">
        <label>Email</label>
        <span>${escapeHtml(email || "—")}</span>
      </div>
      <div class="client-field">
        <label>Brand Name</label>
        <span>${escapeHtml(brandName || "—")}</span>
      </div>
    </div>
  </div>

  <!-- Prompt -->
  <div class="prompt-section">
    <p class="section-title">Generated SEO Prompt &nbsp;<span class="badge">AI-Powered</span></p>
    <div class="prompt-box">
      ${sections.length > 1 ? renderStructuredPrompt(sections) : `<div class="prompt-text">${escapeHtml(prompt)}</div>`}
    </div>
  </div>

</div>
</body>
</html>`;
}

interface PromptSection {
  heading: string | null;
  content: string;
}

/**
 * Splits the generated prompt into logical sections based on the
 * ══════ dividers and numbered headers used by buildPrompt().
 */
function parsePromptSections(prompt: string): PromptSection[] {
  const lines = prompt.split(/\r?\n/);
  const sections: PromptSection[] = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^[═]{4,}$/.test(trimmed)) continue;

    const headingMatch = trimmed.match(
      /^(?:\d+\.\s+)?([A-Z][A-Z &/\-–—()]+)$/
    );
    if (headingMatch && trimmed.length > 4) {
      if (currentLines.length > 0 || currentHeading) {
        sections.push({
          heading: currentHeading,
          content: currentLines.join("\n").trim(),
        });
      }
      currentHeading = headingMatch[0];
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  if (currentLines.length > 0 || currentHeading) {
    sections.push({
      heading: currentHeading,
      content: currentLines.join("\n").trim(),
    });
  }

  return sections;
}

function renderStructuredPrompt(sections: PromptSection[]): string {
  return sections
    .map((s) => {
      if (s.heading) {
        return `<div class="prompt-section-block">
  <div class="prompt-heading">${escapeHtml(s.heading)}</div>
  <div class="prompt-sub-content">${escapeHtml(s.content)}</div>
</div>`;
      }
      return `<div class="prompt-section-block">
  <div class="prompt-sub-content">${escapeHtml(s.content)}</div>
</div>`;
    })
    .join("\n");
}
