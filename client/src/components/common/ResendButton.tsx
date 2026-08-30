"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

type State = "idle" | "sending" | "sent" | "error";

export function ResendButton({ orderId, email }: { orderId: string; email: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const resend = async () => {
    setState("sending");
    setMessage(null);
    try {
      const response = await fetch(`/api/order/${orderId}/resend`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        setState("error");
        setMessage(
          typeof data?.error === "string"
            ? data.error
            : "Could not send the email. Try again in a minute."
        );
        return;
      }
      setState("sent");
    } catch {
      setState("error");
      setMessage("Network error. Try again in a minute.");
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={resend}
        disabled={state === "sending" || state === "sent"}
        className="btn btn-outline"
      >
        {state === "sending" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Mail className="h-4 w-4" aria-hidden />
        )}
        {state === "sent" ? `Sent to ${email}` : "Email it to me again"}
      </button>
      {message && (
        <p className="field-error mt-2" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
