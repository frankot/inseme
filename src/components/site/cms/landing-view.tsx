import { CmsSlot } from "@/components/site/cms/cms-slot";
import { Faq } from "@/components/site/sections/faq";
import { Hero } from "@/components/site/sections/hero";
import { Kontakt } from "@/components/site/sections/kontakt";
import { Opinie } from "@/components/site/sections/opinie";
import { Osrodek } from "@/components/site/sections/osrodek";
import { PierwszyKontakt } from "@/components/site/sections/pierwszy-kontakt";
import { Poradnik } from "@/components/site/sections/poradnik";
import { Program } from "@/components/site/sections/program";
import { TestPrzesiewowy } from "@/components/site/sections/test-przesiewowy";
import { Zespol } from "@/components/site/sections/zespol";
import { ContactPathProvider } from "@/components/site/ui/contact-path";
import { latestArticleDefaults } from "@/content/artykuly";
import {
  faqDefaults,
  heroDefaults,
  kontaktDefaults,
  osrodekDefaults,
  pierwszyKontaktDefaults,
  programDefaults,
  testDefaults,
  type ContactPath,
  type HeroContent,
  type OsrodekContent,
} from "@/content/home";
import { opinieDefaults } from "@/content/opinie";
import { teamTeaserDefaults } from "@/content/team";
import { numberSections, type CmsPage } from "@/lib/cms/get-page";
import { resolveArticle, resolveFaq, resolveTeam, resolveTest } from "@/lib/cms/resolve";
import { getHomeGalleryPhotos } from "@/lib/queries/gallery";
import { getSiteContact } from "@/lib/queries/settings";
import { FAQ_FEATURED_MAX } from "@/lib/validations/content";

/* The stored shapes of the landing sections — see `cms/pages/landing.ts`. */
type HeroData = Pick<HeroContent, "eyebrow" | "title" | "lead" | "trust" | "image"> & {
  rpwdl: { statement?: string; number: string };
};
type PathData = Omit<ContactPath, "id" | "steps" | "note" | "secondaryLabel" | "secondaryHref"> & {
  steps: { title: string; body: string }[];
  note?: string;
  secondary: { label: string; href: string };
};
type KontaktData = { eyebrow: string; paths: PathData[] };
type OsrodekData = Pick<OsrodekContent, "eyebrow" | "title" | "body" | "stats" | "figures">;
type CopyData = { eyebrow: string; title: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The homepage, rendered from its CMS doc — used by `/` and by the editor's
 * preview, so the preview is the site. Section order and everything not in
 * the doc (button labels, links, Kontakt 08, the footer) stay in code.
 */
export async function LandingView({ page }: { page: CmsPage }) {
  const s = page.sections;
  const numbers = numberSections(page);
  const data = <T,>(id: string) => s[id].data as T;

  const [test, article, team, faq, contact, homePhotos] = await Promise.all([
    resolveTest(s.test.data.testId),
    resolveArticle(s.poradnik.data.articleId),
    resolveTeam(s.zespol.data.teamIds, 4),
    resolveFaq(s.faq.data.faqIds, FAQ_FEATURED_MAX),
    getSiteContact(),
    // Like the resolvers: a DB error falls back (to the section's own figures).
    getHomeGalleryPhotos().catch((error) => {
      console.error("[home-gallery] falling back to the section's figures", error);
      return [];
    }),
  ]);

  const hero = data<HeroData>("hero");
  const kontakt = data<KontaktData>("kontakt");
  const zespol = data<CopyData & { lead: string }>("zespol");
  const faqCopy = data<CopyData & { note: string }>("faq");
  const kontaktIndex = pad(Object.keys(numbers).length + 1);

  return (
    <ContactPathProvider>
      <CmsSlot page={page} id="hero">
        <Hero
          contact={contact}
          content={{
            ...heroDefaults,
            ...hero,
            rpwdl: { ...heroDefaults.rpwdl, ...hero.rpwdl },
          }}
        />
      </CmsSlot>

      <CmsSlot page={page} id="kontakt">
        <PierwszyKontakt
          content={{
            index: numbers.kontakt ?? "01",
            eyebrow: kontakt.eyebrow,
            paths: kontakt.paths.map((path, i) => ({
              ...path,
              // The path ids key the shared switch and the #test / #rodzina links.
              id: pierwszyKontaktDefaults.paths[i]?.id ?? "self",
              note: path.note ?? "",
              steps: path.steps.map((step, j) => ({ ...step, index: pad(j + 1) })),
              secondaryLabel: path.secondary.label,
              secondaryHref: path.secondary.href,
            })),
          }}
        />
      </CmsSlot>

      {/*
        Second, not seventh. Most people who ring are ringing about themselves,
        and for someone still asking "is this even a problem yet?" ten
        questions are a far smaller step than a phone call.
      */}
      <CmsSlot page={page} id="test">
        <TestPrzesiewowy test={test} contact={contact} content={{ ...testDefaults, index: numbers.test ?? "" }} />
      </CmsSlot>

      <CmsSlot page={page} id="osrodek">
        <Osrodek
          content={{ ...osrodekDefaults, ...data<OsrodekData>("osrodek"), index: numbers.osrodek ?? "" }}
          photos={homePhotos}
        />
      </CmsSlot>

      {/* 04 reads into the picked (or newest) article; with none, the price list keeps the slot. */}
      <CmsSlot page={page} id="poradnik">
        {article ? (
          <Poradnik
            article={article}
            content={{ ...latestArticleDefaults, index: numbers.poradnik ?? "" }}
          />
        ) : (
          <Program contact={contact} content={{ ...programDefaults, index: numbers.poradnik ?? "" }} />
        )}
      </CmsSlot>

      <CmsSlot page={page} id="zespol">
        <Zespol
          members={team}
          content={{ ...teamTeaserDefaults, ...zespol, index: numbers.zespol ?? "" }}
        />
      </CmsSlot>

      <CmsSlot page={page} id="opinie">
        <Opinie content={{ ...opinieDefaults, index: numbers.opinie ?? "" }} />
      </CmsSlot>

      <CmsSlot page={page} id="faq">
        <Faq
          items={faq.items}
          hasMore={faq.items.length < faq.total}
          content={{ ...faqDefaults, ...faqCopy, index: numbers.faq ?? "" }}
        />
      </CmsSlot>

      <Kontakt contact={contact} content={{ ...kontaktDefaults, index: kontaktIndex }} />
    </ContactPathProvider>
  );
}
