"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { cleanUrl, cleanUrls, pluralParams } from "@/lib/clean";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Heart,
  Moon,
  Settings,
  ShieldCheck,
  Shield,
  Sun,
  Trash2,
} from "lucide-react";

const DONATE_URL = "https://buymeacoffee.com/jeffreyscof";
const GITHUB_URL = "https://github.com/JeffreyHamilton6399/linkclean";
const LS_CONSENT = "linkclean.consent.v1";

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
  const [consented, setConsented] = React.useState(true);
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [termsOpen, setTermsOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
    try {
      setConsented(localStorage.getItem(LS_CONSENT) === "1");
    } catch {
      setConsented(false);
    }
  }, []);

  const acceptConsent = React.useCallback(() => {
    try {
      localStorage.setItem(LS_CONSENT, "1");
    } catch {
      /* ignore */
    }
    setConsented(true);
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
        setInput((prev) =>
          prev ? prev + (prev.endsWith("\n") ? "" : "\n") + text : text,
        );
        toast.success("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard read blocked — paste manually");
    }
  }, []);

  const isDark = mounted && theme === "dark";

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

          {/* Settings dropdown */}
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
              className="w-52"
              sideOffset={6}
            >
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setTheme(isDark ? "light" : "dark");
                }}
              >
                {isDark ? (
                  <Sun className="mr-2 size-3.5" />
                ) : (
                  <Moon className="mr-2 size-3.5" />
                )}
                <span className="flex-1">{isDark ? "Light mode" : "Dark mode"}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-muted-foreground text-[11px] font-medium uppercase tracking-wide">
                Legal
              </DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setPrivacyOpen(true)}>
                <Shield className="mr-2 size-3.5" />
                Privacy Policy
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setTermsOpen(true)}>
                <FileText className="mr-2 size-3.5" />
                Terms of Service
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 size-3.5" />
                  GitHub
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
              <SingleResult result={single} />
            )}

            {/* Batch result */}
            {hasInput && isBatch && <BatchResult batch={batch} />}
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

      {/* First-visit consent */}
      <ConsentDialog open={!consented} onAccept={acceptConsent} />

      <PrivacyPolicyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
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

function SingleResult({ result }: { result: ReturnType<typeof cleanUrl> }) {
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
      ) : (
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
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Batch result                                                               */
/* -------------------------------------------------------------------------- */

function BatchResult({ batch }: { batch: ReturnType<typeof cleanUrls> }) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-3">
      <div className="flex-1 space-y-2">
        {batch.results.map((r, i) => (
          <div
            key={i}
            className="border-l-2 pl-2"
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
            {r.ok && r.removed.length > 0 && (
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

/* -------------------------------------------------------------------------- */
/*  Consent dialog (first visit)                                              */
/* -------------------------------------------------------------------------- */

function ConsentDialog({
  open,
  onAccept,
}: {
  open: boolean;
  onAccept: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* not dismissable except via the accept button */
      }}
    >
      <DialogContent
        className="max-h-[85vh] max-w-lg gap-0 overflow-hidden p-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader className="space-y-2 border-b p-5 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <span className="bg-emerald-500 text-white flex size-7 items-center justify-center rounded-lg">
              <Logo className="size-4" />
            </span>
            Welcome to LinkClean
          </DialogTitle>
          <DialogDescription>
            Before you start, please review our Terms of Service and Privacy
            Policy.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[52vh] space-y-4 overflow-y-auto p-5 text-sm leading-relaxed">
          <div className="space-y-1.5">
            <h3 className="flex items-center gap-1.5 font-medium">
              <Shield className="size-4 text-emerald-500" />
              Privacy Policy (summary)
            </h3>
            <p className="text-muted-foreground">
              LinkClean runs entirely in your browser. We collect no personal
              data, use no cookies, no analytics, and no third-party trackers.
              The URLs you paste never leave your device — they are processed
              locally and never sent to any server. The only thing stored is a
              note in your browser that you&apos;ve accepted these terms, plus
              your theme preference.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="flex items-center gap-1.5 font-medium">
              <FileText className="size-4 text-emerald-500" />
              Terms of Service (summary)
            </h3>
            <p className="text-muted-foreground">
              LinkClean is free to use and provided “as is” without warranty of
              any kind. You are responsible for the URLs you process and share.
              The developer assumes no liability for any damages arising from
              use of the tool. The service may change or be discontinued at any
              time without notice.
            </p>
          </div>
        </div>

        <DialogFooter className="border-t p-4">
          <Button
            onClick={onAccept}
            className="h-9 w-full rounded-lg bg-emerald-500 text-sm font-medium text-white hover:bg-emerald-600"
          >
            <Check className="size-4" />
            I Agree — Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Privacy Policy dialog                                                      */
/* -------------------------------------------------------------------------- */

function PrivacyPolicyDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-2 border-b p-5 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-5 text-emerald-500" />
            Privacy Policy
          </DialogTitle>
          <DialogDescription>
            Your privacy is the entire point of LinkClean.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-5 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">No data collection</h3>
            <p>
              LinkClean does not collect, store, or transmit any personal data.
              There are no accounts, no sign-up, and no user identifiers of any
              kind.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">No cookies or trackers</h3>
            <p>
              We do not use cookies. We do not use Google Analytics, Facebook
              Pixel, or any other analytics or tracking service. No
              third-party scripts are loaded.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">URLs stay on your device</h3>
            <p>
              Every URL you paste is processed entirely in your browser using
              the native JavaScript URL API. Your URLs are never sent to any
              server — there is no backend.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Local storage</h3>
            <p>
              We use your browser&apos;s localStorage for exactly two things:
              remembering whether you&apos;ve accepted these terms, and your
              light/dark theme preference. This data never leaves your device.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Open source</h3>
            <p>
              LinkClean is open source. You can audit the entire codebase at{" "}
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline"
              >
                github.com/JeffreyHamilton6399/linkclean
              </a>
              .
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/*  Terms of Service dialog                                                    */
/* -------------------------------------------------------------------------- */

function TermsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="space-y-2 border-b p-5 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-emerald-500" />
            Terms of Service
          </DialogTitle>
          <DialogDescription>
            By using LinkClean, you agree to the following terms.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-5 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Free to use</h3>
            <p>
              LinkClean is provided free of charge. There are no paid tiers, no
              accounts, and no hidden costs.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">No warranty</h3>
            <p>
              LinkClean is provided “as is” and “as available”, without
              warranty of any kind — express or implied. While we strive for
              accuracy, we do not guarantee that every tracking parameter will
              be detected or that the cleaned URL will function identically to
              the original.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Your responsibility</h3>
            <p>
              You are solely responsible for the URLs you process and the
              resulting links you choose to share. LinkClean is a tool — how you
              use it is up to you.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Limitation of liability</h3>
            <p>
              The developer shall not be liable for any damages arising from the
              use of, or inability to use, LinkClean.
            </p>
          </section>
          <section className="space-y-1.5">
            <h3 className="text-foreground font-medium">Changes</h3>
            <p>
              These terms may be updated at any time. Continued use of LinkClean
              constitutes acceptance of the revised terms. The service itself
              may change or be discontinued without notice.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
