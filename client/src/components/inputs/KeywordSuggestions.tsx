"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

const SUGGESTION_MAP: Record<string, string[]> = {
  hire: [
    "hire remote developers",
    "hire freelance developers",
    "hire developers from github",
    "hire full stack developers",
    "hire software engineers",
    "hire offshore developers",
    "hire dedicated developers",
    "hire mobile app developers",
  ],
  seo: [
    "seo optimization tools",
    "seo strategy generator",
    "seo audit checklist",
    "seo content writing",
    "seo keyword research tool",
    "local seo optimization",
    "technical seo guide",
    "seo competitor analysis",
  ],
  saas: [
    "saas landing page builder",
    "saas pricing strategy",
    "saas marketing tools",
    "saas seo optimization",
    "saas onboarding best practices",
    "saas growth hacking",
    "saas customer retention",
    "saas content marketing",
  ],
  blog: [
    "blog seo best practices",
    "blog content strategy",
    "blog post template",
    "blog keyword research",
    "blog monetization strategies",
    "blog traffic growth tips",
    "blog writing tools",
    "blog engagement techniques",
  ],
  ecommerce: [
    "ecommerce seo strategy",
    "ecommerce product pages",
    "ecommerce conversion optimization",
    "ecommerce content marketing",
    "ecommerce site speed optimization",
    "ecommerce email marketing",
    "ecommerce checkout optimization",
    "ecommerce product descriptions seo",
  ],
  developer: [
    "developer portfolio seo",
    "developer documentation site",
    "developer tools landing page",
    "developer hiring platform",
    "developer blog seo",
    "developer community building",
    "open source project seo",
    "developer relations strategy",
  ],
  ai: [
    "ai tools for seo",
    "ai content generator",
    "ai writing assistant",
    "ai powered analytics",
    "ai chatbot for website",
    "ai image generator",
    "ai marketing automation",
    "ai personalization engine",
  ],
  food: [
    "order food online",
    "food delivery app",
    "restaurant near me",
    "best restaurants in city",
    "food ordering platform",
    "meal delivery service",
    "online catering service",
    "restaurant reservation app",
  ],
  fitness: [
    "online fitness coaching",
    "fitness app workout plans",
    "home workout routines",
    "personal trainer online",
    "fitness equipment reviews",
    "gym membership deals",
    "yoga classes online",
    "weight loss programs",
  ],
  travel: [
    "travel booking platform",
    "cheap flights search",
    "hotel deals online",
    "travel itinerary planner",
    "vacation packages deals",
    "travel insurance comparison",
    "adventure travel destinations",
    "last minute travel deals",
  ],
  real: [
    "real estate listings",
    "buy property online",
    "real estate agent near me",
    "real estate investment tips",
    "property management software",
    "home buying guide",
    "real estate market analysis",
    "commercial real estate listings",
  ],
  marketing: [
    "digital marketing strategy",
    "content marketing tools",
    "social media marketing",
    "email marketing platform",
    "marketing automation software",
    "influencer marketing platform",
    "ppc advertising management",
    "marketing analytics dashboard",
  ],
  education: [
    "online courses platform",
    "e-learning website builder",
    "education app development",
    "online tutoring service",
    "student management system",
    "course creation tools",
    "learning management system",
    "educational content strategy",
  ],
  finance: [
    "personal finance app",
    "investment portfolio tracker",
    "budgeting tools online",
    "fintech startup marketing",
    "loan comparison platform",
    "cryptocurrency exchange",
    "financial planning software",
    "accounting software for small business",
  ],
  health: [
    "telemedicine platform",
    "health and wellness blog",
    "mental health app",
    "healthcare appointment booking",
    "health insurance comparison",
    "patient portal software",
    "medical practice marketing",
    "health tracking wearable",
  ],
};

function getSuggestions(keyword: string): string[] {
  const lower = keyword.toLowerCase().trim();
  if (!lower) return [];

  for (const [key, suggestions] of Object.entries(SUGGESTION_MAP)) {
    if (lower.includes(key)) {
      return suggestions.filter(
        (s) => s !== lower
      ).slice(0, 6);
    }
  }

  if (lower.length >= 3) {
    return [
      `${lower} best practices`,
      `${lower} strategy guide`,
      `${lower} for beginners`,
      `${lower} tools`,
      `${lower} tips and tricks`,
      `best ${lower} services`,
    ];
  }

  return [];
}

interface KeywordSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

const inputBaseClass =
  "h-9 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground dark:bg-input/30";
const inputInvalidClass =
  "border-red-500 dark:border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:focus-visible:border-red-400 dark:focus-visible:ring-red-400/30";
const inputNormalClass =
  "border-input focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function KeywordSuggestions({
  value,
  onChange,
  placeholder,
  invalid,
}: KeywordSuggestionsProps) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuggestions(getSuggestions(value));
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const showSuggestions = focused && suggestions.length > 0;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        className={`${inputBaseClass} ${invalid ? inputInvalidClass : inputNormalClass}`}
      />
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          <div className="flex items-center gap-1.5 border-b border-border/50 px-3 py-2">
            <Sparkles className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Suggestions
            </span>
          </div>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setFocused(false);
              }}
              className="flex w-full items-center px-3 py-2 text-left text-sm text-foreground/80 transition-colors hover:bg-muted"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
