const quotes = [
  { name: "Maya K.", role: "VP Sales, Helix", text: "Closed a deal because I didn't fumble with paper. Genuinely." },
  { name: "Daniel P.", role: "Founder, Loop", text: "Every investor I met at Web Summit asked where I got the card." },
  { name: "Sara L.", role: "Architect", text: "It just works. iOS, Android, even my client's grandma's phone." },
  { name: "Theo R.", role: "Recruiter", text: "I update my title once. 400 candidates see the new version." },
  { name: "Jess W.", role: "Designer", text: "Looks like an object I'd buy from a museum shop." },
  { name: "Marc D.", role: "Consultant", text: "Paid for itself the first week." },
];

export function CustomerMarquee() {
  const row = [...quotes, ...quotes];
  return (
    <section className="py-20 bg-surface overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 05 — Loved by</div>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-ink">Used by people who meet people for a living.</h2>
        </div>
      </div>
      <div className="mt-12 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
        <div className="flex gap-5 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {row.map((q, i) => (
            <div key={i} className="shrink-0 w-[320px] rounded-2xl bg-white border border-border p-5 shadow-sm">
              <p className="text-sm text-ink leading-relaxed">"{q.text}"</p>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="font-medium text-ink">{q.name}</span> · {q.role}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </section>
  );
}