"use client";

import { useEffect } from "react";

function scrollToHash() {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  if (!hash) return;
  const id = hash.slice(1);
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function ScrollToHash() {
  useEffect(() => {
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  return null;
}
