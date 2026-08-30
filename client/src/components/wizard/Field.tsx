import type { ReactNode } from "react";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  /** Use for composite controls (radio groups) where no single input owns the label. */
  asGroup?: boolean;
  children: ReactNode;
}

export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  asGroup = false,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      {asGroup ? (
        <span id={`${id}-label`} className="field-label">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </span>
      ) : (
        <label htmlFor={id} className="field-label">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The id a control should point `aria-describedby` at. The error replaces the
 * hint when present, mirroring what `Field` renders.
 */
export function describedById(
  id: string,
  hasError: boolean,
  hasHint = true
): string | undefined {
  if (hasError) return `${id}-error`;
  if (hasHint) return `${id}-hint`;
  return undefined;
}
