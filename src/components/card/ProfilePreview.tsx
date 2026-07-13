import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { downloadVCard, type VCardData } from "@/lib/vcard";
import { Phone, Mail, Globe, MessageCircle, Linkedin, Twitter, Instagram, UserPlus, MapPin } from "lucide-react";

export interface ProfileData extends VCardData {
  location?: string;
  bio?: string;
  socials?: { kind: "linkedin" | "twitter" | "instagram"; url: string }[];
}

export function ProfilePreview({ data }: { data: ProfileData }) {
  const initials = (data.firstName[0] ?? "") + (data.lastName[0] ?? "");
  const websiteLabel = data.website?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-lift flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-brand px-6 pt-7 pb-6 text-center text-white">
        <Avatar className="h-24 w-24 ring-4 ring-white/90 shadow-lift mx-auto">
          <AvatarFallback className="bg-white text-primary text-2xl font-semibold">
            {initials.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-xl font-semibold tracking-tight">{data.firstName} {data.lastName}</h3>
        {data.title && (
          <p className="mt-0.5 text-sm text-white/90">{data.title}{data.company ? ` · ${data.company}` : ""}</p>
        )}
        {data.website && (
          <a href={data.website} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-white/95 underline underline-offset-4">
            {websiteLabel}
          </a>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.email && (
            <a href={`mailto:${data.email}`} className="rounded-lg bg-white text-primary text-sm font-medium py-2.5 shadow-sm hover:bg-white/95 transition-colors">
              Email
            </a>
          )}
          <button onClick={() => downloadVCard(data)} className="rounded-lg bg-white text-primary text-sm font-medium py-2.5 shadow-sm hover:bg-white/95 transition-colors inline-flex items-center justify-center gap-1.5">
            <UserPlus className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 bg-white">
        {data.bio && (
          <div>
            <h4 className="text-base font-semibold text-primary">About</h4>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink/80">{data.bio}</p>
          </div>
        )}

        <div className="mt-5">
          <h4 className="text-base font-semibold text-primary">Quick Connect</h4>
          <div className="mt-2 divide-y divide-border/70 rounded-lg border border-border/70 overflow-hidden">
            {data.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-surface">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"><Phone className="h-3.5 w-3.5" /></span>
                <span className="font-medium text-ink min-w-[68px]">Phone</span>
                <span className="text-muted-foreground truncate">{data.phone}</span>
              </a>
            )}
            {data.whatsapp && (
              <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-surface">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"><MessageCircle className="h-3.5 w-3.5" /></span>
                <span className="font-medium text-ink min-w-[68px]">WhatsApp</span>
                <span className="text-muted-foreground truncate">Message</span>
              </a>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-surface">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"><Mail className="h-3.5 w-3.5" /></span>
                <span className="font-medium text-ink min-w-[68px]">Email</span>
                <span className="text-muted-foreground truncate">{data.email}</span>
              </a>
            )}
            {data.location && (
              <div className="flex items-center gap-3 px-3 py-2.5 text-xs">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"><MapPin className="h-3.5 w-3.5" /></span>
                <span className="font-medium text-ink min-w-[68px]">Location</span>
                <span className="text-muted-foreground truncate">{data.location}</span>
              </div>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-surface">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary"><Globe className="h-3.5 w-3.5" /></span>
                <span className="font-medium text-ink min-w-[68px]">Website</span>
                <span className="text-muted-foreground truncate">{websiteLabel}</span>
              </a>
            )}
          </div>
        </div>

        <Button onClick={() => downloadVCard(data)} className="mt-5 w-full h-11 rounded-xl text-sm">
          <UserPlus className="h-4 w-4" /> Save to contacts
        </Button>
      </div>

      {/* Footer */}
      {data.socials && data.socials.length > 0 && (
        <div className="bg-gradient-brand px-6 py-4 flex items-center justify-center gap-5">
          {data.socials.map((s) => {
            const Icon = s.kind === "linkedin" ? Linkedin : s.kind === "twitter" ? Twitter : Instagram;
            return (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-white/95 hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}