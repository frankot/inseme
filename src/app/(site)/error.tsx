"use client";

import { useEffect } from "react";

import { useSiteContact } from "@/components/site/chrome/site-settings";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";

/**
 * A page threw — usually the database. The site layout (footer, call bar) is
 * outside this boundary and still renders, and the phone number does not
 * depend on anything that can fail here.
 */
export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const contact = useSiteContact();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SubpageLayout
      eyebrow="Błąd"
      title="Coś poszło nie tak."
      lead="Strona nie wczytała się poprawnie. Spróbuj jeszcze raz za chwilę — a jeśli sprawa jest pilna, zadzwoń."
    >
      <Container className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-section-lg">
        <Cta href={`tel:${contact.phoneHref}`} variant="solid" className="tabular-nums">
          Zadzwoń: {contact.phone}
        </Cta>
        <button
          type="button"
          onClick={() => retry()}
          className="link-arrow text-body text-sage-600 transition-colors hover:text-sage-700"
        >
          <span>Spróbuj ponownie</span>
          <span aria-hidden>→</span>
        </button>
      </Container>
    </SubpageLayout>
  );
}
