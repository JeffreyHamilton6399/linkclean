"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { cleanUrl, cleanUrls, pluralParams } from "@/lib/clean";
import { TRACKING_PARAMS, TRACKING_PARAM_COUNT } from "@/lib/params";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Github,
  Heart,
  Info,
  ListFilter,
  Moon,
  Scissors,
  Settings,
  ShieldCheck,
  Sun,
  Trash2,
} from "lucide-react";

const DONATE_URL = "https://buymeacoffee.com/jeffreyscof";
const GITHUB_URL = "https://github.com/JeffreyHamilton6399/linkclean";
const LS_SHOW_REMOVED = "linkclean.showRemoved";

/* -------------------------------------------------------------------------- */
/*  Clipboard helper                                                          */
/* -------------------------------------------------------------------------- */

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [input, setInput] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [showRemoved, setShowRemoved] = React.useState(true);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [paramsOpen, setParamsOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(LS_SHOW_REMOVED);
      if (stored !== null) setShowRemoved(stored === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleShowRemoved = React.useCallback((next: boolean) => {
    setShowRemoved(next);
    try {
      localStorage.setItem(LS_SHOW_REMOVED, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  /* ---- derived cleaning result (instant, synchronous) ---- */
  const batch = React.useMemo(() => cleanUrls(input), [input]);
  const hasInput = batch.results.length > 0;
  const isBatch = batch.results.length > 1;
  const single = batch.results.length === 1 ? batch.results[0] : null;

  const handleCopy = React.useCallback(async () => {
    if (!hasInput) return;
    const text = isBatch ? batch.joined : single?.clean ?? "";
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      toast.success(isBatch ? "Copied all clean URLs" : "Copied clean URL");
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Couldn't copy — please copy manually");
    }
  }, [hasInput, isBatch, batch.joined, single]);

  const handleClear = React.useCallback(() => {
    setInput("");
    setCopied(false);
    textareaRef.current?.focus();
  }, []);

  const handlePaste = React.useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInput((prev) => (prev ? prev + (prev.endsWith("\n") ? "" : "\n") + text : text));
        toast.success("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard read blocked — paste manually");
    }
  }, []);

  return (
    <div className="bg-background text-foreground flex h-dvh flex-col overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Header (h-12)                                                       */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="bg-emerald-500 text-white flex size-7 shrink-0 items-center justify-center rounded-lg">
            <Logo className="size-4" />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">
            LinkClean
          </span>
          <span className="bg-muted text-muted-foreground hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline">
            {TRACKING_PARAM_COUNT} params stripped
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            asChild
            className="h-7 rounded-full bg-rose-500 px-3 text-xs font-medium text-white hover:bg-rose-600"
          >
            <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
              <Heart className="size-3.5" />
              <span className="hidden sm:inline">Donate</span>
            </a>
          </Button>

          {/* Settings dropdown — styled to match the Donate pill */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-7 rounded-full px-2.5 text-xs"
                aria-label="Settings"
              >
                <Settings className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56"
              sideOffset={6}
            >
              <DropdownMenuLabel className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
                Theme
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={mounted ? theme : undefined}
                onValueChange={setTheme}
              >
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 size-3.5" /> Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 size-3.5" /> Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Settings className="mr-2 size-3.5" /> System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toggleShowRemoved(!showRemoved);
                }}
              >
                <ListFilter className="mr-2 size-3.5" />
                <span className="flex-1">Show what was removed</span>
                <Switch
                  checked={showRemoved}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pointer-events-none data-[state=checked]:bg-emerald-500"
                />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => setParamsOpen(true)}>
                <Scissors className="mr-2 size-3.5" />
                Stripped parameters
                <span className="text-muted-foreground ml-auto text-xs">
                  {TRACKING_PARAM_COUNT}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setAboutOpen(true)}>
                <Info className="mr-2 size-3.5" />
                About LinkClean
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-3.5" />
                  View on GitHub
                  <ExternalLink className="ml-auto size-3.5 opacity-60" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={DONATE_URL} target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 size-3.5" />
                  Buy me a coffee
                  <ExternalLink className="ml-auto size-3.5 opacity-60" />
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main (flex-1)                                                       */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex min-h-0 flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        {/* Input */}
        <section className="flex min-h-0 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="linkclean-input"
              className="text-muted-foreground text-xs font-medium"
            >
              Input
            </label>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePaste}
                className="h-7 rounded-full px-2.5 text-xs"
              >
                Paste
              </Button>
              {hasInput && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 rounded-full px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>
          <Textarea
            id="linkclean-input"
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a URL to clean…"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            className="min-h-[6.5rem] flex-1 resize-none rounded-lg border font-mono text-sm leading-relaxed"
          />
        </section>

        {/* Output */}
        <section className="flex min-h-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground text-xs font-medium">
              {isBatch ? `Clean URLs (${batch.cleaned})` : "Clean URL"}
            </label>
            {hasInput && (
              <Button
                onClick={handleCopy}
                className="h-7 rounded-full bg-emerald-500 px-3 text-xs font-medium text-white hover:bg-emerald-600"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    {isBatch ? "Copy All" : "Copy"}
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="ring-ring/10 relative flex min-h-[8rem] flex-1 flex-col overflow-hidden rounded-lg border bg-muted/40">
            {/* Empty state */}
            {!hasInput && <EmptyState />}

            {/* Single result */}
            {hasInput && !isBatch && single && (
              <SingleResult result={single} showRemoved={showRemoved} />
            )}

            {/* Batch result */}
            {hasInput && isBatch && (
              <BatchResult batch={batch} showRemoved={showRemoved} />
            )}
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* Footer (h-8)                                                        */}
      {/* ------------------------------------------------------------------ */}
      <footer className="text-muted-foreground flex h-8 shrink-0 items-center justify-center gap-1.5 border-t px-3 text-[11px]">
        <span>V1</span>
        <span className="opacity-40">·</span>
        <span>Jeffrey Hamilton</span>
        <span className="opacity-40">·</span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="size-3 text-emerald-500" />
          100% client-side
        </span>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* Dialogs                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white flex size-7 items-center justify-center rounded-lg">
                <Logo className="size-4" />
              </span>
              LinkClean
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              LinkClean strips tracking parameters from URLs — instantly, in
              your browser. Paste a messy link, get a clean one, and stop
              sharing tracking data when you share links.
            </DialogDescription>
          </DialogHeader>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" /> No tracking, no
              sign-up, 100% free
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" /> URLs never leave your
              browser
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-500" /> Strips{" "}
              {TRACKING_PARAM_COUNT} tracking parameters
            </li>
          </ul>
          <div className="text-muted-foreground border-t pt-3 text-xs">
            Built by Jeffrey Hamilton. If it saved you a click, consider{" "}
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 font-medium underline-offset-4 hover:underline"
            >
              buying a coffee
            </a>
            .
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={paramsOpen} onOpenChange={setParamsOpen}>
        <DialogContent className="max-h-[80vh] max-w-lg overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="size-4 text-emerald-500" />
              Stripped parameters
            </DialogTitle>
            <DialogDescription>
              {TRACKING_PARAM_COUNT} tracking parameters are removed from every
              URL. Everything else is left untouched.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55vh] overflow-y-auto pr-1">
            <ul className="flex flex-wrap gap-1.5">
              {TRACKING_PARAMS.map((p) => (
                <li
                  key={p}
                  className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
      <ShieldCheck className="text-emerald-500 size-7" />
      <p className="text-muted-foreground text-sm">
        Strips tracking parameters — your shares stay private
      </p>
      <p className="text-muted-foreground/70 text-xs">
        No tracking · No sign-up · 100% free
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Single result                                                              */
/* -------------------------------------------------------------------------- */

function SingleResult({
  result,
  showRemoved,
}: {
  result: ReturnType<typeof cleanUrl>;
  showRemoved: boolean;
}) {
  if (!result.ok) {
    return (
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-sm text-rose-500">
          Couldn’t parse this URL. Make sure it starts with http(s)://
        </p>
        <p className="text-muted-foreground break-all font-mono text-xs">
          {result.original}
        </p>
      </div>
    );
  }

  const alreadyClean = result.removed.length === 0;

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
      <p className="break-all font-mono text-sm leading-relaxed">
        {result.clean}
      </p>

      {alreadyClean ? (
        <p className="text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1.5 text-xs font-medium">
          <CheckCircle2 className="size-3.5" />
          This URL is already clean
        </p>
      ) : showRemoved ? (
        <div className="mt-1">
          <p className="text-muted-foreground text-xs">
            Removed:{" "}
            <span className="text-foreground font-medium">
              {result.removed.join(", ")}
            </span>{" "}
            <span className="text-muted-foreground">
              ({pluralParams(result.removed.length)})
            </span>
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">
          Removed {pluralParams(result.removed.length)}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Batch result                                                               */
/* -------------------------------------------------------------------------- */

function BatchResult({
  batch,
  showRemoved,
}: {
  batch: ReturnType<typeof cleanUrls>;
  showRemoved: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-3">
      <div className="flex-1 space-y-2">
        {batch.results.map((r, i) => (
          <div
            key={i}
            className="border-l-2 pl-2"
            data-clean={r.ok ? "" : undefined}
            style={{
              borderColor: r.ok
                ? r.removed.length
                  ? "var(--color-emerald-500, #10b981)"
                  : "transparent"
                : "var(--color-rose-500, #f43f5e)",
            }}
          >
            <p
              className={cn(
                "break-all font-mono text-xs leading-relaxed",
                r.ok ? "text-foreground" : "text-rose-500",
              )}
            >
              {r.ok ? r.clean : `Invalid: ${r.original}`}
            </p>
            {r.ok && r.removed.length > 0 && showRemoved && (
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                − {r.removed.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="text-muted-foreground mt-2 border-t pt-2 text-xs">
        Cleaned {batch.cleaned} URL{batch.cleaned === 1 ? "" : "s"} — removed{" "}
        {pluralParams(batch.removedCount)}
        {batch.failed > 0 && (
          <span className="text-rose-500">
            {" "}
            · {batch.failed} couldn’t be parsed
          </span>
        )}
      </div>
    </div>
  );
}
