import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  { name: "Silver", blurb: "One card. Lifetime use.", features: ["1 AtomCard (any finish)", "Unlimited profile updates", "vCard + QR fallback", "Basic tap analytics"], cta: "Get my card" },
  { name: "Gold", blurb: "For growing teams.", features: ["Branded team cards", "Centralized dashboard", "Role-based access", "CRM exports (CSV)", "Priority support"], cta: "Start with team", featured: true },
  { name: "Platinum", blurb: "For 50+ cards.", features: ["SSO + SCIM", "Custom branding & materials", "API + webhooks", "Dedicated success manager", "DPA + custom contracts"], cta: "Talk to sales" },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 06 — Pricing</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink">Choose your finish</h2>
          <p className="mt-3 text-muted-foreground">Buy the card once. Updates are free for life.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-2xl p-7 ${t.featured ? "bg-ink text-white" : "bg-white border border-border shadow-lift"}`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">Most popular</div>
              )}
              <h3 className={`text-lg font-semibold ${t.featured ? "text-white" : "text-ink"}`}>{t.name}</h3>
              <p className={`text-sm mt-1 ${t.featured ? "text-white/70" : "text-muted-foreground"}`}>{t.blurb}</p>
              <Button asChild className={`mt-6 w-full h-11 rounded-xl ${t.featured ? "bg-white text-ink hover:bg-white/90" : ""}`}>
                <a href="#">{t.cta}</a>
              </Button>
              <ul className="mt-7 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className={`h-4 w-4 mt-0.5 shrink-0 ${t.featured ? "text-primary-light" : "text-primary"}`} />
                    <span className={t.featured ? "text-white/85" : "text-ink/85"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}