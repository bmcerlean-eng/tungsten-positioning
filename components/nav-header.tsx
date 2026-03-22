"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function NavHeader() {
  const [darkMode, setDarkMode] = useState(false);
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
          "  " +
          now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex-shrink-0">
      {/* Gold accent line */}
      <div className="h-1 bg-tungsten-gold" />

      {/* Navigation bar */}
      <div className="h-14 border-b border-tungsten-border bg-white flex items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center select-none">
          <Image
            src="/tungsten-logo-blue.jpg"
            alt="Tungsten Automation"
            width={220}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right: Date/time + Dark mode */}
        <div className="flex items-center gap-4">
          <span className="text-tungsten-muted text-sm font-medium tabular-nums">
            {dateTime}
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-tungsten-surface transition-colors text-tungsten-bluegray"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
