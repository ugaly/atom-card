import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/card/TiltCard";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-16 pb-20 md:grid-cols-2 md:gap-8 md:pt-24 md:pb-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="flex flex-col justify-center"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs text-muted-foreground shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            One tap. Every contact app. No app required.
          </motion.div>
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            className="mt-5 text-5xl md:text-6xl font-semibold leading-[1.05] text-ink"
          >
            Your business card,<br />
            <span className="text-gradient-brand">tap-ready.</span>
          </motion.h1>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            className="mt-5 max-w-md text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            AtomCard is an NFC-enabled card that shares your profile, social links, and a saveable contact in a single tap — no app to download for you or them.
          </motion.p>
          <motion.div
            variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm">
              <a href="/order">Get your AtomCard <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-6 text-sm border-border">
              <a href="/c/demo">Try a live card →</a>
            </Button>
          </motion.div>
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            className="mt-8 flex items-center gap-5 text-xs text-muted-foreground"
          >
            <div className="flex -space-x-2">
              {["A", "M", "K", "S"].map((c, i) => (
                <div key={i} className="h-7 w-7 rounded-full bg-gradient-brand ring-2 ring-white text-[10px] text-white font-medium flex items-center justify-center">{c}</div>
              ))}
            </div>
            <span>12,400+ professionals already ditched paper.</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <TiltCard />
        </motion.div>
      </div>
    </section>
  );
}