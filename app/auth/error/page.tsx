"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BackgroundImages from "@/components/BackgroundImages";
import LogoAndChip from "@/components/LogoAndChip";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "Signin":
        return "Try signing in with a different account.";
      case "OAuthSignin":
        return "Try signing in with a different account.";
      case "OAuthCallback":
        return "Try signing in with a different account.";
      case "OAuthCreateAccount":
        return "Try signing in with a different account.";
      case "EmailCreateAccount":
        return "Try signing in with a different account.";
      case "Callback":
        return "Try signing in with a different account.";
      case "OAuthAccountNotLinked":
        return "To confirm your identity, sign in with the same account you used originally.";
      case "EmailSignin":
        return "Check your email address.";
      case "CredentialsSignin":
        return "Sign in failed. Check the details you provided are correct.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "Unable to sign in.";
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center shadow-xl backdrop-blur-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-red-500">Authentication Error</h2>
        <p className="mt-2 text-zinc-400">{getErrorMessage()}</p>
      </div>

      <div className="pt-4">
        <Link
          href="/auth/signin"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-900 duration-150 hover:bg-zinc-200"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center lg:p-24">
      <BackgroundImages />
      <LogoAndChip />
      <Suspense fallback={
        <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 text-center">
          <div>Loading...</div>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </main>
  );
}
