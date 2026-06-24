import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LinkClean mark — a chain link crossed by a strike, rendered as a single
 * flat SVG so it stays crisp at any size and works in both light & dark mode.
 */
export function Logo({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label="LinkClean logo"
      className={cn("size-5", className)}
      {...props}
    >
      {/* Left half of the link */}
      <path
        d="M9.5 14.5 6 18a3.5 3.5 0 0 1-5-5l3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right half of the link (open/broken) */}
      <path
        d="M14.5 9.5 18 6a3.5 3.5 0 0 1 5 5l-2.4 2.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The strike — "clean / removed" */}
      <path
        d="M3 21 21 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
