import { Button } from "@/components/ui/button";
import { Nfc, ArrowRight, Twitter, Instagram, Linkedin } from "lucide-react";

export function FooterCTA() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold leading-[1.05]">
              Stop printing.<br />
              <span className="text-gradient-brand">Start tapping.</span>
            </h2>
            <p className="mt-5 text-white/70 max-w-md leading-relaxed">Your AtomCard ships in under a week. Every update after is free, forever.</p>
            <Button asChild size="lg" className="mt-7 rounded-full h-12 px-6 bg-white text-ink hover:bg-white/90">
              <a href="/order">Get your AtomCard <ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
          <div className="md:justify-self-end">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm max-w-sm">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand"><Nfc className="h-4 w-4" /></span>
                Get launch updates
              </div>
              <p className="mt-2 text-xs text-white/60">New finishes, team features, and the occasional product drop. No spam.</p>
              <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); }}>
                <input type="email" required placeholder="you@work.com" className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary-light" />
                <Button type="submit" className="rounded-lg bg-primary hover:bg-primary-light">Notify me</Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-white/10 pt-8 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-brand"><Nfc className="h-3.5 w-3.5" /></span>
            <span>© {new Date().getFullYear()} AtomCard. Made for people who meet people.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}