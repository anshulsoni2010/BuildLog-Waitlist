"use client";

import { useState } from "react";
import ResendVerificationButton from "@/components/ResendVerificationButton";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage({
        type: "success",
        text: "Please check your email to verify your signup!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to join waitlist",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-3">
      <div className="flex flex-col items-center justify-center w-full gap-3 px-2 sm:gap-4 md:flex-row">
        <input
          placeholder="Your email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="flex w-full max-w-sm px-3 py-1 text-sm transition-colors border rounded-lg shadow-sm h-9 sm:h-12 border-zinc-700 bg-zinc-900/80 file:border-0 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 font-semibold duration-150 rounded-lg h-9 sm:h-12 md:w-fit text-nowrap text-zinc-900 bg-zinc-50 hover:bg-zinc-400 active:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin size-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Joining...
            </div>
          ) : (
            <>
              Join waitlist
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="p-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="flex flex-col items-center">
          <span
            className={`text-sm ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            } text-center mt-2`}
          >
            {message.text}
          </span>
          {message.type === "success" && <ResendVerificationButton email={email} />}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-xs sm:gap-3 sm:text-sm">
        <div className="flex -space-x-3">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/8b61de95636919.61018562de82f.jpg"
            alt="avatar"
            className="border rounded-full bg-zinc-600 size-6 sm:size-8"
          />
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/0715c895636919.5f90091fd3561.jpg"
            alt="avatar"
            className="border rounded-full bg-zinc-600 size-6 sm:size-8"
          />
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/22e60f95636919.5f60f2dda88ee.jpg"
            alt="avatar"
            className="border rounded-full bg-zinc-600 size-6 sm:size-8"
          />
        </div>
        <p className="text-zinc-300">Join 2,000+ others who signed up </p>

        <div className="flex gap-2 px-2 border-l sm:px-4 sm:gap-3 text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer hover:text-zinc-300 size-4 sm:size-6"
          >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>

          <svg xmlns="http://www.w3.org/2000/svg" className="cursor-pointer hover:text-zinc-300 size-4 sm:size-6"
            shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 462.799">
            <path fill-rule="nonzero" d="M403.229 0h78.506L310.219 196.04 512 462.799H354.002L230.261 301.007 88.669 462.799h-78.56l183.455-209.683L0 0h161.999l111.856 147.88L403.229 0zm-27.556 415.805h43.505L138.363 44.527h-46.68l283.99 371.278z" />
          </svg>
        </div>
      </div>
    </form>
  );
}
