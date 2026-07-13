import { motion } from "framer-motion";
import { Nfc, Share2, Contact } from "lucide-react";

const steps = [
  { icon: Nfc, title: "Tap or scan", body: "They hold their phone near your AtomCard, or scan the QR on the back." },
  { icon: Share2, title: "Share your profile", body: "Your card page opens instantly — no app, no install, no friction." },
  { icon: Contact, title: "They save your contact", body: "One tap downloads a vCard straight to their phone's contacts." },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-surface">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl">
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 01 — How it works</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink">Three steps. One tap. Done.</h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                className="relative rounded-2xl bg-white border border-border p-7 shadow-lift"
              >
                <div className="font-mono-tech text-xs text-muted-foreground">0{i + 1}</div>
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary-dark">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}