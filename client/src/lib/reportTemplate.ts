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
  ],
});

const C = {
  bg: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
};

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: C.text,
    backgroundColor: C.bg,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 50,
  },

  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  topItem: {
    fontSize: 10,
    color: C.textSecondary,
  },
  topSeparator: {
    fontSize: 10,
    color: C.textMuted,
  },

  promptBlock: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.6,
    color: C.text,
  },

  footer: {
    position: "absolute" as const,
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: "row" as const,
    justifyContent: "center",
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

export function createSeoPromptDocument(props: ReportParams) {
  const { prompt, fullName, email, generatedDate } = props;
  const year = new Date().getFullYear();

  return React.createElement(
    Document,
    { title: "SEO Prompt Report", author: "SEO Prompt AI" },
    React.createElement(
      Page,
      { size: "A4", style: s.page },

      /* Top: name, email, date/time */
      React.createElement(
        View,
        { style: s.topRow },
        React.createElement(Text, { style: s.topItem }, fullName || "—"),
        React.createElement(Text, { style: s.topSeparator }, " · "),
        React.createElement(Text, { style: s.topItem }, email || "—"),
        React.createElement(Text, { style: s.topSeparator }, " · "),
        React.createElement(Text, { style: s.topItem }, generatedDate)
      ),

      /* Complete prompt */
      React.createElement(Text, { style: s.promptBlock }, prompt),

      /* Simple footer */
      React.createElement(
        View,
        { style: s.footer, fixed: true },
        React.createElement(
          Link,
          { src: "https://seopromptai.com", style: s.footerLink },
          "seopromptai.com"
        ),
        React.createElement(Text, { style: s.footerText }, `  ·  © ${year}`)
      )
    )
  );
}
