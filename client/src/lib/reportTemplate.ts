import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf", fontWeight: 500 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hjQ.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf", fontWeight: 700 },
  ],
});

const C = {
  bg: "#ffffff",
  surface: "#f8f9fb",
  border: "#e5e7eb",
  text: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  accent: "#2563eb",
  accentLight: "#eff6ff",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: C.text,
    backgroundColor: C.bg,
    paddingTop: 50,
    paddingBottom: 70,
    paddingHorizontal: 50,
  },

  /* header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: C.border,
    marginBottom: 24,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: C.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "#ffffff", fontSize: 14, fontWeight: 700 },
  headerTitle: { fontSize: 17, fontWeight: 700, letterSpacing: -0.3 },
  headerSub: { fontSize: 9.5, color: C.textMuted, marginTop: 1 },
  headerRight: { alignItems: "flex-end" },
  headerDate: { fontSize: 10, fontWeight: 600, color: C.textSecondary },
  headerUrl: { fontSize: 9, color: C.textMuted, marginTop: 2 },

  /* section label */
  sectionLabel: {
    fontSize: 8.5,
    fontWeight: 600,
    letterSpacing: 0.6,
    textTransform: "uppercase" as const,
    color: C.textMuted,
    marginBottom: 10,
  },

  /* client card */
  clientCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 18,
    marginBottom: 24,
  },
  clientGrid: {
    flexDirection: "row" as const,
    gap: 20,
  },
  clientCol: { flex: 1 },
  clientLabel: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: 0.4,
    textTransform: "uppercase" as const,
    color: C.textMuted,
    marginBottom: 3,
  },
  clientValue: { fontSize: 11, fontWeight: 500, color: C.text },

  /* prompt area */
  promptCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    padding: 22,
  },
  badge: {
    fontSize: 8,
    fontWeight: 600,
    color: C.accent,
    backgroundColor: C.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
    marginLeft: 6,
  },
  sectionLabelRow: {
    flexDirection: "row" as const,
    alignItems: "center",
    marginBottom: 10,
  },

  /* prompt sections */
  promptBlock: { marginBottom: 14 },
  promptHeading: {
    fontSize: 10.5,
    fontWeight: 700,
    color: C.accent,
    paddingBottom: 4,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  promptContent: {
    fontSize: 9.5,
    lineHeight: 1.7,
    color: C.text,
  },

  /* watermark */
  watermark: {
    position: "absolute" as const,
    bottom: 90,
    right: 30,
    fontSize: 54,
    fontWeight: 700,
    color: "rgba(0,0,0,0.02)",
    transform: "rotate(-18deg)",
  },

  /* footer */
  footer: {
    position: "absolute" as const,
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 10,
  },
  footerText: { fontSize: 8, color: C.textMuted },
  footerLink: { fontSize: 8, color: C.textSecondary, textDecoration: "none" as const },
});

interface ReportParams {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
  generatedDate: string;
}

interface PromptSection {
  heading: string | null;
  content: string;
}

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
        sections.push({ heading: currentHeading, content: currentLines.join("\n").trim() });
      }
      currentHeading = headingMatch[0];
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }

  if (currentLines.length > 0 || currentHeading) {
    sections.push({ heading: currentHeading, content: currentLines.join("\n").trim() });
  }
  return sections;
}

export function createSeoPromptDocument(props: ReportParams) {
  const { prompt, fullName, email, brandName, generatedDate } = props;
  const sections = parsePromptSections(prompt);
  const year = new Date().getFullYear();

  return React.createElement(
    Document,
    { title: `SEO Prompt Report – ${brandName}`, author: "SEO Prompt AI" },
    React.createElement(
      Page,
      { size: "A4", style: s.page },

      /* Watermark */
      React.createElement(Text, { style: s.watermark, fixed: true }, "SEO Prompt AI"),

      /* Header */
      React.createElement(
        View,
        { style: s.header, fixed: true },
        React.createElement(
          View,
          { style: s.headerLeft },
          React.createElement(
            View,
            { style: s.logoPlaceholder },
            React.createElement(Text, { style: s.logoText }, "S")
          ),
          React.createElement(
            View,
            null,
            React.createElement(Text, { style: s.headerTitle }, "SEO Prompt Report"),
            React.createElement(Text, { style: s.headerSub }, "Generated by SEO Prompt AI")
          )
        ),
        React.createElement(
          View,
          { style: s.headerRight },
          React.createElement(Text, { style: s.headerDate }, generatedDate),
          React.createElement(Text, { style: s.headerUrl }, "seopromptai.com")
        )
      ),

      /* Client Details */
      React.createElement(
        View,
        { style: s.clientCard, wrap: false },
        React.createElement(Text, { style: s.sectionLabel }, "CLIENT DETAILS"),
        React.createElement(
          View,
          { style: s.clientGrid },
          React.createElement(
            View,
            { style: s.clientCol },
            React.createElement(Text, { style: s.clientLabel }, "FULL NAME"),
            React.createElement(Text, { style: s.clientValue }, fullName || "—")
          ),
          React.createElement(
            View,
            { style: s.clientCol },
            React.createElement(Text, { style: s.clientLabel }, "EMAIL"),
            React.createElement(Text, { style: s.clientValue }, email || "—")
          ),
          React.createElement(
            View,
            { style: s.clientCol },
            React.createElement(Text, { style: s.clientLabel }, "BRAND NAME"),
            React.createElement(Text, { style: s.clientValue }, brandName || "—")
          )
        )
      ),

      /* Prompt Section */
      React.createElement(
        View,
        { style: { marginBottom: 16 } },
        React.createElement(
          View,
          { style: s.sectionLabelRow },
          React.createElement(Text, { style: s.sectionLabel }, "GENERATED SEO PROMPT"),
          React.createElement(Text, { style: s.badge }, "AI-Powered")
        ),
        React.createElement(
          View,
          { style: s.promptCard },
          ...(sections.length > 1
            ? sections.map((sec, i) =>
                React.createElement(
                  View,
                  { key: i, style: s.promptBlock },
                  sec.heading
                    ? React.createElement(Text, { style: s.promptHeading }, sec.heading)
                    : null,
                  React.createElement(Text, { style: s.promptContent }, sec.content)
                )
              )
            : [React.createElement(Text, { key: "raw", style: s.promptContent }, prompt)])
        )
      ),

      /* Footer */
      React.createElement(
        View,
        { style: s.footer, fixed: true },
        React.createElement(
          Link,
          { src: "https://seopromptai.com", style: s.footerLink },
          "Generated using seopromptai.com"
        ),
        React.createElement(Text, { style: s.footerText }, `© ${year} SEO Prompt AI`),
        React.createElement(
          Text,
          { style: s.footerText, render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Page ${pageNumber} of ${totalPages}` }
        )
      )
    )
  );
}
