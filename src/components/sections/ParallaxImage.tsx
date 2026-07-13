export function ParallaxImage() {
  return (
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://tap-tu.com/wp-content/uploads/2023/09/Tap-Tu-hero-section-image-1-1024x675.webp')",
        }}
      />
      <div className="absolute inset-0 bg-ink/40" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="text-center text-white/90 text-lg md:text-2xl font-medium max-w-xl px-6">
          One tap. Instant connection. Forever memorable.
        </p>
      </div>
    </section>
  );
}
