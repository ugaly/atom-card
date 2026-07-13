const logos = [
  { name: "Automax", url: "https://automax.atomcards.co.tz/logo/logo.png" },
  { name: "CTMCL", url: "https://ctmcl.vercel.app/logo/logo.png" },
  { name: "JR Real Estate", url: "https://jrrealestatedealer.atomcards.co.tz/logo/logo.png", className: "h-44 md:h-56 w-80 md:w-[30rem]" },
  { name: "1128", url: "https://november.atomcards.co.tz/logo/1128%20LOGO%203.png" },
  { name: "Kachenje", url: "https://kachenje.vercel.app/assets/logo/logo-big.png" },
  { name: "Clockwise", url: "https://clockwisetz.com/logo/logo.png" },
];

export function LogoMarquee() {
  // Double the array for seamless loop
  const row = [...logos, ...logos];

  return (
    <section className="py-16 border-y border-white/10 bg-trusted-by-bg overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 text-center">
        <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-white/70">
          Trusted by teams at
        </div>
      </div>
      <div className="mt-8 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-trusted-by-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-trusted-by-bg to-transparent z-10 pointer-events-none" />
        <div className="flex whitespace-nowrap marquee-track items-center">
          {row.map((logo, i) => (
            <div
              key={i}
              className={[
                "flex items-center justify-center shrink-0 mx-6 md:mx-10",
                logo.className || "h-24 md:h-32 w-56 md:w-72",
              ].join(" ")}
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="max-h-full max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .marquee-track {
          animation: logoscroll 15s linear infinite;
          width: max-content;
        }
        @keyframes logoscroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
