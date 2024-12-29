import { useState } from "react";
export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to resend verification email");
    }
  };

  return (
    <div className="mt-8 text-center">
      <h3 className="text-lg font-semibold text-zinc-200 mb-4">
        Didn&apos;t receive the verification email?
      </h3>
      <form onSubmit={handleResend} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 text-zinc-200 placeholder-zinc-400"
            required
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg font-semibold hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {status === "loading" ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Resend Verification Email"
          )}
        </button>
      </form>
      {message && (
        <div className={`mt-4 p-4 rounded-lg ${status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
