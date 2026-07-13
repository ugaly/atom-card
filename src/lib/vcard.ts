export interface VCardData {
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
}

export function buildVCard(d: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${d.lastName};${d.firstName};;;`,
    `FN:${d.firstName} ${d.lastName}`,
    d.title ? `TITLE:${d.title}` : "",
    d.company ? `ORG:${d.company}` : "",
    d.email ? `EMAIL;TYPE=INTERNET:${d.email}` : "",
    d.phone ? `TEL;TYPE=CELL:${d.phone}` : "",
    d.website ? `URL:${d.website}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function downloadVCard(d: VCardData) {
  const vcard = buildVCard(d);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${d.firstName}-${d.lastName}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}