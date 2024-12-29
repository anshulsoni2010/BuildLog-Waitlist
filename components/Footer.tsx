import React from "react";

const Footer = ({ className }: { className: string }) => {
  
  return (
    <footer className={className}>
      <p className="flex flex-col gap-2 sm:flex-row">
        © 2025 BuildLog AI
      </p>
    </footer>
  );
};

export default Footer;
