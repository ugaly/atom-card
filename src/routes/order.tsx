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
  ClipboardList,
  Building2,
  Users,
  Globe,
  Share2,
  Palette,
  Phone,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
        content: "Request AtomCards for your team. Fill a form with your details or upload a spreadsheet.",
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

const fieldClass = "space-y-2";

function OrderPage() {
  return (
    <main className="min-h-screen bg-surface text-ink bg-mesh">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <Nfc className="h-4 w-4" />
            </span>
            <span className="tracking-tight">AtomCard</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="rounded-full px-3 font-mono-tech text-[10px] uppercase tracking-[0.2em]">
            Order form
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Request cards for your team
          </h1>
          <p className="mt-3 text-muted-foreground">
            Fill in company and personal details online, or download the Excel template and upload it when ready.
          </p>
        </div>

        <Tabs defaultValue="form" className="mt-10">
          <TabsList className="grid h-12 w-full max-w-lg grid-cols-2 rounded-xl bg-muted/80 p-1.5">
            <TabsTrigger
              value="form"
              className="h-9 gap-2 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <ClipboardList className="h-4 w-4" />
              Guided form
            </TabsTrigger>
            <TabsTrigger
              value="excel"
              className="h-9 gap-2 rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-8 focus-visible:ring-0">
            <ManualForm />
          </TabsContent>

          <TabsContent value="excel" className="mt-8 focus-visible:ring-0">
            <ExcelOption />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

function ManualForm() {
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState<PhoneValue | undefined>();
  const [cardStructure, setCardStructure] = useState("");
  const [socials, setSocials] = useState<SocialEntry[]>([{ name: "", url: "" }]);
  const [logos, setLogos] = useState<LogoItem[]>([]);
  const [numUsers, setNumUsers] = useState(1);
  const [users, setUsers] = useState<UserEntry[]>([emptyUser()]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      toast.error("Please upload image or PDF logo files.");
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
    if (!company.trim()) return toast.error("Company name is required.");
    if (!companyEmail.trim()) return toast.error("Company email is required so we can reply.");
    if (users.some((u) => !u.fullName.trim())) return toast.error("Every person needs a full name.");

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
          .map(
            (p) =>
              `  Phone: ${p.number} (${p.kind}${p.whatsapp ? ", WhatsApp" : ""})`,
          )
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
        subject: `AtomCard order — ${company} (${numUsers} card${numUsers === 1 ? "" : "s"})`,
        name: company,
        email: companyEmail,
        phone: companyPhone || undefined,
        from_name: company,
        company,
        website: website || undefined,
        location: location || undefined,
        team_size: String(numUsers),
        submission_type: "guided_form",
        message,
      });
      setSubmitted(true);
      toast.success("Request submitted — we'll be in touch shortly.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-border shadow-lift">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-2xl font-semibold">Thanks — we got it.</h3>
          <p className="mt-2 text-muted-foreground">
            Our team will reach out on{" "}
            <span className="text-ink">{companyEmail || "the email you provided"}</span> within 1
            business day with a quote and preview.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back to homepage</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection
        icon={Building2}
        step="01"
        title="Company details"
        description="Shared business info for every card. Fill what you know — we’ll confirm the rest."
      >
        <div className="space-y-5">
          <SubPanel
            icon={Building2}
            title="Business identity"
            hint="How your company should appear on the order"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className={fieldClass}>
                <Label htmlFor="company">
                  Company name <span className="text-primary">*</span>
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Northwind Studio"
                  autoComplete="organization"
                />
              </div>
              <div className={fieldClass}>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, country"
                  autoComplete="address-level2"
                />
              </div>
            </div>
          </SubPanel>

          <SubPanel
            icon={Phone}
            title="Contact"
            hint="Main number and email we can reach you on"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className={fieldClass}>
                <Label>Company phone</Label>
                <PhoneInput
                  value={companyPhone}
                  onChange={setCompanyPhone}
                  defaultCountry="TZ"
                />
                <p className="text-[11px] text-muted-foreground">Defaults to Tanzania (+255)</p>
              </div>
              <div className={fieldClass}>
                <Label htmlFor="companyEmail">
                  Company email <span className="text-primary">*</span>
                </Label>
                <Input
                  id="companyEmail"
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="hello@company.com"
                  autoComplete="email"
                />
              </div>
            </div>
          </SubPanel>

          <SubPanel
            icon={Globe}
            title="Online presence"
            hint="Website and social profiles for digital cards"
          >
            <div className={fieldClass}>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                autoComplete="url"
              />
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-3.5 w-3.5 text-primary" />
                <Label>Social links</Label>
              </div>
              {socials.map((s, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_auto]">
                  <Input
                    value={s.name}
                    onChange={(e) =>
                      setSocials((prev) => prev.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)))
                    }
                    placeholder="LinkedIn"
                    aria-label="Platform"
                  />
                  <Input
                    value={s.url}
                    onChange={(e) =>
                      setSocials((prev) => prev.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))
                    }
                    placeholder="https://"
                    aria-label="Profile URL"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0"
                    onClick={() =>
                      setSocials((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSocials((prev) => [...prev, { name: "", url: "" }])}
              >
                <Plus className="h-4 w-4" /> Add link
              </Button>
            </div>
          </SubPanel>

          <SubPanel
            icon={Palette}
            title="Brand & design"
            hint="Logos and notes for how cards should look"
          >
            <div className="space-y-3">
              <div>
                <Label>Company logo</Label>
                <p className="mt-1 text-xs text-muted-foreground">
                  One or more files · PNG, SVG, JPG, or PDF · click a card to preview
                </p>
              </div>
              <LogoUploader logos={logos} onAdd={addLogos} onRemove={removeLogo} />
            </div>

            <div className={cn(fieldClass, "mt-5")}>
              <Label htmlFor="design">Design notes</Label>
              <Textarea
                id="design"
                rows={4}
                value={cardStructure}
                onChange={(e) => setCardStructure(e.target.value)}
                placeholder="Colors, layout, front vs back, materials…"
              />
            </div>
          </SubPanel>
        </div>
      </FormSection>

      <FormSection
        icon={Users}
        step="02"
        title="People"
        description="One person per card. Set the count, then fill each person’s details."
        action={
          <div className="flex items-center gap-3">
            <Label htmlFor="numUsers" className="whitespace-nowrap text-xs text-muted-foreground">
              Team size
            </Label>
            <Input
              id="numUsers"
              type="number"
              min={1}
              max={200}
              value={numUsers}
              onChange={(e) => setUserCount(Number(e.target.value))}
              className="h-9 w-20"
            />
          </div>
        }
      >
        <div className="space-y-4">
          {users.map((u, i) => (
            <UserBlock key={i} index={i} user={u} onChange={(patch) => updateUser(i, patch)} />
          ))}
        </div>
      </FormSection>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <p className="max-w-md text-xs text-muted-foreground">
          A designer will confirm missing details with you before printing.
        </p>
        <Button type="submit" size="lg" disabled={submitting} className="h-11 rounded-full px-8">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Submit request"
          )}
        </Button>
      </div>
    </form>
  );
}

function UserBlock({
  index,
  user,
  onChange,
}: {
  index: number;
  user: UserEntry;
  onChange: (patch: Partial<UserEntry>) => void;
}) {
  const addPhone = () =>
    onChange({ phones: [...user.phones, { number: undefined, kind: "personal", whatsapp: false }] });
  const removePhone = (i: number) =>
    onChange({ phones: user.phones.length > 1 ? user.phones.filter((_, idx) => idx !== i) : user.phones });
  const setPhone = (i: number, patch: Partial<PhoneEntry>) =>
    onChange({ phones: user.phones.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

  const addEmail = () => onChange({ emails: [...user.emails, { address: "", kind: "work" }] });
  const removeEmail = (i: number) =>
    onChange({ emails: user.emails.length > 1 ? user.emails.filter((_, idx) => idx !== i) : user.emails });
  const setEmail = (i: number, patch: Partial<EmailEntry>) =>
    onChange({ emails: user.emails.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) });

  return (
    <Card className="border-border/80 bg-surface/40 shadow-none">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4">
        <Badge className="h-7 w-7 justify-center rounded-full p-0 text-xs">{index + 1}</Badge>
        <div>
          <CardTitle className="text-base">Person {index + 1}</CardTitle>
          <CardDescription>Personal info for this card</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={fieldClass}>
            <Label>
              Full name <span className="text-primary">*</span>
            </Label>
            <Input
              value={user.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Alex Rivera"
              autoComplete="name"
            />
          </div>
          <div className={fieldClass}>
            <Label>Job title</Label>
            <Input
              value={user.position}
              onChange={(e) => onChange({ position: e.target.value })}
              placeholder="e.g. Head of Sales"
              autoComplete="organization-title"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label>Phone</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Country defaults to Tanzania (+255). Change the flag if needed.
            </p>
          </div>
          {user.phones.map((p, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-3.5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <PhoneInput
                  value={p.number}
                  onChange={(value) => setPhone(i, { number: value })}
                  defaultCountry="TZ"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={() => removePhone(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Select value={p.kind} onValueChange={(v) => setPhone(i, { kind: v as PhoneEntry["kind"] })}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Checkbox checked={p.whatsapp} onCheckedChange={(v) => setPhone(i, { whatsapp: !!v })} />
                  WhatsApp
                </label>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addPhone}>
            <Plus className="h-4 w-4" /> Add phone
          </Button>
        </div>

        <div className="space-y-3">
          <Label>Email</Label>
          {user.emails.map((em, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-3.5">
              <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                <Input
                  type="email"
                  value={em.address}
                  onChange={(e) => setEmail(i, { address: e.target.value })}
                  placeholder="name@company.com"
                  autoComplete="email"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11"
                  onClick={() => removeEmail(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Select value={em.kind} onValueChange={(v) => setEmail(i, { kind: v as EmailEntry["kind"] })}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addEmail}>
            <Plus className="h-4 w-4" /> Add email
          </Button>
        </div>
      </CardContent>
    </Card>
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

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
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

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-background hover:border-primary/35 hover:bg-primary/[0.02]",
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ImagePlus className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium">Drop files here or browse</span>
        <span className="text-xs text-muted-foreground">PNG, SVG, JPG, PDF</span>
      </button>

      {logos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {logos.map((logo) => {
            const isImage = !!logo.previewUrl || logo.file.type.startsWith("image/");
            return (
              <li key={logo.id} className="group relative">
                <button
                  type="button"
                  onClick={() => setPreview(logo)}
                  className="flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="relative flex aspect-square items-center justify-center bg-muted/40">
                    {logo.previewUrl ? (
                      <img src={logo.previewUrl} alt={logo.file.name} className="h-full w-full object-contain p-2" />
                    ) : (
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
                      <Eye className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="border-t border-border/60 px-2.5 py-2">
                    <p className="truncate text-xs font-medium">{logo.file.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {isImage ? "Image" : "File"} · {(logo.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${logo.file.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(logo.id);
                  }}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">Add more</span>
            </button>
          </li>
        </ul>
      )}

      <Dialog open={!!preview} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-w-lg sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">{preview?.file.name}</DialogTitle>
            <DialogDescription>
              {preview ? `${(preview.file.size / 1024).toFixed(1)} KB · ${preview.file.type || "file"}` : "Preview"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[60vh] items-center justify-center overflow-auto rounded-xl border border-border bg-muted/30 p-4">
            {preview?.previewUrl ? (
              <img src={preview.previewUrl} alt={preview.file.name} className="max-h-[55vh] max-w-full object-contain" />
            ) : preview ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <FileText className="h-14 w-14 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Preview isn’t available for this file type.</p>
              </div>
            ) : null}
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

    // Single Order sheet: company block first, then personal-details headers underneath
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
      ["One row = one person / one card. Keep this header row. Leave a cell blank if you don’t have that info."],
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
      [
        "Jordan Lee",
        "Product Designer",
        "+255711111111",
        "personal",
        "yes",
        "",
        "",
        "",
        "jordan@company.com",
        "",
      ],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", "", "", ""],
    ];

    const wsOrder = XLSX.utils.aoa_to_sheet(orderSheet);
    wsOrder["!cols"] = [
      { wch: 48 },
      { wch: 28 },
      { wch: 24 },
      { wch: 28 },
      { wch: 28 },
      { wch: 24 },
      { wch: 28 },
      { wch: 28 },
      { wch: 24 },
      { wch: 24 },
    ];
    // Merge title cells for readability
    wsOrder["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } },
      { s: { r: 15, c: 0 }, e: { r: 15, c: 4 } },
      { s: { r: 16, c: 0 }, e: { r: 16, c: 4 } },
    ];
    XLSX.utils.book_append_sheet(wb, wsOrder, "Order form");

    // Extra sheet dedicated to personal rows (easier for large teams)
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
      [
        "Jordan Lee",
        "Product Designer",
        "+255711111111",
        "personal",
        "yes",
        "",
        "",
        "",
        "jordan@company.com",
        "",
      ],
    ];
    const wsPersonal = XLSX.utils.aoa_to_sheet(personalOnly);
    wsPersonal["!cols"] = USER_TEMPLATE_HEADERS.map((h) => ({
      wch: Math.max(18, Math.min(36, h.length + 4)),
    }));
    wsPersonal["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    XLSX.utils.book_append_sheet(wb, wsPersonal, "Personal details");

    XLSX.writeFile(wb, "atomcard-order-template.xlsx");
    toast.success("Template downloaded — company first, then personal details headers below.");
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

      // If Order form sheet, find the personal header row and parse from there
      const raw = XLSX.utils.sheet_to_json<string[]>(preferred, { header: 1, defval: "" });
      const headerIdx = raw.findIndex(
        (row) =>
          Array.isArray(row) &&
          String(row[0] || "")
            .toLowerCase()
            .includes("full name"),
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
      toast.success(`${file.name} parsed — ${data.length} row${data.length === 1 ? "" : "s"} detected.`);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read that file. Make sure it's a valid .xlsx.");
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

    // Best-effort reply email from first Work email / Personal email / any email-looking cell
    const replyEmail =
      rows
        .map((r) => {
          const work = String(r["Work email"] ?? r["work email"] ?? "").trim();
          const personal = String(r["Personal email"] ?? r["personal email"] ?? "").trim();
          return work || personal;
        })
        .find(Boolean) || "hello@atomcard.co.tz";

    const firstName = String(rows[0]?.["Full name"] ?? rows[0]?.["full name"] ?? "Excel order").trim();

    setSubmitting(true);
    try {
      await submitToWeb3Forms({
        subject: `AtomCard order — Excel (${rows.length} row${rows.length === 1 ? "" : "s"}) — ${fileName}`,
        name: firstName,
        email: replyEmail,
        from_name: firstName,
        submission_type: "excel_upload",
        file_name: fileName,
        row_count: String(rows.length),
        message,
      });
      setSubmitted(true);
      toast.success("Order request sent — we'll be in touch.");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not submit order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-border shadow-lift">
        <CardContent className="p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h3 className="mt-4 text-2xl font-semibold">Thanks — we got it.</h3>
          <p className="mt-2 text-muted-foreground">
            Your Excel order ({fileName}) was sent. We’ll follow up within 1 business day.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/">Back to homepage</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lift">
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <CardTitle className="pt-2 text-lg">1. Download template</CardTitle>
            <CardDescription>
              One sheet with <span className="text-foreground">Company details</span> first, then{" "}
              <span className="text-foreground">Personal details</span> headers below — plus a dedicated Personal sheet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={downloadTemplate} className="rounded-full">
              <FileSpreadsheet className="h-4 w-4" /> Download .xlsx
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lift">
          <CardHeader>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <CardTitle className="pt-2 text-lg">2. Upload completed file</CardTitle>
            <CardDescription>Keep the header row. Fill each person’s details, then upload.</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
              }}
            />
            <Button onClick={() => inputRef.current?.click()} variant="outline" className="rounded-full">
              <Upload className="h-4 w-4" /> Upload .xlsx
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lift">
        <CardHeader>
          <CardTitle className="text-lg">What’s inside the template</CardTitle>
          <CardDescription>
            After company fields you’ll see the personal details header row — fill one row per person.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">1</Badge>
              <h4 className="text-sm font-semibold">Company details</h4>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Field
                    </th>
                    <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPANY_TEMPLATE_FIELDS.map((field) => (
                    <tr key={field} className="border-b border-border/60">
                      <td className="px-3 py-2 font-medium text-ink">{field}</td>
                      <td className="px-3 py-2 text-muted-foreground">— fill in Excel —</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">2</Badge>
              <h4 className="text-sm font-semibold">Personal details headers</h4>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">
              These columns appear directly under company details in the downloaded file.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-primary/5">
                    {USER_TEMPLATE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <td className="px-3 py-2.5">Alex Rivera</td>
                    <td className="px-3 py-2.5">Head of Sales</td>
                    <td className="px-3 py-2.5">+255…</td>
                    <td className="px-3 py-2.5">personal</td>
                    <td className="px-3 py-2.5">yes</td>
                    <td className="px-3 py-2.5">+255…</td>
                    <td className="px-3 py-2.5">office</td>
                    <td className="px-3 py-2.5">no</td>
                    <td className="px-3 py-2.5">alex@…</td>
                    <td className="px-3 py-2.5">alex@gmail…</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {rows && (
        <Card className="shadow-lift overflow-hidden">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0">
            <div>
              <CardTitle className="text-lg">Preview: {fileName}</CardTitle>
              <CardDescription>
                {rows.length} user row{rows.length === 1 ? "" : "s"} detected.
              </CardDescription>
            </div>
            <Button onClick={submitExcelOrder} disabled={submitting} className="rounded-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                "Submit order"
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    {headers.map((h) => (
                      <th key={h} className="py-2 pr-4 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={i} className="border-b border-border/60">
                      {headers.map((h) => (
                        <td key={h} className="py-2 pr-4">
                          {String(r[h] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length > 8 && (
                <p className="mt-3 text-xs text-muted-foreground">…and {rows.length - 8} more.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SubPanel({
  icon: Icon,
  title,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/80 bg-gradient-to-br from-muted/40 via-background to-background p-4 md:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h4 className="text-sm font-semibold text-ink">{title}</h4>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function FormSection({
  icon: Icon,
  step,
  title,
  description,
  action,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  step: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="border-border shadow-lift overflow-hidden">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 border-b border-border/70 bg-muted/20">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Step {step}
            </p>
            <CardTitle className="mt-1 text-lg">{title}</CardTitle>
            <CardDescription className="mt-1 max-w-xl">{description}</CardDescription>
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
