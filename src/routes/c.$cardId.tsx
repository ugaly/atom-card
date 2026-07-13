import { createFileRoute, Link } from "@tanstack/react-router";
import QRCode from "react-qr-code";
import { ProfilePreview } from "@/components/card/ProfilePreview";
import { demoProfile } from "@/lib/demo-profile";
import { Nfc, Share2, Copy, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/c/$cardId")({
  head: () => ({
    meta: [
      { title: "Alex Rivera — AtomCard" },
      { name: "description", content: "Tap to save Alex Rivera to your contacts. Powered by AtomCard." },
      { property: "og:title", content: "Alex Rivera — AtomCard" },
      { property: "og:description", content: "A live AtomCard profile page." },
    ],
  }),
  component: CardLanding,
});

function CardLanding() {
  const { cardId } = Route.useParams();
  const url = typeof window !== "undefined" ? window.location.href : `https://atomcard.app/c/${cardId}`;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try { await (navigator as any).share({ title: "AtomCard", url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-surface">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[380px] w-[380px] rounded-full bg-accent/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(11,14,20,0.07) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="mx-auto w-full max-w-md px-5 pt-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xs font-medium text-ink/80 hover:text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand text-white shadow-sm">
              <Nfc className="h-3.5 w-3.5" />
            </span>
            atomcard.app
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-border bg-white/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-ink hover:border-primary hover:text-primary transition-colors"
          >
            {copied ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Share2 className="h-3.5 w-3.5" /> Share</>}
          </button>
        </div>
      </header>

      {/* Card */}
      <main className="relative z-10 mx-auto w-full max-w-md px-5 pt-8 pb-10">
        <div className="animate-fade-in flex justify-center">
          <ProfilePreview data={demoProfile} />
        </div>

        {/* Share / QR panel */}
        <div className="mt-8 rounded-2xl bg-white/90 backdrop-blur border border-border/70 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-border p-2.5 bg-white">
              <QRCode value={url} size={92} fgColor="#0B0E14" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-primary">Scan to share</div>
              <div className="mt-1 text-sm font-semibold text-ink">Send this card anywhere</div>
              <div className="mt-1.5 font-mono-tech text-[11px] text-muted-foreground break-all">/c/{cardId}</div>
              <button
                onClick={handleShare}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                {copied ? <><Check className="h-3.5 w-3.5" /> Link copied</> : <><Copy className="h-3.5 w-3.5" /> Copy link</>}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="relative z-10 mt-auto pb-8 px-5">
        <Link
          to="/"
          className="mx-auto block max-w-md rounded-2xl bg-ink text-white text-center py-4 text-sm font-medium hover:bg-ink/90 transition-colors shadow-lift"
        >
          Get your own AtomCard →
        </Link>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Powered by <span className="text-ink font-medium">AtomCard</span>
        </p>
      </footer>
    </div>
  );
}