import type { ProfileData } from "@/components/card/ProfilePreview";

export const demoProfile: ProfileData = {
  firstName: "Alex",
  lastName: "Rivera",
  title: "Founder",
  company: "Northwind Studio",
  email: "alex@northwind.studio",
  phone: "+14155550112",
  whatsapp: "+14155550112",
  website: "https://northwind.studio",
  location: "Brooklyn, NY",
  bio: "Design partner for early-stage hardware brands. I help you ship the thing.",
  socials: [
    { kind: "linkedin", url: "https://linkedin.com" },
    { kind: "twitter", url: "https://twitter.com" },
    { kind: "instagram", url: "https://instagram.com" },
  ],
};