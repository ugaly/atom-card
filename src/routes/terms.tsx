import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, Nfc } from "lucide-react";

const LAST_UPDATED = "28 October 2026";
const CONTACT_EMAIL = "info@clockwisetz.com";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use & Privacy — AtomCard" },
      {
        name: "description",
        content:
          "The terms, privacy and account deletion rules for AtomCard digital business cards, the AtomCard website and the AtomCard mobile app.",
      },
    ],
  }),
  component: TermsPage,
});

type Section = { id: string; title: string; body: ReactNode };

const Email = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

const sections: Section[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These Terms of Use ("Terms") apply to the AtomCard website, the AtomCard mobile app for
          iOS and Android, and AtomCard physical NFC cards and digital business cards (together,
          the "Service"). The Service is provided by AtomCard ("we", "us", "our").
        </p>
        <p>
          By logging in to the app or using your AtomCard, you agree to these Terms, including the
          privacy and account deletion sections below. If you do not agree, please do not use the
          Service.
        </p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "How accounts are created",
    body: (
      <>
        <p>
          You cannot sign up for an account inside the mobile app. Most AtomCard customers get their
          card in person, through our sales and marketing team, or by ordering for their team on
          our website. After you (or your organisation) place an order, our team creates your
          account and sends your login details to the email address or phone number you gave us.
        </p>
        <p>
          You then use those details to log in to the app and manage your digital business card.
          Keep your login details private. You are responsible for activity on your account, so
          tell us straight away at <Email /> if you think someone else has accessed it.
        </p>
        <p>
          If your employer or organisation ordered your card, they may manage the company details on
          your card and may ask us to update or close your account. You can still contact us
          directly about your own personal data.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What the Service does",
    body: (
      <>
        <p>With AtomCard you can:</p>
        <ul>
          <li>Use a physical NFC card and a digital business card showing your contact details, links and company information.</li>
          <li>Share your details by NFC tap, QR code or link.</li>
          <li>Receive contact details and responses from people you share your card with.</li>
          <li>Use a custom card layout that we design using your or your company's brand identity.</li>
        </ul>
        <p>
          People you share your card with do not need the app. Your card opens in their web
          browser.
        </p>
      </>
    ),
  },
  {
    id: "branding",
    title: "Custom designs and branding",
    body: (
      <>
        <p>
          We design custom card layouts using the logos, colours, images and other brand materials
          you give us. By giving us these materials, you confirm that you own them or have
          permission to use them. We use them only to design, produce and display your cards.
        </p>
        <p>
          You keep ownership of your brand materials. We own the AtomCard app, platform, designs
          templates and underlying technology.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content and the details you receive",
    body: (
      <>
        <p>
          You are responsible for the information on your card. Your card is meant to be shared, so
          anything you add to your public card can be seen by anyone who taps it, scans it or opens
          its link. Only add details you are happy to share.
        </p>
        <p>
          When other people send you their details through the Service, use that information only
          for normal business contact. Do not sell it, share it with others without their
          permission, or use it for spam.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Pretend to be another person or business.</li>
          <li>Share content that is illegal, offensive, misleading or that infringes someone else's rights.</li>
          <li>Send spam or unwanted messages through the Service.</li>
          <li>Collect other people's data through the Service without their consent.</li>
          <li>Try to access other users' accounts or interfere with how the Service works.</li>
          <li>Copy, reverse engineer or resell the app or platform.</li>
        </ul>
        <p>We may suspend or close accounts that break these rules.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy: what we collect and why",
    body: (
      <>
        <p>We only collect what we need to run the Service:</p>
        <ul>
          <li><strong>Account and card details:</strong> your name, job title, company, phone numbers, email addresses, social links, photo and company logo.</li>
          <li><strong>Login information:</strong> your username or email and an encrypted password.</li>
          <li><strong>Contacts and responses you receive:</strong> details that people choose to share back with you through your card.</li>
          <li><strong>Basic usage information:</strong> such as when your card is viewed or tapped, used to show you card activity and keep the Service working.</li>
        </ul>
        <p>We use this information only to:</p>
        <ul>
          <li>Create and manage your account and card.</li>
          <li>Show your card to the people you share it with.</li>
          <li>Deliver the details and responses people send you.</li>
          <li>Provide support, keep the Service secure and fix problems.</li>
        </ul>
        <p>
          We do <strong>not</strong> sell your personal information, and we do not use it for
          third-party advertising. We do not track you across other companies' apps or websites.
        </p>
      </>
    ),
  },
  {
    id: "data-protection",
    title: "How we protect your information",
    body: (
      <>
        <ul>
          <li>Data is sent over encrypted connections (HTTPS).</li>
          <li>Passwords are stored in encrypted form and are never visible to our staff.</li>
          <li>Only authorised staff can access customer data, and only when needed to provide the Service or support.</li>
          <li>We share data only with trusted service providers that help us run the Service (such as hosting), who must keep it secure and confidential, or when the law requires us to.</li>
        </ul>
        <p>
          We handle personal data in line with the Personal Data Protection Act of Tanzania and other
          laws that apply. No system is perfectly secure, but if a breach affects your data we will
          tell you as required by law.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your privacy rights",
    body: (
      <p>
        You can ask us at any time to see, correct, download or delete the personal information we
        hold about you. You can update most card details yourself in the app. For anything else,
        email <Email /> and we will respond within 30 days.
      </p>
    ),
  },
  {
    id: "delete-account",
    title: "Deleting your account",
    body: (
      <>
        <p>You can delete your account and data at any time, in either of these ways:</p>
        <ul>
          <li><strong>In the app:</strong> go to your account settings and choose "Delete account", then confirm.</li>
          <li>
            <strong>By email:</strong> send a request to <Email /> from the email address linked to
            your account, with the subject "Delete my account". You can do this even if you no
            longer have the app installed.
          </li>
        </ul>
        <p>When your account is deleted:</p>
        <ul>
          <li>Your digital card and its link stop working, and your physical card no longer opens your profile.</li>
          <li>Your profile, card details, uploaded images and the contacts and responses you received are permanently deleted within 30 days.</li>
          <li>We may keep limited records, such as order and payment records, only where the law requires it, and only for as long as required.</li>
        </ul>
        <p>Deleting the app from your phone does not delete your account.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Age requirement",
    body: (
      <p>
        AtomCard is a business tool for adults. You must be at least 18 years old to use the
        Service. We do not knowingly collect information from children.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Availability and liability",
    body: (
      <p>
        We work to keep the Service running, but we cannot promise it will always be available or
        error free. We may update, change or stop parts of the Service. The Service is provided "as
        is", and to the extent allowed by law we are not liable for indirect losses or for losses
        caused by things outside our control.
      </p>
    ),
  },
  {
    id: "app-stores",
    title: "App stores",
    body: (
      <p>
        These Terms are between you and AtomCard only, not Apple or Google. Apple and Google are not
        responsible for the app or its content, and have no duty to provide support for it. Your use
        of the app must also follow the App Store or Google Play terms. Apple and its subsidiaries
        may enforce these Terms against you as third-party beneficiaries.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these Terms from time to time. When we do, we will change the date at the top
        of this page, and we will tell you in the app or by email if the changes are important. If
        you keep using the Service after an update, you accept the new Terms.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: <p>These Terms are governed by the laws of the United Republic of Tanzania.</p>,
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        For questions about these Terms, your privacy or deleting your account, email us at{" "}
        <Email />.
      </p>
    ),
  },
];

function TermsPage() {
  return (
    <main className="min-h-dvh bg-surface text-ink">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2.5 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-white">
              <Nfc className="h-4 w-4" />
            </span>
            <span className="tracking-tight">AtomCard</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-[720px] px-4 py-10 sm:py-14">
        <div className="text-xs font-mono-tech uppercase tracking-[0.25em] text-primary">/ Legal</div>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold">Terms of Use &amp; Privacy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>

        <nav className="mt-8 rounded-xl border border-border bg-white p-5 text-sm">
          <div className="font-semibold">Contents</div>
          <ol className="mt-2 grid gap-1 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="mt-10 space-y-8">
          {sections.map((s, i) => (
            <li key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="text-lg font-semibold">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                {s.body}
              </div>
            </li>
          ))}
        </ol>
      </article>
    </main>
  );
}
