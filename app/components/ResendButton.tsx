"use client";

import { useState } from "react";

interface ResendButtonProps {
  email: string;
}

export default function ResendButton({ email }: ResendButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      setMessage("Verification email resent!");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <button
        onClick={handleResend}
        disabled={loading}
        className="text-sm text-zinc-400 hover:text-zinc-300 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Resend verification email"}
      </button>
      {message && (
        <span className="text-sm text-zinc-400">
          {message}
        </span>
      )}
    </div>
  );
}
