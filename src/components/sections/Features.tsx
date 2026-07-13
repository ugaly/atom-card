import { motion } from "framer-motion";
import { BarChart3, RefreshCw, Users, Download, Link2, Lock } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Tap analytics", body: "See who tapped, where, and when — in a clean dashboard." },
  { icon: RefreshCw, title: "Unlimited updates", body: "Change your title or socials anytime. Your card stays in sync." },
  { icon: Users, title: "Team cards", body: "Roll out branded cards to your whole company in minutes." },
  { icon: Download, title: "vCard download", body: "Saves to native contacts — iOS and Android, no app required." },
  { icon: Link2, title: "All your links", body: "Socials, Calendly, portfolio, payment links — one tap each." },
  { icon: Lock, title: "Private by default", body: "You control what each card reveals. Revoke access anytime." },
];

export function Features() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 04 — Features</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink">A networking stack that doesn't feel like one.</h2>
        </div>
        <div className="mt-12 grid gap-px bg-border rounded-2xl overflow-hidden border border-border md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white p-7 hover:bg-surface transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary-dark">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}