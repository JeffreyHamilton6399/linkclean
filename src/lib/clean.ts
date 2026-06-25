import { TRACKING_PARAM_SET } from "@/lib/params";

export interface CleanResult {
  /** The cleaned URL as a string. */
  clean: string;
  /** The list of tracking parameter names that were removed, in original order. */
  removed: string[];
  /** Whether the input was recognised as a valid URL. */
  ok: boolean;
  /** The original input (trimmed). */
  original: string;
  /** Error message when the URL could not be parsed. */
  error?: string;
}

/**
 * Strip tracking parameters from a single URL.
 *
 * Pure, synchronous, runs entirely in the browser. If the input is missing a
 * protocol we prepend `https://` so the native URL parser can handle it. The
 * original protocol/scheme is always preserved on the way out.
 */
export function cleanUrl(input: string): CleanResult {
  const original = input.trim();
  if (original.length === 0) {
    return { clean: "", removed: [], ok: false, original, error: "empty" };
  }

  // Remember whether the user supplied a scheme; the URL API requires one.
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(original);
  const candidate = hasScheme ? original : `https://${original}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return {
      clean: original,
      removed: [],
      ok: false,
      original,
      error: "invalid URL",
    };
  }

  const removed: string[] = [];
  // Iterate over a snapshot of keys so deletion during iteration is safe.
  const keys = Array.from(url.searchParams.keys());
  for (const key of keys) {
    if (TRACKING_PARAM_SET.has(key)) {
      // A parameter may legitimately appear multiple times — delete all.
      url.searchParams.delete(key);
      removed.push(key);
    }
  }

  // Remove a now-empty search string entirely (trailing "?" cleanup).
  const clean = url.toString().replace(/\?$/, "");

  return { clean, removed, ok: true, original };
}

export interface BatchResult {
  results: CleanResult[];
  /** Number of successfully cleaned URLs. */
  cleaned: number;
  /** Total tracking parameters removed across all URLs. */
  removedCount: number;
  /** Number of inputs that could not be parsed. */
  failed: number;
  /** All cleaned URLs joined by newlines (only successful ones). */
  joined: string;
}

/**
 * Clean a batch of URLs — one per line. Blank lines are skipped.
 * Handles 100+ URLs instantly with zero async work.
 */
export function cleanUrls(input: string): BatchResult {
  const lines = input.split(/\r?\n/);
  const results: CleanResult[] = [];
  let cleaned = 0;
  let removedCount = 0;
  let failed = 0;
  const cleanedLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    const result = cleanUrl(trimmed);
    results.push(result);
    if (result.ok) {
      cleaned += 1;
      removedCount += result.removed.length;
      cleanedLines.push(result.clean);
    } else {
      failed += 1;
    }
  }

  return {
    results,
    cleaned,
    removedCount,
    failed,
    joined: cleanedLines.join("\n"),
  };
}

/** Human readable summary for the UI, e.g. "3 parameters". */
export function pluralParams(n: number): string {
  return `${n} parameter${n === 1 ? "" : "s"}`;
}
