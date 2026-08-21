import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Upload,
  Plus,
  Trash2,
  Nfc,
  CheckCircle2,
  ImagePlus,
  FileText,
  X,
  Eye,
  Minus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhoneInput, type PhoneValue } from "@/components/ui/phone-input";
import { submitToWeb3Forms } from "@/lib/web3forms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order your AtomCards — Team card request" },
      {
        name: "description",
        content:
          "Request AtomCards for your team. Fill a form with your details or upload a spreadsheet.",
      },
    ],
  }),
  component: OrderPage,
});

type PhoneEntry = {
  number: PhoneValue | undefined;
  kind: "personal" | "office";
  whatsapp: boolean;
};

type EmailEntry = {
  address: string;
  kind: "personal" | "work";
};

type UserEntry = {
  fullName: string;
  position: string;
  phones: PhoneEntry[];
  emails: EmailEntry[];
};

type SocialEntry = { name: string; url: string };

type LogoItem = {
  id: string;
  file: File;
  previewUrl: string | null;
};

const COMPANY_TEMPLATE_FIELDS = [
  "Company name",
  "Company phone (with country code)",
  "Website URL",
  "Company email",
  "Location",
  "Social media (name | url, one per line)",
  "Card structure / design notes",
  "Logo filenames (attach logos by email or upload separately)",
] as const;

const USER_TEMPLATE_HEADERS = [
  "Full name",
  "Position / job title",
  "Phone 1 (with country code)",
  "Phone 1 type (personal / office)",
  "Phone 1 on WhatsApp? (yes / no)",
  "Phone 2 (with country code)",
  "Phone 2 type (personal / office)",
  "Phone 2 on WhatsApp? (yes / no)",
  "Work email",
  "Personal email",
] as const;

const emptyUser = (): UserEntry => ({
  fullName: "",
  position: "",
  phones: [{ number: undefined, kind: "personal", whatsapp: false }],
  emails: [{ address: "", kind: "work" }],
});

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const underlineInput =
  "w-full border-0 border-b-2 border-solid border-black/15 bg-transparent px-0 py-3 text-base text-ink outline-none transition placeholder:text-black/35 focus:border-primary focus:ring-0 rounded-none shadow-none";

function OrderPage() {
  const [tab, setTab] = useState<"form" | "excel">("form");

  return (
    <main className="min-h-dvh bg-[#D3E3FD] text-ink">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4 sm:px-0">
          <Link to="/" className="flex items-center gap-2.5 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <Nfc className="h-4 w-4" />
            </span>
            <span className="tracking-tight">AtomCard</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[720px] px-3 py-6 sm:px-4 sm:py-10">
        <div className="mb-5 flex justify-center gap-1 rounded-full border border-black/8 bg-white p-1.5 shadow-md">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition",
              tab === "form" ? "bg-primary text-white shadow-sm" : "text-ink/60 hover:bg-black/5 hover:text-ink",
            )}
          >
            Fill form
          </button>
          <button
            type="button"
            onClick={() => setTab("excel")}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold transition",
              tab === "excel" ? "bg-primary text-white shadow-sm" : "text-ink/60 hover:bg-black/5 hover:text-ink",
            )}
          >
            Upload Excel
          </button>
        </div>

        {tab === "form" ? <GoogleStyleForm /> : <ExcelOption />}
      </div>
    </main>
  );
}

function GoogleStyleForm() {
  const [activeId, setActiveId] = useState<string | null>("company-name");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState<PhoneValue | undefined>();
  const [cardStructure, setCardStructure] = useState("");
  const [socials, setSocials] = useState<SocialEntry[]>([]);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [numUsers, setNumUsers] = useState(1);
  const [users, setUsers] = useState<UserEntry[]>([emptyUser()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      logos.forEach((l) => {
        if (l.previewUrl) URL.revokeObjectURL(l.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserCount = (n: number) => {
    const clamped = Math.max(1, Math.min(200, Math.floor(n) || 1));
    setNumUsers(clamped);
    setUsers((prev) => {
      if (clamped > prev.length) {
        return [...prev, ...Array.from({ length: clamped - prev.length }, emptyUser)];
      }
      return prev.slice(0, clamped);
    });
  };

  const updateUser = (i: number, patch: Partial<UserEntry>) => {
    setUsers((prev) => prev.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));
  };

  const addLogos = (files: FileList | File[]) => {
    const incoming = Array.from(files).filter(
      (f) => /image\/|svg|pdf/i.test(f.type) || /\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(f.name),
    );
    if (!incoming.length) {
      toast.error("Please upload PNG, JPG, SVG, or PDF files.");
      return;
    }
    const items: LogoItem[] = incoming.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setLogos((prev) => [...prev, ...items]);
  };

  const removeLogo = (id: string) => {
    setLogos((prev) => {
      const target = prev.find((l) => l.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((l) => l.id !== id);
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!company.trim()) next.company = "Enter your company name";
    if (!companyEmail.trim()) next.companyEmail = "Enter your company email";
    else if (!isValidEmail(companyEmail)) next.companyEmail = "Enter a valid email address";
    users.forEach((u, i) => {
      if (!u.fullName.trim()) next[`user-${i}`] = "Enter a full name";
    });
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0]);
      const first = Object.keys(next)[0];
      if (first === "company") setActiveId("company-name");
      else if (first === "companyEmail") setActiveId("company-email");
      return;
    }

    const socialLines = socials
      .filter((s) => s.name.trim() || s.url.trim())
      .map((s) => `- ${s.name || "Link"}: ${s.url || "—"}`)
      .join("\n");
    const logoLines =
      logos.length > 0
        ? logos.map((l) => `- ${l.file.name} (${(l.file.size / 1024).toFixed(0)} KB)`).join("\n")
        : "- None uploaded";
    const peopleLines = users
      .map((u, i) => {
        const phones = u.phones
          .filter((p) => p.number)
          .map((p) => `  Phone: ${p.number} (${p.kind}${p.whatsapp ? ", WhatsApp" : ""})`)
          .join("\n");
        const emails = u.emails
          .filter((em) => em.address.trim())
          .map((em) => `  Email: ${em.address} (${em.kind})`)
          .join("\n");
        return [
          `Person ${i + 1}: ${u.fullName}`,
          `  Job title: ${u.position || "—"}`,
          phones || "  Phone: —",
          emails || "  Email: —",
        ].join("\n");
      })
      .join("\n\n");

    const message = [
      "ATOMCARD ORDER — Guided form",
      "",
      "COMPANY DETAILS",
      `Company: ${company}`,
      `Phone: ${companyPhone || "—"}`,
      `Email: ${companyEmail}`,
      `Website: ${website || "—"}`,
      `Location: ${location || "—"}`,
      `Cards requested: ${numUsers}`,
      "",
      "Social links:",
      socialLines || "- None",
      "",
      "Logos:",
      logoLines,
      "",
      "Design notes:",
      cardStructure || "—",
      "",
      "PERSONAL DETAILS",
      peopleLines,
    ].join("\n");

    setSubmitting(true);
    try {
      await submitToWeb3Forms({
        name: company,
        email: companyEmail,
        subject: `AtomCard order — ${company} (${numUsers} card${numUsers === 1 ? "" : "s"})`,
        message,
      });
      setSubmitted(true);
      toast.success("Order submitted — we'll be in touch shortly.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <FormCard active accent>
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
          <h2 className="mt-5 text-2xl font-medium tracking-tight text-ink">Your AtomCards order has been received</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
            Thanks! We&apos;ve received your details and will contact you on{" "}
            <span className="font-medium text-ink">{companyEmail}</span> if anything needs clarification.
          </p>
          <Button asChild className="mt-8 h-12 rounded-full px-8 text-base font-semibold">
            <Link to="/">Back to AtomCards</Link>
          </Button>
        </div>
      </FormCard>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5 pb-10">
      {/* Header card — Google Forms style */}
      <FormCard active={activeId === "header"} accent onActivate={() => setActiveId("header")}>
        <h1 className="text-[28px] font-medium leading-tight tracking-tight text-ink sm:text-[32px]">
          Order your AtomCards
        </h1>
        <div className="mt-4 border-t border-black/10 pt-4">
          <p className="text-[15px] leading-relaxed text-ink/70">
            Tell us about your company and the people who need cards. We&apos;ll use these details to prepare your
            digital business cards.
          </p>
        </div>
        <p className="mt-5 text-sm font-medium text-destructive">* Indicates required question</p>
      </FormCard>

      {/* Section: Company */}
      <SectionTitle>Company details</SectionTitle>

      <QuestionCard
        id="company-name"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Company name"
        required
        error={errors.company}
      >
        <input
          className={underlineInput}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your answer"
          autoComplete="organization"
        />
      </QuestionCard>

      <QuestionCard id="location" activeId={activeId} setActiveId={setActiveId} label="Location">
        <input
          className={underlineInput}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Dar es Salaam, Tanzania"
          autoComplete="address-level2"
        />
      </QuestionCard>

      <QuestionCard
        id="company-phone"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Company phone"
        hint="Defaults to Tanzania (+255)"
      >
        <div className="pt-1">
          <PhoneInput value={companyPhone} onChange={setCompanyPhone} defaultCountry="TZ" />
        </div>
      </QuestionCard>

      <QuestionCard
        id="company-email"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Company email"
        required
        error={errors.companyEmail}
      >
        <input
          type="email"
          className={underlineInput}
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="Your answer"
          autoComplete="email"
        />
      </QuestionCard>

      <SectionTitle>Online presence</SectionTitle>

      <QuestionCard id="website" activeId={activeId} setActiveId={setActiveId} label="Website">
        <input
          type="url"
          className={underlineInput}
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yourcompany.com"
          autoComplete="url"
        />
      </QuestionCard>

      <QuestionCard
        id="socials"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Social links"
        hint="Optional — add profiles you want on the digital card"
      >
        <div className="space-y-4 pt-2">
          {socials.map((s, i) => (
            <div key={i} className="space-y-2">
              <input
                className={underlineInput}
                value={s.name}
                onChange={(e) =>
                  setSocials((prev) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                }
                placeholder="Platform (e.g. LinkedIn)"
              />
              <div className="flex items-end gap-2">
                <input
                  className={cn(underlineInput, "flex-1")}
                  value={s.url}
                  onChange={(e) =>
                    setSocials((prev) => prev.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))
                  }
                  placeholder="URL"
                />
                <button
                  type="button"
                  className="mb-2 rounded-full p-2 text-muted-foreground hover:bg-black/5 hover:text-ink"
                  onClick={() => setSocials((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSocials((prev) => [...prev, { name: "", url: "" }])}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <Plus className="h-4 w-4" /> Add social link
          </button>
        </div>
      </QuestionCard>

      <SectionTitle>Branding</SectionTitle>

      <QuestionCard
        id="logo"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Company logo"
        hint="PNG, JPG, SVG or PDF"
      >
        <div className="pt-2">
          <LogoUploader logos={logos} onAdd={addLogos} onRemove={removeLogo} />
        </div>
      </QuestionCard>

      <QuestionCard
        id="design"
        activeId={activeId}
        setActiveId={setActiveId}
        label="Design notes"
        hint="Anything important about how you want the cards to look"
      >
        <textarea
          rows={3}
          className={cn(underlineInput, "resize-y")}
          value={cardStructure}
          onChange={(e) => setCardStructure(e.target.value)}
          placeholder="Your answer"
        />
      </QuestionCard>

      <SectionTitle>Team &amp; people</SectionTitle>

      <QuestionCard
        id="team-size"
        activeId={activeId}
        setActiveId={setActiveId}
        label="How many AtomCards do you need?"
        hint="Each person gets their own digital business card"
      >
        <div className="flex items-center gap-4 pt-3">
          <button
            type="button"
            onClick={() => setUserCount(numUsers - 1)}
            disabled={numUsers <= 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black/15 bg-[#F8F9FA] text-ink transition hover:border-primary/40 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[2.5rem] text-center text-3xl font-semibold tabular-nums text-ink">{numUsers}</span>
          <button
            type="button"
            onClick={() => setUserCount(numUsers + 1)}
            disabled={numUsers >= 200}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black/15 bg-[#F8F9FA] text-ink transition hover:border-primary/40 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </QuestionCard>

      {users.map((user, i) => (
        <PersonCards
          key={i}
          index={i}
          user={user}
          activeId={activeId}
          setActiveId={setActiveId}
          error={errors[`user-${i}`]}
          onChange={(patch) => updateUser(i, patch)}
        />
      ))}

      <div className="flex flex-col items-center gap-3 pt-6">
        <Button type="submit" disabled={submitting} className="h-12 min-w-[160px] rounded-full px-10 text-base font-semibold shadow-md">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit"
          )}
        </Button>
        <p className="text-xs text-ink/50">Never submit passwords through this form.</p>
      </div>
    </form>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-1 pb-0.5 pt-5">
      <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-sm">
        {children}
      </span>
      <span className="h-px flex-1 bg-primary/25" />
    </div>
  );
}

function FormCard({
  children,
  active,
  accent,
  onActivate,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  accent?: boolean;
  onActivate?: () => void;
  className?: string;
}) {
  return (
    <div
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : undefined}
      onClick={onActivate}
      onKeyDown={
        onActivate
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onActivate();
            }
          : undefined
      }
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white px-5 py-5 transition-shadow sm:px-7 sm:py-6",
        active
          ? "border-primary/20 shadow-[0_2px_8px_rgba(27,77,255,0.12),0_1px_3px_rgba(60,64,67,0.1)]"
          : "border-black/10 shadow-[0_1px_3px_rgba(60,64,67,0.12),0_2px_8px_rgba(60,64,67,0.08)]",
        className,
      )}
    >
      {accent && <div className="absolute inset-x-0 top-0 h-[12px] bg-primary" />}
      {active && !accent && (
        <div className="absolute inset-y-0 left-0 w-[7px] rounded-l-xl bg-[#1A73E8]" />
      )}
      <div className={cn(accent && "pt-3", active && !accent && "pl-2")}>{children}</div>
    </div>
  );
}

function QuestionCard({
  id,
  activeId,
  setActiveId,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  activeId: string | null;
  setActiveId: (id: string) => void;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  const active = activeId === id;
  return (
    <FormCard active={active} onActivate={() => setActiveId(id)}>
      <label className="block text-[17px] font-medium leading-snug text-ink">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      {hint ? <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{hint}</p> : null}
      <div className="mt-5" onFocus={() => setActiveId(id)}>
        {children}
      </div>
      {error ? (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{error}</p>
      ) : null}
    </FormCard>
  );
}

function PersonCards({
  index,
  user,
  activeId,
  setActiveId,
  onChange,
  error,
}: {
  index: number;
  user: UserEntry;
  activeId: string | null;
  setActiveId: (id: string) => void;
  onChange: (patch: Partial<UserEntry>) => void;
  error?: string;
}) {
  const setPhone = (i: number, patch: Partial<PhoneEntry>) =>
    onChange({ phones: user.phones.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const setEmail = (i: number, patch: Partial<EmailEntry>) =>
    onChange({ emails: user.emails.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) });

  const base = `person-${index}`;

  return (
    <>
      <SectionTitle>
        Card {String(index + 1).padStart(2, "0")} — person details
      </SectionTitle>

      <QuestionCard
        id={`${base}-name`}
        activeId={activeId}
        setActiveId={setActiveId}
        label="Full name"
        required
        error={error}
      >
        <input
          className={underlineInput}
          value={user.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="Your answer"
          autoComplete="name"
        />
      </QuestionCard>

      <QuestionCard
        id={`${base}-title`}
        activeId={activeId}
        setActiveId={setActiveId}
        label="Job title"
      >
        <input
          className={underlineInput}
          value={user.position}
          onChange={(e) => onChange({ position: e.target.value })}
          placeholder="Your answer"
          autoComplete="organization-title"
        />
      </QuestionCard>

      <QuestionCard
        id={`${base}-phone`}
        activeId={activeId}
        setActiveId={setActiveId}
        label="Phone"
        hint="Defaults to Tanzania (+255). Tick WhatsApp if that number works there."
      >
        <div className="space-y-4 pt-1">
          {user.phones.map((p, i) => (
            <div key={i} className="space-y-3 border-b border-black/5 pb-4 last:border-0 last:pb-0">
              <PhoneInput value={p.number} onChange={(v) => setPhone(i, { number: v })} defaultCountry="TZ" />
              <div className="flex flex-wrap items-center gap-4">
                <Select value={p.kind} onValueChange={(v) => setPhone(i, { kind: v as PhoneEntry["kind"] })}>
                  <SelectTrigger className="h-9 w-[130px] rounded-md border-black/10 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <Checkbox checked={p.whatsapp} onCheckedChange={(v) => setPhone(i, { whatsapp: !!v })} />
                  WhatsApp
                </label>
                {user.phones.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-destructive"
                    onClick={() => onChange({ phones: user.phones.filter((_, idx) => idx !== i) })}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ phones: [...user.phones, { number: undefined, kind: "personal", whatsapp: false }] })
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <Plus className="h-4 w-4" /> Add phone
          </button>
        </div>
      </QuestionCard>

      <QuestionCard
        id={`${base}-email`}
        activeId={activeId}
        setActiveId={setActiveId}
        label="Email"
      >
        <div className="space-y-4 pt-1">
          {user.emails.map((em, i) => (
            <div key={i} className="space-y-3 border-b border-black/5 pb-4 last:border-0 last:pb-0">
              <input
                type="email"
                className={underlineInput}
                value={em.address}
                onChange={(e) => setEmail(i, { address: e.target.value })}
                placeholder="Your answer"
              />
              <div className="flex flex-wrap items-center gap-4">
                <Select value={em.kind} onValueChange={(v) => setEmail(i, { kind: v as EmailEntry["kind"] })}>
                  <SelectTrigger className="h-9 w-[130px] rounded-md border-black/10 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
                {user.emails.length > 1 && (
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-destructive"
                    onClick={() => onChange({ emails: user.emails.filter((_, idx) => idx !== i) })}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ emails: [...user.emails, { address: "", kind: "work" }] })}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary transition hover:bg-primary/15"
          >
            <Plus className="h-4 w-4" /> Add email
          </button>
        </div>
      </QuestionCard>
    </>
  );
}

function LogoUploader({
  logos,
  onAdd,
  onRemove,
}: {
  logos: LogoItem[];
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<LogoItem | null>(null);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.svg,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.target.value = "";
        }}
      />

      {logos.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
          }}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-9 text-center transition",
            dragging ? "border-primary bg-primary/5" : "border-black/20 bg-[#F8F9FA] hover:border-primary/50",
          )}
        >
          <ImagePlus className="h-7 w-7 text-primary" />
          <span className="text-[15px] font-semibold text-ink">Upload company logo</span>
          <span className="text-sm text-ink/55">PNG, JPG, SVG or PDF</span>
        </button>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {logos.map((logo) => (
            <li key={logo.id} className="group relative">
              <button
                type="button"
                onClick={() => setPreview(logo)}
                className="flex w-full flex-col overflow-hidden rounded-lg border border-black/8 bg-[#F8F9FA] text-left"
              >
                <div className="relative flex aspect-square items-center justify-center">
                  {logo.previewUrl ? (
                    <img src={logo.previewUrl} alt="" className="h-full w-full object-contain p-2" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                    <Eye className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="truncate bg-white px-2 py-1.5 text-xs">{logo.file.name}</div>
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => onRemove(logo.id)}
                className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-muted-foreground shadow-sm hover:bg-destructive hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-black/15 text-muted-foreground hover:border-primary/40 hover:text-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs">Add</span>
            </button>
          </li>
        </ul>
      )}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">{preview?.file.name}</DialogTitle>
            <DialogDescription>
              {preview ? `${(preview.file.size / 1024).toFixed(1)} KB` : "Preview"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[55vh] items-center justify-center rounded-lg bg-[#F8F9FA] p-4">
            {preview?.previewUrl ? (
              <img src={preview.previewUrl} alt="" className="max-h-[50vh] max-w-full object-contain" />
            ) : (
              <FileText className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExcelOption() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const orderSheet: (string | number)[][] = [
      ["ATOMCARD ORDER TEMPLATE"],
      ["Fill company details first, then add one row per person under Personal details."],
      [],
      ["COMPANY DETAILS"],
      ["Field", "Value (fill this column)"],
      ...COMPANY_TEMPLATE_FIELDS.map((field) => [field, ""] as (string | number)[]),
      [],
      [],
      ["PERSONAL DETAILS"],
      ["One row = one person / one card."],
      [...USER_TEMPLATE_HEADERS],
      [
        "Alex Rivera",
        "Head of Sales",
        "+255700000000",
        "personal",
        "yes",
        "+255222000000",
        "office",
        "no",
        "alex@company.com",
        "alex@gmail.com",
      ],
    ];
    const wsOrder = XLSX.utils.aoa_to_sheet(orderSheet);
    wsOrder["!cols"] = Array(10).fill({ wch: 24 });
    XLSX.utils.book_append_sheet(wb, wsOrder, "Order form");

    const personalOnly = [
      ["PERSONAL DETAILS — one row per person"],
      [...USER_TEMPLATE_HEADERS],
      [
        "Alex Rivera",
        "Head of Sales",
        "+255700000000",
        "personal",
        "yes",
        "+255222000000",
        "office",
        "no",
        "alex@company.com",
        "alex@gmail.com",
      ],
    ];
    const wsPersonal = XLSX.utils.aoa_to_sheet(personalOnly);
    wsPersonal["!cols"] = USER_TEMPLATE_HEADERS.map((h) => ({
      wch: Math.max(18, Math.min(36, h.length + 4)),
    }));
    XLSX.utils.book_append_sheet(wb, wsPersonal, "Personal details");
    XLSX.writeFile(wb, "atomcard-order-template.xlsx");
    toast.success("Template downloaded");
  };

  const onUpload = async (file: File) => {
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf);
      const preferred =
        wb.Sheets["Personal details"] ??
        wb.Sheets["Order form"] ??
        wb.Sheets["Users"] ??
        wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<string[]>(preferred, { header: 1, defval: "" });
      const headerIdx = raw.findIndex(
        (row) => Array.isArray(row) && String(row[0] || "").toLowerCase().includes("full name"),
      );
      let data: Record<string, unknown>[] = [];
      if (headerIdx >= 0) {
        const headers = (raw[headerIdx] as string[]).map(String);
        data = raw
          .slice(headerIdx + 1)
          .filter((row) => Array.isArray(row) && row.some((cell) => String(cell).trim()))
          .map((row) => {
            const obj: Record<string, unknown> = {};
            headers.forEach((h, i) => {
              if (h) obj[h] = (row as string[])[i] ?? "";
            });
            return obj;
          });
      } else {
        data = XLSX.utils.sheet_to_json<Record<string, unknown>>(preferred);
      }
      setRows(data);
      setFileName(file.name);
      toast.success(`${data.length} row${data.length === 1 ? "" : "s"} detected`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read that file.");
    }
  };

  const headers = useMemo(() => (rows && rows[0] ? Object.keys(rows[0]) : []), [rows]);

  const submitExcelOrder = async () => {
    if (!rows?.length) return toast.error("Upload a completed Excel file first.");
    const tableLines = [
      headers.join(" | "),
      ...rows.map((r) => headers.map((h) => String(r[h] ?? "")).join(" | ")),
    ].join("\n");
    const message = [
      "ATOMCARD ORDER — Excel upload",
      `File: ${fileName}`,
      `Rows: ${rows.length}`,
      "",
      "PERSONAL DETAILS (from spreadsheet)",
      tableLines,
    ].join("\n");
    const replyEmail =
      rows
        .map((r) => {
          const work = String(r["Work email"] ?? "").trim();
          const personal = String(r["Personal email"] ?? "").trim();
          return work || personal;
        })
        .find(Boolean) || "orders@atomcards.co.tz";
    const firstName = String(rows[0]?.["Full name"] ?? "Excel order").trim();

    setSubmitting(true);
    try {
      await submitToWeb3Forms({
        name: firstName,
        email: replyEmail,
        subject: `AtomCard order — Excel (${rows.length} rows) — ${fileName}`,
        message,
      });
      setSubmitted(true);
      toast.success("Order submitted");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not submit order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <FormCard accent>
        <div className="py-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-2xl font-normal">Order received</h2>
          <p className="mt-3 text-muted-foreground">
            File <span className="text-ink">{fileName}</span> was submitted successfully.
          </p>
          <Button asChild className="mt-8 h-11 rounded-full">
            <Link to="/">Back to AtomCards</Link>
          </Button>
        </div>
      </FormCard>
    );
  }

  return (
    <div className="space-y-3">
      <FormCard accent>
        <h1 className="text-[28px] font-normal tracking-tight">Upload Excel</h1>
        <div className="mt-3 border-t border-black/8 pt-3">
          <p className="text-[14px] text-muted-foreground">
            Download the template, fill company + personal details, then upload it back.
          </p>
        </div>
      </FormCard>

      <FormCard>
        <button type="button" onClick={downloadTemplate} className="flex w-full items-center gap-3 text-left">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Download className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[16px]">1. Download template</p>
            <p className="text-sm text-muted-foreground">Company + personal headers included</p>
          </div>
          <FileSpreadsheet className="ml-auto h-5 w-5 text-muted-foreground" />
        </button>
      </FormCard>

      <FormCard>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[16px]">2. Upload completed file</p>
            <p className="text-sm text-muted-foreground">.xlsx or .xls</p>
          </div>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onUpload(f);
          }}
        />
      </FormCard>

      {rows && (
        <FormCard>
          <p className="text-[16px]">{fileName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} person row{rows.length === 1 ? "" : "s"}
          </p>
          <div className="mt-3 max-h-40 overflow-auto text-sm text-muted-foreground">
            {rows.slice(0, 6).map((r, i) => (
              <p key={i} className="truncate border-b border-black/5 py-1.5">
                {headers.map((h) => String(r[h] ?? "")).filter(Boolean).join(" · ")}
              </p>
            ))}
          </div>
          <Button
            onClick={() => void submitExcelOrder()}
            disabled={submitting}
            className="mt-4 h-11 rounded-md"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Submit
          </Button>
        </FormCard>
      )}
    </div>
  );
}
