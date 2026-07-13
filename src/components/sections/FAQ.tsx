import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Does the other person need an app?", a: "No. AtomCard opens your profile in their default browser — works on any modern iPhone or Android. The 'Save Contact' button generates a standard .vcf file their phone already knows how to read." },
  { q: "What if their phone doesn't have NFC?", a: "Every AtomCard ships with a QR code printed on the back as a fallback. Same destination, same experience." },
  { q: "Can I change what's on my card after I order it?", a: "Yes — that's the whole point. The chip stores a permanent link to your profile page, which you can update unlimited times. Print never goes stale." },
  { q: "Is my data private?", a: "Your profile is public by design (it's a business card), but you choose what to put on it. You can revoke or rotate your card link at any time." },
  { q: "How long does shipping take?", a: "Cards are produced in 3–5 business days and shipped worldwide. Team orders include a dedicated production timeline." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ 07 — FAQ</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-ink">Common questions.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium text-ink hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}