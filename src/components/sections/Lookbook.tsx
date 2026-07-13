import { ArrowUpRight, Globe } from "lucide-react";

type Site = {
  name: string;
  role: string;
  url: string;
  host: string;
};

const sites: Site[] = [
  {
    name: "Automax",
    role: "Auto dealership",
    url: "https://automax.atomcards.co.tz",
    host: "automax.atomcards.co.tz",
  },
  {
    name: "Dorice — JR Real Estate",
    role: "Real estate broker",
    url: "https://jrrealestatedealer.atomcards.co.tz/dorice",
    host: "jrrealestatedealer.atomcards.co.tz",
  },
  {
    name: "Nzaro — Kachenje",
    role: "Personal vCard",
    url: "https://kachenje.co.tz/vcards/nzaro.html",
    host: "kachenje.co.tz",
  },
  {
    name: "Xaveria Hyera — 1128",
    role: "Professional profile",
    url: "https://november.atomcards.co.tz/xaveria-hyera",
    host: "november.atomcards.co.tz",
  },
];

export function Lookbook() {
  return null;
  // Temporarily hidden: "Real cards. Real profiles." section
  // return (
  //   <section className="py-24 bg-section-dark text-white overflow-hidden">
  //     <div className="mx-auto max-w-6xl px-5">
  //       <div className="flex items-end justify-between gap-8 mb-12">
  //         <div>
  //           <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary/80">
  //             / 04 — In the wild
  //           </div>
  //           <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
  //             Real cards. Real profiles.
  //           </h2>
  //         </div>
  //         <p className="hidden md:block max-w-sm text-sm text-white/60 leading-relaxed">
  //           A peek at live AtomCard profiles already in people's pockets.
  //           Tap any preview to open the real thing.
  //         </p>
  //       </div>
  //
  //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  //         {sites.map((s) => (
  //           <a
  //             key={s.url}
  //             href={s.url}
  //             target="_blank"
  //             rel="noreferrer"
  //             className="group relative rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-primary/50 transition"
  //           >
  //             {/* Browser chrome */}
  //             <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
  //               <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
  //               <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
  //               <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
  //               <div className="ml-3 flex-1 flex items-center gap-2 rounded-md bg-white/[0.06] px-3 py-1 text-[11px] font-mono-tech text-white/60 truncate">
  //                 <Globe className="w-3 h-3 shrink-0" />
  //                 <span className="truncate">{s.host}</span>
  //               </div>
  //               <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-primary transition" />
  //             </div>
  //             {/* Iframe preview, scaled down to look like a phone-shot site */}
  //             <div className="relative aspect-[16/10] bg-white overflow-hidden">
  //               <iframe
  //                 src={s.url}
  //                 title={s.name}
  //                 loading="lazy"
  //                 sandbox="allow-scripts allow-same-origin"
  //                 scrolling="no"
  //                 className="absolute top-0 left-0 origin-top-left pointer-events-none"
  //                 style={{
  //                   width: "200%",
  //                   height: "200%",
  //                   transform: "scale(0.5)",
  //                 }}
  //               />
  //               <div className="absolute inset-0 bg-gradient-to-t from-section-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
  //             </div>
  //             {/* Caption */}
  //             <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
  //               <div>
  //                 <div className="text-sm font-semibold">{s.name}</div>
  //                 <div className="text-[11px] text-white/50">{s.role}</div>
  //               </div>
  //               <span className="rounded-full bg-primary/15 text-primary border border-primary/30 px-3 py-1 text-[10px] font-mono-tech tracking-widest uppercase">
  //                 Live
  //               </span>
  //             </div>
  //           </a>
  //         ))}
  //       </div>
  //     </div>
  //   </section>
  // );
}