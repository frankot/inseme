import { ContactForm } from "@/components/site/ui/contact-form";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { footerDefaults, type SiteContact } from "@/content/home";

/**
 * The two-column contact block shared by the homepage section and the /kontakt
 * page. The form sticks — same `StickySplit` method as the FAQ section — while
 * the phone card, map and emergency card scroll beside it.
 */
export function KontaktGrid({
  contact,
  formTitle,
  formNote,
  map,
  className,
}: {
  contact: SiteContact;
  formTitle: string;
  formNote: string;
  map: { title: string; embedSrc: string };
  className?: string;
}) {
  return (
    <StickySplit
      className={className}
      aside={
        <>
          <h2 className="mb-3 text-pretty font-heading text-display-sm text-ink-900">
            {formTitle}
          </h2>
          <p className="mb-6 max-w-[30em] text-[15.5px] leading-[1.72] text-ink-400">
            {formNote}
          </p>
          <ContactForm contact={contact} />
        </>
      }
    >
      <div className="flex flex-col gap-gap">
        <div className="bg-ink-900 p-[clamp(24px,2.4vw,34px)]">
          <span className="mb-4 block text-eyebrow uppercase tracking-[0.2em] text-on-dark-muted">
            Telefon
          </span>
          <a
            href={`tel:${contact.phoneHref}`}
            className="font-heading text-[clamp(30px,3vw,42px)] leading-none tracking-[-0.035em] tabular-nums text-on-dark transition-colors hover:text-on-dark-sage-2"
          >
            {contact.phone}
          </a>
          <p className="mt-3 text-[14px] leading-[1.7] text-on-dark-muted">
            {contact.hours}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-4 block border-t border-on-dark-3/16 pt-3 text-[15px] text-on-dark-muted transition-colors hover:text-on-dark"
          >
            {contact.email}
          </a>
          <p className="mt-4 text-[14px] leading-[1.7] text-on-dark-faint">
            {contact.addressLine1}
            <br />
            {contact.addressLine2}
          </p>
        </div>

        {/* The band's own corner radius, and `overflow-hidden` to hold the
            embed to it — an iframe will not round itself. */}
        <div className="relative aspect-[16/10] overflow-hidden  border border-line bg-stone">
          <iframe
            title={map.title}
            loading="lazy"
            src={map.embedSrc}
            className="absolute inset-0 block size-full border-0"
          />
        </div>

        <div className="border border-line bg-sand p-[clamp(20px,2vw,28px)]">
          <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
            {footerDefaults.emergencyLabel}
          </span>
          <p className="mt-2 font-heading text-[26px] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
            {footerDefaults.emergencyNumber}
          </p>
          <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-300">
            {footerDefaults.helplineLabel}
            <br />
            <span className="tabular-nums text-ink-500">
              {footerDefaults.helplineNumber}
            </span>
          </p>
        </div>
      </div>
    </StickySplit>
  );
}
