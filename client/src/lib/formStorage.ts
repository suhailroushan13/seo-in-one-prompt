import type { FormState } from "./types";
import { getDefaultFormState } from "./types";

const FORM_DRAFT_KEY = "seo-prompt-form-draft";
const USER_STORAGE_KEY = "seo-prompt-user";
const GENERATED_PROMPT_KEY = "seo-prompt-generated";
const LAST_ORDER_KEY = "seo-prompt-last-order";

export interface StoredUser {
  fullName: string;
  email: string;
}

const defaultUser: StoredUser = { fullName: "", email: "" };

function readJson<T>(storage: Storage, key: string): Partial<T> | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<T>) : null;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota or private-mode failures are non-fatal: the app works without a draft.
  }
}

export function loadUserFromStorage(): StoredUser {
  if (typeof window === "undefined") return defaultUser;
  return { ...defaultUser, ...(readJson<StoredUser>(localStorage, USER_STORAGE_KEY) ?? {}) };
}

export function saveUserToStorage(user: StoredUser): void {
  if (typeof window === "undefined") return;
  writeJson(localStorage, USER_STORAGE_KEY, user);
}

export function loadFormFromStorage(): FormState {
  if (typeof window === "undefined") return getDefaultFormState();
  return {
    ...getDefaultFormState(),
    ...(readJson<FormState>(localStorage, FORM_DRAFT_KEY) ?? {}),
  };
}

export function saveFormToStorage(form: FormState): void {
  if (typeof window === "undefined") return;
  writeJson(localStorage, FORM_DRAFT_KEY, form);
}

/** Last generated prompt, so a refresh on /generate does not lose the result. */
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

/**
 * The order the buyer was last sent to checkout with. Used to recover the
 * receipt when the payment provider drops our redirect query parameters.
 */
export interface LastOrder {
  orderId: string;
  email: string;
  brandName: string;
  createdAt: string;
}

export function saveLastOrder(order: LastOrder): void {
  if (typeof window === "undefined") return;
  writeJson(localStorage, LAST_ORDER_KEY, order);
}

export function loadLastOrder(): LastOrder | null {
  if (typeof window === "undefined") return null;
  const parsed = readJson<LastOrder>(localStorage, LAST_ORDER_KEY);
  if (!parsed?.orderId || !parsed.email) return null;
  return {
    orderId: String(parsed.orderId),
    email: String(parsed.email),
    brandName: String(parsed.brandName ?? ""),
    createdAt: String(parsed.createdAt ?? ""),
  };
}

export function clearLastOrder(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LAST_ORDER_KEY);
  } catch {
    // ignore
  }
}

/** Clears the draft, the saved contact details, and the last generated prompt. */
export function clearFormAndUserStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FORM_DRAFT_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(GENERATED_PROMPT_KEY);
  } catch {
    // ignore
  }
}
