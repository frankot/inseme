import { contactDefaults, heroDefaults, kontaktDefaults, type SiteContact } from "@/content/home";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site-url";

/**
 * schema.org builders for the JSON-LD the public pages emit. Pure functions of
 * the same content the pages render, so markup and visible text never drift.
 *
 * Deliberately absent: `AggregateRating` / `Review`. Google treats ratings a
 * business publishes about itself as self-serving and can act against the
 * whole domain (SEO strategy §3.8) — the Opinie section links out instead.
 */

/** Stable id, so Person and Article can point at the clinic instead of repeating it. */
export const CLINIC_ID = `${SITE_URL}/#osrodek`;

/**
 * The Google Business Profile and any other official listings. Empty until
 * the client confirms the canonical profile — an unverified `sameAs` merges
 * the site with the wrong entity.
 */
const SAME_AS: string[] = [];

export function clinicJsonLd(contact: SiteContact = contactDefaults) {
  const [postalCode, ...locality] = contact.addressLine2.split(" ");

  return {
    "@type": "MedicalClinic",
    "@id": CLINIC_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/placeholder/logo-insieme.png"),
    image: absoluteUrl(heroDefaults.image.src),
    telephone: contact.phoneHref,
    email: contact.email,
    medicalSpecialty: "Psychiatric",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.addressLine1.replace(/^ul\.\s*/, ""),
      postalCode,
      addressLocality: locality.join(" "),
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: kontaktDefaults.map.lat,
      longitude: kontaktDefaults.map.lon,
    },
    ...(SAME_AS.length > 0 && { sameAs: SAME_AS }),
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      // The last crumb is the current page and may omit its URL.
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}

/** FAQ answers are sanitised rich text; the markup wants the words. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: stripTags(item.answer) },
    })),
  };
}

export function personJsonLd(member: {
  slug: string;
  name: string;
  role: string | null;
  qualifications: string | null;
  shortBio: string | null;
  photo: { url: string } | null;
}) {
  return {
    "@type": "Person",
    "@id": absoluteUrl(`/zespol/${member.slug}#osoba`),
    name: member.name,
    url: absoluteUrl(`/zespol/${member.slug}`),
    ...(member.role && { jobTitle: member.role }),
    ...(member.qualifications && { hasCredential: member.qualifications }),
    ...(member.shortBio && { description: member.shortBio }),
    ...(member.photo && { image: absoluteUrl(member.photo.url) }),
    worksFor: { "@id": CLINIC_ID },
  };
}

export function articleJsonLd(article: {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  updatedAt: string;
  cover: { url: string } | null;
}) {
  return {
    "@type": "Article",
    headline: article.title,
    url: absoluteUrl(`/artykuly/${article.slug}`),
    mainEntityOfPage: absoluteUrl(`/artykuly/${article.slug}`),
    inLanguage: "pl-PL",
    ...(article.excerpt && { description: article.excerpt }),
    ...(article.cover && { image: absoluteUrl(article.cover.url) }),
    ...(article.publishedAt && { datePublished: article.publishedAt }),
    dateModified: article.updatedAt,
    // `authorReviewer` is free text today; once it is a relation to
    // `team_members`, this becomes a reference to that Person.
    author: { "@id": CLINIC_ID },
    publisher: { "@id": CLINIC_ID },
  };
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
