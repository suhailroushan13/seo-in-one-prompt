import type { FormState } from "./types";
import { getDefaultFormState } from "./types";

const FORM_DRAFT_KEY = "seo-prompt-form-draft";
const USER_STORAGE_KEY = "seo-prompt-user";
const PENDING_PROMPT_KEY = "seo-prompt-pending";
const VIEW_PROMPT_KEY = "seo-prompt-view";
const GENERATED_PROMPT_KEY = "seo-prompt-generated";

export interface StoredUser {
  fullName: string;
  email: string;
}

const defaultUser: StoredUser = { fullName: "", email: "" };

export function loadUserFromStorage(): StoredUser {
  if (typeof window === "undefined") return defaultUser;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return defaultUser;
    const parsed = JSON.parse(raw) as Partial<StoredUser>;
    return { ...defaultUser, ...parsed };
  } catch {
    return defaultUser;
  }
}

export function saveUserToStorage(user: StoredUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function loadFormFromStorage(): FormState {
  if (typeof window === "undefined") return getDefaultFormState();
  try {
    const raw = localStorage.getItem(FORM_DRAFT_KEY);
    if (!raw) return getDefaultFormState();
    const parsed = JSON.parse(raw) as Partial<FormState>;
    return { ...getDefaultFormState(), ...parsed };
  } catch {
    return getDefaultFormState();
  }
}

export function saveFormToStorage(form: FormState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(form));
  } catch {
    // ignore
  }
}

/** Pending prompt + name + email + brand saved when user clicks Submit (before payment). Used on success page to send email. */
export interface PendingPromptData {
  prompt: string;
  fullName: string;
  email: string;
  brandName: string;
}

export function savePendingPrompt(data: PendingPromptData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_PROMPT_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadPendingPrompt(): PendingPromptData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_PROMPT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PendingPromptData>;
    if (!parsed.prompt || !parsed.email) return null;
    return {
      prompt: String(parsed.prompt),
      fullName: String(parsed.fullName ?? ""),
      email: String(parsed.email).trim().toLowerCase(),
      brandName: String(parsed.brandName ?? ""),
    };
  } catch {
    return null;
  }
}

export function clearPendingPrompt(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_PROMPT_KEY);
  } catch {
    // ignore
  }
}

/** Clears form draft, user, pending prompt, and generated prompt from localStorage. */
export function clearFormAndUserStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FORM_DRAFT_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PENDING_PROMPT_KEY);
    localStorage.removeItem(GENERATED_PROMPT_KEY);
  } catch {
    // ignore
  }
}

/** Last generated prompt on /generate — persisted so it survives refresh and is available for /view. */
export function saveGeneratedPrompt(prompt: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GENERATED_PROMPT_KEY, prompt);
  } catch {
    // ignore
  }
}

export function loadGeneratedPrompt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(GENERATED_PROMPT_KEY);
  } catch {
    return null;
  }
}

/** SessionStorage: prompt saved for the /view page (e.g. after payment success). */
export function saveViewPrompt(prompt: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(VIEW_PROMPT_KEY, prompt);
  } catch {
    // ignore
  }
}

export function loadViewPrompt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(VIEW_PROMPT_KEY);
  } catch {
    return null;
  }
}

export function clearViewPrompt(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(VIEW_PROMPT_KEY);
  } catch {
    // ignore
  }
}
