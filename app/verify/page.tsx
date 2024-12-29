"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("error");
          setMessage("No verification token provided");
          return;
        }

        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully! You can close this window.");
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to verify email");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4 text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin mx-auto size-8 border-2 border-zinc-800 border-t-zinc-400 rounded-full" />
            <p className="text-zinc-400">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <svg
              className="mx-auto size-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h1 className="text-2xl font-bold text-zinc-200">
              Email Verified Successfully!
            </h1>
            <p className="text-zinc-400">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <svg
              className="mx-auto size-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <h1 className="text-2xl font-bold text-zinc-200">
              Verification Failed
            </h1>
            <p className="text-zinc-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
