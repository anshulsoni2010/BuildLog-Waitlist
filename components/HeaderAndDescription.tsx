import React from "react";

const HeaderAndDescription = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-1 text-center lg:max-w-screen-sm">
      <h1 className="text-3xl py-2 md:text-4xl lg:text-5xl font-bold tracking-wide leading-[110%] bg-gradient-to-b from-zinc-100 to-[#ADADAD] bg-clip-text text-transparent">
      Be the First to Experience BuildLog with AI Features
      </h1>
      <p className="text-lg text-zinc-400">
      Join our waitlist crafted for creators, indie hackers, and teams to revolutionize how progress is shared. Don’t miss your chance!
      </p>
    </div>
  );
};

export default HeaderAndDescription;
