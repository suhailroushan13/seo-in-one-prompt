import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import { parsePromptSections } from "./promptSections";

/**
 * Only the PDF standard-14 fonts are used (Helvetica for chrome, Courier for
 * the prompt body so its column alignment survives). No network fetch at render
 * time, so delivery never fails because a font CDN is slow.
 */
const FONT_UI = "Helvetica";
const FONT_MONO = "Courier";

const C = {
  page: "#ffffff",
  ink: "#0f172a",
  body: "#334155",
  muted: "#64748b",
  faint: "#94a3b8",
  rule: "#e2e8f0",
  ruleSoft: "#f1f5f9",
  brand: "#059669",
  brandSoft: "#ecfdf5",
};

const s = StyleSheet.create({
  page: {
    fontFamily: FONT_UI,
    fontSize: 9.5,
    color: C.body,
    backgroundColor: C.page,
    paddingTop: 44,
    paddingBottom: 56,
    paddingHorizontal: 46,
  },

  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: C.brand,
  },

  eyebrow: {
    fontFamily: FONT_UI,
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: C.brand,
    marginBottom: 7,
  },
  title: {
    fontFamily: FONT_UI,
    fontSize: 20,
    fontWeight: "bold",
    color: C.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: C.muted,
    marginBottom: 18,
  },

  metaCard: {
    borderWidth: 1,
    borderColor: C.rule,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaItem: { width: "50%", paddingVertical: 3, paddingRight: 8 },
  metaLabel: {
    fontSize: 6.8,
    letterSpacing: 0.8,
    color: C.faint,
    marginBottom: 2,
  },
  metaValue: { fontSize: 9, color: C.ink },

  callout: {
    backgroundColor: C.brandSoft,
    borderLeftWidth: 3,
    borderLeftColor: C.brand,
    borderRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 11,
    marginBottom: 20,
  },
  calloutTitle: {
    fontFamily: FONT_UI,
    fontWeight: "bold",
    fontSize: 9,
    color: "#065f46",
    marginBottom: 3,
  },
  calloutBody: { fontSize: 8.5, color: "#047857", lineHeight: 1.5 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
  },
  sectionIndex: {
    fontFamily: FONT_MONO,
    fontSize: 8,
    color: C.brand,
    marginRight: 7,
  },
  sectionTitle: {
    fontFamily: FONT_UI,
    fontWeight: "bold",
    fontSize: 10.5,
    color: C.ink,
    letterSpacing: 0.2,
  },

  body: {
    fontFamily: FONT_MONO,
    fontSize: 8.2,
    lineHeight: 1.55,
    color: C.body,
  },
  intro: {
    fontFamily: FONT_UI,
    fontSize: 9.5,
    lineHeight: 1.6,
    color: C.body,
    marginBottom: 4,
  },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.ruleSoft,
    paddingTop: 8,
  },
  footerText: { fontSize: 7.5, color: C.faint },
  footerLink: { fontSize: 7.5, color: C.muted, textDecoration: "none" },
});

export interface ReportParams {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
  generatedDate: string;
  orderId?: string;
  siteUrl: string;
  siteName: string;
}

export function createSeoPromptDocument(props: ReportParams) {
  const {
    prompt,
    fullName,
    email,
    brandName,
    generatedDate,
    orderId,
    siteUrl,
    siteName,
  } = props;

  const project = brandName.trim() || "Your project";
  const sections = parsePromptSections(prompt);
  const year = new Date().getFullYear();

  const host = (() => {
    try {
      return new URL(siteUrl).hostname;
    } catch {
      return siteUrl;
    }
  })();

  const metaItems: Array<[string, string]> = [
    ["PREPARED FOR", fullName.trim() || "—"],
    ["EMAIL", email.trim() || "—"],
    ["GENERATED", generatedDate],
    ["ORDER", orderId ?? "—"],
  ];

  const el = React.createElement;
  let sectionCounter = 0;

  return el(
    Document,
    {
      title: `SEO implementation prompt — ${project}`,
      author: siteName,
      subject: "Complete SEO implementation prompt",
      creator: siteName,
    },
    el(
      Page,
      { size: "A4", style: s.page, wrap: true },

      el(View, { style: s.accentBar, fixed: true }),

      el(Text, { style: s.eyebrow }, "SEO IMPLEMENTATION PROMPT"),
      el(Text, { style: s.title }, project),
      el(
        Text,
        { style: s.subtitle },
        "A complete, production-ready SEO brief — paste it into your AI editor."
      ),

      el(
        View,
        { style: s.metaCard },
        ...metaItems.map(([label, value], index) =>
          el(
            View,
            { key: `meta-${index}`, style: s.metaItem },
            el(Text, { style: s.metaLabel }, label),
            el(Text, { style: s.metaValue }, value)
          )
        )
      ),

      el(
        View,
        { style: s.callout },
        el(Text, { style: s.calloutTitle }, "How to use this document"),
        el(
          Text,
          { style: s.calloutBody },
          "Copy everything from here to the end and paste it as a single message into Cursor, Claude, or any AI code editor. Stronger models (Claude Opus or Sonnet) follow the full brief most reliably."
        )
      ),

      ...sections.flatMap((section, index) => {
        const nodes: React.ReactElement[] = [];
        if (section.title) {
          sectionCounter += 1;
          nodes.push(
            el(
              View,
              { key: `head-${index}`, style: s.sectionHeader, wrap: false },
              el(
                Text,
                { style: s.sectionIndex },
                String(sectionCounter).padStart(2, "0")
              ),
              el(Text, { style: s.sectionTitle }, section.title)
            )
          );
        }
        if (section.body) {
          nodes.push(
            el(
              Text,
              {
                key: `body-${index}`,
                style: section.title ? s.body : s.intro,
              },
              section.body
            )
          );
        }
        return nodes;
      }),

      el(
        View,
        { style: s.footer, fixed: true },
        el(Link, { src: siteUrl, style: s.footerLink }, host),
        el(
          Text,
          {
            style: s.footerText,
            render: ({
              pageNumber,
              totalPages,
            }: {
              pageNumber: number;
              totalPages: number;
            }) => `${pageNumber} / ${totalPages}`,
          },
          ""
        ),
        el(Text, { style: s.footerText }, `© ${year} ${siteName}`)
      )
    )
  );
}
