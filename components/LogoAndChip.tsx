import * as React from "react";
import BuildLogAI from "./buildlog-logo.png";
const LogoAndChip = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-1">
      {/* Logo */}
      <div className="overflow-hidden border rounded-lg bg-zinc-700 text-black border-zinc-500 size-11 relative z-10">

      <img src={BuildLogAI.src} alt="logo" className="w-full" />
      </div>

      {/* Chip */}
      <div className="font-medium text-sm leading-5 relative flex items-center text-zinc-400 gap-1.5 rounded-xl border bg-gradient-to-tr from-zinc-950/80 to-zinc-800/80 border-zinc-700 h-7 pr-2.5 pl-2">
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
          className=" p-0.5 size-5"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
        <span>Be the First to Experience BuildLog AI</span>
      </div>
    </div>
  );
};

export default LogoAndChip;
