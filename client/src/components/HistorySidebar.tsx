"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronRight, Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/lib/types";

const HISTORY_KEY = "seo-prompt-history";

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToHistory(entry: HistoryEntry) {
  const current = getHistory();
  const next = [entry, ...current].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

interface HistorySidebarProps {
  onLoad: (prompt: string) => void;
}

export function HistorySidebar({ onLoad }: HistorySidebarProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const refresh = () => setEntries(getHistory());

  const remove = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setEntries(next);
  };

  if (entries.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => {
          refresh();
          setExpanded(!expanded);
        }}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recent Prompts</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {entries.length}
          </span>
        </div>
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border/50">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between border-b border-border/30 px-4 py-2.5 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => onLoad(entry.prompt)}
                className="flex-1 text-left"
              >
                <p className="truncate text-xs font-medium">{entry.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </button>
              <button
                type="button"
                onClick={() => remove(entry.id)}
                className="ml-2 rounded-md p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
