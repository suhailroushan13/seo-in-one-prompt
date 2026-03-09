import type { FormState } from "./types";
import { getDefaultFormState } from "./types";

const FORM_DRAFT_KEY = "seo-prompt-form-draft";
const USER_STORAGE_KEY = "seo-prompt-user";
const PENDING_PROMPT_KEY = "seo-prompt-pending";

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

/** Pending prompt + name + email saved when user clicks Submit (before payment). Used on success page to send email. */
export interface PendingPromptData {
  prompt: string;
  fullName: string;
  email: string;
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

/** Clears form draft and user (name/email) from localStorage. */
export function clearFormAndUserStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FORM_DRAFT_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PENDING_PROMPT_KEY);
  } catch {
    // ignore
  }
}
