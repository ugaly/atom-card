import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Nfc, Wifi } from "lucide-react";
import type { PointerEvent } from "react";

export function TiltCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const sheenX = useTransform(sx, [-0.5, 0.5], ["10%", "90%"]);
  const sheenY = useTransform(sy, [-0.5, 0.5], ["10%", "90%"]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.45), transparent 55%)`;

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div className="relative" style={{ perspective: 1400 }}>
      <div className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-gradient-brand rounded-[2rem]" />
      <motion.div
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative aspect-[1.586/1] w-[min(92vw,440px)] rounded-2xl bg-gradient-brand text-white shadow-[0_30px_80px_-20px_rgba(27,77,255,0.55)] overflow-hidden select-none"
      >
        {/* Sheen */}
        <motion.div
          style={{ backgroundImage: sheenBg }}
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
        />
        {/* Concentric grid */}
        <svg className="absolute inset-0 opacity-20" viewBox="0 0 400 250" preserveAspectRatio="none">
          <defs>
            <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>

        <div className="relative h-full w-full p-7 flex flex-col justify-between" style={{ transform: "translateZ(40px)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] opacity-80">AtomCard</div>
              <div className="mt-1 font-semibold text-lg">Alex Rivera</div>
              <div className="text-xs opacity-80">Founder · Northwind Studio</div>
            </div>
            <div className="relative">
              <Wifi className="w-6 h-6 rotate-90 opacity-90" />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="font-mono-tech text-[10px] opacity-80 tracking-widest">
              NFC ID · A7F2 · 9C30 · 04B1
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
              <Nfc className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium tracking-wide">Tap to share</span>
            </div>
          </div>
        </div>

        {/* Edge highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
      </motion.div>
    </div>
  );
}