import { IntentView } from "@/components/site/intent/intent-page";
import { LandingView } from "@/components/site/cms/landing-view";
import { OsrodekView } from "@/components/site/cms/osrodek-view";
import { ProgramView } from "@/components/site/cms/program-view";
import { detoksIKwalifikacjaDefaults } from "@/content/intent/detoks-i-kwalifikacja";
import { dlaRodzinyDefaults } from "@/content/intent/dla-rodziny";
import { leczenieAlkoholizmuDefaults } from "@/content/intent/leczenie-alkoholizmu";
import type { CmsPage } from "@/lib/cms/get-page";

/**
 * Page key → the view that renders it. The public routes import their view
 * directly; the preview route goes through here, so a new CMS page needs one
 * line in this map as well as its line in the registry.
 */
export function renderCmsPage(page: CmsPage) {
  switch (page.def.key) {
    case "landing":
      return <LandingView page={page} />;
    case "program":
      return <ProgramView page={page} />;
    case "osrodek":
      return <OsrodekView page={page} />;
    case "leczenie-alkoholizmu":
      return <IntentView page={page} defaults={leczenieAlkoholizmuDefaults} />;
    case "dla-rodziny":
      return <IntentView page={page} defaults={dlaRodzinyDefaults} />;
    case "detoks-i-kwalifikacja":
      return <IntentView page={page} defaults={detoksIKwalifikacjaDefaults} />;
    default:
      return null;
  }
}
