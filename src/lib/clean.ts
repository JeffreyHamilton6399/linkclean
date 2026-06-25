import {
  TRACKING_PARAM_SET,
  TRACKING_PREFIXES,
} from "@/lib/params";

export interface CleanResult {
  /** The cleaned URL as a string. */
  clean: string;
  /** The list of tracking parameter names that were removed, in first-seen order, de-duplicated. */
  removed: string[];
  /** Whether the input was recognised as a cleanable web URL. */
  ok: boolean;
  /** The original input (trimmed). */
  original: string;
  /** Error message when the URL could not be parsed. */
  error?: string;
}

/**
 * Does a parameter name (case-insensitive) look like a tracker?
 * Checks the explicit set first, then the conservative prefix globs.
 */
function isTrackingParam(name: string): boolean {
  const k = name.toLowerCase();
  if (TRACKING_PARAM_SET.has(k)) return true;
  for (const prefix of TRACKING_PREFIXES) {
    if (k.startsWith(prefix)) return true;
  }
  return false;
}

/**
 * Parse a user-pasted string into a web URL, tolerating bare domains.
 *
 * Safety rules:
 *  - Never mangle non-web URLs (mailto:, tel:, sms:, custom schemes). These are
 *    returned to the caller as "out of scope" (ok: true, nothing removed).
 *  - If the input has no scheme but looks like a bare domain, prepend https://.
 *  - Never follow redirects and never contact any server — pure parsing only.
 *  - The scheme, host, port and path are always preserved untouched.
 */
function parseWebUrl(original: string): URL | null {
  let url: URL;
  try {
    url = new URL(original);
  } catch {
    // No valid scheme — try treating it as a bare domain.
    try {
      url = new URL(`https://${original}`);
    } catch {
      return null;
    }
  }

  // If it parsed but isn't a web URL, and the original looks like a bare
  // domain (e.g. "example.com:8080"), retry with an https:// prefix so we
  // don't mistake "host:port" for a custom scheme.
  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:" &&
    /^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(original)
  ) {
    try {
      url = new URL(`https://${original}`);
    } catch {
      return null;
    }
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    // Non-web URL (mailto:, tel:, …) — out of scope. Signal "not cleanable"
    // by returning null; the caller treats it as already clean / untouched.
    return null;
  }
  return url;
}

/**
 * Strip tracking parameters from a single URL — including from the fragment.
 *
 * Pure, synchronous, runs entirely in the browser. Preserves the order and
 * encoding of all non-tracking parameters.
 */
export function cleanUrl(input: string): CleanResult {
  const original = input.trim();
  if (original.length === 0) {
    return { clean: "", removed: [], ok: false, original, error: "empty" };
  }

  const url = parseWebUrl(original);
  if (!url) {
    // Could be a non-web URL (mailto/tel) or genuinely invalid. If the native
    // parser accepts it as a non-web URL, treat it as "already clean" so we
    // don't accuse the user of a bad link; otherwise flag as invalid.
    let nonWeb = false;
    try {
      const u = new URL(original);
      nonWeb = u.protocol !== "http:" && u.protocol !== "https:";
    } catch {
      nonWeb = false;
    }
    if (nonWeb) {
      return { clean: original, removed: [], ok: true, original };
    }
    return {
      clean: original,
      removed: [],
      ok: false,
      original,
      error: "invalid URL",
    };
  }

  const removed: string[] = [];
  const seen = new Set<string>();

  // --- Query string ---
  // Iterate over a snapshot of keys so deletion during iteration is safe.
  const keys = Array.from(url.searchParams.keys());
  for (const key of keys) {
    if (isTrackingParam(key)) {
      // A parameter may legitimately appear multiple times — delete all of
      // them, but report the name only once.
      url.searchParams.delete(key);
      if (!seen.has(key.toLowerCase())) {
        seen.add(key.toLowerCase());
        removed.push(key);
      }
    }
  }

  // --- Fragment / hash ---
  // Some trackers (notably GA's _gl linker) live in the hash. If the hash
  // looks like key=value&key=value, clean it the same way. Anything without
  // an "=" (e.g. "#section" or SPA routes) is left untouched.
  if (url.hash.startsWith("#") && url.hash.includes("=")) {
    const body = url.hash.slice(1);
    const parts = body.split("&");
    const kept: string[] = [];
    for (const part of parts) {
      const eq = part.indexOf("=");
      const k = eq === -1 ? part : part.slice(0, eq);
      if (isTrackingParam(k)) {
        if (!seen.has(k.toLowerCase())) {
          seen.add(k.toLowerCase());
          removed.push(k);
        }
      } else {
        kept.push(part);
      }
    }
    url.hash = kept.length ? `#${kept.join("&")}` : "";
  }

  // Tidy: drop a now-empty search string ("?") and a lone trailing "#".
  let clean = url.toString();
  if (clean.endsWith("?")) clean = clean.slice(0, -1);
  if (clean.endsWith("#")) clean = clean.slice(0, -1);

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
