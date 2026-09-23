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
    /*
     * The stack closes on a dark sheet, pulled up over the last band with a
     * curved top — the mirror of how a raised band is laid over the one below
     * it. The foot stays square: it is the page's bottom edge, with nothing
     * behind it for a curve to be cut against.
     *
     * `z-20` because a raised band is itself `z-10` — without it a page that
     * ends on a raised sheet (Przyjazd on /osrodek) paints over the curve.
     */
    <footer className="relative z-20 -mt-slab rounded-t-slab bg-ink-950">
      <Container className="grid gap-9 gap-x-[clamp(24px,3vw,64px)] pt-[clamp(40px,4.5vw,64px)] pb-[clamp(32px,3.5vw,48px)] sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <SiteImage
            src="/placeholder/logo-insieme.png"
            alt="Insieme"
            width={244}
            height={72}
            // The mark is drawn for light grounds; on this one it is knocked
            // back to white, the same treatment the header gives it over the
            // hero photograph.
            className="h-8 w-26 object-contain object-left brightness-0 opacity-95 invert"
          />
          <span className="mt-2 block text-[9.5px] uppercase tracking-[0.26em] text-on-dark-muted">
            {content.tagline}
          </span>
          <span className="mt-[18px] block text-[13.5px] leading-[1.7] text-on-dark-muted">
            {contact.addressLine1}
            <br />
            {contact.addressLine2}
          </span>
        </div>

        <FooterColumn title={content.columnTitle}>
          {content.links.slice(0, 6).map((link) => (
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
          <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-300">
            {content.emergencyLabel}
          </span>
          <span className="font-heading text-[26px] leading-none tracking-[-0.03em] tabular-nums text-on-dark">
            {content.emergencyNumber}
          </span>
          <span className="text-[13.5px] leading-[1.7] text-on-dark-muted">
            {content.helplineLabel}
            <br />
            <span className="tabular-nums text-on-dark-sage-2">
              {content.helplineNumber}
            </span>
          </span>
        </div>
      </Container>

      <div className="border-t border-white/12">
        <Container className="flex flex-wrap justify-between gap-x-11 gap-y-2 py-6 text-[13px] text-on-dark-muted">
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
      {/*
        The warm label tier survives the swap to a dark ground: clay-600 reads
        as the eyebrow colour on cream, clay-300 does the same job here. Going
        neutral would have cost the footer the one hue that marks a label.
      */}
      <span className="mb-1 text-eyebrow uppercase tracking-[0.2em] text-clay-300">
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
      className="text-[13.5px] leading-[1.7] text-on-dark-lead transition-colors hover:text-sage-300"
    >
      {children}
    </a>
  );
}
