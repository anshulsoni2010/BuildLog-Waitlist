"use client";

export default function SupportBox() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <a
        href="https://x.com/AnshulSoni2010"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 backdrop-blur-sm border border-zinc-700/50 hover:border-zinc-600/50"
      >
        <span>Support me</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="opacity-80"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
    </div>
  );
}
