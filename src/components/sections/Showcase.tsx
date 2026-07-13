import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Nfc, Wifi } from "lucide-react";
import { useEffect, useRef, useState, createContext, useContext } from "react";

type Finish = {
  name: string;
  material: string;
  gradient: string;
  light?: boolean;
  person: { name: string; role: string; handle: string; company: string; logo: string };
};

const cards: Finish[] = [
  {
    name: "Onyx",
    material: "Matte PVC",
    gradient: "linear-gradient(135deg,#0B0E14,#1f2735)",
    person: {
      name: "Alex Rivera",
      role: "Founder",
      handle: "alex",
      company: "Automax",
      logo: "https://automax.atomcards.co.tz/logo/logo.png",
    },
  },
  {
    name: "Cobalt",
    material: "Brushed metal",
    gradient: "linear-gradient(135deg,#0A2DB3,#1B4DFF 60%,#5B82FF)",
    person: {
      name: "Maya Chen",
      role: "Design Lead",
      handle: "maya",
      company: "Clockwise",
      logo: "https://clockwisetz.com/logo/logo.png",
    },
  },
  {
    name: "Linen",
    material: "Recycled paper",
    gradient: "linear-gradient(135deg,#F6F8FC,#E3E8F0)",
    light: true,
    person: {
      name: "Jonas Hale",
      role: "Architect",
      handle: "jonas",
      company: "Kachenje",
      logo: "https://kachenje.vercel.app/assets/logo/logo-big.png",
    },
  },
  {
    name: "Carbon",
    material: "Carbon fiber",
    gradient: "linear-gradient(135deg,#1a1d24,#3a3f4b)",
    person: {
      name: "Sara Okafor",
      role: "Broker · JR Real Estate",
      handle: "sara",
      company: "JR Real Estate",
      logo: "https://jrrealestatedealer.atomcards.co.tz/logo/logo.png",
    },
  },
];

const FocusedCardContext = createContext<string | null>(null);

export function Showcase() {
  const [focusedName, setFocusedName] = useState<string | null>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const refs = cardRefs.current;
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const name = (entry.target as HTMLElement).dataset.cardName;
          if (name) ratios.set(name, entry.intersectionRatio);
        });

        let bestName: string | null = null;
        let bestRatio = -1;
        ratios.forEach((ratio, name) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestName = name;
          }
        });
        setFocusedName(bestRatio > 0 ? bestName : null);
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    );

    refs.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="showcase" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 02 — Materials</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink max-w-xl">Four finishes. All the same chip inside.</h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">Every AtomCard ships with the same encrypted NFC core. Hover a card to flip it — tap or scan the QR to share.</p>
        </div>
        {/* Cards: column on mobile, grid on desktop */}
        <div className="mt-12 flex flex-col gap-5 md:grid md:grid-cols-2">
          <FocusedCardContext.Provider value={focusedName}>
            {cards.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl bg-white border border-border p-4 shadow-lift"
              >
                <FlipCard
                  finish={c}
                  registerRef={(el) => {
                    if (el) cardRefs.current.set(c.name, el);
                    else cardRefs.current.delete(c.name);
                  }}
                />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-ink">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.material}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </FocusedCardContext.Provider>
        </div>
      </div>
    </section>
  );
}

function FlipCard({ finish, registerRef }: { finish: Finish; registerRef: (el: HTMLDivElement | null) => void }) {
  const focusedName = useContext(FocusedCardContext);
  const isFocused = focusedName === finish.name;
  const text = finish.light ? "text-ink" : "text-white";
  const subtle = finish.light ? "text-ink/60" : "text-white/70";
  const chipBg = finish.light ? "bg-ink/5 text-ink/70" : "bg-white/15 text-white/90";

  return (
    <div ref={registerRef} data-card-name={finish.name} className="[perspective:1200px] aspect-[1.586/1] w-full">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFocused ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        } md:[transform:rotateY(0deg)] md:group-hover:[transform:rotateY(180deg)]`}
      >
        {/* FRONT */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] ${text}`}
          style={{ background: finish.gradient }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.45), transparent 55%)" }}
          />
          {/* faint grid */}
          <svg className="absolute inset-0 opacity-[0.12]" viewBox="0 0 400 250" preserveAspectRatio="none">
            <defs>
              <pattern id={`g-${finish.name}`} width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M32 0H0V32" fill="none" stroke={finish.light ? "#0B0E14" : "white"} strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#g-${finish.name})`} />
          </svg>

          <div className="relative h-full w-full p-4 flex flex-col">
            <div className="flex items-start justify-between">
              <div className={`text-[8px] tracking-[0.3em] uppercase ${subtle}`}>AtomCard</div>
              <Wifi className={`w-3.5 h-3.5 rotate-90 ${subtle}`} />
            </div>
            <div className="mt-auto flex items-end justify-between gap-3">
              {/* Left — details */}
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-tight truncate">{finish.person.name}</div>
                <div className={`text-[10px] ${subtle} truncate`}>
                  {finish.person.role} · {finish.person.company}
                </div>
                <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ${chipBg}`}>
                  <Nfc className="w-2.5 h-2.5" />
                  <span className="text-[8px] font-medium tracking-wide">Tap to share</span>
                </div>
              </div>
              {/* Right — QR */}
              <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-sm">
                <QRCode
                  value={`https://atomcard.app/c/${finish.person.handle}`}
                  size={60}
                  style={{ height: 60, width: 60 }}
                  viewBox="0 0 60 60"
                  bgColor="#ffffff"
                  fgColor="#0B0E14"
                />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15" />
        </div>

        {/* BACK */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] ${text}`}
          style={{ background: finish.gradient }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: "radial-gradient(circle at 70% 80%, rgba(255,255,255,0.35), transparent 55%)" }}
          />
          <svg className="absolute inset-0 opacity-[0.10]" viewBox="0 0 400 250" preserveAspectRatio="none">
            <defs>
              <pattern id={`gb-${finish.name}`} width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill={finish.light ? "#0B0E14" : "white"} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#gb-${finish.name})`} />
          </svg>
          <div className="relative h-full w-full p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AtomMark light={finish.light} />
                <span className={`text-[9px] tracking-[0.3em] uppercase ${subtle}`}>AtomCard</span>
              </div>
              <Nfc className={`w-3 h-3 ${subtle}`} />
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="aspect-[3/2] w-[85%] max-w-[260px] flex items-center justify-center">
                <img
                  src={finish.person.logo}
                  alt={`${finish.person.company} logo`}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-[8px] tracking-[0.25em] uppercase ${subtle}`}>{finish.person.company}</div>
              <div className={`text-[8px] tracking-[0.25em] uppercase ${subtle}`}>Scan or tap</div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/15" />
        </div>
      </div>
    </div>
  );
}

function AtomMark({ light }: { light?: boolean }) {
  const stroke = light ? "#0B0E14" : "#ffffff";
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="2" fill={stroke} />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke={stroke} strokeWidth="1.2" opacity="0.9" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke={stroke} strokeWidth="1.2" opacity="0.7" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke={stroke} strokeWidth="1.2" opacity="0.7" transform="rotate(-60 12 12)" />
    </svg>
  );
}