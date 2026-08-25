import { Container } from "@/components/site/ui/container";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  contactDefaults,
  footerDefaults,
  type FooterContent,
  type SiteContact,
} from "@/content/home";

export function SiteFooter({
  content = footerDefaults,
  contact = contactDefaults,
}: {
  content?: FooterContent;
  contact?: SiteContact;
}) {
  return (
    <footer className="border-t border-line bg-bone">
      <Container className="grid gap-9 gap-x-[clamp(24px,3vw,64px)] pt-[clamp(40px,4.5vw,64px)] pb-[clamp(32px,3.5vw,48px)] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <SiteImage
            src="/placeholder/logo-insieme.png"
            alt="Insieme"
            width={244}
            height={72}
            className="h-8 w-26 object-contain object-left"
          />
          <span className="mt-2 block text-[9.5px] uppercase tracking-[0.26em] text-ink-200">
            {content.tagline}
          </span>
          <span className="mt-[18px] block text-[13.5px] leading-[1.7] text-ink-200">
            {contact.addressLine1}
            <br />
            {contact.addressLine2}
          </span>
        </div>

        <FooterColumn title={content.columnTitle}>
          {content.links.slice(0, 4).map((link) => (
            <FooterLink key={link.label} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Kontakt">
          <FooterLink href={`tel:${contact.phoneHref}`}>
            {contact.phone} — całą dobę
          </FooterLink>
          <FooterLink href={`mailto:${contact.email}`}>
            {contact.email}
          </FooterLink>
          <FooterLink href={content.privacyHref}>
            {content.privacyLabel}
          </FooterLink>
        </FooterColumn>

        <div className="flex flex-col gap-2.5">
          <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
            {content.emergencyLabel}
          </span>
          <span className="font-heading text-[26px] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
            {content.emergencyNumber}
          </span>
          <span className="text-[13.5px] leading-[1.7] text-ink-200">
            {content.helplineLabel}
            <br />
            <span className="tabular-nums text-ink-500">
              {content.helplineNumber}
            </span>
          </span>
        </div>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-wrap justify-between gap-x-11 gap-y-2 py-6 text-[13px] text-ink-200">
          <span>{content.legalName}</span>
          <span className="max-w-[46em]">{content.disclaimer}</span>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="mb-1 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
        {title}
      </span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-[13.5px] leading-[1.7] text-ink-300 transition-colors hover:text-sage-600"
    >
      {children}
    </a>
  );
}
