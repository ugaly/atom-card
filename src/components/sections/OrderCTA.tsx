import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardList } from "lucide-react";

export function OrderCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-white to-surface p-8 md:p-12 shadow-lift"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground">
                <ClipboardList className="h-3 w-3 text-primary" />
                Ready to order
              </div>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-ink leading-tight">
                Do you need a card?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Tell us about your team and card design. Fill a quick form or upload a spreadsheet — we'll take it from there.
              </p>
            </div>
            <Button asChild size="lg" className="h-12 rounded-full px-6 shrink-0">
              <Link to="/order">Fill this form <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}