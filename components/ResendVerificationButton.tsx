"use client";

import { useState } from "react";

interface ResendVerificationButtonProps {
  email: string;
}

export default function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleResend = async () => {
    setLoading(true);
    setStatus("idle");

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

      setStatus("success");
    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <button
        onClick={handleResend}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-zinc-800 bg-zinc-100 rounded-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Resend verification email
          </div>
        )}
      </button>
      {status === "success" && (
        <span className="text-sm text-green-400 mt-2">
          Verification email sent! Please check your inbox.
        </span>
      )}
      {status === "error" && (
        <span className="text-sm text-red-400 mt-2">
          Failed to send verification email. Please try again.
        </span>
      )}
    </div>
  );
}
