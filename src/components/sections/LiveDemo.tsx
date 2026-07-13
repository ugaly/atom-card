import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { NFCPulse } from "@/components/card/NFCPulse";
import { ProfilePreview } from "@/components/card/ProfilePreview";
import { demoProfile } from "@/lib/demo-profile";

export function LiveDemo() {
  const [tapped, setTapped] = useState(false);

  return (
    <section id="demo" className="py-24 bg-surface relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: "url(https://tap-tu.com/wp-content/uploads/2023/09/Tap-Tu-hero-section-image-1-1024x675.webp)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 03 — Live demo</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink">See exactly what happens when someone taps your card.</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">No app to download. Their phone just opens your profile — and one tap saves you to their contacts forever.</p>
          <Button onClick={() => setTapped((t) => !t)} className="mt-6 rounded-full px-5 h-11">
            {tapped ? "Reset demo" : "Simulate a tap"}
          </Button>
          <div className="mt-6 text-xs text-muted-foreground">
            Tip: open <span className="font-mono-tech text-ink">/c/demo</span> on your phone to feel the real thing.
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-[300px] h-[600px] rounded-[3rem] bg-ink p-3 shadow-[0_40px_80px_-30px_rgba(11,14,20,0.4)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 h-6 w-28 rounded-full bg-ink" />
            <div className="relative h-full w-full rounded-[2.4rem] overflow-hidden bg-surface">
              <AnimatePresence mode="wait">
                {!tapped ? (
                  <motion.div
                    key="tap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                  >
                    <NFCPulse />
                    <div className="text-center px-8">
                      <div className="font-semibold text-ink">Hold to share</div>
                      <div className="text-xs text-muted-foreground mt-1">Tap your AtomCard against the back of any modern phone</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0 overflow-y-auto p-3"
                  >
                    <ProfilePreview data={demoProfile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}